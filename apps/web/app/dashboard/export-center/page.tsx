"use client";

import { useProjects, Project } from "@/hooks/useProjects";
import { Download, FileText, FileSpreadsheet, History, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import * as XLSX from 'xlsx';
import { useStats } from "@/hooks/useStats";

export default function ExportCenterPage() {
  const { projects, loading } = useProjects();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const { stats } = useStats();
  const isPro = stats.plan?.toLowerCase() === 'pro' || stats.plan?.toLowerCase() === 'enterprise';

  const fetchProjectData = async (projectId: string) => {
    const q = query(
      collection(db, "projects", projectId, "scraped_data"),
      orderBy("scrapedAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  };

  const downloadFile = (content: any, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (project: Project, format: 'csv' | 'json' | 'xlsx') => {
    if (!project.id) return;

    if (format === 'xlsx' && !isPro) {
      alert("Excel export is an Enterprise feature. Please upgrade your plan.");
      return;
    }

    setExportingId(`${project.id}-${format}`);
    
    try {
      let data = await fetchProjectData(project.id);
      
      if (data.length === 0) {
        alert("No data found for this project. Run a scrape first!");
        return;
      }

      // Remove specific fields from export
      data = data.map(item => {
        const { userId, projectId, ...rest } = item;
        return rest;
      });

      if (format === 'json') {
        const jsonString = JSON.stringify(data, null, 2);
        downloadFile(jsonString, `${project.name.replace(/\s+/g, '_')}_data.json`, 'application/json');
      } else if (format === 'csv') {
        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(','),
          ...data.map(row => 
            headers.map(fieldName => {
              const val = row[fieldName];
              const escaped = String(val === undefined ? '' : val).replace(/"/g, '""');
              return `"${escaped}"`;
            }).join(',')
          )
        ];
        downloadFile(csvRows.join('\n'), `${project.name.replace(/\s+/g, '_')}_data.csv`, 'text/csv');
      } else if (format === 'xlsx') {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Scraped Data");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(excelBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${project.name.replace(/\s+/g, '_')}_data.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setExportingId(null);
    }
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
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-DEFAULT" />
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-card p-20 text-center flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Download className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">No data available for export</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Create and run a scraping project first to generate exportable datasets.</p>
            </div>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="glass-card p-8 border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-DEFAULT/5 blur-[50px] pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary-DEFAULT shadow-inner transition-transform group-hover:scale-110 duration-500">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white tracking-tight">{project.name}</h3>
                    <div className="flex items-center space-x-3 text-[10px] uppercase font-black tracking-widest text-gray-500 mt-1">
                      <span className={`px-2 py-0.5 rounded ${
                        project.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                        project.status === 'running' ? 'bg-primary/10 text-primary-DEFAULT' : 'bg-white/5 text-gray-500'
                      }`}>
                        {project.status}
                      </span>
                      <span>•</span>
                      <span>{project.url.substring(0, 30)}...</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    disabled={exportingId !== null}
                    onClick={() => handleExport(project, 'csv')}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black border border-white/5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {exportingId === `${project.id}-csv` ? <Loader2 className="w-4 h-4 animate-spin text-primary-DEFAULT" /> : <Download className="w-4 h-4" />}
                    <span>CSV</span>
                  </button>
                  <button 
                    disabled={exportingId !== null}
                    onClick={() => handleExport(project, 'json')}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black border border-white/5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {exportingId === `${project.id}-json` ? <Loader2 className="w-4 h-4 animate-spin text-primary-DEFAULT" /> : <Download className="w-4 h-4" />}
                    <span>JSON</span>
                  </button>
                  <button 
                    disabled={exportingId !== null}
                    onClick={() => handleExport(project, 'xlsx')}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-premium shadow-lg shadow-primary/20 rounded-xl text-xs font-bold transition-all active:scale-95 hover:shadow-primary/40 disabled:opacity-50"
                  >
                    {exportingId === `${project.id}-xlsx` ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                    <span>{exportingId === `${project.id}-xlsx` ? "PREPARING..." : "EXCEL"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

