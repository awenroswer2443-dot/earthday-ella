"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { play } from "@/lib/sounds";

type Variant = "pink" | "earth" | "gold" | "ghost" | "lilac";

interface Props extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  sound?: Parameters<typeof play>[0] | null;
}

const variants: Record<Variant, string> = {
  pink:
    "bg-gradient-to-b from-blush-300 to-blush-500 text-white shadow-candy hover:brightness-105",
  earth:
    "bg-gradient-to-b from-moss-300 to-moss-500 text-white shadow-earthy hover:brightness-105",
  gold:
    "bg-gradient-to-b from-gold-200 to-gold-400 text-[#3b1e3a] shadow-candy hover:brightness-105",
  lilac:
    "bg-gradient-to-b from-lilac-200 to-lilac-400 text-[#3b1e3a] shadow-dreamy hover:brightness-105",
  ghost:
    "bg-white/80 text-[#3b1e3a] backdrop-blur border border-white shadow-md hover:bg-white",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function CandyButton({
  children,
  variant = "pink",
  size = "md",
  sound = "tap",
  onClick,
  className = "",
  ...rest
}: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.94, y: 2 }}
      whileHover={{ scale: 1.03, y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      onClick={(e) => {
        if (sound) play(sound);
        onClick?.(e);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-display font-bold tracking-wide no-touch-callout select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
