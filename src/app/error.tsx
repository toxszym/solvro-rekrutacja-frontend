"use client";

import { TriangleAlertIcon } from "lucide-react";
import { useEffect } from "react";
import { StatusMessage } from "@/components/status-message";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/** Łapie nieobsłużone błędy podstron (np. awarię API), żeby nie pokazywać pustego ekranu. */
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusMessage
      icon={TriangleAlertIcon}
      title="Coś poszło nie tak"
      description="Nie udało się wczytać tej strony. Sprawdź połączenie z internetem i spróbuj ponownie."
      action={<Button onClick={() => retry()}>Spróbuj ponownie</Button>}
    />
  );
}
