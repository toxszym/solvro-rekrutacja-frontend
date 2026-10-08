"use client";

import { HeartIcon } from "lucide-react";
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
    <HeartIcon
      className={cn("transition-colors", active && "fill-red-500 text-red-500")}
      aria-hidden
    />
  );

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        onClick={() => toggleFavorite(cocktail)}
        aria-pressed={active}
        className={className}
      >
        {heart}
        {active ? "W ulubionych" : "Dodaj do ulubionych"}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon-lg"
      onClick={() => toggleFavorite(cocktail)}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn("rounded-full bg-background/80 shadow-sm backdrop-blur", className)}
    >
      {heart}
    </Button>
  );
}
