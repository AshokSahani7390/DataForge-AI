"use client";

import { CreditCard, CheckCircle2, History, AlertCircle, Loader2 } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function BillingPage() {
  const { stats, loading } = useStats(); 
  const { user } = useAuth();
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  const plans = [
    { id: "free", name: "Starter", price: "₹0", features: ["5 Projects", "Daily Scrapes", "CSV Export"] },
    { id: "pro", name: "Pro", price: "₹2,900", features: ["1,000 Scrapes/mo", "Hourly Scrapes", "JSON/Excel Export", "API Access"] },
    { id: "enterprise", name: "Enterprise", price: "₹9,900", features: ["10,000 Scrapes/mo", "Real-time Scrapes", "Priority Support", "Dedicated Worker"] },
  ];

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (planId: string, planName: string) => {
    if (!user) return alert("Please log in to upgrade.");
    
    setUpgradingPlan(planId);
    
    try {
      const res = await loadRazorpay();
      if (!res) return alert("Razorpay SDK failed to load. Are you online?");

      const token = await user.getIdToken();
      
      const orderRes = await axios.post(`${API_URL}/api/payments/create-order`, {
        planId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const order = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_...', 
        amount: order.amount,
        currency: order.currency,
        name: "DataForge AI",
        description: `Upgrade to ${planName} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          alert("Payment Successful! Your plan will be updated shortly.");
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        notes: {
          userId: user.uid,
          planId: planId
        },
        theme: {
          color: "#0070F3",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setUpgradingPlan(null);
    }
  };

  if (loading) {
     return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-DEFAULT" /></div>
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="pt-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2 uppercase">Subscription & Billing</h2>
        <p className="text-gray-400">Manage your subscription, update payment methods, and view invoices.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {plans.map((plan) => {
          const isCurrent = (stats.plan || "free").toLowerCase() === plan.id;
          
          return (
            <div key={plan.name} className={`glass-card p-8 flex flex-col space-y-6 transition-all duration-300 ${isCurrent ? 'border-primary/50 ring-1 ring-primary/20 bg-gradient-to-b from-primary/5 to-transparent scale-[1.02]' : 'border-white/5 opacity-80 hover:opacity-100 hover:scale-[1.01]'}`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  {isCurrent && <span className="text-[10px] bg-primary/20 text-primary-DEFAULT px-2 py-0.5 rounded-full font-black tracking-widest leading-none">ACTIVE</span>}
                </div>
                <div className="text-4xl font-black">{plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              </div>
              
              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-primary-DEFAULT" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => !isCurrent && handleUpgrade(plan.id, plan.name)}
                disabled={isCurrent || upgradingPlan !== null}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                  isCurrent 
                    ? 'bg-white/5 text-gray-500 cursor-default border border-white/5' 
                    : 'bg-gradient-premium text-white hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] transform active:scale-95'
                }`}
              >
                {upgradingPlan === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isCurrent ? "Current Plan" : "Upgrade Now"}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span>Payment Details</span>
            </h3>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 italic text-sm text-gray-500">
             Razorpay secure payments integration active.
          </div>
        </div>

        <div className="glass-card p-8 border-white/5 space-y-6">
           <h3 className="text-lg font-bold flex items-center space-x-2">
              <History className="w-5 h-5 text-gray-400" />
              <span>Billing History</span>
           </h3>
           <div className="space-y-4 text-center py-4">
              <p className="text-sm text-gray-500 font-medium">No recent invoices found.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
