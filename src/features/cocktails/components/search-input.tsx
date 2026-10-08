"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

type SearchInputProps = {
  /** Wartość z URL. */
  value: string;
  /** Wywoływane z opóźnieniem, gdy użytkownik przestanie pisać. */
  onChange: (value: string) => void;
};

export function SearchInput({ value: urlValue, onChange }: SearchInputProps) {
  // Pole ma własny stan, żeby pisanie było płynne. Do URL (i do API)
  // trafia dopiero wartość "uspokojona" przez debounce.
  const [value, setValue] = useState(urlValue);
  const debouncedValue = useDebounce(value, 300);

  // Gdy URL zmieni się z zewnątrz (przycisk "wstecz", "wyczyść filtry"),
  // aktualizujemy pole. Robimy to w trakcie renderu, a nie w useEffect,
  // zgodnie z zaleceniem Reacta dla stanu zależnego od propsów.
  const [prevUrlValue, setPrevUrlValue] = useState(urlValue);
  if (urlValue !== prevUrlValue) {
    setPrevUrlValue(urlValue);
    if (urlValue !== debouncedValue) setValue(urlValue);
  }

  // Wysyłamy zmianę tylko wtedy, gdy zmieniła się wartość po debounce.
  // Sama zmiana URL nie może nadpisać go starą wartością.
  const lastDebouncedValue = useRef(debouncedValue);
  useEffect(() => {
    if (debouncedValue === lastDebouncedValue.current) return;
    lastDebouncedValue.current = debouncedValue;
    if (debouncedValue !== urlValue) onChange(debouncedValue);
  }, [debouncedValue, urlValue, onChange]);

  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Szukaj koktajlu po nazwie…"
        aria-label="Szukaj koktajlu"
        className="h-10 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
          aria-label="Wyczyść wyszukiwanie"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
