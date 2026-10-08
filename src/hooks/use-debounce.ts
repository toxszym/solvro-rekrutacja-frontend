import { useEffect, useState } from "react";

/** Zwraca `value`, ale dopiero gdy przez `delay` ms się nie zmieniała. */
export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // Każda zmiana `value` kasuje poprzedni timer, więc wolno "przechodzi" tylko ostatnia.
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
