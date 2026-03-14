import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { db, auth } from './services/firebase';
import { addScrapingJob, scheduleScrapingJob } from './services/queue';
import { createOrder, verifyWebhookSignature } from './services/payments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Auth Middleware
const authenticate = async (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Public API Auth Middleware (via x-api-key)
const authenticatePublic = async (req: Request, res: Response, next: any) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) return res.status(401).json({ error: 'API Key missing' });

  try {
    const snapshot = await db.collection('api_keys')
      .where('key', '==', apiKey)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: 'Invalid API Key' });
    }

    const keyData = snapshot.docs[0].data();
    (req as any).user = { uid: keyData.userId };
    
    // Update last used
    await snapshot.docs[0].ref.update({ lastUsed: admin.firestore.FieldValue.serverTimestamp() });
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Auth failed' });
  }
};

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), service: 'DataForge API' });
});

// --- Projects CRUD ---
app.get('/api/projects', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const snapshot = await db.collection('projects')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { name, url, frequency, extractionRules, proxySettings, webhookUrl, aiModel } = req.body;
    
    const projectRef = await db.collection('projects').add({
      name,
      url,
      frequency: frequency || 'manual',
      extractionRules,
      proxySettings: proxySettings || null,
      webhookUrl: webhookUrl || null,
      aiModel: aiModel || 'gemini-1.5-flash',
      userId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Schedule if not manual
    if (frequency && frequency !== 'manual') {
      await scheduleScrapingJob(projectRef.id, frequency);
    }

    res.status(201).json({ id: projectRef.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { id } = req.params;
    const { name, url, frequency, extractionRules, proxySettings, webhookUrl, aiModel } = req.body;

    const projectRef = db.collection('projects').doc(id);
    const doc = await projectRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'Project not found' });
    if (doc.data()?.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    await projectRef.update({
      name,
      url,
      frequency,
      extractionRules,
      proxySettings,
      webhookUrl: webhookUrl || null,
      aiModel: aiModel || 'gemini-1.5-flash',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update schedule
    await scheduleScrapingJob(id, frequency);

    res.json({ message: 'Project updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', authenticate, async (req, res) => {
    try {
      const userId = (req as any).user.uid;
      const { id } = req.params;
      const projectRef = db.collection('projects').doc(id);
      const doc = await projectRef.get();
  
      if (!doc.exists) return res.status(404).json({ error: 'Project not found' });
      if (doc.data()?.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
  
      await projectRef.delete();
      
      // Remove schedule
      await scheduleScrapingJob(id, 'manual');
  
      res.json({ message: 'Project deleted' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
});

// --- Usage & Billing ---
app.get('/api/usage', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    
    res.json(userDoc.data()?.usage);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects/:id/run', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { id } = req.params;
    
    const projectDoc = await db.collection('projects').doc(id).get();
    if (!projectDoc.exists) return res.status(404).json({ error: 'Project not found' });
    if (projectDoc.data()?.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    // --- Usage Enforcement ---
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const usage = userData?.usage || { currentScrapes: 0, maxScrapes: 10 }; // Default free tier

    if (usage.currentScrapes >= usage.maxScrapes) {
      return res.status(403).json({ 
        error: 'Usage limit reached', 
        message: 'You have reached your monthly scrape limit. Please upgrade your plan.' 
      });
    }

    const job = await addScrapingJob(id);
    
    // Update project status
    await db.collection('projects').doc(id).update({
      status: 'running'
    });

    // Increment usage
    await db.collection('users').doc(userId).update({
      'usage.currentScrapes': admin.firestore.FieldValue.increment(1)
    });

    res.json({ message: 'Scraping job enqueued', jobId: job.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Public Data API ---
app.get('/api/v1/data/:projectId', authenticatePublic, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = (req as any).user.uid;

    // Verify ownership
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists || projectDoc.data()?.userId !== userId) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Fetch results
    const snapshot = await db.collection('projects').doc(projectId)
      .collection('scraped_data')
      .orderBy('scrapedAt', 'desc')
      .limit(100)
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({
      project: projectDoc.data()?.name,
      count: data.length,
      results: data
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Razorpay Payments ---
app.post('/api/payments/create-order', authenticate, async (req, res) => {
  try {
    const { planId } = req.body;
    let amount = 0;
    
    // Simple pricing logic
    if (planId === 'pro') amount = 2900; // ₹2,900
    if (planId === 'enterprise') amount = 9900; // ₹9,900
    
    if (amount === 0) return res.status(400).json({ error: 'Invalid plan' });

    const order = await createOrder(amount);
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const body = req.body.toString();

  if (!verifyWebhookSignature(body, signature)) {
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(body);
  
  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const notes = payment.notes || {};
    const userId = notes.userId;
    const planId = notes.planId;

    if (userId && planId) {
      const limits: Record<string, number> = {
        'pro': 1000,
        'enterprise': 10000
      };

      await db.collection('users').doc(userId).update({
        plan: planId.toUpperCase(),
        'usage.maxScrapes': limits[planId] || 10,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ User ${userId} upgraded to ${planId}`);
    }
  }

  res.json({ status: 'ok' });
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`🚀 DataForge API running on http://localhost:${PORT}`);
});

