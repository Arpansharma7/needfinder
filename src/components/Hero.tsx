"use client";
import { motion } from "framer-motion";
import SearchInput from "./SearchInput";
import { Star } from "lucide-react";

import Image from "next/image";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Hero() {

  return (
    <section className="relative pt-20 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-6 w-full relative z-30 flex flex-col items-center text-center"
      >
        <motion.h1 variants={itemVariants} className="headline-font text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-6">
          FIND EXACTLY <br/> <span className="text-primary">WHAT YOU NEED</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
          Your personal AI shopper that scans the web for the best deals, quality, and fit in seconds.
        </motion.p>
        
        <motion.div variants={itemVariants} className="w-full">
          <SearchInput />
        </motion.div>
      </motion.div>

      {/* Floating UI Elements Background */}
      <div className="absolute inset-0 z-0 hidden lg:block pointer-events-none">
        {/* Floating Badges */}
        <motion.div 
          animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[15%] bg-primary text-background-dark px-6 py-3 rounded-full font-black headline-font text-2xl shadow-lg"
        >
          98% MATCH
        </motion.div>

        {/* Product Card Float 1 */}
        <motion.div 
          animate={{ y: [20, -20, 20], rotate: [-6, -4, -6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[30%] left-[8%] bg-card-dark p-4 rounded-xl border border-white/5 shadow-2xl w-64"
        >
          <div className="bg-slate-800 rounded-lg mb-4 overflow-hidden h-48 relative">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6lKo2XvxQiZrXDtfkLam5RJp8QJYP82MmZD9aF-DWLhMNa7lePCI1T6bn8tC9MgStI-ICHCpnYxiZz-HXp_sZJ_P31tjXBSvtM8wUEoTDnnH16OKcBjgLOOjWTfZe0BnKply2zEHgKz94eWXGOXKVw5aKBKocQWzhSZzuPfvwBcEK2ylKgD_hmMbx8BhYz8fx3yTZQnF7wIAM-1yFw8OeGaItlvIj601tuZqls_sxQoW5ZGmxGZWKEjy-HBX6qcMDQV2gF_i0xiA" fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" alt="Headphones" priority />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent"></div>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-primary uppercase">Best Match</span>
            <span className="text-xs text-slate-500">94%</span>
          </div>
          <h4 className="headline-font text-xl uppercase tracking-tight">Sony WH-1000XM5</h4>
        </motion.div>

        {/* Product Card Float 2 */}
        <motion.div 
          animate={{ y: [-25, 25, -25], rotate: [3, 5, 3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[10%] bg-card-dark p-4 rounded-xl border border-white/5 shadow-2xl w-56"
        >
          <div className="bg-slate-800 rounded-lg mb-4 overflow-hidden h-36 relative">
             <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDzAWlCqIs2FWdni1nFTtjwrl45r7Ufgi_WCA1YRUpRY0jBbRB8mrCzD_e-KJv9fyvvvIc36oWmZh4KO8WSZhQx7yNg4BQuEYGDQaLeffdA3wBLBBXoS5yJdmmJH4ol2FlO-ecmijmOwGz2EGSGn7YyMOV1vyunNybir_P4w0PrOWz8zHzcV_lncwVEKTYkf9hBoHLsUX2Cv3jcYEOezWnhyd2gyHBB5AyzKW2EQqLDxP7k84YCadS1shWKookHOI0sBAX5MCMwfk" fill sizes="(max-width: 768px) 100vw, 200px" className="object-cover" alt="Watch" priority />
          </div>
          <div className="flex gap-1 mb-2">
            {[...Array(4)].map((_, i) => <Star key={i} className="text-primary size-3 fill-primary" />)}
            <Star className="text-primary size-3" />
          </div>
          <h4 className="headline-font text-lg uppercase tracking-tight">Field Watch V2</h4>
        </motion.div>
      </div>
    </section>
  );
}
