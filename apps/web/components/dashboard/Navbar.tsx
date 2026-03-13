"use client";

import { Search, Bolt } from "lucide-react";

export default function Navbar() {
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
          <span className="text-sm font-bold text-primary-DEFAULT">8,420 / 10,000</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center p-[2px]">
           <div className="w-full h-full rounded-full bg-background-card flex items-center justify-center text-sm font-bold overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=Data+Architect&background=000&color=fff`} alt="User" />
           </div>
        </div>
      </div>
    </header>
  );
}
