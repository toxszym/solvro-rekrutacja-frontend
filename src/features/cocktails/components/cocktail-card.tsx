import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import type { Cocktail } from "../schemas";
import { CocktailImage } from "./cocktail-image";

type CocktailCardProps = {
  cocktail: Pick<
    Cocktail,
    "id" | "name" | "category" | "glass" | "imageUrl" | "alcoholic"
  >;
  priority?: boolean;
};

export function CocktailCard({ cocktail, priority }: CocktailCardProps) {
  return (
    <Card className="group relative h-full pt-0 transition-shadow hover:shadow-lg">
      <Link
        href={`/cocktails/${cocktail.id}`}
        className="flex flex-col gap-(--card-spacing) rounded-xl outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
      >
        <CocktailImage
          src={cocktail.imageUrl}
          alt={cocktail.name}
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
        />
        <CardContent className="space-y-1">
          <CardTitle className="truncate">{cocktail.name}</CardTitle>
          <CardDescription className="truncate">
            {cocktail.category} · {cocktail.glass}
          </CardDescription>
        </CardContent>
      </Link>

      {!cocktail.alcoholic && (
        <Badge variant="secondary" className="absolute top-3 left-3 shadow-sm">
          Bezalkoholowy
        </Badge>
      )}
    </Card>
  );
}
