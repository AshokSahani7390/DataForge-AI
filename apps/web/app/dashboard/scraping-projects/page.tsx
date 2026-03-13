"use client";

import { useState } from "react";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { useProjects } from "@/hooks/useProjects";

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scraping Projects</h2>
          <p className="text-gray-400">Manage your automated scraping workflows and monitor their performance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-premium px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all"
        >
          + New Project
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="p-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 hover:border-white/10 transition-colors cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl text-gray-500">+</span>
          </div>
          <div>
            <h3 className="font-bold text-white">Create New Project</h3>
            <p className="text-sm text-gray-500">Add a URL to start extracting data</p>
          </div>
        </div>

        {!loading && projects.map((project) => (
          <div key={project.id} className="p-8 glass-card border-white/10 rounded-3xl flex flex-col space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-DEFAULT font-bold">
                 {project.name[0]}
               </div>
               <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/5 ${
                 project.status === 'success' ? 'text-emerald-500' : 
                 project.status === 'failed' ? 'text-red-500' : 'text-primary-DEFAULT'
               }`}>
                 {project.status}
               </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{project.name}</h3>
              <p className="text-sm text-gray-500 truncate">{project.url}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
               <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{project.frequency}</span>
               <button className="text-xs font-bold text-primary-DEFAULT hover:underline">View Results →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

