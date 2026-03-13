import { z } from 'zod';

// Scraping Project Configuration
export const ScrapingProjectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid target URL"),
  selectorConfig: z.object({
    type: z.enum(['manual', 'ai']),
    selectors: z.record(z.string()).optional(), // Field name to CSS selector
    aiExtractionPrompt: z.string().optional(), // For AI mode
  }),
  schedule: z.enum(['manual', 'hourly', 'daily', 'weekly']).default('manual'),
  crawlDepth: z.number().min(0).max(5).default(0),
  paginationSupport: z.boolean().default(false),
  maxPages: z.number().min(1).default(1),
  status: z.enum(['active', 'paused', 'archived']).default('active'),
  createdAt: z.date().optional(),
  userId: z.string(),
});

export type ScrapingProject = z.infer<typeof ScrapingProjectSchema>;

// Individual Scraping Job / Run
export const ScrapingJobSchema = z.object({
  id: z.string().uuid().optional(),
  projectId: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  dataCount: z.number().default(0),
  error: z.string().optional(),
  logs: z.array(z.string()).optional(),
});

export type ScrapingJob = z.infer<typeof ScrapingJobSchema>;

// Scraped Data Record
export const ScrapedRecordSchema = z.record(z.any());
export type ScrapedRecord = z.infer<typeof ScrapedRecordSchema>;
