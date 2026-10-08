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
import {
  type AlcoholicOption,
  type CocktailFilters as Filters,
  hasActiveFilters,
  type SortOption,
} from "../filters";
import { useCategories, useGlasses } from "../queries";
import { SearchInput } from "./search-input";

// Radix Select nie pozwala na pustą wartość, więc "brak filtra" to "all".
const ALL = "all";

const ALCOHOLIC_LABELS: Record<AlcoholicOption, string> = {
  all: "Wszystkie",
  alcoholic: "Alkoholowe",
  "non-alcoholic": "Bezalkoholowe",
};

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Nazwa A–Z",
  "name-desc": "Nazwa Z–A",
};

type CocktailFiltersProps = {
  filters: Filters;
  onChange: (changes: Partial<Filters>, options?: { replace?: boolean }) => void;
  onReset: () => void;
};

export function CocktailFilters({ filters, onChange, onReset }: CocktailFiltersProps) {
  const { data: categories = [] } = useCategories();
  const { data: glasses = [] } = useGlasses();

  return (
    <div className="space-y-3">
      <SearchInput
        value={filters.search}
        onChange={(search) => onChange({ search }, { replace: true })}
      />

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <FilterSelect
          label="Kategoria"
          value={filters.category ?? ALL}
          onValueChange={(value) => onChange({ category: value === ALL ? null : value })}
          options={[
            { value: ALL, label: "Wszystkie kategorie" },
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
          label="Rodzaj"
          value={filters.alcoholic}
          onValueChange={(value) => onChange({ alcoholic: value as AlcoholicOption })}
          options={Object.entries(ALCOHOLIC_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <FilterSelect
          label="Sortowanie"
          value={filters.sort}
          onValueChange={(value) => onChange({ sort: value as SortOption })}
          options={Object.entries(SORT_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />

        {hasActiveFilters(filters) && (
          <Button variant="ghost" onClick={onReset} className="col-span-2 sm:ml-auto">
            <FilterXIcon />
            Wyczyść filtry
          </Button>
        )}
      </div>
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
};

function FilterSelect({ label, value, onValueChange, options }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={label} className="w-full sm:w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
