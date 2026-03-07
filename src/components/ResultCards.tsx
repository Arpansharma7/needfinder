"use client";
import { motion } from "framer-motion";
import { Copy, Check, ArrowRight } from "lucide-react";
import { useState, memo } from "react";
import Image from "next/image";
import MatchBadge from "./MatchBadge";

import { ProductCard } from "@/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 150ms delay staggered entry
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ResultCards = memo(function ResultCards({ products }: { products: ProductCard[] }) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!products || products.length === 0) return null;


  const handleCopy = (id: number, link: string = "https://example.com/item") => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500); // Checkmark for 1.5s
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid md:grid-cols-3 gap-8"
    >
      {products.map((product, idx) => (
        <motion.div
          key={idx}
          variants={item}
          className="group relative bg-card-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col h-full"
        >
          {/* Card Image Area */}
          <div className="bg-slate-800 relative h-64 overflow-hidden">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.product_title} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center p-6 text-center text-slate-500 text-sm">
                [Product Image Placeholder]
              </div>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="bg-primary text-background-dark font-black headline-font px-3 py-1 rounded-full text-lg shadow-lg">
                {product.badge}
              </div>
              <MatchBadge score={product.match_score} />
            </div>

            {/* Copy Link button (fades in on hover) */}
            <button 
              onClick={(e) => { e.preventDefault(); handleCopy(idx, product.link || undefined); }}
              className="absolute top-4 left-4 bg-background-dark/80 backdrop-blur text-slate-200 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg hover:text-primary"
              aria-label="Copy link"
            >
              {copiedId === idx ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Card Content Area */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2 gap-4">
              <h4 className="headline-font text-2xl uppercase tracking-tight leading-tight flex-grow line-clamp-2">
                {product.product_title}
              </h4>
              <span className="font-bold text-primary text-xl whitespace-nowrap">{product.price}</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 flex-grow">
              <span className="font-semibold text-slate-300">Why:</span> {product.reason}
            </p>
            <a 
              href={product.link || "#"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-primary headline-font text-lg tracking-widest group/link hover:gap-4 transition-all mt-auto"
            >
              VIEW DEAL 
              <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
            </a>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

export default ResultCards;
