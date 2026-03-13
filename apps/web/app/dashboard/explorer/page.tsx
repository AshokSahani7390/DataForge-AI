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
  ExternalLink
} from "lucide-react";
import { useState } from "react";

export default function DataExplorer() {
  const [activeTab, setActiveTab] = useState("all");

  const mockData = [
    { id: "1", project: "Amazon PS5 Price", field_1: "PlayStation 5 Console", field_2: "$499.00", field_3: "4.8/5", field_4: "In Stock" },
    { id: "2", project: "Amazon PS5 Price", field_1: "Sony DualSense Edge", field_2: "$199.99", field_3: "4.9/5", field_4: "Sold Out" },
    { id: "3", project: "Miami Real Estate", field_1: "Penthouse at Sunny Isles", field_2: "$2.4M", field_3: "Active", field_4: "12 mins ago" },
    { id: "4", project: "Zillow Price Tracker", field_1: "Modern Studio - NYC", field_2: "$3,800/mo", field_3: "Reduced", field_4: "Yesterday" },
    { id: "5", project: "LinkedIn Jobs", field_1: "Senior AI Architect", field_2: "Remote", field_3: "$180k - $240k", field_4: "Applied" },
  ];

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
           <button className="flex items-center space-x-2 px-6 py-2.5 glass-card hover:bg-white/10 transition-colors font-bold text-sm">
             <Download className="w-4 h-4" />
             <span>Export All</span>
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
             placeholder="Search within extracted records..." 
             className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-primary-DEFAULT transition-all text-sm placeholder:text-gray-500 text-gray-200"
           />
        </div>

        <div className="relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2">
             <Layers className="w-4 h-4 text-gray-500" />
           </div>
           <select className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none appearance-none cursor-pointer text-sm text-gray-300">
             <option>All Projects</option>
             <option>Amazon Scraper</option>
             <option>Miami Real Estate</option>
           </select>
        </div>

        <div className="relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2">
             <Calendar className="w-4 h-4 text-gray-500" />
           </div>
           <button className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-left text-sm text-gray-300 flex items-center justify-between hover:bg-white/10 transition-colors">
              <span>Past 30 Days</span>
              <Filter className="w-3 h-3 text-gray-500" />
           </button>
        </div>

      </div>

      {/* TABS Navigation */}
      <div className="flex border-b border-white/5 gap-8 overflow-x-auto pb-px">
        {['All Records', 'Featured', 'Cleaned Data', 'AI Enriched'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab.toLowerCase() ? 'text-primary-DEFAULT' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab.toLowerCase() && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-DEFAULT shadow-[0_0_10px_#0070F3]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="glass-card border-white/5 relative group">
        
        {/* Premium Overlay Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-DEFAULT/5 blur-[100px] pointer-events-none"></div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Record Source</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Field 01</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Field 02</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Field 03</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Extraction Date</th>
                <th className="px-6 py-5 text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockData.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.03] transition-colors group/row">
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                       <div className="p-1.5 rounded-lg bg-primary-DEFAULT/10 text-primary-DEFAULT">
                          <ExternalLink className="w-3.5 h-3.5" />
                       </div>
                       <span className="text-sm font-bold text-gray-100">{row.project}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-gray-300 font-medium">{row.field_1}</td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-black text-white border border-white/5">
                      {row.field_2}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                     <div className="flex items-center space-x-1 text-emerald-500 text-xs font-black uppercase">
                       <Sparkles className="w-3.5 h-3.5 fill-current" />
                       <span>{row.field_3}</span>
                     </div>
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-500 font-bold">{row.field_4}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                       <button className="p-2 glass-card hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                         <Download className="w-4 h-4" />
                       </button>
                       <button className="p-2 glass-card hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                         <Filter className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-bold">Rows per page:</span>
            <select className="bg-transparent border-none outline-none text-xs font-black text-gray-300 cursor-pointer">
               <option>25</option>
               <option>50</option>
               <option>100</option>
            </select>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Page 1 of 42</span>
            <div className="flex space-x-1">
               <button className="p-2 glass-card hover:bg-white/10 rounded-lg text-gray-400 disabled:opacity-30" disabled>
                 <ChevronLeft className="w-4 h-4" />
               </button>
               <button className="p-2 glass-card hover:bg-white/10 rounded-lg text-gray-400">
                 <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
