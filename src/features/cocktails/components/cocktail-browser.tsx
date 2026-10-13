"use client";

import { useIsClient } from "@/hooks/use-is-client";
import { useCocktailFilters } from "../use-cocktail-filters";
import { CocktailFilters, ResultsToolbar } from "./cocktail-filters";
import { CocktailGridSkeleton } from "./cocktail-grid";
import { CocktailList } from "./cocktail-list";
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
          top-20 = tuż pod pływającym headerem. */}
      <div className="sticky top-20 z-30 rounded-xl shadow-lg shadow-foreground/5">
        <SearchInput
          value={filters.search}
          onChange={(search) => setFilters({ search }, { replace: true })}
        />
      </div>
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
