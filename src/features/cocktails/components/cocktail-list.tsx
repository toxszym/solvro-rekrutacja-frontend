"use client";

import { SearchXIcon, TriangleAlertIcon } from "lucide-react";
import { useEffect } from "react";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import type { CocktailFilters } from "../filters";
import { useCocktailsInfinite } from "../queries";
import { CocktailCard } from "./cocktail-card";
import { CocktailGrid, CocktailGridItem, CocktailGridSkeleton } from "./cocktail-grid";

export function CocktailList({ filters }: { filters: CocktailFilters }) {
  const {
    data,
    error,
    isPending,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useCocktailsInfinite(filters);

  // Element na końcu listy. Gdy zbliży się do ekranu (600px zapasu), ładujemy kolejną stronę.
  const { ref: loadMoreRef, isInView } = useInView("600px");

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage && !isPlaceholderData) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, isPlaceholderData, fetchNextPage]);

  if (isPending) {
    return <CocktailGridSkeleton />;
  }

  if (error && !data) {
    return (
      <StatusMessage
        icon={TriangleAlertIcon}
        title="Nie udało się pobrać koktajli"
        description="Sprawdź połączenie z internetem i spróbuj ponownie."
        action={<Button onClick={() => refetch()}>Spróbuj ponownie</Button>}
      />
    );
  }

  const cocktails = data.pages.flatMap((page) => page.data);
  const total = data.pages[0]?.meta.total ?? 0;

  if (cocktails.length === 0) {
    return (
      <StatusMessage
        icon={SearchXIcon}
        title="Brak wyników"
        description="Nie znaleźliśmy koktajli pasujących do wybranych filtrów."
      />
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Znaleziono: {total}
      </p>

      <div className={cn("transition-opacity", isPlaceholderData && "opacity-50")}>
        <CocktailGrid>
          {cocktails.map((cocktail, index) => (
            <CocktailGridItem key={cocktail.id} index={index}>
              <CocktailCard cocktail={cocktail} priority={index < 4} />
            </CocktailGridItem>
          ))}
        </CocktailGrid>
      </div>

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {/* Przycisk to zapasowa opcja, gdyby IntersectionObserver nie zadziałał. */}
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Ładowanie…" : "Pokaż więcej"}
          </Button>
        </div>
      )}
    </div>
  );
}
