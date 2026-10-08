import { DEFAULT_FILTERS } from "@/features/cocktails/filters";
import { CocktailList } from "@/features/cocktails/components/cocktail-list";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Koktajle</h1>
        <p className="text-muted-foreground">
          Znajdź coś dla siebie na dzisiejszy wieczór.
        </p>
      </div>
      <CocktailList filters={DEFAULT_FILTERS} />
    </div>
  );
}
