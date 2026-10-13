import Link from "next/link";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    // Header "pływa" nad treścią jako zaokrąglona belka, zamiast paska na całą szerokość.
    <header className="sticky top-3 z-40 page-container mt-3">
      <div className="flex h-14 items-center justify-between gap-3 rounded-full border bg-background/80 pr-2 pl-5 shadow-sm backdrop-blur-md">
        <Link href="/" className="group rounded-full" aria-label="Shaker – strona główna">
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
