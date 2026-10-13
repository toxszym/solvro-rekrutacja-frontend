import {
  GlassWaterIcon,
  LeafIcon,
  ListChecksIcon,
  type LucideIcon,
  WineIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackButton } from "@/features/cocktails/components/back-button";
import { CocktailImage } from "@/features/cocktails/components/cocktail-image";
import { IngredientList } from "@/features/cocktails/components/ingredient-list";
import { FavoriteButton } from "@/features/favorites/favorite-button";
import { getAllCocktailIds, getCocktail } from "@/features/cocktails/api";
import { ApiError } from "@/lib/api-client";

// Na serwerze Node strona jest odświeżana w tle najwyżej raz na dobę (ISR),
// więc API Solvro nie dostaje zapytania przy każdym wejściu.
export const revalidate = 86400;

/** Przy buildzie generujemy stronę dla każdego koktajlu (potrzebne też do statycznego eksportu). */
export async function generateStaticParams() {
  const ids = await getAllCocktailIds();
  return ids.map((id) => ({ id: String(id) }));
}

async function getCocktailOrNotFound(params: PageProps<"/cocktails/[id]">["params"]) {
  const { id } = await params;
  const cocktailId = Number(id);
  if (!Number.isInteger(cocktailId)) notFound();

  try {
    return await getCocktail(cocktailId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/cocktails/[id]">): Promise<Metadata> {
  const cocktail = await getCocktailOrNotFound(params);

  return {
    title: cocktail.name,
    description: `${cocktail.name} – składniki i sposób przygotowania.`,
    openGraph: cocktail.imageUrl ? { images: [cocktail.imageUrl] } : undefined,
  };
}

export default async function CocktailPage({ params }: PageProps<"/cocktails/[id]">) {
  const cocktail = await getCocktailOrNotFound(params);

  return (
    <article className="space-y-6">
      <BackButton />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CocktailImage
            src={cocktail.imageUrl}
            alt={cocktail.name}
            sizes="(min-width: 1024px) 45vw, 100vw"
            preload
            className="rounded-3xl shadow-2xl shadow-foreground/10"
          />
        </div>

        <div className="space-y-10">
          <header className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                {cocktail.category}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {cocktail.name}
              </h1>
            </div>

            <dl className="grid grid-cols-3 gap-2 sm:gap-3">
              <Fact icon={GlassWaterIcon} label="Szkło" value={cocktail.glass} />
              <Fact
                icon={cocktail.alcoholic ? WineIcon : LeafIcon}
                label="Rodzaj"
                value={cocktail.alcoholic ? "Alkoholowy" : "Bez alkoholu"}
              />
              <Fact
                icon={ListChecksIcon}
                label="Składniki"
                value={String(cocktail.ingredients.length)}
              />
            </dl>

            <FavoriteButton cocktail={cocktail} variant="full" />
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Składniki</h2>
            <IngredientList ingredients={cocktail.ingredients} />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Przygotowanie</h2>
            <ol className="space-y-4">
              {splitIntoSteps(cocktail.instructions).map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary tabular-nums">
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-relaxed text-muted-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}

type FactProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

/** Mały kafelek z jedną informacją o koktajlu. */
function Fact({ icon: Icon, label, value }: FactProps) {
  return (
    <div className="space-y-1.5 rounded-2xl border bg-card p-3 sm:p-4">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="text-sm font-medium sm:text-base">{value}</dd>
    </div>
  );
}

/** Instrukcje z API to jeden akapit. Dzielimy go na zdania, żeby pokazać numerowane kroki. */
function splitIntoSteps(instructions: string) {
  return instructions
    .split(/(?<=[.!?])\s+/)
    .map((step) => step.trim())
    .filter(Boolean);
}
