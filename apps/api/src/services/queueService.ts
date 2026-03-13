import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

export const scrapingQueue = new Queue('scraping-queue', { connection: connection as any });

export async function addScrapingJob(projectId: string) {
  const job = await scrapingQueue.add(
    'scraping-job',
    { projectId },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
  return job;
}
