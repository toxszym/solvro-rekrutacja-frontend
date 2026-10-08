import { GlassWaterIcon } from "lucide-react";
import Link from "next/link";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StatusMessage
      icon={GlassWaterIcon}
      title="Nie znaleziono strony"
      description="Ten kieliszek jest pusty. Strona, której szukasz, nie istnieje."
      action={
        <Button asChild>
          <Link href="/">Wróć do listy koktajli</Link>
        </Button>
      }
    />
  );
}
