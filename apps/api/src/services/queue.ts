import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const scrapingQueue = new Queue('scraping-queue', { connection: connection as any });

export const addScrapingJob = async (projectId: string) => {
  return await scrapingQueue.add('scrape', { projectId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
  });
};

export const scheduleScrapingJob = async (projectId: string, frequency: string) => {
  // First, remove existing repeatable jobs for this project to avoid duplicates
  const repeatableJobs = await scrapingQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    if (job.id === projectId) {
      await scrapingQueue.removeRepeatableByKey(job.key);
    }
  }

  if (frequency === 'manual') return;

  const cronPatterns: Record<string, string> = {
    'hourly': '0 * * * *',
    'daily': '0 0 * * *',
    'weekly': '0 0 * * 0',
  };

  const pattern = cronPatterns[frequency];
  if (!pattern) return;

  return await scrapingQueue.add('scrape', { projectId, isScheduled: true }, {
    repeat: { pattern },
    jobId: projectId, // Use projectId as jobId to make it easy to find/remove
  });
};
