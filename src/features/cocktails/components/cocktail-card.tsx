import { GlassWaterIcon, LeafIcon } from "lucide-react";
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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5">
      {/* Link rozciągnięty pseudo-elementem ::after na całą kartę,
          dzięki czemu cała karta jest klikalna, a przycisk serduszka działa osobno. */}
      <Link
        href={`/cocktails/${cocktail.id}`}
        className="flex flex-1 flex-col outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
      >
        <CocktailImage
          src={cocktail.imageUrl}
          alt={cocktail.name}
          preload={preload}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
          className="aspect-[4/5]"
        />

        <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
          <p className="truncate text-[11px] font-semibold tracking-widest text-primary uppercase">
            {cocktail.category}
          </p>
          <h3 className="line-clamp-2 font-heading text-base leading-snug font-semibold sm:text-lg">
            {cocktail.name}
          </h3>
          <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted-foreground sm:text-sm">
            <GlassWaterIcon className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{cocktail.glass}</span>
          </p>
        </div>
      </Link>

      {!cocktail.alcoholic && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-1 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur dark:text-emerald-400">
          <LeafIcon className="size-3" aria-hidden />
          <span className="sr-only sm:not-sr-only">Bez alkoholu</span>
        </span>
      )}

      {/* z-10, żeby przycisk był nad linkiem rozciągniętym na całą kartę */}
      <FavoriteButton cocktail={cocktail} className="absolute top-3 right-3 z-10" />
    </article>
  );
}
