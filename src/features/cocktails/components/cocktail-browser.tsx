"use client";

import { useCocktailFilters } from "../use-cocktail-filters";
import { CocktailFilters } from "./cocktail-filters";
import { CocktailList } from "./cocktail-list";

/** Strona główna: filtry + lista. Łączy stan z URL z komponentami prezentacyjnymi. */
export function CocktailBrowser() {
  const { filters, setFilters, resetFilters } = useCocktailFilters();

  return (
    <div className="space-y-6">
      <CocktailFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
      <CocktailList filters={filters} />
    </div>
  );
}
