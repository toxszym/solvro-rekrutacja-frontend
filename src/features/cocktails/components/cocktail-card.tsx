import { ArrowRightIcon, LeafIcon, WineIcon } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "@/features/favorites/favorite-button";
import type { FavoriteCocktail } from "@/features/favorites/favorites-store";
import { CocktailImage } from "./cocktail-image";

type CocktailCardProps = {
  cocktail: FavoriteCocktail;
  preload?: boolean;
};

export function CocktailCard({ cocktail, preload }: CocktailCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border bg-card p-1.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5 sm:p-2">
      {/* Link rozciągnięty pseudo-elementem ::after na całą kartę,
          dzięki czemu cała karta jest klikalna, a przycisk serduszka działa osobno. */}
      <Link
        href={`/cocktails/${cocktail.id}`}
        className="flex flex-1 flex-col outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
      >
        {/* Zdjęcie z odstępem od krawędzi karty, jak odbitka w passe-partout. */}
        <CocktailImage
          src={cocktail.imageUrl}
          alt={cocktail.name}
          preload={preload}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
          className="aspect-[6/5] rounded-xl"
        />

        <div className="flex flex-1 flex-col gap-1 px-1.5 pt-3 pb-1 sm:px-2">
          <h3 className="line-clamp-2 font-heading text-base leading-snug font-semibold sm:text-lg">
            {cocktail.name}
          </h3>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {cocktail.category} · {cocktail.glass}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t pt-2.5 text-xs sm:mt-3 sm:pt-3">
            {cocktail.alcoholic ? (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <WineIcon className="size-3.5" aria-hidden />
                <span className="sr-only sm:not-sr-only">Z alkoholem</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <LeafIcon className="size-3.5" aria-hidden />
                <span className="sr-only sm:not-sr-only">Bez alkoholu</span>
              </span>
            )}
            <span className="flex items-center gap-1 font-semibold text-primary">
              Przepis
              <ArrowRightIcon
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>

      {/* z-10, żeby przycisk był nad linkiem rozciągniętym na całą kartę */}
      <FavoriteButton
        cocktail={cocktail}
        className="absolute top-3.5 right-3.5 z-10 sm:top-4 sm:right-4"
      />
    </article>
  );
}
