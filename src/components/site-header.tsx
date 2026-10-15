import Link from "next/link";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    // Header "pływa" nad treścią jako zaokrąglona belka, zamiast paska na całą szerokość.
    // Zaokrąglenie jak w pasku wyszukiwania, który przykleja się tuż pod nim.
    <header className="sticky top-3 z-40 page-container mt-3">
      <div className="flex h-14 items-center justify-between gap-3 rounded-2xl border bg-background/80 pr-2 pl-4 shadow-sm backdrop-blur-md">
        <Link href="/" className="group rounded-lg" aria-label="Shaker – strona główna">
          <Logo />
        </Link>

        <div className="flex items-center gap-1">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
