import { ChevronRightIcon, LeafIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Ingredient } from "../schemas";

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-xs">
      {ingredients.map((ingredient) => {
        const description = describeIngredient(ingredient);

        return (
          <li
            key={ingredient.id}
            className="group/row relative flex items-center gap-3 p-3 transition-colors hover:bg-muted/50 sm:gap-4 sm:px-4"
          >
            <div className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-12">
              {ingredient.imageUrl ? (
                <Image
                  src={ingredient.imageUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              ) : (
                <LeafIcon
                  className="absolute inset-0 m-auto size-5 text-muted-foreground"
                  aria-hidden
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium wrap-break-word">
                {/* ::after rozciąga link na cały wiersz */}
                <Link
                  href={`/ingredients/${ingredient.id}`}
                  className="outline-none after:absolute after:inset-0 focus-visible:underline"
                >
                  {ingredient.name}
                </Link>
              </p>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>

            {ingredient.measure?.trim() && (
              // max-w + wrap: miary bywają długie, np. "Juice of 1/2 a lemon".
              <span className="max-w-[45%] shrink-0 rounded-xl bg-muted px-3 py-1 text-right text-sm font-medium tabular-nums">
                {ingredient.measure.trim()}
              </span>
            )}
            <ChevronRightIcon
              className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover/row:translate-x-0.5 group-hover/row:text-foreground"
              aria-hidden
            />
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Np. "Gin · 40%" albo "Mineral · bezalkoholowy".
 *
 * Uwaga na dane z API: składniki bez uzupełnionego `type` (np. "Lime juice")
 * mają zawsze `alcohol: true`, więc flagi alkoholu nie ufamy, gdy typu brak.
 */
function describeIngredient({ type, alcohol, percentage }: Ingredient) {
  if (!type) return null;

  if (!alcohol) return `${type} · bezalkoholowy`;
  if (percentage !== null) return `${type} · ${percentage}%`;
  return type;
}
