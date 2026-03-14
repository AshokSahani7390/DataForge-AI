"use client";

import { Search, Bolt, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStats } from "@/hooks/useStats";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { stats } = useStats();

  return (
    <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between backdrop-blur-md sticky top-0 bg-background/80 z-20">
      <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 w-96">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input 
          type="text" 
          placeholder="Search projects or data..." 
          className="bg-transparent border-none outline-none text-sm w-full text-gray-300 placeholder:text-gray-500" 
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-gradient-premium/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <Bolt className="w-4 h-4 text-primary-DEFAULT fill-primary-DEFAULT" />
          <span className="text-sm font-bold text-primary-DEFAULT">{stats.usageQuota}</span>
        </div>
        
        <div className="flex items-center space-x-3 group relative">
          <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center p-[2px]">
             <div className="w-full h-full rounded-full bg-background-card flex items-center justify-center text-sm font-bold overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=0D0D0D&color=fff`} alt="User" />
             </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-red-500"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
