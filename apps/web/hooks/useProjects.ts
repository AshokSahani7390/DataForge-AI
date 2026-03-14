"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
  where
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Project {
  id?: string;
  name: string;
  url: string;
  frequency: string;
  extractionRules: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  proxySettings?: {
    server: string;
    username?: string;
    password?: string;
  };
  webhookUrl?: string | null;
  aiModel?: string;
  lastRunCompleted?: any;
  lastRunScreenshot?: string;
  createdAt: any;
}

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !user) {
      if (!user) {
        setProjects([]);
        setLoading(false);
      }
      return;
    }
    
    try {
      const q = query(
        collection(db, 'projects'), 
        where('userId', '==', user.uid)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        // Sort client-side to avoid needing a composite index
        projectsData.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || a.createdAt || 0;
          const timeB = b.createdAt?.toMillis?.() || b.createdAt || 0;
          return timeB - timeA;
        });
        setProjects(projectsData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  }, [user]);

  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'status'>) => {
    if (!user) return;
    const token = await user.getIdToken();
    const response = await axios.post(`${API_URL}/api/projects`, project, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const updateProject = async (projectId: string, project: Partial<Project>) => {
    if (!user) return;
    const token = await user.getIdToken();
    const response = await axios.put(`${API_URL}/api/projects/${projectId}`, project, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const deleteProject = async (projectId: string) => {
    if (!user) return;
    const token = await user.getIdToken();
    const response = await axios.delete(`${API_URL}/api/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const runProject = async (projectId: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await axios.post(`${API_URL}/api/projects/${projectId}/run`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error triggering project run:", error);
      throw error;
    }
  };

  return { projects, loading, createProject, updateProject, deleteProject, runProject };
};
