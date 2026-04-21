"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import FloatingDecor from "@/components/ui/FloatingDecor";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  SeedIcon,
  BudIcon,
  FlowerIcon,
  HeartIcon,
  SparkleIcon,
} from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";
import { play } from "@/lib/sounds";

type SeedId = string;

const colorMap: Record<string, { soft: string; deep: string; icon: string }> = {
  blush: { soft: "#ffc6d7", deep: "#ff5288", icon: "#ff7aa0" },
  gold: { soft: "#ffe58a", deep: "#ffbf2e", icon: "#ffd35c" },
  lilac: { soft: "#d9c4ff", deep: "#a77dff", icon: "#c3a2ff" },
  peach: { soft: "#ffc9a8", deep: "#ffae82", icon: "#ffc9a8" },
  moss: { soft: "#bedfb6", deep: "#3f9834", icon: "#5fb553" },
};

export default function Act4Garden() {
  const { go } = useGame();
  const c = content.act4;
  const seeds = c.seeds;
  const [planted, setPlanted] = useState<Record<SeedId, number>>({});
  // 0 = seed, 1 = sprout, 2 = bloom

  const plant = (id: SeedId) => {
    setPlanted((p) => {
      const next = { ...p };
      const cur = p[id] ?? 0;
      if (cur < 2) {
        next[id] = cur + 1;
        if (cur === 0) play("pop");
        else play("chime");
      }
      return next;
    });
  };

  const bloomed = useMemo(
    () => Object.values(planted).filter((v) => v === 2).length,
    [planted]
  );
  const allBloomed = bloomed === seeds.length;

  return (
    <Screen background="bg-dreamy-gradient">
      <FloatingDecor count={10} palette="mixed" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 px-6 pt-14 pb-24">
        <div className="text-center">
          <h2 className="font-display text-4xl font-black text-[#3b1e3a] text-shadow-soft sm:text-6xl">
            {c.title}
          </h2>
          <p className="mt-2 text-base text-[#3b1e3a]/80 sm:text-lg">{c.sub}</p>
        </div>

        <div className="w-full max-w-md">
          <ProgressBar
            value={bloomed}
            max={seeds.length}
            label="bloomed"
            accent="pink"
          />
        </div>

        {/* Garden bed */}
        <div className="relative flex w-full flex-wrap items-end justify-center gap-4 sm:gap-6">
          {seeds.map((s) => {
            const stage = planted[s.id] ?? 0;
            const cols = colorMap[s.color] ?? colorMap.blush;
            return (
              <div
                key={s.id}
                className="flex w-40 flex-col items-center gap-2 sm:w-48"
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => plant(s.id)}
                  aria-label={`Grow seed ${s.id}`}
                  className="relative flex h-48 w-full items-end justify-center rounded-3xl bg-gradient-to-b from-white/60 to-white/30 p-3 shadow-inner backdrop-blur-sm"
                >
                  {/* Soil */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-6 rounded-b-3xl"
                    style={{
                      background:
                        "linear-gradient(180deg, #8f6d35 0%, #5a4420 100%)",
                    }}
                  />
                  {/* Stem only after sprout */}
                  {stage >= 1 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: stage === 2 ? 72 : 38 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                      }}
                      className="absolute bottom-5 w-1.5 rounded-full"
                      style={{ background: "#3f9834" }}
                    />
                  )}
                  {/* Plant */}
                  <AnimatePresence mode="wait">
                    {stage === 0 && (
                      <motion.div
                        key="seed"
                        initial={{ y: 20, opacity: 0, scale: 0.5 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -10, opacity: 0, scale: 0.8 }}
                        className="relative z-10 mb-3 drop-shadow"
                        style={{ color: "#8f6d35" }}
                      >
                        <SeedIcon size={60} />
                      </motion.div>
                    )}
                    {stage === 1 && (
                      <motion.div
                        key="bud"
                        initial={{ y: 20, opacity: 0, scale: 0.5 }}
                        animate={{ y: -8, opacity: 1, scale: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        className="relative z-10 mb-3 drop-shadow"
                        style={{ color: cols.icon }}
                      >
                        <BudIcon size={64} />
                      </motion.div>
                    )}
                    {stage === 2 && (
                      <motion.div
                        key="flower"
                        initial={{ y: 20, opacity: 0, scale: 0 }}
                        animate={{
                          y: -32,
                          opacity: 1,
                          scale: 1,
                          rotate: [-4, 4, -4],
                        }}
                        exit={{ scale: 0 }}
                        transition={{
                          y: { type: "spring", stiffness: 200 },
                          scale: { type: "spring", stiffness: 200, damping: 10 },
                          rotate: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                        className="relative z-10 mb-3 drop-shadow"
                        style={{ color: cols.icon }}
                      >
                        <FlowerIcon size={72} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Sparkles when bloomed */}
                  {stage === 2 && (
                    <motion.div
                      className="absolute right-2 top-2"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{ color: cols.deep }}
                    >
                      <SparkleIcon size={22} />
                    </motion.div>
                  )}
                  {/* Tap hint */}
                  {stage < 2 && (
                    <div className="absolute left-1/2 top-2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-[#3b1e3a]/60">
                      tap to grow
                    </div>
                  )}
                </motion.button>

                {/* Wish message */}
                <AnimatePresence>
                  {stage === 2 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl bg-white/80 px-3 py-2 text-center text-sm font-semibold shadow-dreamy backdrop-blur"
                      style={{ color: cols.deep }}
                    >
                      <span className="mr-1 inline-flex align-middle">
                        <HeartIcon size={14} />
                      </span>
                      {s.bud}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Done panel */}
        <AnimatePresence>
          {allBloomed && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-3xl bg-white/85 px-6 py-5 text-center shadow-dreamy backdrop-blur"
            >
              <div className="font-display text-2xl font-black text-blush-600">
                {c.doneTitle}
              </div>
              <div className="text-sm text-[#3b1e3a]/80">{c.doneSub}</div>
              <CandyButton
                variant="pink"
                size="md"
                sound="chime"
                onClick={() => go("act5")}
              >
                {c.cta} →
              </CandyButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
