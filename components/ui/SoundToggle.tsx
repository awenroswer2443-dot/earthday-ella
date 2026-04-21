"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/game-state";
import { MuteIcon, SpeakerIcon } from "./Icons";

export default function SoundToggle() {
  const { soundOn, toggleSound } = useGame();
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.08 }}
      onClick={toggleSound}
      className="fixed top-4 right-4 z-[65] flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-blush-500 shadow-dreamy backdrop-blur transition-colors hover:text-blush-600"
      aria-label={soundOn ? "Mute sounds" : "Unmute sounds"}
    >
      {soundOn ? <SpeakerIcon size={20} /> : <MuteIcon size={20} />}
    </motion.button>
  );
}
