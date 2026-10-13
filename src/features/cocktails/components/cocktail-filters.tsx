"use client";

import { FilterXIcon } from "lucide-react";
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
import { useCategories, useGlasses } from "../queries";

// Radix Select nie pozwala na pustą wartość, więc "brak filtra" to "all".
const ALL = "all";

export const ALCOHOLIC_LABELS: Record<AlcoholicOption, string> = {
  all: "Każdy rodzaj",
  alcoholic: "Alkoholowe",
  "non-alcoholic": "Bezalkoholowe",
};

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Nazwa A–Z",
  "name-desc": "Nazwa Z–A",
  newest: "Najnowsze",
};

export type FiltersProps = {
  filters: Filters;
  onChange: (changes: Partial<Filters>, options?: { replace?: boolean }) => void;
};

/**
 * Filtry na większych ekranach: trzy listy rozwijane pod wyszukiwarką.
 * Na telefonie zastępuje je panel wysuwany z dołu (MobileFilters).
 */
export function CocktailFilters({ filters, onChange }: FiltersProps) {
  const { data: categories = [] } = useCategories();
  const { data: glasses = [] } = useGlasses();

  return (
    <div className="hidden gap-2 sm:grid sm:grid-cols-3 lg:flex">
      <FilterSelect
        label="Kategoria"
        value={filters.category ?? ALL}
        onValueChange={(value) => onChange({ category: value === ALL ? null : value })}
        options={[
          { value: ALL, label: "Każda kategoria" },
          ...categories.map((category) => ({ value: category, label: category })),
        ]}
      />
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
        className="w-36 lg:w-36"
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
          "w-full rounded-xl bg-card data-[size=default]:h-11 lg:w-56",
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
