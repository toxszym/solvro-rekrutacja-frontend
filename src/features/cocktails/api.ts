import { apiGet } from "@/lib/api-client";
import type { CocktailFilters } from "./filters";
import {
  type Cocktail,
  cocktailDetailsResponseSchema,
  cocktailIngredientIdsPageSchema,
  cocktailsPageSchema,
  ingredientResponseSchema,
  stringListResponseSchema,
} from "./schemas";

export const COCKTAILS_PER_PAGE = 24;

const SORT_PARAM: Record<CocktailFilters["sort"], string> = {
  "name-asc": "+name",
  "name-desc": "-name",
  newest: "-createdAt",
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

export async function getGlasses(signal?: AbortSignal) {
  const response = await apiGet("/cocktails/glasses", stringListResponseSchema, {
    signal,
  });
  return response.data;
}

export async function getIngredient(id: number, signal?: AbortSignal) {
  const response = await apiGet(`/ingredients/${id}`, ingredientResponseSchema, {
    signal,
  });
  return response.data;
}

// Największy rozmiar strony, jaki przyjmuje API.
const MAX_PER_PAGE = 100;

/** Pobiera kolejne strony, aż do ostatniej, i zwraca wszystkie elementy razem. */
async function getAllPages<T>(
  getPage: (page: number) => Promise<{ data: T[]; meta: { lastPage: number } }>,
) {
  const items: T[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await getPage(page);
    items.push(...response.data);
    lastPage = response.meta.lastPage;
    page++;
  } while (page <= lastPage);

  return items;
}

/** Wszystkie koktajle zawierające dany składnik. */
export function getCocktailsByIngredient(ingredientId: number): Promise<Cocktail[]> {
  return getAllPages((page) =>
    apiGet("/cocktails", cocktailsPageSchema, {
      params: { page, perPage: MAX_PER_PAGE, ingredientId, sort: "+name" },
    }),
  );
}

/** Wszystkie ID koktajli. Potrzebne przy buildzie do wygenerowania stron szczegółów. */
export async function getAllCocktailIds() {
  const cocktails = await getAllPages((page) =>
    apiGet("/cocktails", cocktailsPageSchema, {
      params: { page, perPage: MAX_PER_PAGE },
    }),
  );
  return cocktails.map((cocktail) => cocktail.id);
}

/**
 * ID składników użytych w co najmniej jednym koktajlu. Tylko do nich prowadzą linki,
 * więc przy buildzie nie generujemy stron dla pozostałych (API ma ich ponad 500).
 */
export async function getUsedIngredientIds() {
  const cocktails = await getAllPages((page) =>
    apiGet("/cocktails", cocktailIngredientIdsPageSchema, {
      params: { page, perPage: MAX_PER_PAGE, ingredients: true },
    }),
  );
  const ids = cocktails.flatMap((cocktail) =>
    cocktail.ingredients.map((ingredient) => ingredient.id),
  );
  return [...new Set(ids)];
}
