"use client";

import { FilterXIcon } from "lucide-react";
import type { ReactNode } from "react";
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
  TECHNIQUE_OPTIONS,
  type TechniqueOption,
} from "../filters";
import { useCategories, useGlasses } from "../queries";
import { SearchInput } from "./search-input";

// Radix Select nie pozwala na pustą wartość, więc "brak filtra" to "all".
const ALL = "all";

const ALCOHOLIC_LABELS: Record<AlcoholicOption, string> = {
  all: "Z alkoholem i bez",
  alcoholic: "Alkoholowe",
  "non-alcoholic": "Bezalkoholowe",
};

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Nazwa A–Z",
  "name-desc": "Nazwa Z–A",
  newest: "Najnowsze",
};

const TECHNIQUE_LABELS: Record<TechniqueOption, string> = {
  shake: "Wstrząsane",
  stir: "Mieszane",
  blend: "Blendowane",
  muddle: "Ugniatane",
};

type FiltersProps = {
  filters: Filters;
  onChange: (changes: Partial<Filters>, options?: { replace?: boolean }) => void;
};

/** Wyszukiwarka, kategorie i technika (chipy) oraz filtry szkła i alkoholu. */
export function CocktailFilters({ filters, onChange }: FiltersProps) {
  const { data: glasses = [] } = useGlasses();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex-1">
          <SearchInput
            value={filters.search}
            onChange={(search) => onChange({ search }, { replace: true })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:flex">
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
      </div>

      <CategoryChips
        value={filters.category}
        onChange={(category) => onChange({ category })}
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Technika:</span>
        {TECHNIQUE_OPTIONS.map((technique) => (
          <Chip
            key={technique}
            active={filters.technique === technique}
            // Ponowne kliknięcie aktywnego chipa wyłącza filtr.
            onClick={() =>
              onChange({ technique: filters.technique === technique ? null : technique })
            }
          >
            {TECHNIQUE_LABELS[technique]}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function CategoryChips({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (category: string | null) => void;
}) {
  const { data: categories = [] } = useCategories();

  const chips: { value: string | null; label: string }[] = [
    { value: null, label: "Wszystkie" },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  return (
    // Chipy przewijają się w poziomie; maska wygasza krawędzie, sugerując że jest ich więcej.
    <div
      className="-mx-4 scrollbar-none overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-2rem),transparent)] px-4 sm:mx-0 sm:[mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)] sm:px-0"
      role="group"
      aria-label="Kategoria"
    >
      <div className="flex w-max gap-2">
        {chips.map((chip) => (
          <Chip
            key={chip.label}
            active={chip.value === value}
            onClick={() => onChange(chip.value)}
          >
            {chip.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

type ChipProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
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
          "w-full rounded-xl bg-card data-[size=default]:h-11 lg:w-52",
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
