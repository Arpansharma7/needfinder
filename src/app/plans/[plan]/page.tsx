"use client";
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bell, Sparkles, Zap, CheckCircle, Users, Tag, UserPlus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';

import { User } from '@supabase/supabase-js';

export default function PlanPage({ params }: { params: { plan: string } }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  if (params.plan !== 'pro' && params.plan !== 'teams') {
    notFound();
  }

  const isPro = params.plan === 'pro';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  const proData = {
    badge: "PRO PLAN",
    price: "₹199",
    subtext: "Everything you need to shop smarter",
    cards: [
      {
        icon: <Sparkles className="w-8 h-8 text-primary" />,
        title: "Unlimited AI Searches",
        detail: "Run as many product searches as you need. No daily caps, no waiting. Free plan is limited to 5 searches per month."
      },
      {
        icon: <Bell className="w-8 h-8 text-primary" />,
        title: "Price Drop Alerts",
        detail: "Save any product and get notified by email when the price drops. Never overpay again."
      },
      {
        icon: <Sparkles className="w-8 h-8 text-primary" />,
        title: "AI Review Synthesis",
        detail: "Instead of reading 200 reviews, our AI reads them all and gives you a 3-line verdict: who it's great for, who should avoid it, and the one thing everyone complains about."
      },
      {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Faster, Deeper Results",
        detail: "Pro searches run 5 results deep instead of 3, with more detailed match explanations and better ranking accuracy."
      }
    ],
    faqs: [
      { q: "How does billing work?", a: "You will be billed monthly. Cancel anytime by emailing us." },
      { q: "Can I try before subscribing?", a: "Yes — free plan gives you 5 searches/month to try the product before committing." },
      { q: "How do I cancel?", a: "Just send us an email and we'll cancel within 24 hours, no questions asked." }
    ],
    cta: {
      heading: "Ready to get started?",
      subtext: "Send us an email and we'll set up your Pro account within a few hours.",
      buttonText: "GET PRO FOR ₹199/mo →",
      href: `mailto:${email}?subject=Pro Plan Subscription Request&body=Hi, I'd like to subscribe to the NeedFinder AI Pro plan (₹199/mo). My name is: [Your name] Please activate my account.`,
      footerText: "We'll reply within a few hours with payment instructions and account activation."
    }
  };

  const teamsData = {
    badge: "TEAMS PLAN",
    price: "₹499",
    subtext: "Built for teams that buy together",
    cards: [
      {
        icon: <CheckCircle className="w-8 h-8 text-primary" />,
        title: "Everything in Pro, Plus More",
        detail: "All Pro features included — unlimited searches, price alerts, AI review synthesis."
      },
      {
        icon: <Users className="w-8 h-8 text-primary" />,
        title: "Shared Procurement List",
        detail: "Your whole team sees the same saved products and search history. Perfect for offices buying equipment or supplies together."
      },
      {
        icon: <Tag className="w-8 h-8 text-primary" />,
        title: "B2B Discount Detection",
        detail: "Our AI specifically looks for bulk pricing, B2B portals, and business discounts that regular shoppers never see."
      },
      {
        icon: <UserPlus className="w-8 h-8 text-primary" />,
        title: "Up to 5 Team Members",
        detail: "One subscription covers your whole small team. Each member gets their own search history and saved products."
      }
    ],
    faqs: [
      { q: "How many people can use one Teams account?", a: "Up to 5 team members per subscription." },
      { q: "Do we all share one login?", a: "No — each team member gets their own account under the same Teams subscription." },
      { q: "Can we upgrade from Pro to Teams later?", a: "Yes, just email us and we'll upgrade your account and prorate the difference." }
    ],
    cta: {
      heading: "Equip your whole team",
      subtext: "Email us to set up your Teams account. We'll onboard your whole team manually.",
      buttonText: "GET TEAMS FOR ₹499/mo →",
      href: `mailto:${email}?subject=Teams Plan Subscription Request&body=Hi, I'd like to subscribe to the NeedFinder AI Teams plan (₹499/mo). Company/Team name: [Your name] Number of members: [Number] Please activate our account.`,
      footerText: "We'll reply within a few hours with payment instructions and team onboarding steps."
    }
  };

  const data = isPro ? proData : teamsData;

  return (
    <main className="min-h-screen bg-background-dark text-slate-100 body-font selection:bg-primary selection:text-background-dark pb-24">
      <Navbar user={user} isChildPage={true} />
      
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <Link href="/#pricing" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-12 uppercase tracking-widest text-sm font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Pricing
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full font-black text-xs headline-font tracking-widest mb-6 border border-primary/20">
            {data.badge}
          </div>
          <h1 className="headline-font text-6xl md:text-7xl mb-6 tracking-tighter uppercase">
            {data.price} <span className="text-3xl text-slate-500">/month</span>
          </h1>
          <p className="text-xl text-slate-300">
            {data.subtext}
          </p>
        </div>

        {/* Features Breakdown */}
        <div className="mb-24">
          <h2 className="headline-font text-3xl mb-10 uppercase tracking-tight text-center">What&apos;s included</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.cards.map((card, i) => (
              <div key={i} className="bg-card-dark p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-colors group">
                <div className="mb-6 bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  {card.icon}
                </div>
                <h3 className="headline-font text-2xl mb-4">{card.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {card.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-24">
          <h2 className="headline-font text-3xl mb-10 flex uppercase tracking-tight text-center justify-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-card-dark p-8 rounded-3xl border border-white/5">
                <h4 className="headline-font text-xl mb-3">{faq.q}</h4>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card-dark p-12 rounded-3xl border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <h2 className="headline-font text-4xl mb-4 uppercase tracking-tighter">{data.cta.heading}</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            {data.cta.subtext}
          </p>
          <a 
            href={data.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full md:w-auto px-12 py-5 rounded-full font-bold uppercase tracking-widest transition-all bg-primary text-background-dark hover:brightness-110 hover:scale-105 shadow-[0_0_40px_rgba(245,197,24,0.3)] mb-6"
          >
            {data.cta.buttonText}
          </a>
          <p className="text-sm text-slate-500">
            {data.cta.footerText}
          </p>
        </div>
      </div>
    </main>
  );
}
