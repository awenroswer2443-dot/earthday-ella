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

export default function Act7Finale() {
  const { go, reset } = useGame();
  const c = content.act7;
  const [fire, setFire] = useState(0);

  useEffect(() => {
    play("win");
    const t1 = setTimeout(() => {
      play("sparkle");
      setFire((f) => f + 1);
    }, 300);
    const t2 = setTimeout(() => {
      play("chime");
      setFire((f) => f + 1);
    }, 1400);
    const t3 = setTimeout(() => {
      play("success");
      setFire((f) => f + 1);
    }, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const restart = () => {
    reset();
    go("act1");
  };

  return (
    <Screen background="bg-dreamy-gradient">
      <FloatingDecor count={22} palette="ella" />
      <Confetti fire={fire} continuous intensity={0.6} />

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
        >
          <Mascot size={140} variant="bee" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: 0.35,
            type: "spring",
            stiffness: 140,
            damping: 12,
          }}
          className="font-display text-6xl font-black leading-tight text-[#3b1e3a] text-shadow-soft sm:text-8xl"
        >
          <motion.span
            animate={{
              color: ["#ff5288", "#a77dff", "#ffbf2e", "#ff5288"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Happy Ella Day
          </motion.span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 text-blush-500"
        >
          <HeartIcon size={22} />
          <StarIcon size={22} />
          <HeartIcon size={30} />
          <SparkleIcon size={22} />
          <HeartIcon size={22} />
        </motion.div>

        {/* Letter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-xl rounded-[32px] bg-white/85 p-6 text-left shadow-dreamy backdrop-blur"
        >
          <div className="flex items-center gap-2 border-b border-blush-200 pb-2 font-display text-sm font-bold uppercase tracking-widest text-blush-500">
            <HeartIcon size={16} /> A letter
          </div>
          <div className="mt-4 flex flex-col gap-4 font-display text-base leading-relaxed text-[#3b1e3a]/90 sm:text-lg">
            {c.letter.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.25 }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 + c.letter.length * 0.25 + 0.4 }}
          className="text-sm italic text-[#3b1e3a]/60"
        >
          {c.signoff}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.0 + c.letter.length * 0.25 + 0.6,
            type: "spring",
            stiffness: 200,
            damping: 12,
          }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <CandyButton
            variant="pink"
            size="lg"
            sound="sparkle"
            onClick={() => {
              play("sparkle");
              setFire((f) => f + 1);
            }}
          >
            <SparkleIcon size={18} /> more confetti
          </CandyButton>
          <CandyButton
            variant="ghost"
            size="md"
            sound="whoosh"
            onClick={restart}
          >
            {c.replay}
          </CandyButton>
        </motion.div>
      </div>
    </Screen>
  );
}
