"use client";

import { useProjects } from "@/hooks/useProjects";
import { Download, FileText, FileSpreadsheet, History } from "lucide-react";

export default function ExportCenterPage() {
  const { projects, loading } = useProjects();

  const handleExport = (projectName: string, format: 'csv' | 'json' | 'xlsx') => {
    alert(`Exporting ${projectName} as ${format.toUpperCase()}...`);
    // TODO: Implement actual export logic (fetch subcollection and generate file)
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Export Center</h2>
          <p className="text-gray-400">Download your scraped data in multiple industry-standard formats.</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold text-sm">
          <History className="w-4 h-4" />
          <span>Export History</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {!loading && projects.length === 0 && (
          <div className="glass-card p-20 text-center flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Download className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">No data available for export</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Create and run a scraping project first to generate exportable datasets.</p>
            </div>
          </div>
        )}

        {projects.map((project) => (
          <div key={project.id} className="glass-card p-6 border-white/10 hover:border-primary/20 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-premium/10 flex items-center justify-center text-primary-DEFAULT">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{project.name}</h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="bg-white/5 px-2 py-0.5 rounded uppercase font-black">{project.status}</span>
                    <span>•</span>
                    <span>Last run: {project.lastRun ? 'Recent' : 'Never'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleExport(project.name, 'csv')}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/5 transition-colors"
                >
                  CSV
                </button>
                <button 
                  onClick={() => handleExport(project.name, 'json')}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/5 transition-colors"
                >
                  JSON
                </button>
                <button 
                  onClick={() => handleExport(project.name, 'xlsx')}
                  className="px-4 py-2 bg-gradient-premium shadow-lg shadow-primary/20 rounded-lg text-xs font-bold transition-all transform active:scale-95"
                >
                  Excel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

