"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Screen from "@/components/ui/Screen";
import { GlobeIcon, HeartIcon, SparkleIcon } from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";
import { play } from "@/lib/sounds";

function vibrate(p: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(p);
    } catch {
      /* ignore */
    }
  }
}

export default function Act2Glitch() {
  const { go } = useGame();
  const lines = content.act2.glitchLines;
  const [step, setStep] = useState(0);
  const autoAdvance = useRef(false);

  useEffect(() => {
    if (step < lines.length) {
      const d = step < 2 ? 600 : step < lines.length - 2 ? 450 : 800;
      const t = setTimeout(() => {
        play(step % 2 === 0 ? "tap" : "pop");
        const buzz = Math.max(10, 12 + step * 6);
        vibrate(buzz);
        setStep((s) => s + 1);
      }, d);
      return () => clearTimeout(t);
    } else if (!autoAdvance.current) {
      autoAdvance.current = true;
      play("whoosh");
      vibrate([80, 40, 80, 40, 120]);
      const t = setTimeout(() => go("act3"), 900);
      return () => clearTimeout(t);
    }
  }, [step, lines.length, go]);

  const intensity = Math.min(1, step / (lines.length - 1));
  // Colors drift from eco green → blush pink
  const bg = `linear-gradient(180deg,
    hsl(${110 - intensity * 110}, ${60 + intensity * 10}%, ${92 - intensity * 6}%) 0%,
    hsl(${90 - intensity * 90}, ${70 + intensity * 10}%, ${85 - intensity * 5}%) 50%,
    hsl(${330 * intensity}, ${70 + intensity * 20}%, ${95 - intensity * 8}%) 100%)`;

  return (
    <Screen>
      <div
        className="absolute inset-0 transition-all"
        style={{ background: bg }}
      />
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-60 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0, rgba(0,0,0,0.08) 1px, transparent 2px, transparent 4px)",
        }}
        aria-hidden
      />

      {/* Central morphing icon */}
      <motion.div
        className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center gap-6 px-6"
        animate={{
          x: [0, -2 * intensity * 3, 3 * intensity * 3, -2 * intensity * 3, 0],
          y: [0, 1 * intensity * 3, -2 * intensity * 3, 1 * intensity * 3, 0],
        }}
        transition={{ duration: 0.18, repeat: Infinity }}
      >
        <motion.div
          animate={{
            x: [0, -6 * intensity, 4 * intensity, -2 * intensity, 0],
            y: [0, 2 * intensity, -3 * intensity, 0],
            rotate: [0, -3 * intensity, 4 * intensity, 0],
            scale: [1, 1 + 0.1 * intensity, 1 - 0.05 * intensity, 1],
          }}
          transition={{ duration: 0.22, repeat: Infinity }}
          className="relative"
        >
          {/* Earth underneath */}
          <div style={{ opacity: 1 - intensity }}>
            <GlobeIcon size={200} />
          </div>
          {/* Heart on top emerging */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-blush-500"
            style={{ opacity: intensity }}
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <HeartIcon size={180} />
          </motion.div>
          {/* Sparkles */}
          {intensity > 0.4 && (
            <>
              <motion.div
                className="absolute -right-8 -top-6 text-gold-300"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <SparkleIcon size={34} />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-8 text-blush-400"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <SparkleIcon size={28} />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Glitch text stream */}
        <div className="relative flex min-h-[120px] w-full max-w-xl flex-col items-center justify-start gap-1 text-center">
          {lines.slice(0, step + 1).map((l, i) => {
            const dist = step - i;
            const fade = Math.max(0, 1 - dist * 0.35);
            if (fade <= 0) return null;
            const isGlitch = i > 2 && i < lines.length - 2;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: fade,
                  x: isGlitch
                    ? [0, (Math.random() - 0.5) * 10, 0]
                    : 0,
                }}
                transition={{ duration: 0.3 }}
                className={`font-mono text-sm tracking-widest ${
                  i === step ? "text-[#3b1e3a]" : "text-[#3b1e3a]/60"
                } ${isGlitch ? "chroma" : ""}`}
              >
                {l}
              </motion.div>
            );
          })}
        </div>

        {/* Aberration flash */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,82,136,0.15) 0%, transparent 40%, transparent 60%, rgba(47,139,189,0.15) 100%)",
          }}
          animate={{ opacity: [0, 0.6, 0, 0.4, 0] }}
          transition={{
            duration: 0.25,
            repeat: Infinity,
            repeatDelay: 0.8 - intensity * 0.6,
          }}
        />

        {/* Crawling static bar */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-white/40 to-transparent"
          animate={{ y: ["-20vh", "120vh"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </Screen>
  );
}
