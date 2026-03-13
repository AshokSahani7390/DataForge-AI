"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  Database, 
  Send, 
  Settings, 
  CreditCard, 
  Key, 
  Sparkles
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Main" },
    { label: "Scraping Projects", href: "/dashboard/scraping-projects", icon: Layers, group: "Main" },
    { label: "Data Explorer", href: "/dashboard/explorer", icon: Database, group: "Main" },
    { label: "Export Center", href: "/dashboard/export-center", icon: Send, group: "Tools" },
    { label: "API Access", href: "/dashboard/api-access", icon: Key, group: "Tools" },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard, group: "Config" },
    { label: "Settings", href: "/dashboard/settings", icon: Settings, group: "Config" },
  ];

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col p-6 space-y-8 bg-background-card h-screen sticky top-0">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-premium p-2 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-premium text-transparent bg-clip-text">
          DataForge AI
        </h1>
      </div>

      <nav className="flex-1 space-y-6">
        {["Main", "Tools", "Config"].map((group) => (
          <div key={group} className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-4 mb-2">
              {group}
            </div>
            {navItems
              .filter((item) => item.group === group)
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-white/10 text-white border border-white/10" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer: User Status */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-xs text-gray-400">Pro Plan</span>
          <span className="text-[10px] bg-primary/20 text-primary-DEFAULT px-2 py-0.5 rounded-full font-bold">75% Used</span>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full mb-3 overflow-hidden">
          <div className="bg-gradient-premium h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(0,112,243,0.5)]"></div>
        </div>
        <button className="w-full text-xs font-bold py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
