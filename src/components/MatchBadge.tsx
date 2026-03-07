"use client";
import { useEffect, useState, memo } from "react";

const MatchBadge = memo(function MatchBadge({ score }: { score: number }) {
  const [offset, setOffset] = useState(100);
  
  useEffect(() => {
    // Timeout to allow the component to mount before animating
    const to = setTimeout(() => {
      setOffset(100 - score);
    }, 100);
    return () => clearTimeout(to);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center w-12 h-12 bg-background-dark/80 backdrop-blur-sm rounded-full shadow-lg">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-white/10"
          strokeDasharray="100, 100"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="text-primary transition-all duration-1000 ease-out"
          strokeDasharray="100, 100"
          strokeDashoffset={offset}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold headline-font">{score}%</span>
      </div>
    </div>
  );
});

export default MatchBadge;
