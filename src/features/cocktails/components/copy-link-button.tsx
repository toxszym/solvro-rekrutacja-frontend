"use client";

import { CheckIcon, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** Kopiuje adres bieżącej strony do schowka i na chwilę potwierdza to na przycisku. */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Schowek bywa zablokowany (np. strona otwarta po http). Wtedy pokazujemy
      // adres w oknie, z którego da się go skopiować ręcznie.
      window.prompt("Skopiuj link:", window.location.href);
    }
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleClick}
      className="h-11 rounded-full px-5"
    >
      {copied ? <CheckIcon className="text-emerald-600" /> : <LinkIcon />}
      <span aria-live="polite">{copied ? "Skopiowano" : "Udostępnij"}</span>
    </Button>
  );
}
