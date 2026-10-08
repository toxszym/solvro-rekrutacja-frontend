import { z } from "zod";
import { cocktailSchema } from "@/features/cocktails/schemas";

/**
 * Prosty "store" ulubionych oparty o localStorage.
 *
 * Zapisujemy nie tylko ID, ale też podstawowe dane koktajlu (nazwa, zdjęcie...),
 * żeby strona ulubionych działała od razu, bez zapytań do API, także offline.
 *
 * Store jest czytany przez useSyncExternalStore (patrz use-favorites.ts),
 * więc nie potrzebujemy Contextu ani biblioteki do stanu.
 */

const STORAGE_KEY = "cocktails:favorites";

export const favoriteCocktailSchema = cocktailSchema.pick({
  id: true,
  name: true,
  category: true,
  glass: true,
  imageUrl: true,
  alcoholic: true,
});

export type FavoriteCocktail = z.infer<typeof favoriteCocktailSchema>;

const NO_FAVORITES: FavoriteCocktail[] = [];

function readStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // np. zablokowany dostęp do storage w trybie prywatnym
    return null;
  }
}

function parseFavorites(raw: string | null): FavoriteCocktail[] {
  if (!raw) return NO_FAVORITES;

  try {
    const result = z.array(favoriteCocktailSchema).safeParse(JSON.parse(raw));
    return result.success ? result.data : NO_FAVORITES;
  } catch {
    return NO_FAVORITES;
  }
}

// useSyncExternalStore wymaga, żeby getSnapshot zwracał tę samą referencję,
// dopóki dane się nie zmieniły. Dlatego pamiętamy ostatni odczyt.
let lastRaw: string | null = null;
let lastFavorites = NO_FAVORITES;

export function getFavorites(): FavoriteCocktail[] {
  const raw = readStorage();

  if (raw !== lastRaw) {
    lastRaw = raw;
    lastFavorites = parseFavorites(raw);
  }

  return lastFavorites;
}

/** Na serwerze nie ma localStorage, więc zawsze zwracamy pustą listę. */
export function getServerFavorites(): FavoriteCocktail[] {
  return NO_FAVORITES;
}

const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);

  // Zdarzenie "storage" przychodzi, gdy ulubione zmienią się w innej karcie.
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) listener();
  }
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveFavorites(favorites: FavoriteCocktail[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // brak miejsca albo zablokowany storage, nic więcej nie zrobimy
  }

  listeners.forEach((listener) => listener());
}

export function toggleFavorite(cocktail: FavoriteCocktail) {
  const favorites = getFavorites();
  const isFavorite = favorites.some((favorite) => favorite.id === cocktail.id);

  if (isFavorite) {
    saveFavorites(favorites.filter((favorite) => favorite.id !== cocktail.id));
  } else {
    // Wybieramy tylko potrzebne pola, nawet jeśli dostaliśmy cały obiekt z API.
    saveFavorites([favoriteCocktailSchema.parse(cocktail), ...favorites]);
  }
}
