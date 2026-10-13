import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type CocktailFilters, DEFAULT_FILTERS, serializeFilters } from "../filters";

/** Link do listy z ustawionym filtrem, np. /?category=Shot#przepisy. */
function filtersHref(changes: Partial<CocktailFilters>) {
  return `/?${serializeFilters({ ...DEFAULT_FILTERS, ...changes })}#przepisy`;
}

// Skróty do gotowych filtrów. Nazwy kategorii muszą być takie same jak w API.
const SHORTCUTS = [
  { label: "Bez alkoholu", href: filtersHref({ alcoholic: "non-alcoholic" }) },
  { label: "Szoty", href: filtersHref({ category: "Shot" }) },
  { label: "Na imprezę", href: filtersHref({ category: "Punch / Party Drink" }) },
  { label: "Kawa i herbata", href: filtersHref({ category: "Coffee / Tea" }) },
];

// Trzy klasyki w "oknach". Dane są stałe, więc nie ma sensu pobierać ich z API.
const FEATURED = [
  {
    id: 11003,
    name: "Negroni",
    imageUrl: "https://cocktails.solvro.pl/images/cocktails/negroni.png",
    className: "aspect-[3/5]",
  },
  {
    id: 11000,
    name: "Mojito",
    imageUrl: "https://cocktails.solvro.pl/images/cocktails/mojito.png",
    className: "aspect-[3/7]",
  },
  {
    id: 11007,
    name: "Margarita",
    imageUrl: "https://cocktails.solvro.pl/images/cocktails/margarita.png",
    className: "aspect-[3/5]",
  },
];

export function Hero() {
  return (
    <section className="grid items-end gap-10 pt-4 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pt-10">
      <div className="space-y-8">
        <div className="space-y-5">
          <h1 className="text-5xl leading-[0.95] font-bold tracking-tighter sm:text-6xl lg:text-7xl">
            Wstrząśnij <span className="text-primary">czymś</span> dobrym.
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            Przepisy na klasyki i mniej znane drinki, ze składnikami i miarami. Poszukaj
            po nazwie albo zacznij od jednego ze skrótów.
          </p>
        </div>

        <ul className="grid max-w-lg grid-cols-2 gap-2">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.label}>
              <Link
                href={shortcut.href}
                scroll={false}
                className="group flex items-center justify-between gap-2 rounded-2xl border bg-card px-3 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary sm:px-4 sm:text-base"
              >
                {shortcut.label}
                <ArrowUpRightIcon
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <ul className="mx-auto grid w-full max-w-lg grid-cols-3 items-end gap-3 sm:gap-4 lg:max-w-none">
        {FEATURED.map((cocktail) => (
          <li key={cocktail.id}>
            <Link
              href={`/cocktails/${cocktail.id}`}
              className={cn(
                // Duży promień u góry daje kształt łuku, jak okno albo butelka na półce.
                // Nie rounded-t-full: przy 9999px przeglądarka skaluje wszystkie promienie
                // i dolne rogi wychodzą kwadratowe.
                "group relative block overflow-hidden rounded-t-[6rem] rounded-b-3xl bg-muted",
                cocktail.className,
              )}
            >
              <Image
                src={cocktail.imageUrl}
                alt={cocktail.name}
                fill
                sizes="(min-width: 1024px) 14vw, 30vw"
                preload
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-3 text-center text-sm font-medium text-white">
                {cocktail.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
