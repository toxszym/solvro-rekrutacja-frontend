"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/features/favorites/use-favorites";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  return (
    <nav className="flex items-center gap-1 text-sm">
      <NavLink href="/" active={pathname === "/"}>
        Koktajle
      </NavLink>
      <NavLink href="/favorites" active={pathname === "/favorites"}>
        Ulubione
        {favorites.length > 0 && (
          <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-xs leading-none text-primary-foreground tabular-nums">
            {favorites.length}
          </span>
        )}
      </NavLink>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center rounded-md px-3 py-1.5 transition-colors hover:bg-muted",
        active ? "font-medium text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </Link>
  );
}
