"use client";

import { Circle } from "lucide-react";
import { useState } from "react";

export default function Marquee() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="bg-primary py-6 overflow-hidden">
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll.paused {
          animation-play-state: paused;
        }
      `}</style>
      <div 
        className="flex w-max"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex items-center justify-around gap-8 whitespace-nowrap px-4 animate-scroll ${isHovered ? 'paused' : ''}`}>
          <div className="flex items-center gap-8 headline-font text-3xl text-background-dark">
            <span>AMAZON</span><Circle className="size-4 fill-background-dark" />
            <span>GOOGLE SHOPPING</span><Circle className="size-4 fill-background-dark" />
            <span>FLIPKART</span><Circle className="size-4 fill-background-dark" />
            <span>EBAY</span><Circle className="size-4 fill-background-dark" />
            <span>WALMART</span><Circle className="size-4 fill-background-dark" />
            {/* Duplicated for seamless scrolling loop */}
            <span>AMAZON</span><Circle className="size-4 fill-background-dark" />
            <span>GOOGLE SHOPPING</span><Circle className="size-4 fill-background-dark" />
            <span>FLIPKART</span><Circle className="size-4 fill-background-dark" />
            <span>EBAY</span><Circle className="size-4 fill-background-dark" />
            <span>WALMART</span><Circle className="size-4 fill-background-dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
