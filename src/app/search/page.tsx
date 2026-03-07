/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { User } from "@supabase/supabase-js";
import { ProductCard } from "@/types";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
const ResultCards = dynamic(() => import("@/components/ResultCards"));
import { AlertCircle, RefreshCcw } from "lucide-react";
import SearchInput from "@/components/SearchInput";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ProductCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [budgetWarning, setBudgetWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch results");
        }
        
        setResults(data.results || []);
        if (data.budget_warning) {
          setBudgetWarning(data.budget_warning);
        } else {
          setBudgetWarning(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <SearchInput />
      </div>

      <h2 className="headline-font text-4xl mb-12 flex items-center gap-4 uppercase font-bold text-slate-100">
        Results for &quot;{query}&quot;
      </h2>

      {loading && (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card-dark rounded-2xl overflow-hidden border border-white/5 animate-pulse h-[450px]">
              <div className="bg-slate-700/50 h-64 w-full"></div>
              <div className="p-6">
                <div className="h-8 bg-slate-700/50 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-700/50 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && error.toLowerCase().includes('10 free searches') && (
        <div className="bg-card-dark border border-primary/50 relative overflow-hidden p-10 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-background-dark font-bold text-xs px-4 py-1 rounded-b-xl uppercase tracking-widest">
            Free Trial Ended
          </div>
          <div className="bg-primary/10 p-4 rounded-full mb-6 mt-4">
             <AlertCircle className="w-10 h-10 text-primary" />
          </div>
          <h3 className="headline-font text-3xl mb-4 uppercase text-slate-100">Unlock Unlimited Searches</h3>
          <p className="text-slate-400 max-w-md mb-8">
            You&apos;ve reached the limit of your 10 free AI searches for today. Upgrade to Pro to get unlimited searches, price drop alerts, and AI review synthesis.
          </p>
          <a href="/#pricing" className="bg-primary text-background-dark px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform inline-block">
            View Premium Plans
          </a>
        </div>
      )}

      {!loading && error && !error.toLowerCase().includes('10 free searches') && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h3 className="headline-font text-2xl mb-2 uppercase">Oops, something went wrong</h3>
          <p className="text-slate-300 max-w-md">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-2 rounded-full font-bold uppercase transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}

      {!loading && !error && results.length === 0 && query && (
         <div className="bg-card-dark border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
         <h3 className="headline-font text-2xl mb-2 uppercase text-slate-200">No matches found</h3>
         <p className="text-slate-400 max-w-md mb-6">
           Try describing the item differently. Here are some suggestions:
         </p>
         <div className="flex flex-wrap items-center justify-center gap-4">
           {["Professional running shoes", "Acoustic guitar pack", "Organic coffee beans"].map((s, i) => (
             <a key={i} href={`/search?q=${encodeURIComponent(s)}`} className="bg-background-dark border border-white/10 hover:border-primary/50 text-slate-300 px-4 py-2 rounded-full text-sm transition-colors">
               {s}
             </a>
           ))}
         </div>
       </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-6">
          {budgetWarning && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-yellow-500/90 text-sm font-medium">{budgetWarning}</p>
            </div>
          )}
          <ResultCards products={results} />
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    import("@/utils/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    });
  }, []);

  return (
    <main className="min-h-screen bg-background-dark text-slate-100 body-font selection:bg-primary selection:text-background-dark">
      <Navbar user={user} isChildPage />
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}
