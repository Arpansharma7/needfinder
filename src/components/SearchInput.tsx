"use client";
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

const placeholders = [
  "Best noise-cancelling headphones under $300...",
  "A lightweight tent for 4 people...",
  "Ergonomic office chair for back pain...",
];

const SearchInput = memo(function SearchInput() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  // Typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fullText = placeholders[placeholderIndex];

    const typeSpeed = isDeleting ? 30 : 80;
    
    if (!isDeleting && currentPlaceholder === fullText) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentPlaceholder === "") {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      timeout = setTimeout(() => {}, 500);
    } else {
      timeout = setTimeout(() => {
        setCurrentPlaceholder(
          fullText.substring(0, currentPlaceholder.length + (isDeleting ? -1 : 1))
        );
      }, typeSpeed);
    }

    return () => clearTimeout(timeout);
  }, [currentPlaceholder, isDeleting, placeholderIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auth Check
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login?message=Create an account to search products');
      return;
    }

    if (!query.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`relative w-full max-w-2xl mx-auto rounded-full transition-all duration-300 ${
        isFocused ? "shadow-[0_0_30px_rgba(245,197,24,0.3)] border-primary" : "border-white/10"
      } border bg-background-dark/80 backdrop-blur-md`}
    >
      <div className="flex items-center px-4 py-2">
        <Search className={`h-6 w-6 transition-colors ${isFocused ? "text-primary" : "text-slate-400"}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? "" : currentPlaceholder}
          className="w-full bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 px-4 py-3 text-lg body-font h-14"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-background-dark h-12 px-6 rounded-full font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-80"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Search
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
});

export default SearchInput;
