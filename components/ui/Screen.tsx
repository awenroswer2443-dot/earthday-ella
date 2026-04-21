"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  background?: string;
}

export default function Screen({
  children,
  className = "",
  background = "bg-dreamy-gradient",
}: Props) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className={`relative flex min-h-[100dvh] w-full flex-col items-center ${background} ${className}`}
    >
      {children}
    </motion.main>
  );
}
