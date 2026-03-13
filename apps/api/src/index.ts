import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { addScrapingJob } from './services/queueService';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API Key authentication (Basic)
// Firebase Auth (Advanced) - middleware placeholder
app.use((req, res, next) => {
    // Check Authorization header for Bearer token...
    // verify with firebase-admin
    next();
});

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), service: 'DataForge API' });
});

// --- Projects CRUD ---
app.get('/api/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    include: { jobs: { take: 1, orderBy: { createdAt: 'desc' } } }
  });
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, targetUrl, selectorConfig, schedule, userId } = req.body;
    
    const project = await prisma.project.create({
      data: {
        name,
        targetUrl,
        selectorConfig: selectorConfig || { type: 'ai' },
        schedule: schedule || 'manual',
        userId: userId || 'test-user-id', // Use Firebase user ID here
      }
    });

    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Job Management ---
app.post('/api/projects/:id/run', async (req, res) => {
  const { id } = req.params;
  
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const job = await addScrapingJob(id);
    res.json({ message: 'Job enqueued', jobId: job.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects/:id/jobs', async (req, res) => {
  const { id } = req.params;
  const jobs = await prisma.job.findMany({
    where: { projectId: id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(jobs);
});

// --- Scraped Data ---
app.get('/api/projects/:id/data', async (req, res) => {
  const { id } = req.params;
  const data = await prisma.scrapedData.findMany({
    where: { projectId: id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(data);
});

// --- API Keys ---
app.get('/api/keys', async (req, res) => {
  // Mock keys for now
  res.json([
    { id: '1', name: 'Production Scraper', key: 'df_live_xxxxxxxxxxxx', createdAt: new Date() },
    { id: '2', name: 'Staging Engine', key: 'df_test_xxxxxxxxxxxx', createdAt: new Date() }
  ]);
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`🚀 DataForge API running on http://localhost:${PORT}`);
});
