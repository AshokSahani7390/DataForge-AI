import { CreditCard, CheckCircle2, History, AlertCircle } from "lucide-react";

export default function BillingPage() {
  const plans = [
    { name: "Starter", price: "$0", features: ["5 Projects", "Daily Scrapes", "CSV Export"], current: false },
    { name: "Pro", price: "$19", features: ["25 Projects", "Hourly Scrapes", "JSON/Excel Export", "API Access"], current: true },
    { name: "Enterprise", price: "$99", features: ["Unlimited Projects", "Real-time Scrapes", "Priority Support", "Dedicated Worker"], current: false },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="pt-4">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Subscription & Billing</h2>
        <p className="text-gray-400">Manage your subscription, update payment methods, and view invoices.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {plans.map((plan) => (
          <div key={plan.name} className={`glass-card p-8 flex flex-col space-y-6 ${plan.current ? 'border-primary/50 ring-1 ring-primary/20 bg-gradient-to-b from-primary/5 to-transparent' : 'border-white/5'}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                {plan.current && <span className="text-[10px] bg-primary/20 text-primary-DEFAULT px-2 py-0.5 rounded-full font-black tracking-widest leading-none">ACTIVE</span>}
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
            
            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.current ? 'bg-white/5 text-gray-500 cursor-default' : 'bg-gradient-premium text-white hover:shadow-[0_0_20px_rgba(0,112,243,0.3)]'}`}>
              {plan.current ? "Current Plan" : "Upgrade Now"}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span>Payment Method</span>
            </h3>
            <button className="text-xs font-bold text-primary-DEFAULT hover:underline">Edit</button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
             <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-black/40 rounded border border-white/10 flex items-center justify-center font-black italic text-[10px] text-gray-500">VISA</div>
                <div>
                  <div className="text-sm font-bold">Visa ending in 4242</div>
                  <div className="text-xs text-gray-500">Expiry 12/2026</div>
                </div>
             </div>
             <div className="text-gray-500 text-xs font-bold">Default</div>
          </div>
        </div>

        <div className="glass-card p-8 border-white/5 space-y-6">
           <h3 className="text-lg font-bold flex items-center space-x-2">
              <History className="w-5 h-5 text-gray-400" />
              <span>Billing History</span>
           </h3>
           <div className="space-y-4">
              {[
                { date: "Mar 01, 2026", amount: "$19.00", status: "Paid" },
                { date: "Feb 01, 2026", amount: "$19.00", status: "Paid" },
              ].map((inv, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm font-medium text-gray-300">{inv.date}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-bold">{inv.amount}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase">{inv.status}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

