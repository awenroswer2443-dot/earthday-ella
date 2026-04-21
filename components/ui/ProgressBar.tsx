"use client";

import { motion } from "framer-motion";

interface Props {
  value: number;
  max: number;
  label?: string;
  accent?: "pink" | "gold" | "lilac";
  className?: string;
}

const accents = {
  pink: "from-blush-300 to-blush-500",
  gold: "from-gold-200 to-gold-400",
  lilac: "from-lilac-200 to-lilac-400",
};

export default function ProgressBar({
  value,
  max,
  label,
  accent = "pink",
  className = "",
}: Props) {
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label ? (
        <div className="text-xs font-bold uppercase tracking-widest text-blush-500">
          {label}
        </div>
      ) : null}
      <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-white/60 shadow-inner">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${accents[accent]}`}
          initial={false}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-shimmer-gradient"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="min-w-[3ch] text-right font-display text-sm font-bold text-[#3b1e3a]">
        {value}/{max}
      </div>
    </div>
  );
}
