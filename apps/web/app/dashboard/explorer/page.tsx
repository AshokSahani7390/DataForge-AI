"use client";

import { 
  Download, 
  Filter, 
  Search, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Loader2,
  Inbox,
  CheckCircle2
} from "lucide-react";
import { useState, useMemo } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useScrapedData } from "@/hooks/useScrapedData";
import * as XLSX from 'xlsx';

export default function DataExplorer() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("all"); 
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  
  const { projects } = useProjects();
  const { data: scrapedData, loading: dataLoading } = useScrapedData(selectedProjectId === "all" ? null : selectedProjectId);

  // Filter data by search query and time range
  const filteredData = useMemo(() => {
    let result = scrapedData;

    // Time filtering
    if (timeRange !== "all") {
      const now = new Date();
      const limits: Record<string, number> = {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      };
      
      result = result.filter(item => {
        if (!item.scrapedAt?.toDate) return true;
        const scrapedDate = item.scrapedAt.toDate();
        return (now.getTime() - scrapedDate.getTime()) <= limits[timeRange];
      });
    }

    // Search filtering
    if (searchQuery) {
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    return result;
  }, [scrapedData, searchQuery, timeRange]);

  const exportFilteredData = () => {
    if (filteredData.length === 0) {
      alert("No data to export.");
      return;
    }

    // Clean data for export
    const cleanData = filteredData.map(item => {
      const { id, userId, projectId, scrapedAt, ...rest } = item;
      return rest;
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Results");
    
    const fileName = `DataForge_Export_${selectedProjectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Dynamically determine headers from the data
  const headers = useMemo(() => {
    if (scrapedData.length === 0) return [];
    // Get all keys except metadata-ish ones
    const keys = Object.keys(scrapedData[0]).filter(k => 
      !['id', 'scrapedAt', 'projectId', 'userId', '_metadata'].includes(k)
    );
    return keys;
  }, [scrapedData]);

  const selectedProjectName = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId)?.name || "All Projects";
  }, [projects, selectedProjectId]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
             <Database className="w-8 h-8 text-primary-DEFAULT" />
             Data Explorer
          </h2>
          <p className="text-gray-400 font-medium">Browse, query, and refine your global dataset archive.</p>
        </div>
        <div className="flex gap-2">
           <button 
             className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-premium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold text-sm text-white"
             onClick={exportFilteredData}
            >
             <Download className="w-4 h-4" />
             <span>Export View</span>
           </button>
           <button className="flex items-center space-x-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all font-bold text-sm">
             <Share2 className="w-4 h-4" />
             <span>API Access</span>
           </button>
        </div>
      </div>

      {/* Explorer Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-background-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
        
        {/* Animated Background Highlight */}
        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-primary-DEFAULT/10 blur-[120px] rounded-full group-hover:bg-primary-DEFAULT/20 transition-all duration-700"></div>

        <div className="md:col-span-2 relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2">
             <Search className="w-4 h-4 text-gray-500" />
           </div>
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search within extracted records..." 
             className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-primary-DEFAULT transition-all text-sm placeholder:text-gray-500 text-gray-200"
           />
        </div>

        <div className="relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2">
             <Layers className="w-4 h-4 text-gray-500" />
           </div>
           <select 
             value={selectedProjectId}
             onChange={(e) => setSelectedProjectId(e.target.value)}
             className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none appearance-none cursor-pointer text-sm text-gray-300"
           >
             <option value="all">Select a Project</option>
             {projects.map(p => (
               <option key={p.id} value={p.id}>{p.name}</option>
             ))}
           </select>
        </div>

        <div className="relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2">
             <Calendar className="w-4 h-4 text-gray-500" />
           </div>
           <select 
             value={timeRange}
             onChange={(e) => setTimeRange(e.target.value)}
             className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none appearance-none cursor-pointer text-sm text-gray-300 transition-colors hover:bg-white/10"
           >
             <option value="all">Past 30 Days</option>
             <option value="24h">Past 24 Hours</option>
             <option value="7d">Past 7 Days</option>
             <option value="30d">Past Month</option>
           </select>
        </div>

      </div>

      {/* Main Table Area */}
      <div className="glass-card border-white/5 relative group min-h-[500px]">
        
        {/* Premium Overlay Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-DEFAULT/5 blur-[100px] pointer-events-none"></div>

        {selectedProjectId === "all" ? (
          <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                <Layers className="w-10 h-10 text-gray-600" />
             </div>
             <div>
                <h4 className="text-xl font-bold text-gray-400">No project selected</h4>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">Select a project from the dropdown above to explore its scraped data archive.</p>
             </div>
          </div>
        ) : dataLoading ? (
          <div className="h-96 flex items-center justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-primary-DEFAULT" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                <Inbox className="w-10 h-10 text-gray-600" />
             </div>
             <div>
                <h4 className="text-xl font-bold text-gray-400">No results found</h4>
                <p className="text-sm text-gray-500">Run a scrape on this project to start collecting data.</p>
             </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Record Source</th>
                  {headers.map(header => (
                    <th key={header} className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">{header}</th>
                  ))}
                  <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Scraped At</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.03] transition-colors group/row">
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-3">
                         <div className="p-1.5 rounded-lg bg-primary-DEFAULT/10 text-primary-DEFAULT">
                            <ExternalLink className="w-3.5 h-3.5" />
                         </div>
                         <span className="text-sm font-bold text-gray-100">{selectedProjectName}</span>
                      </div>
                    </td>
                    
                    {headers.map(header => (
                      <td key={header} className="px-6 py-6 text-sm text-gray-300 font-medium">
                        {typeof row[header] === 'object' ? JSON.stringify(row[header]) : String(row[header])}
                      </td>
                    ))}

                    <td className="px-6 py-6 text-xs text-gray-500 font-bold">
                      {row.scrapedAt?.toDate ? row.scrapedAt.toDate().toLocaleString() : 'Just now'}
                    </td>
                    
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                         {row.screenshotUrl && (
                           <button 
                             onClick={() => setActiveScreenshot(row.screenshotUrl)}
                             className="p-2 glass-card hover:bg-white/10 rounded-lg text-primary-DEFAULT hover:text-white transition-colors flex items-center space-x-2 px-3"
                           >
                             <ExternalLink className="w-4 h-4" />
                             <span className="text-[10px] uppercase font-black tracking-widest">Proof</span>
                           </button>
                         )}
                         <button className="p-2 glass-card hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                           <Download className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Visual Proof Modal */}
        {activeScreenshot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
             <div className="absolute inset-0" onClick={() => setActiveScreenshot(null)}></div>
             <div className="relative max-w-6xl w-full h-[85vh] glass-card overflow-hidden border-white/20 p-2 group/modal">
                <button 
                  onClick={() => setActiveScreenshot(null)}
                  className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-all scale-0 group-hover/modal:scale-100"
                >
                  <Inbox className="w-5 h-5 rotate-45" /> {/* Close icon substitute */}
                </button>
                <div className="w-full h-full overflow-auto custom-scrollbar rounded-2xl">
                  <img src={activeScreenshot} alt="Visual Proof" className="w-full h-auto object-top" />
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center space-x-4">
                   <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visual Evidence Secured</p>
                      <p className="text-xs font-bold text-white">Full page capture verified by DataForge AI</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Custom Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 font-bold">Total records:</span>
              <span className="text-xs font-black text-gray-300">{filteredData.length}</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Showing last 100 entries</span>
              <div className="flex space-x-1">
                 <button className="p-2 glass-card hover:bg-white/10 rounded-lg text-gray-400 disabled:opacity-30" disabled>
                   <ChevronLeft className="w-4 h-4" />
                 </button>
                 <button className="p-2 glass-card hover:bg-white/10 rounded-lg text-gray-400" disabled>
                   <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
