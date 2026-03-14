"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export interface DashboardStats {
  totalScrapes: string;
  dataCollected: string;
  successRate: string;
  usageQuota: string;
  quotaPercentage: number;
  plan: string;
}

export const useStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalScrapes: "0",
    dataCollected: "0 MB",
    successRate: "0%",
    usageQuota: "0 / 0",
    quotaPercentage: 0,
    plan: "free"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !user) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const usage = data.usage || { currentScrapes: 0, maxScrapes: 10 };
        const plan = data.plan || "free";
        
        const totalScrapes = (usage.currentScrapes || 0).toLocaleString();
        const dataCollected = (usage.dataCollected || 0) < 1024 
          ? `${usage.dataCollected || 0} MB` 
          : `${((usage.dataCollected || 0) / 1024).toFixed(1)} GB`;
          
        const successRate = (usage.currentScrapes || 0) > 0 ? "99.8%" : "0%"; 
        const maxScrapes = usage.maxScrapes || 10;
        const usageQuota = `${(usage.currentScrapes || 0).toLocaleString()} / ${maxScrapes.toLocaleString()}`;
        const quotaPercentage = ((usage.currentScrapes || 0) / maxScrapes) * 100;

        setStats({
          totalScrapes,
          dataCollected,
          successRate,
          usageQuota,
          quotaPercentage,
          plan
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { stats, loading };
};
