"use client";

import { useState } from "react";
import { Key, Copy, RefreshCw, ShieldCheck, Bolt } from "lucide-react";

export default function APIAccessPage() {
  const [apiKey, setApiKey] = useState("df_live_4k82n9slw01mkzv9281");
  const [copied, setCopied] = useState(false);

  const rotateKey = () => {
    const newKey = `df_live_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
    alert("New API key generated. Please update your environment variables.");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="pt-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2">API Access</h2>
        <p className="text-gray-400">Integrate DataForge AI into your workflow with our production-ready API.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Key className="w-32 h-32" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg text-primary-DEFAULT">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Default API Key</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full font-black tracking-widest leading-none">ACTIVE</span>
            </div>

            <div className="flex items-center space-x-4 mb-8 relative z-10">
              <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-6 py-4 font-mono text-gray-300 text-lg flex items-center justify-between group">
                <span className="truncate">{copied ? apiKey : apiKey.replace(/.(?=.{4})/g, '*')}</span>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-500 hover:text-white"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={rotateKey}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                title="Rotate API Key"
              >
                <RefreshCw className="w-6 h-6 text-gray-400 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            <p className="text-xs text-gray-500 font-medium relative z-10">
              Your API key is a sensitive credential. Never share it in client-side code or public repositories.
            </p>
          </div>

          <div className="glass-card p-8 border-white/5">
            <h3 className="font-bold mb-6 text-lg">Quick Start Guide</h3>
            <div className="space-y-4">
              <div className="p-4 bg-black/20 rounded-xl border border-white/5 font-mono text-xs text-gray-400">
                <div className="text-emerald-500 mb-2"># Fetch your projects via CLI</div>
                <div>curl -X GET "http://api.dataforge-ai.com/v1/projects" \</div>
                <div className="px-4">-H "Authorization: Bearer {apiKey.substring(0, 8)}..."</div>
              </div>
              <p className="text-sm text-gray-400">Read our full <a href="#" className="text-primary-DEFAULT hover:underline">API Documentation</a> for more details on endpoints and rate limits.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-b from-white/5 to-transparent">
            <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-4">API Statisitcs</h4>
            <div className="space-y-4">
               {[
                 { label: "Request Count", value: "1,242", limit: "10,000" },
                 { label: "Bandwidth Used", value: "420 MB", limit: "5 GB" },
                 { label: "Latency (Avg)", value: "142ms", limit: "" },
               ].map((stat, i) => (
                 <div key={i} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-400">{stat.label}</span>
                      <span className="text-sm font-black text-white">{stat.value}</span>
                    </div>
                    {stat.limit && (
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary-DEFAULT h-full w-[12%] rounded-full shadow-[0_0_10px_#0070F3]"></div>
                      </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

