import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { FavoritesList } from "@/features/favorites/favorites-list";

export const metadata: Metadata = {
  title: "Ulubione",
};

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Twoja kolekcja"
        title="Ulubione"
        description="Koktajle oznaczone serduszkiem. Zapisują się w tej przeglądarce, więc działają nawet offline."
      />
      <FavoritesList />
    </div>
  );
}
