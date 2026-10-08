import { apiGet } from "@/lib/api-client";
import type { CocktailFilters } from "./filters";
import {
  cocktailDetailsResponseSchema,
  cocktailsPageSchema,
  stringListResponseSchema,
} from "./schemas";

export const COCKTAILS_PER_PAGE = 24;

const SORT_PARAM: Record<CocktailFilters["sort"], string> = {
  "name-asc": "+name",
  "name-desc": "-name",
};

const ALCOHOLIC_PARAM: Record<CocktailFilters["alcoholic"], boolean | undefined> = {
  all: undefined,
  alcoholic: true,
  "non-alcoholic": false,
};

export function getCocktails(
  filters: CocktailFilters,
  page: number,
  signal?: AbortSignal,
) {
  const search = filters.search.trim();

  return apiGet("/cocktails", cocktailsPageSchema, {
    signal,
    params: {
      page,
      perPage: COCKTAILS_PER_PAGE,
      // API szuka dokładnej nazwy, a "%" działa jak wildcard (SQL LIKE).
      name: search ? `%${search}%` : undefined,
      category: filters.category ?? undefined,
      glass: filters.glass ?? undefined,
      alcoholic: ALCOHOLIC_PARAM[filters.alcoholic],
      sort: SORT_PARAM[filters.sort],
    },
  });
}

export async function getCocktail(id: number, signal?: AbortSignal) {
  const response = await apiGet(`/cocktails/${id}`, cocktailDetailsResponseSchema, {
    signal,
  });
  return response.data;
}

export async function getCategories(signal?: AbortSignal) {
  const response = await apiGet("/cocktails/categories", stringListResponseSchema, {
    signal,
  });
  return response.data;
}

export async function getGlasses(signal?: AbortSignal) {
  const response = await apiGet("/cocktails/glasses", stringListResponseSchema, {
    signal,
  });
  return response.data;
}

/** Wszystkie ID koktajli. Potrzebne przy buildzie do wygenerowania stron szczegółów. */
export async function getAllCocktailIds() {
  const ids: number[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await apiGet("/cocktails", cocktailsPageSchema, {
      params: { page, perPage: 100 },
    });
    ids.push(...response.data.map((cocktail) => cocktail.id));
    lastPage = response.meta.lastPage;
    page++;
  } while (page <= lastPage);

  return ids;
}
