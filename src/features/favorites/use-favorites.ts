"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getFavorites,
  getServerFavorites,
  subscribe,
  toggleFavorite,
} from "./favorites-store";

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getFavorites, getServerFavorites);

  const isFavorite = useCallback(
    (id: number) => favorites.some((favorite) => favorite.id === id),
    [favorites],
  );

  return { favorites, isFavorite, toggleFavorite };
}
