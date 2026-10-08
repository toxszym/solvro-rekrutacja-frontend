"use client";

import { motion } from "motion/react";

/**
 * template.tsx (w przeciwieństwie do layout.tsx) montuje się na nowo przy każdej
 * zmianie strony, więc nadaje się do prostej animacji wejścia.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
