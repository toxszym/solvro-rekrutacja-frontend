import { LeafIcon } from "lucide-react";
import Image from "next/image";
import type { Ingredient } from "../schemas";

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <ul className="divide-y rounded-xl border">
      {ingredients.map((ingredient) => {
        const description = describeIngredient(ingredient);

        return (
          <li key={ingredient.id} className="flex items-center gap-3 p-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
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
              <p className="truncate font-medium">{ingredient.name}</p>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>

            {ingredient.measure && (
              <span className="shrink-0 text-sm font-medium tabular-nums">
                {ingredient.measure.trim()}
              </span>
            )}
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
