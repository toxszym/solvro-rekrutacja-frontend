"use client";

import { SlidersHorizontalIcon, XIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { pluralize } from "@/lib/plural";
import { cn } from "@/lib/utils";
import {
  ALCOHOLIC_OPTIONS,
  type AlcoholicOption,
  type CocktailFilters,
} from "../filters";
import { useCategories, useCocktailsInfinite, useGlasses } from "../queries";
import { ALCOHOLIC_LABELS, type FiltersProps } from "./cocktail-filters";

// Krótsze niż w liście rozwijanej, żeby trzy segmenty zmieściły się na wąskim telefonie.
const SEGMENT_LABELS: Record<AlcoholicOption, string> = {
  all: "Wszystkie",
  alcoholic: "Z alkoholem",
  "non-alcoholic": "Bez alkoholu",
};

function countActive(filters: CocktailFilters) {
  return (
    Number(filters.category !== null) +
    Number(filters.glass !== null) +
    Number(filters.alcoholic !== "all")
  );
}

type MobileFiltersProps = FiltersProps & {
  onReset: () => void;
};

/**
 * Filtry na telefonie: przycisk w pasku wyszukiwania otwiera panel wysuwany z dołu.
 * Przycisk jest w przyklejonym pasku, więc filtry są pod ręką także w połowie listy.
 */
export function MobileFilters({ filters, onChange, onReset }: MobileFiltersProps) {
  const { data: categories = [] } = useCategories();
  const { data: glasses = [] } = useGlasses();
  // To samo zapytanie co lista (wspólny cache), więc licznik nic nie kosztuje.
  const { data, isPlaceholderData } = useCocktailsInfinite(filters);
  const total = data?.pages[0]?.meta.total;
  const activeCount = countActive(filters);

  // W panelu zmieniamy URL przez `replace`: kilka kliknięć z rzędu nie powinno
  // zostawiać kilku wpisów w historii przeglądarki.
  function change(changes: Partial<CocktailFilters>) {
    onChange(changes, { replace: true });
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={activeCount > 0 ? `Filtry (aktywne: ${activeCount})` : "Filtry"}
          className={cn(
            "relative flex size-9 shrink-0 items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:hidden",
            activeCount > 0
              ? "bg-foreground text-background"
              : "bg-muted text-foreground hover:bg-muted/70",
          )}
        >
          <SlidersHorizontalIcon className="size-4" aria-hidden />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums ring-2 ring-background">
              {activeCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          // dvh: wysokość liczona bez paska adresu przeglądarki, który na telefonie się chowa.
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-3xl border-t bg-background shadow-2xl duration-300 outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom sm:hidden"
        >
          <div
            className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-border"
            aria-hidden
          />
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <Dialog.Title className="font-heading text-2xl font-semibold">
              Filtry
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                className="-mr-2 rounded-full"
                aria-label="Zamknij filtry"
              >
                <XIcon className="size-5" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain py-4">
            <SheetGroup label="Alkohol">
              {/* Trzy równe segmenty zamiast chipów: opcje wykluczają się nawzajem. */}
              <div className="mx-5 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1">
                {ALCOHOLIC_OPTIONS.map((alcoholic) => {
                  const active = filters.alcoholic === alcoholic;

                  return (
                    <button
                      key={alcoholic}
                      type="button"
                      onClick={() => change({ alcoholic })}
                      aria-pressed={active}
                      className={cn(
                        "h-10 rounded-xl text-[13px] font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 min-[360px]:text-sm",
                        active
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground",
                      )}
                    >
                      {SEGMENT_LABELS[alcoholic]}
                    </button>
                  );
                })}
              </div>
            </SheetGroup>

            <SheetGroup label="Kategoria">
              <div className="flex flex-wrap gap-2 px-5">
                {categories.map((category) => (
                  <SheetChip
                    key={category}
                    active={filters.category === category}
                    onClick={() =>
                      change({
                        category: filters.category === category ? null : category,
                      })
                    }
                  >
                    {category}
                  </SheetChip>
                ))}
              </div>
            </SheetGroup>

            <SheetGroup label="Szkło">
              {/* Rodzajów szkła jest ponad 30, więc przewijają się w poziomie
                  w dwóch rzędach, zamiast zajmować cały panel. */}
              <div className="scrollbar-none overflow-x-auto px-5">
                <div className="grid w-max grid-flow-col grid-rows-2 gap-2">
                  {glasses.map((glass) => (
                    <SheetChip
                      key={glass}
                      active={filters.glass === glass}
                      onClick={() =>
                        change({ glass: filters.glass === glass ? null : glass })
                      }
                    >
                      {glass}
                    </SheetChip>
                  ))}
                </div>
              </div>
            </SheetGroup>
          </div>

          <div className="flex gap-2 border-t px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button
              variant="outline"
              onClick={onReset}
              disabled={activeCount === 0 && filters.search === ""}
              className="h-12 rounded-full px-5 text-base"
            >
              Wyczyść
            </Button>
            <Dialog.Close asChild>
              <Button
                className={cn(
                  "h-12 flex-1 rounded-full text-base transition-opacity",
                  isPlaceholderData && "opacity-70",
                )}
              >
                {total === undefined
                  ? "Pokaż wyniki"
                  : total === 0
                    ? "Brak wyników"
                    : `Pokaż ${pluralize(total, { one: "koktajl", few: "koktajle", many: "koktajli" })}`}
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SheetGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="space-y-2.5">
      <p className="px-5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

type SheetChipProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

function SheetChip({ active, onClick, children }: SheetChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "border-foreground bg-foreground text-background"
          : "bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Aktywne filtry jako chipy z "×" pod wyszukiwarką (tylko telefon): widać, co zawęża
 * wyniki, i każdy filtr da się zdjąć jednym dotknięciem, bez otwierania panelu.
 */
export function ActiveFilterChips({ filters, onChange }: FiltersProps) {
  const chips = [
    filters.alcoholic !== "all" && {
      label: ALCOHOLIC_LABELS[filters.alcoholic],
      clear: () => onChange({ alcoholic: "all" }),
    },
    filters.category !== null && {
      label: filters.category,
      clear: () => onChange({ category: null }),
    },
    filters.glass !== null && {
      label: filters.glass,
      clear: () => onChange({ glass: null }),
    },
  ].filter((chip) => chip !== false);

  if (chips.length === 0) return null;

  return (
    <ul className="-mx-4 scrollbar-none flex gap-2 overflow-x-auto px-4 sm:hidden">
      {chips.map((chip) => (
        <li key={chip.label} className="shrink-0">
          <button
            type="button"
            onClick={chip.clear}
            aria-label={`Usuń filtr: ${chip.label}`}
            className="flex h-9 items-center gap-1.5 rounded-full bg-foreground pr-2.5 pl-3.5 text-sm font-medium text-background"
          >
            {chip.label}
            <XIcon className="size-3.5" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}
