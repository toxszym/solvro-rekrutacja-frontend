import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCategories, getCocktails, getGlasses } from "./api";
import type { CocktailFilters } from "./filters";

/**
 * Klucze zapytań w jednym miejscu. TanStack Query cache'uje dane po kluczu,
 * więc np. każda kombinacja filtrów ma swój osobny wpis w cache.
 */
export const cocktailKeys = {
  all: ["cocktails"] as const,
  list: (filters: CocktailFilters) => [...cocktailKeys.all, "list", filters] as const,
  categories: () => [...cocktailKeys.all, "categories"] as const,
  glasses: () => [...cocktailKeys.all, "glasses"] as const,
};

export function useCocktailsInfinite(filters: CocktailFilters) {
  return useInfiniteQuery({
    queryKey: cocktailKeys.list(filters),
    queryFn: ({ pageParam, signal }) => getCocktails(filters, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) =>
      meta.currentPage < meta.lastPage ? meta.currentPage + 1 : undefined,
    // Przy zmianie filtrów pokazujemy stare wyniki, dopóki nie przyjdą nowe,
    // zamiast migać skeletonem.
    placeholderData: keepPreviousData,
  });
}

// Kategorie i rodzaje szkła praktycznie się nie zmieniają.
const STATIC_DATA_STALE_TIME = 24 * 60 * 60 * 1000;

export function useCategories() {
  return useQuery({
    queryKey: cocktailKeys.categories(),
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: STATIC_DATA_STALE_TIME,
  });
}

export function useGlasses() {
  return useQuery({
    queryKey: cocktailKeys.glasses(),
    queryFn: ({ signal }) => getGlasses(signal),
    staleTime: STATIC_DATA_STALE_TIME,
  });
}
