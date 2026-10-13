import { LeafIcon, MartiniIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StatusMessage } from "@/components/status-message";
import {
  getCocktailsByIngredient,
  getIngredient,
  getUsedIngredientIds,
} from "@/features/cocktails/api";
import { BackButton } from "@/features/cocktails/components/back-button";
import { CocktailCard } from "@/features/cocktails/components/cocktail-card";
import {
  CocktailGrid,
  CocktailGridItem,
} from "@/features/cocktails/components/cocktail-grid";
import type { Ingredient } from "@/features/cocktails/schemas";
import { ApiError } from "@/lib/api-client";
import { pluralize } from "@/lib/plural";

export const revalidate = 86400;

export async function generateStaticParams() {
  const ids = await getUsedIngredientIds();
  return ids.map((id) => ({ id: String(id) }));
}

async function getIngredientOrNotFound(params: PageProps<"/ingredients/[id]">["params"]) {
  const { id } = await params;
  const ingredientId = Number(id);
  if (!Number.isInteger(ingredientId)) notFound();

  try {
    return await getIngredient(ingredientId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/ingredients/[id]">): Promise<Metadata> {
  const ingredient = await getIngredientOrNotFound(params);

  return {
    title: ingredient.name,
    description: `${ingredient.name} – opis składnika i koktajle, w których występuje.`,
  };
}

export default async function IngredientPage({ params }: PageProps<"/ingredients/[id]">) {
  const ingredient = await getIngredientOrNotFound(params);
  const cocktails = await getCocktailsByIngredient(ingredient.id);
  const facts = getFacts(ingredient);
  const [lead, ...rest] = splitIntoParagraphs(ingredient.description);
  const isLongDescription = rest.length > 0 || (lead?.length ?? 0) > 280;

  return (
    <article className="space-y-10 lg:space-y-14">
      <div className="space-y-6">
        <BackButton label="Wróć" />

        <header className="rounded-3xl bg-muted/60 p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 lg:gap-12">
            {/* Wiele składników nie ma zdjęcia: wtedy zamiast dużego pustego kafla
                pokazujemy małą ikonę obok nazwy. */}
            {ingredient.imageUrl ? (
              <div className="relative size-32 shrink-0 overflow-hidden rounded-3xl bg-background sm:size-44 lg:size-56">
                <Image
                  src={ingredient.imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 224px, 176px"
                  preload
                  className="object-contain p-4"
                />
              </div>
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
                <LeafIcon className="size-7" aria-hidden />
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                  Składnik
                </p>
                <h1 className="text-4xl font-semibold tracking-tight wrap-break-word sm:text-5xl">
                  {ingredient.name}
                </h1>
              </div>

              {facts.length > 0 && (
                <dl className="flex flex-wrap gap-2">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-baseline gap-2 rounded-full border bg-card px-3.5 py-1.5 text-sm"
                    >
                      <dt className="text-muted-foreground">{fact.label}</dt>
                      <dd className="font-medium">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {lead &&
                (isLongDescription ? (
                  // Opisy z API bywają bardzo długie: pierwszy akapit skracamy do kilku
                  // linii, a całość jest pod rozwijaną sekcją (bez JS, zwykłe <details>).
                  <details className="group max-w-2xl leading-relaxed text-muted-foreground">
                    <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <span className="line-clamp-4 group-open:line-clamp-none">
                        {lead}
                      </span>
                      <span className="mt-2 inline-block text-sm font-medium text-foreground underline decoration-primary/50 underline-offset-4 group-open:hidden">
                        Czytaj dalej
                      </span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      {rest.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </details>
                ) : (
                  <p className="max-w-2xl leading-relaxed text-muted-foreground">
                    {lead}
                  </p>
                ))}
            </div>
          </div>
        </header>
      </div>

      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Koktajle z tym składnikiem
          </h2>
          {cocktails.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {pluralize(cocktails.length, {
                one: "koktajl",
                few: "koktajle",
                many: "koktajli",
              })}
            </p>
          )}
        </div>

        {cocktails.length === 0 ? (
          <StatusMessage
            icon={MartiniIcon}
            title="Brak koktajli"
            description="Żaden przepis w naszej bazie nie używa tego składnika."
          />
        ) : (
          <CocktailGrid>
            {cocktails.map((cocktail, index) => (
              <CocktailGridItem key={cocktail.id} index={index}>
                <CocktailCard cocktail={cocktail} />
              </CocktailGridItem>
            ))}
          </CocktailGrid>
        )}
      </section>
    </article>
  );
}

/**
 * Tylko to, co API faktycznie podaje. Składniki bez `type` mają zawsze
 * `alcohol: true`, więc bez typu nie pokazujemy informacji o alkoholu.
 */
function getFacts({ type, alcohol, percentage }: Ingredient) {
  const facts: { label: string; value: string }[] = [];

  if (type) {
    facts.push({ label: "Typ", value: type });
    facts.push({ label: "Alkohol", value: alcohol ? "Tak" : "Nie" });
  }
  if (percentage !== null) facts.push({ label: "Moc", value: `${percentage}%` });

  return facts;
}

function splitIntoParagraphs(description: string | null) {
  return (description ?? "")
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
