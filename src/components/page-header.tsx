import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
};

/** Nagłówek podstron: mały napis nad tytułem, tytuł i opis. */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  );
}
