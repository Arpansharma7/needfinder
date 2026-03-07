/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import { Check, Verified, TrendingDown, Maximize } from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

import Image from "next/image";

const HOW_IT_WORKS_STEPS = [
  { num: "01", title: "ASK ANYTHING", desc: "Describe what you're looking for in natural language. \"Need a tent for 4 people that fits in a small trunk.\"" },
  { num: "02", title: "AI SCANS THE WEB", desc: "Our agents crawl thousands of retailers and review sites to find the perfect matches for your criteria." },
  { num: "03", title: "CHOOSE & BUY", desc: "Review the top 3 best-fit options with synthesized pros/cons and one-click purchase links." },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <main className="min-h-screen bg-background-dark text-slate-100 body-font selection:bg-primary selection:text-background-dark">
      <Navbar user={user} />
      <Hero />
      <Marquee />

      {/* FEATURE SECTION */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="headline-font text-5xl md:text-7xl mb-6 leading-none">
              SHOP SMARTER, <br /> <span className="text-primary">NOT HARDER</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
              Stop opening dozens of tabs. Our AI engine processes specifications, real user reviews, and pricing history to deliver a personalized shortlist in milliseconds.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Verified className="text-primary w-6 h-6" />
                <span>Expert review synthesis</span>
              </li>
              <li className="flex items-center gap-3">
                <TrendingDown className="text-primary w-6 h-6" />
                <span>Historical price tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <Maximize className="text-primary w-6 h-6" />
                <span>Personalized sizing guide</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card-dark p-2 rounded-[2rem] border border-white/10 shadow-2xl">
            {/* Browser Mockup */}
            <div className="bg-background-dark rounded-xl overflow-hidden border border-white/5">
              <div className="h-8 bg-card-dark flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="aspect-square bg-card-dark rounded-lg flex flex-col p-4 shadow-lg">
                  <div className="w-full h-1/2 bg-slate-800 rounded mb-3 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop" fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" alt="Product" />
                  </div>
                  <div className="text-sm font-bold headline-font mb-1 text-slate-200 uppercase truncate">Sony WH-1000XM5</div>
                  <div className="text-xs text-slate-500 mb-2 truncate">Noise Cancelling</div>
                  <div className="text-primary font-black headline-font text-lg mt-auto">XX,990</div>
                </div>
                <div className="aspect-square bg-card-dark rounded-lg flex flex-col p-4 shadow-lg">
                  <div className="w-full h-1/2 bg-slate-800 rounded mb-3 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop" fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" alt="Product" />
                  </div>
                  <div className="text-sm font-bold headline-font mb-1 text-slate-200 uppercase truncate">Smart Watch Pro</div>
                  <div className="text-xs text-slate-500 mb-2 truncate">Fitness Tracking</div>
                  <div className="text-primary font-black headline-font text-lg mt-auto">XX,499</div>
                </div>
                <div className="aspect-square bg-card-dark rounded-lg flex flex-col p-4 shadow-lg">
                  <div className="w-full h-1/2 bg-slate-800 rounded mb-3 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop" fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" alt="Product" />
                  </div>
                  <div className="text-sm font-bold headline-font mb-1 text-slate-200 uppercase truncate">Polaroid Camera</div>
                  <div className="text-xs text-slate-500 mb-2 truncate">Instant Print</div>
                  <div className="text-primary font-black headline-font text-lg mt-auto">X,990</div>
                </div>
                <div className="aspect-square bg-card-dark rounded-lg flex flex-col p-4 shadow-lg border border-primary/30 relative">
                  <div className="absolute -top-2 -right-2 bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 rounded-full z-10">BEST DEAL</div>
                  <div className="w-full h-1/2 bg-slate-800 rounded mb-3 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" alt="Product" />
                  </div>
                  <div className="text-sm font-bold headline-font mb-1 text-slate-200 uppercase truncate">Nike Air Max</div>
                  <div className="text-xs text-slate-500 mb-2 truncate">Running Shoes</div>
                  <div className="text-primary font-black headline-font text-lg mt-auto">XX,295</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about" className="py-24 bg-card-dark/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="headline-font text-5xl md:text-7xl mb-16 text-center">HOW IT WORKS</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="headline-font text-8xl text-white/5 group-hover:text-primary/20 transition-colors mb-[-4rem]">
                  {step.num}
                </div>
                <h3 className="headline-font text-3xl mb-4 relative z-10">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
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

      {/* FOOTER */}
      <footer className="bg-background-dark border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-sm">© 2026 NeedFinder AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            POWERED BY <span className="text-primary headline-font text-lg tracking-widest">team NeedFinder</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
