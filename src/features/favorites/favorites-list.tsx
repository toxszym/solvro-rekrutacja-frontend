"use client";

import { HeartIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";
import { CocktailCard } from "@/features/cocktails/components/cocktail-card";
import {
  CocktailGrid,
  CocktailGridItem,
  CocktailGridSkeleton,
} from "@/features/cocktails/components/cocktail-grid";
import { useIsClient } from "@/hooks/use-is-client";
import { useFavorites } from "./use-favorites";

export function FavoritesList() {
  const { favorites } = useFavorites();
  const isClient = useIsClient();

  if (!isClient) {
    return <CocktailGridSkeleton count={4} />;
  }

  if (favorites.length === 0) {
    return (
      <StatusMessage
        icon={HeartIcon}
        title="Nie masz jeszcze ulubionych"
        description="Kliknij serduszko przy koktajlu, a pojawi się tutaj."
        action={
          <Button asChild size="lg" className="h-11 rounded-xl px-5">
            <Link href="/">Przeglądaj koktajle</Link>
          </Button>
        }
      />
    );
  }

  return (
    <CocktailGrid>
      {/* AnimatePresence pozwala animować kartę także przy jej usuwaniu (exit). */}
      <AnimatePresence initial={false}>
        {favorites.map((cocktail, index) => (
          <CocktailGridItem key={cocktail.id} index={index}>
            <CocktailCard cocktail={cocktail} />
          </CocktailGridItem>
        ))}
      </AnimatePresence>
    </CocktailGrid>
  );
}
