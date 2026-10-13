"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Wraca do poprzedniej strony, żeby zachować filtry i pozycję na liście.
 * Gdy ktoś wszedł bezpośrednio z linku (brak historii), przenosi na stronę główną.
 */
export function BackButton() {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="-ml-3 rounded-full text-muted-foreground hover:text-foreground"
    >
      <ArrowLeftIcon />
      Wróć do listy
    </Button>
  );
}
