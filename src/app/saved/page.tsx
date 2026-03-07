/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, Search } from "lucide-react";
import Link from "next/link";

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    import("@/utils/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    });
  }, []);

  useEffect(() => {
    async function load() {
      // In a real app we'd fetch by user ID, but for this demo 
      // we'll just fetch latest 20 searches broadly or by a local identifier.
      // We'll just fetch all for demonstration purposes as requested in the simplified DB schema.
      const { data, error } = await supabase
        .from("searches")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setSearches(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-background-dark text-slate-100 body-font selection:bg-primary selection:text-background-dark">
      <Navbar user={user} isChildPage />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="headline-font text-5xl mb-12 uppercase tracking-tight flex items-center gap-4">
          <Clock className="w-10 h-10 text-primary" /> Recent Searches
        </h1>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
           </div>
        ) : searches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searches.map((s) => (
              <Link 
                href={`/search?q=${encodeURIComponent(s.query)}`} 
                key={s.id}
                className="bg-card-dark p-6 rounded-2xl border border-white/5 hover:border-primary/50 hover:-translate-y-1 transition-all group block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-background-dark p-3 rounded-full group-hover:bg-primary/10 transition-colors">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-slate-500">{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="headline-font text-2xl uppercase tracking-widest text-slate-200 mb-2 truncate">{s.query}</h3>
                <p className="text-sm text-slate-500">
                  {s.results ? `${s.results.length} matches found` : 'No matches'}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card-dark rounded-2xl border border-white/5">
            <h3 className="headline-font text-2xl text-slate-300">No searches yet</h3>
            <p className="text-slate-500 mt-2">Start exploring to see your history here.</p>
          </div>
        )}
      </div>
    </main>
  );
}
