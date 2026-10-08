import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CocktailGrid({ children }: { children: ReactNode }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </ul>
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
