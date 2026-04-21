"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Screen from "@/components/ui/Screen";
import { GlobeIcon } from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";

export default function Boot() {
  const { go } = useGame();
  const c = content.boot;
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const rot = setInterval(() => {
      setIdx((i) => (i + 1) % c.facts.length);
    }, 1100);
    return () => clearInterval(rot);
  }, [c.facts.length]);

  useEffect(() => {
    const start = Date.now();
    const total = 3200;
    const tick = setInterval(() => {
      const e = Date.now() - start;
      const p = Math.min(1, e / total);
      setProgress(p);
      if (p >= 1) {
        clearInterval(tick);
        go("act1");
      }
    }, 40);
    return () => clearInterval(tick);
  }, [go]);

  return (
    <Screen background="bg-earth-gradient">
      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center gap-8 px-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <GlobeIcon size={120} />
        </motion.div>
        <div className="font-display text-3xl font-black tracking-widest text-moss-700">
          {c.logo}
        </div>
        <div className="text-sm font-semibold uppercase tracking-widest text-moss-600">
          {c.tagline}
        </div>
        <div className="h-3 w-64 overflow-hidden rounded-full bg-white/60 shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-moss-300 to-moss-500"
            style={{ width: `${progress * 100}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="max-w-md text-sm text-moss-700/80"
        >
          {c.facts[idx]}
        </motion.div>
      </div>
    </Screen>
  );
}
