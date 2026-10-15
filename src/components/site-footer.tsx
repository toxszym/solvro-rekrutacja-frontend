import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="page-container mt-20 pb-8">
      <div className="flex flex-col gap-6 rounded-3xl border bg-card px-6 py-8 shadow-xs sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted-foreground">Pij odpowiedzialnie.</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Przepisy z{" "}
          <a
            href="https://cocktails.solvro.pl"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
          >
            Cocktails API
          </a>
          , kod:{" "}
          <a
            href="https://github.com/toxszym"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
          >
            Szymon
          </a>
        </p>
      </div>
    </footer>
  );
}
