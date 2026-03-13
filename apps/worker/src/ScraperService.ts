import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { ScrapingProject } from '@dataforge/shared';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Extension for playwright-extra
chromium.use(stealth());

export interface ScrapeResult {
  data: any[];
  screenshot?: Buffer;
  logs: string[];
  success: boolean;
  error?: string;
}

export class ScraperService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (process.env.LLM_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
    }
  }

  /**
   * Main scraping entry point for a single run
   */
  async runScrape(project: ScrapingProject): Promise<ScrapeResult> {
    const logs: string[] = [];
    const proxyUrl = process.env.PROXY_URL;
    
    // Setup browser with proxy if available
    const browser = await chromium.launch({
      headless: true,
      proxy: proxyUrl ? { server: proxyUrl } : undefined,
      args: ['--no-sandbox']
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    
    let results: any[] = [];
    
    try {
      const page = await context.newPage();
      logs.push(`[Service] Navigating to: ${project.url}`);
      if (proxyUrl) logs.push(`[Service] Using Proxy: ${proxyUrl.split('@')[1] || 'Default'}`);

      await page.goto(project.url, { waitUntil: 'networkidle', timeout: 90000 });
      
      // Basic anti-bot wait
      await page.waitForTimeout(Math.random() * 2000 + 1000);

      const html = await page.content();
      const $ = cheerio.load(html);

      if (project.selectorConfig.type === 'manual' && project.selectorConfig.selectors) {
        logs.push('[Service] Executing manual selector extraction');
        results = this.extractManual($, project.selectorConfig.selectors);
      } else if (project.selectorConfig.type === 'ai') {
        logs.push('[Service] Initializing Gemini AI for extraction...');
        results = await this.extractAI(page, project.selectorConfig.aiExtractionPrompt || "Identify and extract all primary data items from this page.");
      }

      logs.push(`[Service] Success: Extracted ${results.length} records.`);
      return { data: results, logs, success: true };

    } catch (err: any) {
      logs.push(`[Service] Error: ${err.message}`);
      return { data: [], logs, success: false, error: err.message };
    } finally {
      await browser.close();
    }
  }

  private extractManual($: any, selectors: Record<string, string>): any[] {
    const record: any = {};
    Object.entries(selectors).forEach(([field, selector]) => {
      record[field] = $(selector).first().text().trim();
    });
    return [record];
  }

  private async extractAI(page: any, prompt: string): Promise<any[]> {
    if (!this.genAI) {
      throw new Error("AI extraction requested but LLM_API_KEY is not configured.");
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Clean DOM to minimize token usage
    const cleanContent = await page.evaluate(() => {
        const body = document.body.cloneNode(true) as HTMLElement;
        const junk = body.querySelectorAll('script, style, svg, path, noscript, nav, footer, iframe');
        junk.forEach(tag => tag.remove());
        
        // Remove attributes to further clean
        const all = body.querySelectorAll('*');
        all.forEach(el => {
            const attrs = el.attributes;
            for(let i = attrs.length - 1; i >= 0; i--) {
                const attrName = attrs[i].name;
                if (!['id', 'class', 'href', 'src', 'title'].includes(attrName)) {
                    el.removeAttribute(attrName);
                }
            }
        });

        return body.innerText.substring(0, 30000); // 30k characters is usually enough for key data
    });

    const fullPrompt = `
      You are an expert data extraction engine.
      URL Context: ${page.url()}
      User Request: ${prompt}

      Page Content Snippet:
      ${cleanContent}

      Instructions:
      1. Extract all entities that match the user request.
      2. Return ONLY a valid JSON array of objects.
      3. Do not include markdown formatting or explanations.
      4. If no data is found, return [].
    `;

    try {
      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text().trim();
      
      // Basic JSON cleaning if LLM returns markdown blocks
      const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (err: any) {
      console.error("[AI Error]", err);
      return [{ error: "AI Extraction failed", details: err.message }];
    }
  }
}
