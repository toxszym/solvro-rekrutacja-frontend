import { cn } from "@/lib/utils";

/** Ikona shakera. Własny SVG, bo w lucide nie ma pasującej. */
export function ShakerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* nakrętka, sitko i kubek */}
      <path d="M10 2h4v3h-4z" />
      <path d="M8.5 5h7L17 9H7z" />
      <path d="M7 9h10l-1.3 11.1a1 1 0 0 1-1 .9H9.3a1 1 0 0 1-1-.9z" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <ShakerIcon className="size-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
      <span className="font-heading text-xl font-bold tracking-tight lowercase">
        Shaker
      </span>
    </span>
  );
}
