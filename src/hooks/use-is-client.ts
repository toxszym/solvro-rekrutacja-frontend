import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * `false` podczas renderu na serwerze i hydratacji, potem `true`.
 * Przydaje się, gdy treść zależy od localStorage i nie chcemy
 * pokazać mylącego stanu (np. "brak ulubionych") przed jego odczytem.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
