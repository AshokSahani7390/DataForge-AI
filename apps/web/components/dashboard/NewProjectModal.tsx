"use client";

import { useState } from "react";
import { X, Globe, Clock, Sparkles } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

export default function NewProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createProject } = useProjects();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    frequency: "daily",
    extractionRules: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject(formData);
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl glass-card bg-background-card border-white/10 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold flex items-center space-x-3">
            <span className="p-2 bg-gradient-premium rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </span>
            <span>New Scraping Project</span>
          </h2>
          <p className="text-gray-400 mt-2">Define your target and let DataForge AI handle the rest.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Project Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Amazon Electronics Tracker"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center space-x-2">
              <Globe className="w-3 h-3" />
              <span>Target URL</span>
            </label>
            <input 
              required
              type="url" 
              placeholder="https://example.com/products"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>Frequency</span>
              </label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors appearance-none"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Extraction Mode</label>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm">
                <Sparkles className="w-4 h-4 text-primary-DEFAULT" />
                <span className="font-semibold">AI Auto-Extract</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Rules (What to extract?)</label>
            <textarea 
              placeholder="e.g. Extract product name, price, and stock status"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors min-h-[100px] resize-none"
              value={formData.extractionRules}
              onChange={(e) => setFormData({ ...formData, extractionRules: e.target.value })}
            />
          </div>

          <div className="pt-4 flex space-x-3">
             <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm">
                Cancel
             </button>
             <button type="submit" className="flex-[2] py-3 rounded-xl font-bold bg-gradient-premium text-white hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all text-sm">
                Initialize Engine
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
