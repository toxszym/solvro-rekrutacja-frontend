"use client";

import { Loader2Icon, SearchXIcon, TriangleAlertIcon } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import { pluralize } from "@/lib/plural";
import { cn } from "@/lib/utils";
import type { CocktailFilters } from "../filters";
import { useCocktailsInfinite } from "../queries";
import { CocktailCard } from "./cocktail-card";
import { CocktailGrid, CocktailGridItem, CocktailGridSkeleton } from "./cocktail-grid";

type CocktailListProps = {
  filters: CocktailFilters;
  /** Dodatkowe akcje wyświetlane obok liczby wyników (sortowanie, czyszczenie filtrów). */
  toolbar?: ReactNode;
};

export function CocktailList({ filters, toolbar }: CocktailListProps) {
  const {
    data,
    error,
    isPending,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
  } = useCocktailsInfinite(filters);

  // Element na końcu listy. Gdy zbliży się do ekranu (600px zapasu), ładujemy kolejną stronę.
  const { ref: loadMoreRef, isInView } = useInView("600px");

  useEffect(() => {
    // Po błędzie nie ponawiamy automatycznie: znacznik nadal jest na ekranie,
    // więc zapytania leciałyby w kółko. Zostaje przycisk "Spróbuj ponownie".
    if (
      isInView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetchNextPageError &&
      !isPlaceholderData
    ) {
      fetchNextPage();
    }
  }, [
    isInView,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isPlaceholderData,
    fetchNextPage,
  ]);

  const cocktails = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.meta.total;

  return (
    <div className="space-y-6">
      <div className="flex min-h-11 items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {total !== undefined &&
            `Znaleziono ${pluralize(total, { one: "koktajl", few: "koktajle", many: "koktajli" })}`}
        </p>
        {toolbar}
      </div>

      {isPending ? (
        <CocktailGridSkeleton />
      ) : error && !data ? (
        <StatusMessage
          icon={TriangleAlertIcon}
          title="Nie udało się pobrać koktajli"
          description="Sprawdź połączenie z internetem i spróbuj ponownie."
          action={
            <Button size="lg" onClick={() => refetch()} className="h-11 rounded-xl px-5">
              Spróbuj ponownie
            </Button>
          }
        />
      ) : cocktails.length === 0 ? (
        <StatusMessage
          icon={SearchXIcon}
          title="Brak wyników"
          description="Nie znaleźliśmy koktajli pasujących do wybranych filtrów. Spróbuj zmienić wyszukiwanie."
        />
      ) : (
        <div className={cn("transition-opacity", isPlaceholderData && "opacity-50")}>
          <CocktailGrid>
            {cocktails.map((cocktail, index) => (
              <CocktailGridItem key={cocktail.id} index={index}>
                <CocktailCard cocktail={cocktail} preload={index < 4} />
              </CocktailGridItem>
            ))}
          </CocktailGrid>
        </div>
      )}

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center pt-4">
          {/* Przycisk to zapasowa opcja, gdyby IntersectionObserver nie zadziałał. */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="h-11 rounded-xl px-6"
          >
            {isFetchingNextPage && <Loader2Icon className="animate-spin" />}
            {isFetchingNextPage
              ? "Ładowanie…"
              : isFetchNextPageError
                ? "Spróbuj ponownie"
                : "Pokaż więcej"}
          </Button>
        </div>
      )}

      {!hasNextPage && cocktails.length > 12 && (
        <p className="pt-4 text-center text-sm text-muted-foreground">
          To już wszystkie koktajle.
        </p>
      )}
    </div>
  );
}
