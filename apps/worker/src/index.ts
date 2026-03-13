import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { ScraperService } from './ScraperService';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { ScrapingProject } from '@dataforge/shared';

dotenv.config();

const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

const scraper = new ScraperService();

async function startWorker() {
  console.log('--- DataForge Scraper Worker Starting ---');
  // scraper.init() call removed as ScraperService handles browser lifecycle per run

  const worker = new Worker('scraping-queue', async (job: Job) => {
    const { projectId } = job.data;
    console.log(`[Worker] Started job ${job.id} for project ${projectId}`);

    // Create DB entry for the Job run
    const dbJob = await prisma.job.create({
      data: {
        projectId,
        status: 'running',
        startedAt: new Date(),
      }
    });

    try {
      const projectDoc = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true }
      });

      if (!projectDoc) throw new Error('Project not found');

      const result = await scraper.runScrape(projectDoc as unknown as ScrapingProject);

      if (result.success) {
        console.log(`[Worker] Scrape successful. Processing ${result.data.length} items with AI...`);

        // AI Data Cleaning & Enrichment (Process each item)
        const enrichedData = [];
        for (const item of result.data) {
          const enrichedItem = {
            ...item,
            _metadata: {
              category: "Scraped Content",
              extractedAt: new Date().toISOString(),
              source: projectDoc.targetUrl
            }
          };
          enrichedData.push(enrichedItem);
        }

        await prisma.scrapedData.createMany({
            data: enrichedData.map(content => ({
                projectId,
                content: content as any
            }))
        });

        await prisma.job.update({
          where: { id: dbJob.id },
          data: {
            status: 'completed',
            completedAt: new Date(),
            logs: result.logs,
            error: null
          }
        });

      } else {
        throw new Error(result.error || 'Unknown scraping error');
      }

    } catch (err: any) {
      console.error(`[Worker] Job ${job.id} failed: ${err.message}`);
      await prisma.job.update({
        where: { id: dbJob.id },
        data: {
          status: 'failed',
          completedAt: new Date(),
          error: err.message,
          logs: [err.message]
        }
      });
      throw err;
    }
  }, { connection: connection as any });

  worker.on('completed', (job: Job) => {
    console.log(`[Worker] Job ${job.id} has completed successfully.`);
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    console.log(`[Worker] Job ${job?.id} has failed: ${err.message}`);
  });
}

startWorker().catch(err => {
    console.error('Fatal Worker Error:', err);
    process.exit(1);
});
