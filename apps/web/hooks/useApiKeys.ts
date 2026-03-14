"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: any;
  lastUsed?: any;
}

export const useApiKeys = () => {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "api_keys"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const keysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ApiKey[];
      setKeys(keysData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateKey = async (name: string = "Default Key") => {
    if (!user) return;
    const newKey = `df_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    await addDoc(collection(db, "api_keys"), {
      key: newKey,
      userId: user.uid,
      name,
      createdAt: serverTimestamp(),
    });
    
    return newKey;
  };

  const revokeKey = async (id: string) => {
    await deleteDoc(doc(db, "api_keys", id));
  };

  return { keys, loading, generateKey, revokeKey };
};
