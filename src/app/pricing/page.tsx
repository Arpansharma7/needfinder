"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <main className="min-h-screen bg-background-dark text-slate-100 body-font selection:bg-primary selection:text-background-dark">
      <Navbar user={user} isChildPage={true} />
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="headline-font text-5xl md:text-7xl mb-16 text-center uppercase tracking-tighter">PRICING PLANS</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free */}
          <div className="bg-card-dark p-10 rounded-3xl border border-white/5 flex flex-col h-full hover:border-white/20 transition-all">
            <h3 className="headline-font text-3xl mb-2">FREE</h3>
            <div className="mb-8"><span className="text-4xl font-black headline-font">₹0</span><span className="text-slate-500 ml-1">/mo</span></div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="text-primary w-4 h-4" /> 5 AI searches / week
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="text-primary w-4 h-4" /> Basic price comparison
              </li>
            </ul>
            <Link 
              href="/"
              className="w-full py-4 rounded-full font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-white/20 hover:bg-white/5 text-slate-200"
            >
              START FREE
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-card-dark p-10 rounded-3xl border-2 border-primary relative flex flex-col h-full transform scale-105 shadow-[0_0_40px_rgba(245,197,24,0.15)] hover:shadow-[0_0_50px_rgba(245,197,24,0.25)] transition-shadow">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background-dark px-4 py-1 rounded-full font-black text-xs headline-font tracking-widest">MOST POPULAR</div>
            <h3 className="headline-font text-3xl mb-2">PRO</h3>
            <div className="mb-8"><span className="text-4xl font-black headline-font">₹199</span><span className="text-slate-500 ml-1">/mo</span></div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="text-primary w-4 h-4" /> Unlimited searches
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="text-primary w-4 h-4" /> Price drop alerts
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="text-primary w-4 h-4" /> AI Review synthesis
              </li>
            </ul>
            <Link 
              href="/plans/pro"
              className="w-full py-4 rounded-full font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 bg-primary text-background-dark hover:brightness-110"
            >
              GO PRO
            </Link>
          </div>

          {/* Teams */}
          <div className="bg-card-dark p-10 rounded-3xl border border-white/5 flex flex-col h-full hover:border-white/20 transition-all">
            <h3 className="headline-font text-3xl mb-2">TEAMS</h3>
            <div className="mb-8"><span className="text-4xl font-black headline-font">₹499</span><span className="text-slate-500 ml-1">/mo</span></div>
            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="text-primary w-4 h-4" /> Shared procurement list
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="text-primary w-4 h-4" /> B2B discount finding
              </li>
               <li className="flex items-center gap-3 text-slate-300">
                <Check className="text-primary w-4 h-4" /> Everything in Pro
              </li>
            </ul>
             <Link 
              href="/plans/teams"
              className="w-full py-4 rounded-full font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-white/20 hover:bg-white/5 text-slate-200"
            >
              GET TEAMS
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
