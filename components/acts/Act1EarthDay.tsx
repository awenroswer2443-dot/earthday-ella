"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import FloatingDecor from "@/components/ui/FloatingDecor";
import {
  GlobeIcon,
  LeafIcon,
  RecycleIcon,
  BeeIcon,
  iconByName,
} from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";
import { play } from "@/lib/sounds";

export default function Act1EarthDay() {
  const { go, pledgesSigned, pledge } = useGame();
  const c = content.act1;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => pledge(), 1500);
    return () => clearInterval(i);
  }, [pledge]);

  const fact = c.ticker[tick % c.ticker.length];

  return (
    <Screen background="bg-earth-gradient">
      {/* Subtle eco floaties */}
      <FloatingDecor count={10} palette="earth" className="opacity-60" />
      <div className="scanlines absolute inset-0 opacity-40" aria-hidden />

      {/* "Official" top bar */}
      <div className="relative z-10 flex w-full items-center justify-between border-b border-moss-200 bg-white/70 px-5 py-3 text-xs font-semibold text-moss-700 backdrop-blur">
        <div className="flex items-center gap-2">
          <GlobeIcon size={20} />
          <span className="tracking-widest">EARTHDAY.CO.ZA · EST. 1970</span>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <span>About</span>
          <span>Pledge</span>
          <span>Donate</span>
          <span>Acts of Earth</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-moss-500 px-3 py-1 text-[10px] text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 px-6 pt-10 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <GlobeIcon size={180} />
          </motion.div>
          {/* Orbiting leaf */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 text-moss-600">
              <LeafIcon size={28} />
            </div>
          </motion.div>
        </motion.div>

        <div>
          <h1 className="font-display text-5xl font-black leading-tight text-moss-700 text-shadow-earth sm:text-7xl">
            {c.headline}
          </h1>
          <p className="mt-3 font-display text-lg font-semibold text-moss-600 sm:text-2xl">
            {c.sub}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base text-moss-700/90 sm:text-lg">
            {c.pitch}
          </p>
        </div>

        {/* Pledge counter */}
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-3xl bg-white/80 px-6 py-5 shadow-earthy backdrop-blur">
          <div className="text-xs font-bold uppercase tracking-widest text-moss-500">
            {c.counterLabel}
          </div>
          <motion.div
            key={pledgesSigned}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-4xl font-black tabular-nums text-moss-700 sm:text-5xl"
          >
            {pledgesSigned.toLocaleString()}
          </motion.div>
          <div className="flex items-center gap-1 text-xs text-moss-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-moss-500" />
            updating live
          </div>
        </div>

        <CandyButton
          variant="earth"
          size="lg"
          sound="whoosh"
          onClick={() => {
            play("pop");
            go("act2");
          }}
          className="text-base sm:text-lg"
        >
          {c.cta}
        </CandyButton>
      </section>

      {/* Badges */}
      <section className="relative z-10 mt-12 flex w-full max-w-5xl flex-wrap items-center justify-center gap-3 px-6">
        {c.badges.map((b) => {
          const Icon = iconByName(b.icon);
          return (
            <div
              key={b.label}
              className="flex items-center gap-2 rounded-full border border-moss-200 bg-white/80 px-4 py-2 text-sm font-semibold text-moss-700 shadow-sm"
            >
              <Icon size={20} />
              {b.label}
            </div>
          );
        })}
      </section>

      {/* Stat row */}
      <section className="relative z-10 mt-10 grid w-full max-w-5xl grid-cols-1 gap-4 px-6 sm:grid-cols-3">
        {c.stats.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl bg-white/80 p-5 text-center shadow-earthy backdrop-blur"
          >
            <div className="font-display text-4xl font-black text-moss-700">
              {s.value}
            </div>
            <div className="mt-1 text-sm font-semibold text-moss-600">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* Ticker */}
      <section className="relative z-10 mt-10 w-full overflow-hidden border-y border-moss-200 bg-moss-500/10 py-3">
        <motion.div
          key={tick}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="px-6 text-center font-semibold text-moss-700"
        >
          · {fact} ·
        </motion.div>
      </section>

      {/* Tip line */}
      <section className="relative z-10 mx-auto mt-10 flex max-w-2xl flex-col items-center gap-2 px-6 text-center text-sm text-moss-600">
        <div className="flex items-center gap-2">
          <RecycleIcon size={18} />
          <span className="font-semibold uppercase tracking-widest">
            Tip of the day
          </span>
          <BeeIcon size={18} />
        </div>
        <p>
          If you listen closely to this page, you can almost hear something is a
          little off about today…
        </p>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-10 w-full border-t border-moss-200 bg-white/70 px-6 py-6 text-center text-xs text-moss-600 backdrop-blur">
        <div>© 2026 earthday.co.za · carbon-neutral · bird-friendly · bee-approved</div>
        <div className="mt-1 opacity-70">
          Not affiliated with The Earth Day Network. Affiliated with one specific girl.
        </div>
      </footer>
    </Screen>
  );
}
