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
  deleteDoc
} from 'firebase/firestore';

export interface Project {
  id?: string;
  name: string;
  url: string;
  frequency: string;
  extractionRules: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  lastRun?: any;
  createdAt: any;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(projectsData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  }, []);

  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'status'>) => {
    if (!db) {
      alert("Firebase not initialized. Please add your API keys to the .env file.");
      return;
    }
    return await addDoc(collection(db, 'projects'), {
      ...project,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  };

  const updateProjectStatus = async (projectId: string, status: Project['status']) => {
    if (!db) return;
    const projectRef = doc(db, 'projects', projectId);
    return await updateDoc(projectRef, { status });
  };

  const deleteProject = async (projectId: string) => {
    if (!db) return;
    return await deleteDoc(doc(db, 'projects', projectId));
  };

  return { projects, loading, createProject, updateProjectStatus, deleteProject };
};
