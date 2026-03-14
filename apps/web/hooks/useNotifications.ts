"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export interface Notification {
  id: string;
  userId: string;
  projectId?: string;
  projectName?: string;
  type: 'error' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  createdAt: any;
  read: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(notifsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!db) return;
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  const deleteNotification = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "notifications", id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, loading, markAsRead, deleteNotification };
};
