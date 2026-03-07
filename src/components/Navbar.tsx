"use client";
import Link from "next/link";
import { ShoppingBag, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import { User } from "@supabase/supabase-js";

export default function Navbar({ user, isChildPage }: { user?: User | null; isChildPage?: boolean }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    window.location.reload();
  };
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 text-primary">
          <ShoppingBag className="w-8 h-8" />
          <span className="headline-font text-2xl tracking-wider uppercase">NeedFinder AI</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {!isChildPage && (
            <>
              <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="#features">Features</Link>
              <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="#pricing">Pricing</Link>
              <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="#about">About</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isChildPage && (
            <Link className="text-sm font-bold text-slate-300 hover:text-primary transition-colors uppercase tracking-widest mr-4" href="/">
              Home
            </Link>
          )}
          {!user ? (
            <Link href="/login">
              <button className="bg-primary text-background-dark px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                Log In
              </button>
            </Link>
          ) : (
            <>
              <Link href="/saved">
                <button className="hidden md:block bg-slate-800 text-slate-200 border border-white/10 px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-slate-700 transition-colors">
                  History
                </button>
              </Link>
              <button 
                onClick={handleSignOut}
                className="bg-transparent border border-white/20 text-slate-300 px-4 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
