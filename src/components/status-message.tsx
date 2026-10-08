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
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="rounded-full bg-muted p-4 text-muted-foreground">
        <Icon className="size-8" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
