"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export const useScrapedData = (projectId: string | null) => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !user || !projectId || projectId === "all") {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "projects", projectId, "scraped_data"),
      orderBy("scrapedAt", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching scraped data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, projectId]);

  return { data, loading };
};
