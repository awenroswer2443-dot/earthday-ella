"use client";

import { useMemo } from "react";

interface Props {
  count?: number;
  className?: string;
}

export default function Starfield({ count = 60, className = "" }: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        key: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 2,
        duration: 1.6 + Math.random() * 2.4,
        hue:
          Math.random() < 0.25
            ? "#ffd35c"
            : Math.random() < 0.5
            ? "#ff7aa0"
            : "#ffffff",
      })),
    [count]
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {stars.map((s) => (
        <div
          key={s.key}
          className="anim-twinkle absolute rounded-full"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              background: s.hue,
              boxShadow: `0 0 ${s.size * 3}px ${s.hue}`,
              "--dur": `${s.duration}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
