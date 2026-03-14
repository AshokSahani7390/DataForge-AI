import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { processScrapingJob } from './ScraperEngine';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

async function startWorker() {
  console.log('--- 🛡️ DataForge Scraper Worker v1.0 Starting ---');

  const worker = new Worker('scraping-queue', async (job: Job) => {
    const { projectId } = job.data;
    console.log(`[Worker] 🚀 Received job for project: ${projectId}`);

    try {
      await processScrapingJob(projectId);
      console.log(`[Worker] ✅ Job processed for project: ${projectId}`);
    } catch (err: any) {
      console.error(`[Worker] ❌ Failed to process job ${job.id}:`, err.message);
      throw err;
    }
  }, { 
    connection: connection as any,
    concurrency: 2 // Allow 2 concurrent browser sessions
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] 💥 Job ${job?.id} failed with error: ${err.message}`);
  });

  console.log('✅ Worker is listening for jobs on "scraping-queue"');
}

startWorker().catch(err => {
    console.error('Fatal Worker Error:', err);
    process.exit(1);
});
