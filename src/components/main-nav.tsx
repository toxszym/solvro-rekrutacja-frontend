"use client";

import { HeartIcon, LayoutGridIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useFavorites } from "@/features/favorites/use-favorites";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  return (
    <nav className="flex items-center gap-1 text-sm">
      <NavLink href="/" icon={LayoutGridIcon} active={pathname === "/"}>
        <span className="sr-only sm:not-sr-only">Przeglądaj</span>
      </NavLink>
      <NavLink
        href="/favorites"
        icon={HeartIcon}
        active={pathname.startsWith("/favorites")}
      >
        <span className="sr-only sm:not-sr-only">Ulubione</span>
        {favorites.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums">
            {favorites.length}
          </span>
        )}
      </NavLink>
    </nav>
  );
}

type NavLinkProps = {
  href: string;
  icon: LucideIcon;
  active: boolean;
  children: ReactNode;
};

function NavLink({ href, icon: Icon, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-medium transition-colors sm:px-3",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden />
      {children}
    </Link>
  );
}
