"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import Confetti from "@/components/ui/Confetti";
import FloatingDecor from "@/components/ui/FloatingDecor";
import Mascot from "@/components/ui/Mascot";
import { HeartIcon, SparkleIcon, StarIcon } from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";
import { play } from "@/lib/sounds";

export default function Act3Reveal() {
  const { go } = useGame();
  const c = content.act3;
  const [fire, setFire] = useState(0);

  useEffect(() => {
    play("unlock");
    const t1 = setTimeout(() => {
      play("chime");
      setFire((f) => f + 1);
    }, 450);
    const t2 = setTimeout(() => {
      play("sparkle");
      setFire((f) => f + 1);
    }, 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Screen background="bg-dreamy-gradient">
      <FloatingDecor count={16} palette="ella" />
      <Confetti fire={fire} intensity={1.2} />

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center gap-6 px-6 text-center">
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: -20, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 160 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 font-display text-sm font-bold uppercase tracking-widest text-blush-500 shadow-dreamy backdrop-blur sm:text-base"
        >
          <SparkleIcon size={18} /> {c.preTitle} <SparkleIcon size={18} />
        </motion.div>

        {/* Mascot */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 160, damping: 12 }}
        >
          <Mascot size={140} mood="wink" />
        </motion.div>

        {/* Main reveal title */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            delay: 0.35,
            type: "spring",
            stiffness: 120,
            damping: 10,
          }}
          className="font-display text-6xl font-black leading-none text-[#3b1e3a] text-shadow-soft sm:text-8xl"
        >
          Happy{" "}
          <motion.span
            animate={{
              color: ["#ff5288", "#a77dff", "#ffbf2e", "#ff5288"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            ELLA
          </motion.span>{" "}
          Day
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="font-display text-xl text-[#3b1e3a]/80 sm:text-2xl"
        >
          {c.sub}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="max-w-xl font-display text-lg font-semibold italic text-blush-600 sm:text-xl"
        >
          {c.tagline}
        </motion.p>

        {/* Decorative row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-3 text-blush-500"
        >
          <HeartIcon size={22} />
          <StarIcon size={22} />
          <HeartIcon size={28} />
          <StarIcon size={22} />
          <HeartIcon size={22} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="max-w-md px-4 text-center text-sm text-[#3b1e3a]/70"
        >
          {c.credit}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, type: "spring", stiffness: 200, damping: 12 }}
        >
          <CandyButton
            variant="pink"
            size="lg"
            sound="chime"
            onClick={() => go("act4")}
          >
            {c.cta} →
          </CandyButton>
        </motion.div>
      </div>
    </Screen>
  );
}
