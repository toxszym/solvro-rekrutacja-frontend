"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Jedno kliknięcie przełącza jasny/ciemny. Dopóki użytkownik nic nie kliknie,
 * obowiązuje motyw systemowy (defaultTheme="system" w Providers).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full"
      // Stały opis: `resolvedTheme` nie jest znany na serwerze, więc tekst zależny
      // od motywu różniłby się przy hydratacji.
      aria-label="Przełącz motyw jasny/ciemny"
      title="Przełącz motyw"
    >
      {/* Ikonę wybiera CSS (klasa .dark na <html>), a nie JS, z tego samego powodu. */}
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </Button>
  );
}
