/**
 * Filtry listy koktajli. Ich źródłem prawdy jest URL (?q=gin&category=Shot),
 * więc link z filtrami można komuś wysłać, a przycisk "wstecz" działa.
 */

export const SORT_OPTIONS = ["name-asc", "name-desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const ALCOHOLIC_OPTIONS = ["all", "alcoholic", "non-alcoholic"] as const;
export type AlcoholicOption = (typeof ALCOHOLIC_OPTIONS)[number];

export type CocktailFilters = {
  search: string;
  category: string | null;
  glass: string | null;
  alcoholic: AlcoholicOption;
  sort: SortOption;
};

export const DEFAULT_FILTERS: CocktailFilters = {
  search: "",
  category: null,
  glass: null,
  alcoholic: "all",
  sort: "name-asc",
};

function isOneOf<T extends string>(
  options: readonly T[],
  value: string | null,
): value is T {
  return value !== null && options.includes(value as T);
}

/** URL -> filtry. Nieznane wartości (np. ręcznie zmieniony link) zastępujemy domyślnymi. */
export function parseFilters(params: URLSearchParams): CocktailFilters {
  const alcoholic = params.get("alcoholic");
  const sort = params.get("sort");

  return {
    search: params.get("q") ?? DEFAULT_FILTERS.search,
    category: params.get("category"),
    glass: params.get("glass"),
    alcoholic: isOneOf(ALCOHOLIC_OPTIONS, alcoholic)
      ? alcoholic
      : DEFAULT_FILTERS.alcoholic,
    sort: isOneOf(SORT_OPTIONS, sort) ? sort : DEFAULT_FILTERS.sort,
  };
}

/** Filtry -> URL. Wartości domyślne pomijamy, żeby adres był krótki. */
export function serializeFilters(filters: CocktailFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("q", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.glass) params.set("glass", filters.glass);
  if (filters.alcoholic !== DEFAULT_FILTERS.alcoholic)
    params.set("alcoholic", filters.alcoholic);
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);

  return params;
}

export function hasActiveFilters(filters: CocktailFilters) {
  return serializeFilters({ ...filters, sort: DEFAULT_FILTERS.sort }).size > 0;
}
