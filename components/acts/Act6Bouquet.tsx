"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import FloatingDecor from "@/components/ui/FloatingDecor";
import ProgressBar from "@/components/ui/ProgressBar";
import { FlowerIcon, HeartIcon } from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";
import { play } from "@/lib/sounds";

const tints: Record<string, string> = {
  blush: "#ff7aa0",
  gold: "#ffd35c",
  lilac: "#c3a2ff",
  peach: "#ffae82",
  cream: "#fff3dc",
};

export default function Act6Bouquet() {
  const { go } = useGame();
  const c = content.act6;
  const [picked, setPicked] = useState<string[]>([]);
  const remaining = useMemo(
    () => c.flowers.filter((f) => !picked.includes(f.id)),
    [picked, c.flowers]
  );

  const pick = (id: string) => {
    setPicked((p) => {
      if (p.includes(id)) return p;
      play("pop");
      return [...p, id];
    });
  };

  const reset = () => {
    setPicked([]);
    play("whoosh");
  };

  const done = picked.length >= c.goal;

  return (
    <Screen background="bg-dreamy-gradient">
      <FloatingDecor count={8} palette="ella" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-14 pb-24">
        <div className="text-center">
          <h2 className="font-display text-4xl font-black text-[#3b1e3a] text-shadow-soft sm:text-6xl">
            {c.title}
          </h2>
          <p className="mt-2 text-base text-[#3b1e3a]/80 sm:text-lg">{c.sub}</p>
        </div>

        <div className="w-full max-w-md">
          <ProgressBar
            value={Math.min(picked.length, c.goal)}
            max={c.goal}
            label="picked"
            accent="pink"
          />
        </div>

        {/* Bouquet display */}
        <div className="relative flex h-64 w-full max-w-sm items-end justify-center rounded-3xl bg-gradient-to-b from-white/60 to-white/30 p-4 shadow-dreamy backdrop-blur">
          <div className="relative h-full w-full">
            {/* Ribbon */}
            <div className="absolute bottom-4 left-1/2 h-20 w-24 -translate-x-1/2 rounded-b-3xl bg-gradient-to-b from-blush-400 to-blush-600 shadow-lg">
              <div className="absolute left-1/2 top-0 h-5 w-32 -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] rounded-full bg-blush-500" />
              <div className="absolute left-1/2 top-0 h-5 w-32 -translate-x-1/2 -translate-y-1/2 rotate-6 rounded-full bg-blush-400" />
              <div className="absolute left-1/2 top-3 -translate-x-1/2 font-display text-[10px] font-bold uppercase tracking-widest text-white">
                E &amp; C
              </div>
            </div>
            {/* Stems */}
            {picked.map((id, i) => {
              const angle = (i - (picked.length - 1) / 2) * 8;
              return (
                <motion.div
                  key={`stem-${id}`}
                  className="absolute bottom-16 left-1/2 h-36 w-1 origin-bottom rounded-full bg-moss-500"
                  initial={{ scaleY: 0, rotate: angle }}
                  animate={{ scaleY: 1, rotate: angle }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                />
              );
            })}
            {/* Flower heads */}
            {picked.map((id, i) => {
              const flower = c.flowers.find((f) => f.id === id);
              if (!flower) return null;
              const angle = (i - (picked.length - 1) / 2) * 8;
              const rad = (angle * Math.PI) / 180;
              const y = 16 + 150 * Math.cos(rad);
              const x = 150 * Math.sin(rad);
              return (
                <motion.div
                  key={`head-${id}`}
                  className="absolute left-1/2 bottom-0"
                  style={{
                    color: tints[flower.tint] ?? "#ff7aa0",
                  }}
                  initial={{
                    scale: 0,
                    x: "-50%",
                    y: 0,
                  }}
                  animate={{
                    scale: 1,
                    x: `calc(-50% + ${x}px)`,
                    y: -y,
                    rotate: angle,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 12,
                    delay: i * 0.05,
                  }}
                >
                  <FlowerIcon size={54} />
                </motion.div>
              );
            })}
            {picked.length === 0 && (
              <div className="absolute inset-x-0 top-10 text-center text-sm text-[#3b1e3a]/60">
                pick a flower →
              </div>
            )}
          </div>
        </div>

        {/* Flower tray */}
        <div className="flex w-full max-w-xl flex-wrap justify-center gap-3">
          {remaining.map((f) => (
            <motion.button
              key={f.id}
              onClick={() => pick(f.id)}
              whileHover={{ scale: 1.1, rotate: -6 }}
              whileTap={{ scale: 0.9 }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full bg-white/80 p-3 shadow-dreamy backdrop-blur"
              style={{ color: tints[f.tint] ?? "#ff7aa0" }}
              aria-label="Pick flower"
            >
              <FlowerIcon size={44} />
            </motion.button>
          ))}
          {remaining.length === 0 && (
            <div className="rounded-full bg-white/80 px-4 py-2 text-sm text-[#3b1e3a]/70">
              no more flowers — you got them all.
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {picked.length > 0 && (
            <CandyButton
              variant="ghost"
              size="sm"
              sound="tap"
              onClick={reset}
            >
              start over
            </CandyButton>
          )}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <CandyButton
                  variant="pink"
                  size="md"
                  sound="chime"
                  onClick={() => go("act7")}
                >
                  <HeartIcon size={16} /> {c.cta}
                </CandyButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md text-center text-sm text-[#3b1e3a]/80"
            >
              {c.done}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
