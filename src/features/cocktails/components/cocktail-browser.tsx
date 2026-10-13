"use client";

import { useCocktailFilters } from "../use-cocktail-filters";
import { CocktailFilters, ResultsToolbar } from "./cocktail-filters";
import { CocktailList } from "./cocktail-list";

/** Strona główna: filtry + lista. Łączy stan z URL z komponentami prezentacyjnymi. */
export function CocktailBrowser() {
  const { filters, setFilters, resetFilters } = useCocktailFilters();

  return (
    <div className="space-y-6">
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
