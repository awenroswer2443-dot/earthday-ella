"use client";

import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useGame } from "@/lib/game-state";
import SoundToggle from "@/components/ui/SoundToggle";
import SparkleTrail from "@/components/ui/SparkleTrail";
import Boot from "@/components/acts/Boot";

const Act1 = dynamic(() => import("@/components/acts/Act1EarthDay"), { ssr: false });
const Act2 = dynamic(() => import("@/components/acts/Act2Glitch"), { ssr: false });
const Act3 = dynamic(() => import("@/components/acts/Act3Reveal"), { ssr: false });
const Act4 = dynamic(() => import("@/components/acts/Act4Garden"), { ssr: false });
const Act5 = dynamic(() => import("@/components/acts/Act5VsEarth"), { ssr: false });
const Act6 = dynamic(() => import("@/components/acts/Act6Bouquet"), { ssr: false });
const Cake = dynamic(() => import("@/components/acts/CakeAct"), { ssr: false });
const Act7 = dynamic(() => import("@/components/acts/Act7Finale"), { ssr: false });

export default function Experience() {
  const { act, hydrated } = useGame();
  if (!hydrated) return null;

  const showSparkles = act !== "act1" && act !== "boot";

  return (
    <>
      <SoundToggle />
      {showSparkles && <SparkleTrail />}
      <AnimatePresence mode="wait">
        {act === "boot" && <Boot key="boot" />}
        {act === "act1" && <Act1 key="act1" />}
        {act === "act2" && <Act2 key="act2" />}
        {act === "act3" && <Act3 key="act3" />}
        {act === "act4" && <Act4 key="act4" />}
        {act === "act5" && <Act5 key="act5" />}
        {act === "act6" && <Act6 key="act6" />}
        {act === "cake" && <Cake key="cake" />}
        {act === "act7" && <Act7 key="act7" />}
      </AnimatePresence>
    </>
  );
}
