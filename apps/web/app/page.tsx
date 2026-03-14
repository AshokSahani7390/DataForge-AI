"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Database, Globe } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary-DEFAULT/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => router.push("/")}>
            <div className="bg-gradient-premium p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">DataForge AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-6 py-2.5 text-sm font-bold hover:text-primary-DEFAULT transition-colors">Sign In</Link>
            <Link href="/signup" className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-black hover:bg-gray-200 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          {/* Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary-DEFAULT/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Production Ready v1.0</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              The AI Engine for <br />
              <span className="bg-gradient-premium text-transparent bg-clip-text">Web Intelligence</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12 font-medium">
              DataForge AI automates the extraction of structured data from any website using advanced LLMs and headless browser infrastructure.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full md:w-auto px-10 py-5 bg-gradient-premium rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(0,112,243,0.3)] hover:scale-105 transition-all flex items-center justify-center space-x-3">
                <span>Start Scraping Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full md:w-auto px-10 py-5 glass-card rounded-2xl font-black text-lg hover:bg-white/10 transition-all border-white/10">
                Book a Demo
              </button>
            </div>

            {/* Mock UI Preview */}
            <div className="mt-24 relative max-w-5xl mx-auto">
               <div className="absolute inset-0 bg-primary-DEFAULT/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
               <div className="glass-card border-white/10 p-2 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="bg-background-card rounded-[2rem] overflow-hidden border border-white/5 aspect-video flex items-center justify-center">
                     <div className="text-center">
                        <Database className="w-16 h-16 text-gray-800 mb-4 mx-auto" />
                        <span className="text-gray-600 font-black tracking-widest uppercase text-xs">Previewing Live Terminal</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Strip */}
        <section className="py-20 border-y border-white/5 bg-white/[0.02]">
           <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                 <div className="space-y-4">
                    <Globe className="w-10 h-10 text-primary-DEFAULT mx-auto md:mx-0" />
                    <h3 className="text-xl font-bold">Global Infrastructure</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Multi-region proxy rotation and automatic anti-bot bypassing baked in.</p>
                 </div>
                 <div className="space-y-4">
                    <Sparkles className="w-10 h-10 text-purple-500 mx-auto md:mx-0" />
                    <h3 className="text-xl font-bold">AI Data Forge</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Turn messy HTML into valid JSON schemas automatically with Gemini 1.5 Pro.</p>
                 </div>
                 <div className="space-y-4">
                    <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto md:mx-0" />
                    <h3 className="text-xl font-bold">Enterprise Privacy</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">End-to-end encryption for all your scraping projects and extracted data.</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-10 border-t border-white/5 text-center text-gray-600 text-xs font-bold">
         &copy; 2026 DataForge AI. Built for the modern web architect.
      </footer>
    </div>
  );
}
