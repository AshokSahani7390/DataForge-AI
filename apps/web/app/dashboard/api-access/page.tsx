"use client";

import { useState } from "react";
import { Key, Copy, RefreshCw, ShieldCheck, Trash2, Plus, Loader2, CheckCircle2, Bolt } from "lucide-react";
import { useApiKeys, ApiKey } from "@/hooks/useApiKeys";

export default function APIAccessPage() {
  const { keys, loading, generateKey, revokeKey } = useApiKeys();
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedProjectId = ""; // Placeholder for documentation

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateKey(`Production Key ${keys.length + 1}`);
    setIsGenerating(false);
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-DEFAULT" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="pt-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">API Access</h2>
          <p className="text-gray-400">Integrate DataForge AI into your workflow with our production-ready API.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-gradient-premium px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Generate New Key</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 space-y-6">
          {keys.length === 0 ? (
            <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                <Key className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium">No API keys found. Generate one to start using the API.</p>
              <button 
                onClick={handleGenerate}
                className="text-primary-DEFAULT font-bold hover:underline"
              >
                + Create your first key
              </button>
            </div>
          ) : (
            keys.map((apiKey) => (
              <div key={apiKey.id} className="glass-card p-8 border-white/5 relative group overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary-DEFAULT">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">{apiKey.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        Created {apiKey.createdAt?.toDate ? apiKey.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full font-black tracking-widest leading-none">ACTIVE</span>
                    <button 
                      onClick={() => confirm("Revoke this key? All applications using it will lose access.") && revokeKey(apiKey.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 relative z-10">
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-6 py-4 font-mono text-gray-300 text-sm flex items-center justify-between group/key">
                    <span className="truncate">{copiedKeyId === apiKey.id ? apiKey.key : apiKey.key.replace(/.(?=.{4})/g, '*')}</span>
                    <button 
                      onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-500 hover:text-white"
                    >
                      {copiedKeyId === apiKey.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="glass-card p-8 border-white/5">
            <h3 className="font-bold mb-6 text-lg tracking-tight">API Documentation</h3>
            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-gray-400">
                <div className="text-emerald-500 mb-2">// Fetch your scraping project results</div>
                <div>curl -X GET "http://localhost:3001/api/v1/data/{selectedProjectId || ':project_id'}" \</div>
                <div className="px-4">-H "x-api-key: {keys[0]?.key.substring(0, 12) || 'YOUR_API_KEY'}..."</div>
              </div>
              <p className="text-sm text-gray-400">Read our full <a href="#" className="text-primary-DEFAULT font-bold hover:underline">documentation</a> to learn how to trigger scrapes and manage projects programmatically.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 bg-gradient-to-b from-white/5 to-transparent border-white/5">
            <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-6">Usage Limits</h4>
            <div className="space-y-6">
               {[
                 { label: "Monthly Requests", value: "0", limit: "10,000" },
                 { label: "Concurrent Jobs", value: "0", limit: "5" },
                 { label: "Data Retention", value: "30 Days", limit: "" },
               ].map((stat, i) => (
                 <div key={i} className="pb-6 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-bold text-gray-400">{stat.label}</span>
                       <span className="text-sm font-black text-white">{stat.value}{stat.limit && ` / ${stat.limit}`}</span>
                    </div>
                    {stat.limit && (
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary-DEFAULT h-full w-[1%] rounded-full shadow-[0_0_10px_rgba(0,112,243,0.5)]"></div>
                      </div>
                    )}
                 </div>
               ))}
            </div>
            <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start space-x-3">
               <Bolt className="w-5 h-5 text-primary-DEFAULT mt-0.5" />
               <p className="text-[11px] text-gray-400 leading-relaxed">
                 Need higher limits or dedicated infrastructure? <b>Contact sales</b> for enterprise API solutions.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

