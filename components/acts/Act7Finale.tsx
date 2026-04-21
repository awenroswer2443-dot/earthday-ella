"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import Confetti from "@/components/ui/Confetti";
import Fireworks from "@/components/ui/Fireworks";
import Starfield from "@/components/ui/Starfield";
import FloatingDecor from "@/components/ui/FloatingDecor";
import Mascot from "@/components/ui/Mascot";
import { HeartIcon, SparkleIcon, StarIcon, MusicIcon } from "@/components/ui/Icons";
import { useGame } from "@/lib/game-state";
import { content } from "@/lib/content";
import { play, stopBirthday } from "@/lib/sounds";

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

type Floater = { id: number; x: number; y: number; label: string };

export default function Act7Finale() {
  const { go, reset } = useGame();
  const c = content.act7;
  const [fire, setFire] = useState(0);
  const [beeTaps, setBeeTaps] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const floaterIdRef = useRef(0);

  const spawnFloater = (x: number, y: number) => {
    const id = floaterIdRef.current++;
    const labels = ["i love u", "♥", "my girl", "♥", "i love u", "ella ♥"];
    const label = labels[id % labels.length];
    setFloaters((f) => [...f, { id, x, y, label }]);
    setTimeout(() => {
      setFloaters((f) => f.filter((fl) => fl.id !== id));
    }, 1500);
  };

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
    vibrate([60, 40, 60, 40, 160]);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const restart = () => {
    stopBirthday();
    reset();
    go("act1");
  };

  const onBeeTap = () => {
    play("pop");
    vibrate(20);
    setBeeTaps((t) => {
      const next = t + 1;
      if (next >= 3 && !showSecret) {
        setShowSecret(true);
        play("unlock");
        setFire((f) => f + 1);
        vibrate([80, 40, 80, 40, 80, 40, 160]);
      }
      return next;
    });
  };

  return (
    <Screen background="bg-dreamy-gradient">
      {/* Night-sky feel behind everything */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 0%, #ffe4ec 0%, #ffcce0 30%, #f3e5ff 60%, #dfe3ff 100%)",
        }}
        aria-hidden
      />
      <Starfield count={40} />
      <FloatingDecor count={8} palette="ella" />
      <Fireworks active density={0.45} />
      <Confetti fire={fire} intensity={0.3} />

      {/* Tap-spawned love floaters */}
      <AnimatePresence>
        {floaters.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, scale: 0.4, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1, 0.9], y: -90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-1/2 font-display text-sm font-black text-blush-500 drop-shadow sm:text-base"
            style={{
              left: f.x,
              top: f.y,
              textShadow: "0 2px 10px rgba(255, 82, 136, 0.55)",
            }}
          >
            {f.label}
          </motion.div>
        ))}
      </AnimatePresence>

      <div
        className="relative z-[70] flex min-h-[100dvh] w-full flex-col items-center justify-center gap-6 px-6 py-20 text-center"
        onPointerDown={(e) => {
          spawnFloater(e.clientX, e.clientY);
          play("kiss");
          vibrate(10);
        }}
      >
        {/* Bee mascot — the secret trigger */}
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
          <motion.button
            onClick={onBeeTap}
            whileTap={{ scale: 0.85, rotate: -10 }}
            whileHover={{ scale: 1.06, rotate: 4 }}
            className="cursor-pointer rounded-full"
            aria-label="Mystery bee"
          >
            <Mascot size={140} variant="bee" />
          </motion.button>
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

        {/* Letter in a polaroid-ish frame */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ delay: 0.8 }}
          className="max-w-xl rounded-[32px] bg-white/90 p-6 text-left shadow-dreamy backdrop-blur"
          style={{ boxShadow: "0 30px 60px -20px rgba(199, 98, 176, 0.45)" }}
        >
          <div className="flex items-center gap-2 border-b border-blush-200 pb-2 font-display text-sm font-bold uppercase tracking-widest text-blush-500">
            <HeartIcon size={16} /> A letter · April 22, 2026
          </div>
          <div className="mt-4 flex flex-col gap-4 font-display text-base leading-relaxed text-[#3b1e3a]/90 sm:text-lg">
            {c.letter.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.22 }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 + c.letter.length * 0.22 + 0.3 }}
          className="max-w-md text-sm italic text-[#3b1e3a]/60"
        >
          {c.signoff}
        </motion.div>

        {/* Secret bee message */}
        <AnimatePresence>
          {showSecret && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="relative max-w-md rounded-3xl bg-gradient-to-br from-gold-200 via-blush-200 to-lilac-200 p-5 text-center font-display text-base font-bold text-[#3b1e3a] shadow-dreamy"
            >
              <motion.div
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blush-500 shadow"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                secret unlocked
              </motion.div>
              {c.secret}
            </motion.div>
          )}
        </AnimatePresence>

        {beeTaps > 0 && beeTaps < 3 && !showSecret && (
          <motion.div
            key={beeTaps}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 0.6, y: 0 }}
            className="text-xs italic text-[#3b1e3a]/60"
          >
            {beeTaps === 1 ? "hmm." : "almost…"}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.0 + c.letter.length * 0.22 + 0.5,
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
              vibrate([20, 30, 20]);
            }}
          >
            <SparkleIcon size={18} /> more confetti
          </CandyButton>
          <CandyButton
            variant="gold"
            size="md"
            sound={null}
            onClick={() => {
              stopBirthday();
              play("birthday");
              setFire((f) => f + 1);
              vibrate([30, 40, 30]);
            }}
          >
            <MusicIcon size={16} /> sing it again
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
