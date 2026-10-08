import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/features/cocktails/components/back-button";
import { CocktailImage } from "@/features/cocktails/components/cocktail-image";
import { IngredientList } from "@/features/cocktails/components/ingredient-list";
import { getCachedCocktail, getCachedCocktailIds } from "@/features/cocktails/server";

/** Przy buildzie generujemy stronę dla każdego koktajlu (potrzebne też do statycznego eksportu). */
export async function generateStaticParams() {
  const ids = await getCachedCocktailIds();
  return ids.map((id) => ({ id: String(id) }));
}

async function getCocktailOrNotFound(params: PageProps<"/cocktails/[id]">["params"]) {
  const { id } = await params;
  const cocktailId = Number(id);
  if (!Number.isInteger(cocktailId)) notFound();

  const cocktail = await getCachedCocktail(cocktailId);
  if (!cocktail) notFound();

  return cocktail;
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

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <CocktailImage
          src={cocktail.imageUrl}
          alt={cocktail.name}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
          className="rounded-2xl md:sticky md:top-20 md:self-start"
        />

        <div className="space-y-8">
          <header className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{cocktail.category}</Badge>
              <Badge variant="outline">{cocktail.glass}</Badge>
              <Badge variant={cocktail.alcoholic ? "default" : "secondary"}>
                {cocktail.alcoholic ? "Alkoholowy" : "Bezalkoholowy"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {cocktail.name}
            </h1>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              Składniki{" "}
              <span className="text-muted-foreground">
                ({cocktail.ingredients.length})
              </span>
            </h2>
            <IngredientList ingredients={cocktail.ingredients} />
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Przygotowanie</h2>
            <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
              {cocktail.instructions}
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
