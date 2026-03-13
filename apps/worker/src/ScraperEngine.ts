import { db } from './lib/firebase-admin';
import { ScraperService } from './ScraperService';
import { FieldValue } from 'firebase-admin/firestore';

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
      targetUrl: project.url,
      extractionRules: project.extractionRules
    } as any);

    if (result.success) {
      // Save results to subcollection 'data'
      const dataBatch = db.batch();
      result.data.forEach((item: any) => {
        const docRef = projectRef.collection('scraped_data').doc();
        dataBatch.set(docRef, {
          ...item,
          scrapedAt: FieldValue.serverTimestamp()
        });
      });
      await dataBatch.commit();

      // Update project status
      await projectRef.update({
        status: 'success',
        lastRunCompleted: FieldValue.serverTimestamp(),
        totalScrapes: FieldValue.increment(result.data.length)
      });
      
      console.log(`[ScraperEngine] Job successful for ${projectId}. Saved ${result.data.length} records.`);
    } else {
      throw new Error(result.error);
    }
  } catch (error: any) {
    console.error(`[ScraperEngine] Job failed: ${error.message}`);
    await projectRef.update({
      status: 'failed',
      lastError: error.message,
      lastRunCompleted: FieldValue.serverTimestamp()
    });
  }
}
