"use client";

import { HeartIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FavoriteCocktail } from "./favorites-store";
import { useFavorites } from "./use-favorites";

type FavoriteButtonProps = {
  cocktail: FavoriteCocktail;
  /** `icon` – okrągły przycisk na karcie, `full` – przycisk z tekstem na stronie szczegółów. */
  variant?: "icon" | "full";
  className?: string;
};

export function FavoriteButton({
  cocktail,
  variant = "icon",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(cocktail.id);
  const label = active ? "Usuń z ulubionych" : "Dodaj do ulubionych";

  const heart = (
    // "Pyknięcie" serduszka przy dodaniu. initial={false} – bez animacji przy pierwszym renderze.
    <motion.span
      initial={false}
      animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex"
    >
      <HeartIcon
        className={cn("transition-colors", active && "fill-red-500 text-red-500")}
        aria-hidden
      />
    </motion.span>
  );

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        size="lg"
        onClick={() => toggleFavorite(cocktail)}
        aria-pressed={active}
        className={cn("h-11 rounded-xl px-5", className)}
      >
        {heart}
        {active ? "W ulubionych" : "Dodaj do ulubionych"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={() => toggleFavorite(cocktail)}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-full bg-background/85 shadow-sm backdrop-blur hover:bg-background",
        className,
      )}
    >
      {heart}
    </Button>
  );
}
