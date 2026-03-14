import { db } from './lib/firebase-admin';
import * as admin from 'firebase-admin';
import { ScraperService } from './ScraperService';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';
import axios from 'axios';

const scraper = new ScraperService();

export async function processScrapingJob(projectId: string) {
  console.log(`[ScraperEngine] Starting job for Project: ${projectId}`);
  const projectRef = db.collection('projects').doc(projectId);
  
  try {
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) throw new Error("Project not found");
    
    const project = projectDoc.data();
    if (!project) throw new Error("Project data is empty");
    
    // Update status to running
    await projectRef.update({ 
      status: 'running',
      lastRunStarted: FieldValue.serverTimestamp()
    });

    // RUN SCRAPE
    // We pass the project data to the ScraperService
    const result = await scraper.runScrape({
      url: project.url,
      selectorConfig: {
        type: 'ai',
        aiExtractionPrompt: project.extractionRules
      },
      proxySettings: project.proxySettings,
      aiModel: project.aiModel
    });

    if (result.success) {
      // 1. Upload Screenshot if exists
      let screenshotUrl = null;
      if (result.screenshot) {
        try {
          const bucket = admin.storage().bucket();
          const filename = `screenshots/${projectId}/${Date.now()}.png`;
          const file = bucket.file(filename);
          
          await file.save(result.screenshot, {
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens: crypto.randomUUID(),
            }
          });
          
          // Make public for the proof (in production, use signed URLs)
          await file.makePublic();
          screenshotUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        } catch (uploadErr: any) {
          console.error(`[ScraperEngine] Screenshot upload failed: ${uploadErr.message}`);
        }
      }

      // 2. Save results to subcollection 'data'
      const dataBatch = db.batch();
      result.data.forEach((item: any) => {
        const docRef = projectRef.collection('scraped_data').doc();
        dataBatch.set(docRef, {
          ...item,
          screenshotUrl,
          scrapedAt: FieldValue.serverTimestamp()
        });
      });
      await dataBatch.commit();

      // Update project status
      await projectRef.update({
        status: 'success',
        lastRunCompleted: FieldValue.serverTimestamp(),
        totalScrapes: FieldValue.increment(result.data.length),
        lastRunScreenshot: screenshotUrl
      });
      
      // 3. Trigger Webhook if exists
      if (project.webhookUrl) {
        try {
           console.log(`[ScraperEngine] Triggering webhook for ${projectId}: ${project.webhookUrl}`);
           await axios.post(project.webhookUrl, {
             projectId: projectId,
             projectName: project.name,
             timestamp: new Date().toISOString(),
             resultsCount: result.data.length,
             screenshotUrl,
             data: result.data
           });
           console.log(`[ScraperEngine] Webhook delivered successfully.`);
        } catch (webhookErr: any) {
           console.error(`[ScraperEngine] Webhook delivery failed: ${webhookErr.message}`);
        }
      }
      
      console.log(`[ScraperEngine] Job successful for ${projectId}. Saved ${result.data.length} records.`);
    } else {
      throw new Error(result.error);
    }
  } catch (error: any) {
    console.error(`[ScraperEngine] Job failed: ${error.message}`);
    
    // Create notification
    try {
      const projectDoc = await projectRef.get();
      const project = projectDoc.data();
      if (project?.userId) {
        await db.collection('notifications').add({
          userId: project.userId,
          projectId: projectId,
          projectName: project.name,
          type: 'error',
          title: 'Scrape Failed',
          message: `Your project "${project.name}" failed to scrape: ${error.message}`,
          createdAt: FieldValue.serverTimestamp(),
          read: false
        });
      }
    } catch (notifErr) {
      console.error("[ScraperEngine] Failed to create notification", notifErr);
    }

    await projectRef.update({
      status: 'failed',
      lastError: error.message,
      lastRunCompleted: FieldValue.serverTimestamp()
    });
  }
}
