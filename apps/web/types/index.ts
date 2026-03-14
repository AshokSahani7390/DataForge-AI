import { Timestamp } from "firebase/firestore";

export type PlanType = "free" | "pro" | "enterprise";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  plan: PlanType;
  createdAt: Timestamp;
  usage: {
    scrapes: number;
    dataCollected: number;
    quota: number;
  };
  stripeCustomerId?: string;
  subscriptionId?: string;
}

export interface ScrapingProject {
  id?: string;
  userId: string;
  name: string;
  url: string;
  frequency: "hourly" | "daily" | "weekly" | "once";
  extractionRules: string;
  status: "pending" | "running" | "success" | "failed";
  lastRun?: Timestamp;
  createdAt: Timestamp;
  selectors?: { [key: string]: string };
}

export interface ScrapingJob {
  id?: string;
  projectId: string;
  userId: string;
  startedAt: Timestamp;
  finishedAt?: Timestamp;
  status: "running" | "completed" | "failed";
  itemsScraped: number;
  dataSize: number; // in KB/MB
  errorMessage?: string;
}

export interface UsageLog {
  id?: string;
  userId: string;
  type: "scrape" | "api_call" | "export";
  amount: number;
  timestamp: Timestamp;
  metadata?: any;
}

export interface Subscription {
  id: string;
  userId: string;
  status: "active" | "canceled" | "incomplete" | "past_due";
  priceId: string;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
}
