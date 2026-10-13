import { Suspense } from "react";
import { CocktailBrowser } from "@/features/cocktails/components/cocktail-browser";
import { CocktailGridSkeleton } from "@/features/cocktails/components/cocktail-grid";
import { Hero } from "@/features/cocktails/components/hero";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />

      {/* scroll-mt: przy przewijaniu do #przepisy zostawiamy miejsce na przyklejony header */}
      <section id="przepisy" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">Przepisy</h2>

        {/* CocktailBrowser czyta filtry z URL (useSearchParams), który nie jest znany
            podczas prerenderu, dlatego musi być w Suspense. */}
        <Suspense fallback={<CocktailGridSkeleton />}>
          <CocktailBrowser />
        </Suspense>
      </section>
    </div>
  );
}
