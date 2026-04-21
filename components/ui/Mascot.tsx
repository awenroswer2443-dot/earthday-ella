"use client";

import { motion } from "framer-motion";

interface Props {
  size?: number;
  variant?: "star" | "bee";
  mood?: "happy" | "blush" | "wink";
  floating?: boolean;
  className?: string;
}

function StarBody({ mood }: { mood: Props["mood"] }) {
  const blush = mood === "blush";
  return (
    <>
      <defs>
        <radialGradient id="starFill" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffe58a" />
          <stop offset="60%" stopColor="#ffbf2e" />
          <stop offset="100%" stopColor="#e83a75" />
        </radialGradient>
      </defs>
      <path
        d="M60 8l14 31 34 5-25 24 6 34-29-16-29 16 6-34L12 44l34-5L60 8Z"
        fill="url(#starFill)"
        stroke="#3b1e3a"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* Cheeks */}
      {blush && (
        <>
          <ellipse cx={44} cy={68} rx={6} ry={3} fill="#ff7aa0" opacity={0.8} />
          <ellipse cx={76} cy={68} rx={6} ry={3} fill="#ff7aa0" opacity={0.8} />
        </>
      )}
      {/* Eyes */}
      {mood === "wink" ? (
        <>
          <circle cx={48} cy={56} r={3} fill="#3b1e3a" />
          <path
            d="M72 56c2-2 6-2 8 0"
            stroke="#3b1e3a"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <circle cx={48} cy={56} r={3} fill="#3b1e3a" />
          <circle cx={72} cy={56} r={3} fill="#3b1e3a" />
          <circle cx={49} cy={55} r={1} fill="#fff" />
          <circle cx={73} cy={55} r={1} fill="#fff" />
        </>
      )}
      {/* Smile */}
      <path
        d="M50 66c4 4 16 4 20 0"
        stroke="#3b1e3a"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function BeeBody() {
  return (
    <>
      <defs>
        <radialGradient id="beeFill" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffe58a" />
          <stop offset="100%" stopColor="#ffbf2e" />
        </radialGradient>
      </defs>
      {/* Wings */}
      <ellipse cx={38} cy={38} rx={20} ry={14} fill="#ffffff" opacity={0.85} />
      <ellipse cx={82} cy={38} rx={20} ry={14} fill="#ffffff" opacity={0.85} />
      {/* Body */}
      <ellipse cx={60} cy={66} rx={30} ry={26} fill="url(#beeFill)" stroke="#3b1e3a" strokeWidth={2.5} />
      <rect x={42} y={54} width={36} height={6} fill="#3b1e3a" />
      <rect x={38} y={68} width={44} height={6} fill="#3b1e3a" />
      {/* Eyes */}
      <circle cx={52} cy={60} r={3} fill="#3b1e3a" />
      <circle cx={68} cy={60} r={3} fill="#3b1e3a" />
      <circle cx={53} cy={59} r={1} fill="#fff" />
      <circle cx={69} cy={59} r={1} fill="#fff" />
      {/* Cheeks */}
      <ellipse cx={48} cy={72} rx={4} ry={2.5} fill="#ff7aa0" opacity={0.85} />
      <ellipse cx={72} cy={72} rx={4} ry={2.5} fill="#ff7aa0" opacity={0.85} />
      {/* Smile */}
      <path
        d="M54 74c2 2 8 2 10 0"
        stroke="#3b1e3a"
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
      {/* Crown */}
      <path
        d="M44 40l4 8 6-6 4 8 6-6 4 8 6-6 4 8"
        stroke="#ff5288"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

export default function Mascot({
  size = 120,
  variant = "star",
  mood = "happy",
  floating = true,
  className = "",
}: Props) {
  const svg = (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {variant === "bee" ? <BeeBody /> : <StarBody mood={mood} />}
    </svg>
  );

  if (!floating) return svg;

  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {svg}
    </motion.div>
  );
}
