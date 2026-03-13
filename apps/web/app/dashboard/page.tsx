"use client";

import { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Database, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Play,
  Settings2,
  MoreVertical,
  Calendar,
  Layers,
  Sparkles,
  Bolt
} from "lucide-react";
import NewProjectModal from "@/components/dashboard/NewProjectModal";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Hero / Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Welcome back, <span className="text-primary-DEFAULT">Data Architect</span></h2>
          <p className="text-gray-400 font-medium">Monitoring and managing active scraping jobs across your infrastructure.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 glass-card hover:bg-white/10 transition-colors font-bold text-sm">
            <Calendar className="w-4 h-4" />
            <span>Activity Logs</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-premium rounded-xl shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_30px_rgba(0,112,243,0.5)] transition-all transform active:scale-95 font-bold text-sm"
          >
            <Layers className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Scrapes", value: "142,829", change: "+12.5%", trendingUp: true, icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Data Collected", value: "4.2 GB", change: "+8.1%", trendingUp: true, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Success Rate", value: "99.2%", change: "+0.4%", trendingUp: true, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Usage Quota", value: "8,420 / 10k", change: "75%", trendingUp: false, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl glass-card border-white/10 group hover:border-white/20 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`${stat.bg} p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-bold ${stat.trendingUp ? 'text-emerald-500' : 'text-orange-500'}`}>
                <span>{stat.change}</span>
                {stat.trendingUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
            
            {/* Subtle background glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-[60px] opacity-20 ${stat.bg.replace('/10', '/30')}`}></div>
          </div>
        ))}
      </div>

      {/* Main Content Area: Recent Projects & Job Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Projects Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center space-x-2">
               <span>Recent Scraping Projects</span>
               <span className="bg-white/5 text-gray-500 text-xs px-2 py-0.5 rounded-full border border-white/5">04 Total</span>
            </h3>
            <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors">View All</button>
          </div>

          <div className="glass-card overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Project Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Frequency</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Last Run</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: "Amazon Product Scraper", status: "Active", frequency: "Hourly", lastRun: "12 mins ago", color: "text-emerald-500" },
                    { name: "Real Estate Leads - Miami", status: "Active", frequency: "Daily", lastRun: "2 hours ago", color: "text-emerald-500" },
                    { name: "LinkedIn Job Postings", status: "Running", frequency: "Daily", lastRun: "Currently Running...", color: "text-primary-DEFAULT" },
                    { name: "Zillow Price Tracker", status: "Failed", frequency: "Daily", lastRun: "4 hours ago", color: "text-red-500" },
                  ].map((project, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center font-bold text-xs bg-gradient-premium/5">
                             {project.name[0]}
                           </div>
                           <span className="font-bold text-sm tracking-tight">{project.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className={`text-xs font-black inline-flex items-center space-x-1 uppercase px-3 py-1 bg-white/5 rounded-full ${project.color}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'Running' ? 'animate-pulse' : ''} bg-current`}></div>
                           <span>{project.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-xs text-gray-400 font-bold">{project.frequency}</td>
                      <td className="px-6 py-5 text-right text-xs text-gray-500 font-bold">{project.lastRun}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           <button className="p-2 hover:bg-white/10 rounded-lg transition-colors group-hover:text-primary-DEFAULT">
                             <Play className="w-4 h-4 fill-current" />
                           </button>
                           <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                             <Settings2 className="w-4 h-4" />
                           </button>
                           <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widget: Job Status */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Activity Health</h3>
              <button className="p-2 glass-card rounded-xl hover:bg-white/10 transition-colors">
                <Settings2 className="w-4 h-4 text-gray-400" />
              </button>
           </div>

           <div className="p-6 glass-card border-none bg-gradient-to-b from-white/10 to-transparent space-y-6">
              {[
                { label: "Successful Tasks", value: 842, max: 850, color: "bg-emerald-500", icon: CheckCircle2 },
                { label: "Pending Jobs", value: 24, max: 100, color: "bg-primary-DEFAULT", icon: Clock },
                { label: "Action Required", value: 2, max: 10, color: "bg-red-500", icon: AlertCircle },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-bold text-gray-300">
                       <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                       <span>{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-white">{item.value} / {item.max}</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div 
                      className={`${item.color} h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`}
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4">
                  <button className="w-full premium-button flex items-center justify-center space-x-2 py-3">
                    <Bolt className="w-4 h-4" />
                    <span>Optimize Engine Performance</span>
                  </button>
              </div>
           </div>

           <div className="glass-card p-6 border-white/5 bg-background-card overflow-hidden">
             <div className="flex items-center space-x-3 mb-4">
               <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                 <AlertCircle className="w-5 h-5" />
               </div>
               <h4 className="font-bold text-white tracking-tight">System Notice</h4>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed mb-4">
               Real-time proxy pool is experiencing higher latency for <b>USA East</b> region. We are automatically rerouting to EU-West nodes.
             </p>
             <div className="h-2 w-full bg-white/5 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50 animate-[shimmer_2s_infinite]"></div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
