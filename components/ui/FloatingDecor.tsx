"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  HeartIcon,
  SparkleIcon,
  LeafIcon,
  FlowerIcon,
  StarIcon,
} from "./Icons";

type Palette = "earth" | "ella" | "mixed";

interface Props {
  count?: number;
  palette?: Palette;
  className?: string;
}

const PALETTES = {
  earth: ["#3f9834", "#5fb553", "#8ecc82", "#55aad4", "#b7995e"],
  ella: ["#ff7aa0", "#ffc6d7", "#ffd35c", "#a77dff", "#ffae82"],
  mixed: ["#ff7aa0", "#5fb553", "#ffd35c", "#a77dff", "#55aad4"],
};

const ICONS = {
  earth: [LeafIcon, SparkleIcon, StarIcon],
  ella: [HeartIcon, SparkleIcon, FlowerIcon, StarIcon],
  mixed: [HeartIcon, SparkleIcon, LeafIcon, FlowerIcon, StarIcon],
};

export default function FloatingDecor({
  count = 12,
  palette = "ella",
  className = "",
}: Props) {
  const items = useMemo(() => {
    const colors = PALETTES[palette];
    const icons = ICONS[palette];
    return Array.from({ length: count }).map((_, i) => {
      const Icon = icons[i % icons.length];
      return {
        key: i,
        Icon,
        color: colors[i % colors.length],
        size: 14 + Math.round(Math.random() * 28),
        left: Math.round(Math.random() * 100),
        top: Math.round(Math.random() * 100),
        dur: 3 + Math.random() * 5,
        delay: Math.random() * 3,
        rot: Math.round(Math.random() * 360),
      };
    });
  }, [count, palette]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {items.map(({ key, Icon, color, size, left, top, dur, delay, rot }) => (
        <motion.div
          key={key}
          className="absolute"
          style={{ left: `${left}%`, top: `${top}%`, color }}
          initial={{ opacity: 0, scale: 0.6, rotate: rot }}
          animate={{
            opacity: [0, 0.9, 0],
            y: [0, -40, -80],
            rotate: [rot, rot + 30, rot + 60],
            scale: [0.6, 1, 0.8],
          }}
          transition={{
            duration: dur,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}
    </div>
  );
}
