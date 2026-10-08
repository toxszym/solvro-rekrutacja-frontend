import { MartiniIcon } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MartiniIcon className="size-5 text-primary" aria-hidden />
          Koktajle
        </Link>
      </div>
    </header>
  );
}
