import {
  GlassWaterIcon,
  LeafIcon,
  ListChecksIcon,
  type LucideIcon,
  WineIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BackButton } from "@/features/cocktails/components/back-button";
import { CocktailImage } from "@/features/cocktails/components/cocktail-image";
import { IngredientList } from "@/features/cocktails/components/ingredient-list";
import { FavoriteButton } from "@/features/favorites/favorite-button";
import { getAllCocktailIds, getCocktail } from "@/features/cocktails/api";
import { ApiError } from "@/lib/api-client";
import { pluralize } from "@/lib/plural";

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
  const steps = splitIntoSteps(cocktail.instructions);

  return (
    <article className="space-y-6">
      <BackButton />

      <div className="space-y-10 lg:space-y-14">
        {/* Zdjęcie i najważniejsze informacje. Na telefonie zdjęcie jest niższe (4:3),
            żeby tytuł był widoczny bez przewijania. */}
        <header className="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-center sm:gap-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-12">
          <CocktailImage
            src={cocktail.imageUrl}
            alt={cocktail.name}
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 40vw, 100vw"
            preload
            className="aspect-[4/3] rounded-3xl shadow-xl shadow-foreground/10 sm:aspect-square"
          />

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                {cocktail.category}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight wrap-break-word sm:text-5xl lg:text-6xl">
                {cocktail.name}
              </h1>
            </div>

            <ul className="flex flex-wrap gap-2">
              <Fact icon={GlassWaterIcon}>{cocktail.glass}</Fact>
              <Fact icon={cocktail.alcoholic ? WineIcon : LeafIcon}>
                {cocktail.alcoholic ? "Alkoholowy" : "Bez alkoholu"}
              </Fact>
              <Fact icon={ListChecksIcon}>
                {pluralize(cocktail.ingredients.length, {
                  one: "składnik",
                  few: "składniki",
                  many: "składników",
                })}
              </Fact>
            </ul>

            <FavoriteButton cocktail={cocktail} variant="full" />
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Składniki</h2>
            <IngredientList ingredients={cocktail.ingredients} />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Przygotowanie</h2>
            <ol className="divide-y border-y">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4 py-4 sm:gap-6 sm:py-5">
                  <span
                    className="w-8 shrink-0 font-heading text-2xl leading-7 font-bold text-primary tabular-nums sm:w-10 sm:text-3xl sm:leading-8"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base leading-7 sm:text-lg sm:leading-8">{step}</p>
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
  children: ReactNode;
};

/** Pigułka z jedną informacją o koktajlu. */
function Fact({ icon: Icon, children }: FactProps) {
  return (
    <li className="flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium">
      <Icon className="size-4 text-muted-foreground" aria-hidden />
      {children}
    </li>
  );
}

/** Instrukcje z API to jeden akapit. Dzielimy go na zdania, żeby pokazać numerowane kroki. */
function splitIntoSteps(instructions: string) {
  return instructions
    .split(/(?<=[.!?])\s+/)
    .map((step) => step.trim())
    .filter(Boolean);
}
