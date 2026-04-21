"use client";

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
      const rot = Math.round(Math.random() * 360);
      return {
        key: i,
        Icon,
        color: colors[i % colors.length],
        size: 14 + Math.round(Math.random() * 28),
        left: Math.round(Math.random() * 100),
        top: Math.round(Math.random() * 100),
        dur: 3 + Math.random() * 5,
        delay: Math.random() * 3,
        rot0: rot,
        rot1: rot + 30,
        rot2: rot + 60,
      };
    });
  }, [count, palette]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {items.map(
        ({ key, Icon, color, size, left, top, dur, delay, rot0, rot1, rot2 }) => (
          <div
            key={key}
            className="anim-float-up absolute"
            style={
              {
                left: `${left}%`,
                top: `${top}%`,
                color,
                "--dur": `${dur}s`,
                "--delay": `${delay}s`,
                "--rot0": `${rot0}deg`,
                "--rot1": `${rot1}deg`,
                "--rot2": `${rot2}deg`,
              } as React.CSSProperties
            }
          >
            <Icon size={size} />
          </div>
        )
      )}
    </div>
  );
}
