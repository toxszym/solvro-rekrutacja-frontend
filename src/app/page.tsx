import { Suspense } from "react";
import { CocktailBrowser } from "@/features/cocktails/components/cocktail-browser";
import { CocktailGridSkeleton } from "@/features/cocktails/components/cocktail-grid";
import { getCocktailStats } from "@/features/cocktails/api";
import { Hero } from "@/features/cocktails/components/hero";

// Liczby w hero pobieramy przy buildzie i odświeżamy najwyżej raz na dobę.
export const revalidate = 86400;

export default async function HomePage() {
  const stats = await getCocktailStats();

  return (
    <div className="space-y-12">
      <Hero stats={stats} />

      {/* scroll-mt: przy przewijaniu do #przepisy zostawiamy miejsce na przyklejony header */}
      <section id="przepisy" className="scroll-mt-24 space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold tracking-tight">Przepisy</h2>
          <p className="text-muted-foreground">
            Szukaj po nazwie albo zawęź listę po kategorii, szkle i alkoholu.
          </p>
        </div>

        {/* CocktailBrowser czyta filtry z URL (useSearchParams), który nie jest znany
            podczas prerenderu, dlatego musi być w Suspense. */}
        <Suspense fallback={<CocktailGridSkeleton />}>
          <CocktailBrowser />
        </Suspense>
      </section>
    </div>
  );
}
