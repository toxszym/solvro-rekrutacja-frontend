import { useCallback, useState } from "react";

/**
 * Zwraca ref do podpięcia pod element i informację, czy element jest widoczny.
 * `rootMargin` pozwala reagować wcześniej, zanim element faktycznie wejdzie na ekran.
 */
export function useInView(rootMargin = "0px") {
  const [isInView, setIsInView] = useState(false);

  // Callback ref: React wywołuje go z elementem po zamontowaniu,
  // a zwrócona funkcja sprząta observer przy odmontowaniu.
  const ref = useCallback(
    (node: Element | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => setIsInView(entry.isIntersecting),
        { rootMargin },
      );
      observer.observe(node);

      return () => observer.disconnect();
    },
    [rootMargin],
  );

  return { ref, isInView };
}
