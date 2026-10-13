"use client";

import { useIsClient } from "@/hooks/use-is-client";
import { useCocktailFilters } from "../use-cocktail-filters";
import { CocktailFilters, ResultsToolbar } from "./cocktail-filters";
import { CocktailGridSkeleton } from "./cocktail-grid";
import { CocktailList } from "./cocktail-list";
import { ActiveFilterChips, MobileFilters } from "./mobile-filters";
import { SearchInput } from "./search-input";

/** Strona główna: filtry + lista. Łączy stan z URL z komponentami prezentacyjnymi. */
export function CocktailBrowser() {
  const { filters, setFilters, resetFilters } = useCocktailFilters();
  const isClient = useIsClient();

  // Cache zapytań wraca z localStorage, zanim React zhydratuje tę część strony,
  // więc klient miałby już dane (kategorie, listę), których nie było w HTML z serwera.
  // Do końca hydratacji renderujemy to samo co fallback Suspense.
  if (!isClient) return <CocktailGridSkeleton />;

  return (
    <div className="space-y-4">
      {/* Sticky musi być bezpośrednio w tym (wysokim) kontenerze: element przykleja się
          tylko w obrębie rodzica, więc w niskim wrapperze odkleiłby się od razu.
          top-20 = tuż pod pływającym headerem. Wygląda jak header (półprzezroczyste
          tło z rozmyciem), żeby odcinał się od zdjęć, nad którymi się przesuwa. */}
      <div className="sticky top-20 z-30 flex h-12 items-center rounded-full border bg-background/80 pr-1.5 shadow-sm backdrop-blur-md transition-shadow has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50">
        <div className="min-w-0 flex-1">
          <SearchInput
            value={filters.search}
            onChange={(search) => setFilters({ search }, { replace: true })}
            // Obramowanie, tło i obwódkę fokusu daje otaczająca "pigułka".
            className="h-12 rounded-full border-0 bg-transparent pl-11 shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
        </div>
        <MobileFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
      </div>
      <ActiveFilterChips filters={filters} onChange={setFilters} />
      <CocktailFilters filters={filters} onChange={setFilters} />
      <CocktailList
        filters={filters}
        toolbar={
          <ResultsToolbar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
          />
        }
      />
    </div>
  );
}
