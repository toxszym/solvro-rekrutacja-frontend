import type { Metadata } from "next";
import { FavoritesList } from "@/features/favorites/favorites-list";

export const metadata: Metadata = {
  title: "Ulubione",
};

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Ulubione</h1>
        <p className="text-muted-foreground">
          Koktajle, które oznaczyłeś serduszkiem. Zapisują się w tej przeglądarce.
        </p>
      </div>
      <FavoritesList />
    </div>
  );
}
