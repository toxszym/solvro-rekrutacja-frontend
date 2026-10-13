"use client";

import { FilterXIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  type AlcoholicOption,
  type CocktailFilters as Filters,
  hasActiveFilters,
  type SortOption,
} from "../filters";
import { useGlasses } from "../queries";

// Radix Select nie pozwala na pustą wartość, więc "brak filtra" to "all".
const ALL = "all";

const ALCOHOLIC_LABELS: Record<AlcoholicOption, string> = {
  all: "Każdy rodzaj",
  alcoholic: "Alkoholowe",
  "non-alcoholic": "Bezalkoholowe",
};

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Nazwa A–Z",
  "name-desc": "Nazwa Z–A",
  newest: "Najnowsze",
};

type FiltersProps = {
  filters: Filters;
  onChange: (changes: Partial<Filters>, options?: { replace?: boolean }) => void;
};

/** Filtry szkła i alkoholu. Wyszukiwarka jest osobno, bo przykleja się do góry ekranu. */
export function CocktailFilters({ filters, onChange }: FiltersProps) {
  const { data: glasses = [] } = useGlasses();

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
      <FilterSelect
        label="Szkło"
        value={filters.glass ?? ALL}
        onValueChange={(value) => onChange({ glass: value === ALL ? null : value })}
        options={[
          { value: ALL, label: "Każde szkło" },
          ...glasses.map((glass) => ({ value: glass, label: glass })),
        ]}
      />
      <FilterSelect
        label="Alkohol"
        value={filters.alcoholic}
        onValueChange={(value) => onChange({ alcoholic: value as AlcoholicOption })}
        options={Object.entries(ALCOHOLIC_LABELS).map(([value, label]) => ({
          value,
          label,
        }))}
      />

      {/* Kategorię ustawiają skróty na górze strony. Tu tylko widać, że jest aktywna,
          i można ją zdjąć. */}
      {filters.category && (
        <button
          type="button"
          onClick={() => onChange({ category: null })}
          aria-label={`Usuń filtr kategorii: ${filters.category}`}
          className="col-span-2 flex h-11 items-center justify-between gap-2 rounded-xl bg-foreground pr-3 pl-4 text-sm font-medium text-background transition-opacity hover:opacity-85 sm:justify-start"
        >
          <span className="truncate">{filters.category}</span>
          <XIcon className="size-4 shrink-0" aria-hidden />
        </button>
      )}
    </div>
  );
}

type ResultsToolbarProps = {
  filters: Filters;
  onChange: FiltersProps["onChange"];
  onReset: () => void;
};

/** Sortowanie i czyszczenie filtrów, wyświetlane obok liczby wyników. */
export function ResultsToolbar({ filters, onChange, onReset }: ResultsToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      {hasActiveFilters(filters) && (
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
          <FilterXIcon />
          <span className="hidden sm:inline">Wyczyść filtry</span>
        </Button>
      )}
      <FilterSelect
        label="Sortowanie"
        value={filters.sort}
        onValueChange={(value) => onChange({ sort: value as SortOption })}
        options={Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }))}
        className="w-36 sm:w-36"
      />
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
};

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
  className,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "w-full rounded-xl bg-card data-[size=default]:h-11 sm:w-52",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-80">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
