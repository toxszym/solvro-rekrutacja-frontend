"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CocktailGrid({ children }: { children: ReactNode }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </ul>
  );
}

type CocktailGridItemProps = {
  /** Pozycja na liście. Kolejne karty pojawiają się z małym opóźnieniem ("kaskada"). */
  index: number;
  children: ReactNode;
};

export function CocktailGridItem({ index, children }: CocktailGridItemProps) {
  return (
    <motion.li
      // `layout` animuje przesuwanie się kart, np. po usunięciu jednej z ulubionych.
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: (index % 12) * 0.03 }}
    >
      {children}
    </motion.li>
  );
}

export function CocktailGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <CocktailGrid>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="space-y-3">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </li>
      ))}
    </CocktailGrid>
  );
}
