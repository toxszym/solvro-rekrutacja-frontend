import "server-only";

import { cacheLife } from "next/cache";
import { ApiError } from "@/lib/api-client";
import { getAllCocktailIds, getCocktail } from "./api";

/**
 * Funkcje używane tylko po stronie serwera (np. podczas builda).
 * "use cache" zapamiętuje wynik, więc API Solvro nie dostaje
 * tego samego zapytania przy każdym wejściu na stronę.
 */

export async function getCachedCocktail(id: number) {
  "use cache";
  cacheLife("days");

  try {
    return await getCocktail(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getCachedCocktailIds() {
  "use cache";
  cacheLife("days");

  return getAllCocktailIds();
}
