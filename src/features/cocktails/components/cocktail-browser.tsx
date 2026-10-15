"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import { useCocktailFilters } from "../use-cocktail-filters";
import { CocktailFilters, ResultsToolbar } from "./cocktail-filters";
import { CocktailGridSkeleton } from "./cocktail-grid";
import { CocktailList } from "./cocktail-list";
import { ActiveFilterChips, MobileFilters } from "./mobile-filters";
import { SearchInput } from "./search-input";

const SEARCH_INPUT_ID = "szukaj";

/** ⌘K / Ctrl+K przenosi kursor do wyszukiwarki. Zwraca podpis skrótu dla tego systemu. */
function useSearchShortcut() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        document.getElementById(SEARCH_INPUT_ID)?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K"),
    () => "Ctrl K",
  );
}

/** Strona główna: filtry + lista. Łączy stan z URL z komponentami prezentacyjnymi. */
export function CocktailBrowser() {
  const { filters, setFilters, resetFilters } = useCocktailFilters();
  const isClient = useIsClient();
  const shortcutLabel = useSearchShortcut();

  // Cache zapytań wraca z localStorage, zanim React zhydratuje tę część strony,
  // więc klient miałby już dane (kategorie, listę), których nie było w HTML z serwera.
  // Do końca hydratacji renderujemy to samo co fallback Suspense.
  if (!isClient) return <CocktailGridSkeleton />;

  return (
    // Siatka z jedną kolumną, w której panel (tło), wyszukiwarka i filtry leżą na sobie.
    // Dzięki temu wyszukiwarka wygląda na część panelu, a jednocześnie jej rodzicem
    // jest cały (wysoki) kontener z listą, więc `sticky` działa przez całe przewijanie.
    // W zwykłym wrapperze panelu odkleiłaby się od razu, bo sticky działa tylko w rodzicu.
    <div className="grid grid-cols-1">
      <div
        className="col-start-1 row-span-2 row-start-1 rounded-3xl border bg-card shadow-xs"
        aria-hidden
      />

      {/* top-20 = tuż pod pływającym headerem. Półprzezroczyste tło z rozmyciem, jak
          w headerze, żeby pasek odcinał się od zdjęć, nad którymi się przesuwa. */}
      <div className="sticky top-20 z-30 col-start-1 row-start-1 m-2 flex items-center gap-1 self-start rounded-2xl border bg-background/85 pr-2 shadow-sm backdrop-blur-md has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50 sm:m-3">
        <div className="min-w-0 flex-1">
          <SearchInput
            id={SEARCH_INPUT_ID}
            value={filters.search}
            onChange={(search) => setFilters({ search }, { replace: true })}
            // Obramowanie, tło i obwódkę fokusu daje otaczający pasek.
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
        </div>
        <kbd className="hidden h-8 shrink-0 items-center rounded-lg border bg-muted px-2 font-sans text-xs font-medium text-muted-foreground sm:flex">
          {shortcutLabel}
        </kbd>
        <MobileFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
      </div>

      <div className="col-start-1 row-start-2 px-2 pb-2 sm:px-3 sm:pb-3">
        <ActiveFilterChips filters={filters} onChange={setFilters} />
        <CocktailFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="col-start-1 row-start-3 pt-6">
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
    </div>
  );
}
