import { useEffect, useState } from "react";
import { X, Globe, Clock, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useProjects, Project } from "@/hooks/useProjects";
import { useStats } from "@/hooks/useStats";
import { validateProjectForm } from "@/lib/validation";

export default function NewProjectModal({ 
  isOpen, 
  onClose, 
  project 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  project?: Project | null;
}) {
  const { createProject, updateProject } = useProjects();
  const { stats } = useStats();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    frequency: "manual",
    extractionRules: "",
    proxySettings: {
      server: "",
      username: "",
      password: "",
    },
    webhookUrl: "",
    aiModel: "gemini-1.5-flash"
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        url: project.url,
        frequency: project.frequency,
        extractionRules: project.extractionRules,
        proxySettings: {
          server: project.proxySettings?.server || "",
          username: project.proxySettings?.username || "",
          password: project.proxySettings?.password || ""
        },
        webhookUrl: project.webhookUrl || "",
        aiModel: project.aiModel || "gemini-1.5-flash"
      });
    } else {
      setFormData({
        name: "",
        url: "",
        frequency: "manual",
        extractionRules: "",
        proxySettings: { server: "", username: "", password: "" },
        webhookUrl: "",
        aiModel: "gemini-1.5-flash"
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const isPro = stats.plan?.toLowerCase() === 'pro' || stats.plan?.toLowerCase() === 'enterprise';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validation = validateProjectForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      // Clean proxy if empty
      const projectPayload = {
        ...formData,
        proxySettings: formData.proxySettings.server ? formData.proxySettings : null
      } as any;
      
      if (project?.id) {
        await updateProject(project.id, projectPayload);
      } else {
        await createProject(projectPayload);
      }
      
      onClose();
    } catch (error: any) {
      console.error("Error saving project:", error);
      setErrors({ global: error.message || "Failed to save project. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl glass-card bg-background-card border-white/10 p-8 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold flex items-center space-x-3">
            <span className="p-2 bg-gradient-premium rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </span>
            <span>{project ? "Modify Engine Settings" : "New Scraping Project"}</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm font-medium">{project ? "Update parameters for your existing extraction node." : "Define your target and configure your extraction engine."}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.global && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.global}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Project Name</label>
              <input 
                type="text" 
                placeholder="e.g. Amazon Electronics Tracker"
                className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors`}
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 flex items-center space-x-2">
                <Globe className="w-3 h-3" />
                <span>Target URL</span>
              </label>
              <input 
                type="text" 
                placeholder="https://example.com/products"
                className={`w-full bg-white/5 border ${errors.url ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors`}
                value={formData.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value });
                  if (errors.url) setErrors({ ...errors, url: "" });
                }}
              />
              {errors.url && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.url}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value="manual">Manual Trigger</option>
                <option value="hourly">Hourly (Pro+)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">AI Intelligence Mode</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors appearance-none"
                value={formData.aiModel}
                onChange={(e) => setFormData({ ...formData, aiModel: e.target.value })}
              >
                <option value="gemini-1.5-flash">Ultra Fast (Gemini Flash)</option>
                <option value="gemini-1.5-pro">Deep Analysis (Gemini Pro - Pro Only)</option>
              </select>
              <p className="text-[10px] text-gray-500 font-medium pl-1 italic">Pro model handles complex tables and JS-heavy pages better.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">AI Extraction Prompt (What to extract?)</label>
            <textarea 
              placeholder="e.g. Extract product name, price, and stock status in USD"
              className={`w-full bg-white/5 border ${errors.extractionRules ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors min-h-[80px] resize-none`}
              value={formData.extractionRules}
              onChange={(e) => {
                setFormData({ ...formData, extractionRules: e.target.value });
                if (errors.extractionRules) setErrors({ ...errors, extractionRules: "" });
              }}
            />
            {errors.extractionRules && <p className="text-[10px] text-red-500 font-bold pl-1">{errors.extractionRules}</p>}
          </div>

          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Custom Proxy Support {!isPro && <span className="text-primary-DEFAULT ml-2">(PRO ONLY)</span>}</label>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${!isPro ? 'opacity-30 pointer-events-none' : ''}`}>
               <div className="space-y-1">
                 <input 
                    type="text" 
                    placeholder="Proxy Server (http://...)" 
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary/30"
                    value={formData.proxySettings.server}
                    onChange={(e) => setFormData({...formData, proxySettings: {...formData.proxySettings, server: e.target.value}})}
                 />
               </div>
               <div className="space-y-1">
                 <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary/30"
                    value={formData.proxySettings.username}
                    onChange={(e) => setFormData({...formData, proxySettings: {...formData.proxySettings, username: e.target.value}})}
                 />
               </div>
               <div className="space-y-1">
                 <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary/30"
                    value={formData.proxySettings.password}
                    onChange={(e) => setFormData({...formData, proxySettings: {...formData.proxySettings, password: e.target.value}})}
                 />
               </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Webhook Destination {!isPro && <span className="text-primary-DEFAULT ml-2">(PRO ONLY)</span>}</label>
            </div>
            <div className={`space-y-1 ${!isPro ? 'opacity-30 pointer-events-none' : ''}`}>
               <input 
                  type="text" 
                  placeholder="https://your-server.com/api/webhook" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all font-medium"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
               />
               <p className="text-[10px] text-gray-500 font-medium pl-1">DataForge will send a POST request with extraction results to this URL.</p>
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
             <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm disabled:opacity-50">
                Cancel
             </button>
             <button type="submit" disabled={loading} className="flex-[2] py-3 rounded-xl font-bold bg-gradient-premium text-white hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-50">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? (project ? "Updating..." : "Registering...") : (project ? "Update Project" : "Initialize Engine")}</span>
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

