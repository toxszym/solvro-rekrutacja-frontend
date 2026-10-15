import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type HeroStats = {
  cocktails: number;
  nonAlcoholic: number;
  categories: number;
};

// Trzy klasyki w kolażu. Dane są stałe, więc nie ma sensu pobierać ich z API.
const FEATURED = [
  {
    id: 11003,
    name: "Negroni",
    note: "na gorzko",
    imageUrl: "https://cocktails.solvro.pl/images/cocktails/negroni.png",
    // Duży łuk po lewej. Nie rounded-t-full: przy 9999px przeglądarka skaluje
    // wszystkie promienie i dolne rogi wychodzą kwadratowe.
    className: "top-[10%] left-0 h-[88%] w-[58%] rounded-t-[12rem] rounded-b-3xl",
    sizes: "(min-width: 1024px) 18vw, 50vw",
  },
  {
    id: 11000,
    name: "Mojito",
    imageUrl: "https://cocktails.solvro.pl/images/cocktails/mojito.png",
    className: "top-0 right-0 h-[52%] w-[44%] rounded-3xl",
    sizes: "(min-width: 1024px) 14vw, 40vw",
  },
  {
    id: 11007,
    name: "Margarita",
    imageUrl: "https://cocktails.solvro.pl/images/cocktails/margarita.png",
    className: "right-[6%] bottom-0 h-[40%] w-[44%] rounded-3xl",
    sizes: "(min-width: 1024px) 14vw, 40vw",
  },
];

export function Hero({ stats }: { stats: HeroStats }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border bg-card px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      {/* Ciepła poświata za zdjęciami, jak światło nad barem. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_60%)]"
        aria-hidden
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 text-[11px] font-semibold tracking-widest text-primary uppercase sm:text-xs">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            {/* Jeden span: inaczej `gap` z flexa wstawiłby odstęp przed kropką. */}
            <span>
              Domowy barek<span className="hidden sm:inline"> · kolekcja przepisów</span>
            </span>
          </p>

          <div className="space-y-5">
            <h1 className="text-5xl leading-[0.95] font-bold tracking-tighter sm:text-6xl lg:text-7xl">
              Wstrząśnij <span className="text-primary">czymś</span> dobrym.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
              Przepisy na klasyki i mniej znane drinki, ze składnikami, miarami i krokami
              przygotowania. Także bez alkoholu.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-x-8">
            <Stat value={stats.cocktails} label="przepisów" />
            <Stat value={stats.nonAlcoholic} label="bez alkoholu" />
            <Stat value={stats.categories} label="kategorii" />
          </dl>
        </div>

        <ul className="relative mx-auto aspect-[6/5] w-full max-w-md lg:max-w-none">
          {FEATURED.map((cocktail, index) => (
            <li
              key={cocktail.id}
              className={cn(
                "absolute overflow-hidden bg-muted shadow-xl shadow-foreground/10",
                // Mniejsze zdjęcia nachodzą na duże, więc dostają ramkę w kolorze tła karty.
                index > 0 && "border-4 border-card",
                cocktail.className,
              )}
            >
              <Link href={`/cocktails/${cocktail.id}`} className="group block size-full">
                <Image
                  src={cocktail.imageUrl}
                  alt={cocktail.name}
                  fill
                  sizes={cocktail.sizes}
                  preload
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md sm:bottom-3 sm:left-3 sm:max-w-[calc(100%-1.5rem)] sm:px-3">
                  {cocktail.note && (
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                  <span className="min-w-0 truncate">
                    {cocktail.name}
                    {/* Na wąskim telefonie zostaje sama nazwa, bo dopisek by się uciął. */}
                    {cocktail.note && (
                      <span className="hidden min-[400px]:inline">
                        {" "}
                        · {cocktail.note}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    // Na telefonie liczba nad podpisem (trzy kolumny), od sm obok siebie z kreską.
    // `order`, bo w <dl> podpis (dt) musi być przed wartością (dd).
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
      <dt className="order-2 text-sm leading-tight text-muted-foreground sm:border-l sm:pl-3">
        {label}
      </dt>
      <dd className="order-1 font-heading text-2xl font-bold text-primary tabular-nums sm:text-3xl">
        {value}
      </dd>
    </div>
  );
}
