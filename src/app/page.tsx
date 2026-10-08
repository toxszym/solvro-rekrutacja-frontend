import { Suspense } from "react";
import { CocktailBrowser } from "@/features/cocktails/components/cocktail-browser";
import { CocktailGridSkeleton } from "@/features/cocktails/components/cocktail-grid";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Koktajle</h1>
        <p className="text-muted-foreground">
          Znajdź coś dla siebie na dzisiejszy wieczór.
        </p>
      </div>

      {/* CocktailBrowser czyta filtry z URL (useSearchParams), który nie jest znany
          podczas prerenderu, dlatego musi być w Suspense. */}
      <Suspense fallback={<CocktailGridSkeleton />}>
        <CocktailBrowser />
      </Suspense>
    </div>
  );
}
