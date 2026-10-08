"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { type CocktailFilters, parseFilters, serializeFilters } from "./filters";

type UpdateOptions = {
  /** `replace` nie dodaje wpisu do historii (przydatne przy pisaniu w wyszukiwarce). */
  replace?: boolean;
};

/** Czyta filtry z URL i pozwala je zmieniać. URL jest jedynym źródłem prawdy. */
export function useCocktailFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const setFilters = useCallback(
    (changes: Partial<CocktailFilters>, { replace = false }: UpdateOptions = {}) => {
      const query = serializeFilters({ ...filters, ...changes }).toString();
      const href = query ? `${pathname}?${query}` : pathname;

      if (replace) {
        router.replace(href, { scroll: false });
      } else {
        router.push(href, { scroll: false });
      }
    },
    [filters, pathname, router],
  );

  const resetFilters = useCallback(
    () => router.push(pathname, { scroll: false }),
    [pathname, router],
  );

  return { filters, setFilters, resetFilters };
}
