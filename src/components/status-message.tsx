import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatusMessageProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

/** Komunikat na środku strony: pusta lista, błąd, brak ulubionych itp. */
export function StatusMessage({
  icon: Icon,
  title,
  description,
  action,
}: StatusMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card px-6 py-16 text-center shadow-xs">
      <div className="mb-2 flex size-16 items-center justify-center rounded-2xl bg-muted text-primary">
        <Icon className="size-7" aria-hidden />
      </div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description && <p className="max-w-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
