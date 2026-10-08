import { LeafIcon } from "lucide-react";
import Image from "next/image";
import type { Ingredient } from "../schemas";

export function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <ul className="divide-y rounded-xl border">
      {ingredients.map((ingredient) => (
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
            <p className="text-sm text-muted-foreground">
              {describeIngredient(ingredient)}
            </p>
          </div>

          {ingredient.measure && (
            <span className="shrink-0 text-sm font-medium tabular-nums">
              {ingredient.measure.trim()}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Np. "Gin · 40%" albo "bezalkoholowy". */
function describeIngredient({ type, alcohol, percentage }: Ingredient) {
  const parts = [type];

  if (!alcohol) {
    parts.push("bezalkoholowy");
  } else if (percentage !== null) {
    parts.push(`${percentage}%`);
  } else {
    parts.push("alkohol");
  }

  return parts.filter(Boolean).join(" · ");
}
