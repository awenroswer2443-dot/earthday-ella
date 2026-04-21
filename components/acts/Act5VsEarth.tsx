"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import FloatingDecor from "@/components/ui/FloatingDecor";
import ProgressBar from "@/components/ui/ProgressBar";
import { GlobeIcon, HeartIcon } from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";
import { play } from "@/lib/sounds";

export default function Act5VsEarth() {
  const { go } = useGame();
  const c = content.act5;
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const flip = (i: number) => {
    setFlipped((s) => ({ ...s, [i]: !s[i] }));
    play("tap");
  };

  const done = Object.values(flipped).filter(Boolean).length;
  const allDone = done >= c.rows.length;

  return (
    <Screen background="bg-dreamy-gradient">
      <FloatingDecor count={8} palette="mixed" />

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 px-6 pt-14 pb-24">
        <div className="text-center">
          <h2 className="font-display text-4xl font-black text-[#3b1e3a] text-shadow-soft sm:text-6xl">
            {c.title}
          </h2>
          <p className="mt-2 text-base text-[#3b1e3a]/80 sm:text-lg">{c.sub}</p>
        </div>

        <div className="w-full max-w-md">
          <ProgressBar
            value={done}
            max={c.rows.length}
            label="revealed"
            accent="lilac"
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.rows.map((row, i) => {
            const isFlipped = !!flipped[i];
            return (
              <button
                key={row.cat}
                onClick={() => flip(i)}
                aria-label={`Flip ${row.cat}`}
                className="tilt-card relative h-48 w-full [perspective:1000px]"
              >
                <motion.div
                  className="relative h-full w-full"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Earth face */}
                  <div
                    className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-b from-sky-200 to-moss-200 p-5 text-moss-700 shadow-earthy"
                  >
                    <GlobeIcon size={46} />
                    <div className="text-xs font-bold uppercase tracking-widest opacity-70">
                      Earth / {row.cat}
                    </div>
                    <div className="text-center font-display text-lg font-black leading-tight">
                      {row.earth.v}
                    </div>
                    <div className="rounded-full bg-white/70 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-moss-600">
                      {row.earth.tag}
                    </div>
                    <div className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-widest text-moss-600/70">
                      tap to flip
                    </div>
                  </div>
                  {/* Ella face */}
                  <div
                    className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-b from-blush-200 to-lilac-200 p-5 text-[#3b1e3a] shadow-dreamy"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <HeartIcon size={40} />
                    <div className="text-xs font-bold uppercase tracking-widest text-blush-600">
                      Ella / {row.cat}
                    </div>
                    <div className="text-center font-display text-lg font-black leading-tight">
                      {row.ella.v}
                    </div>
                    <div className="rounded-full bg-white/70 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blush-600">
                      {row.ella.tag}
                    </div>
                  </div>
                </motion.div>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-3xl bg-white/85 px-6 py-5 text-center shadow-dreamy backdrop-blur"
            >
              <div className="font-display text-xl font-black text-blush-600">
                Verdict: Ella, by a lot.
              </div>
              <div className="text-sm text-[#3b1e3a]/80">
                The peer review has been… extremely peer-reviewed.
              </div>
              <CandyButton
                variant="lilac"
                size="md"
                sound="chime"
                onClick={() => go("act6")}
              >
                {c.cta} →
              </CandyButton>
            </motion.div>
          )}
        </AnimatePresence>

        {!allDone && (
          <CandyButton
            variant="ghost"
            size="sm"
            sound="tap"
            onClick={() => {
              const next: Record<number, boolean> = {};
              c.rows.forEach((_, i) => (next[i] = true));
              setFlipped(next);
            }}
            className="opacity-80"
          >
            flip them all for me
          </CandyButton>
        )}
      </div>
    </Screen>
  );
}
