"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

const ONE_DAY = 24 * 60 * 60 * 1000;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        // Dane muszą żyć w pamięci co najmniej tyle, ile w localStorage,
        // inaczej zostałyby usunięte zanim zdążymy je zapisać.
        gcTime: ONE_DAY,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

function getLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

let browserQueryClient: QueryClient | undefined;
let browserPersister: ReturnType<typeof createAsyncStoragePersister> | undefined;

function getQueryClient() {
  // Na serwerze nowy klient dla każdego renderu, żeby dane nie wyciekały
  // między użytkownikami. W przeglądarce jeden klient na całą sesję.
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

/**
 * Cache zapytań zapisywany w localStorage. Po ponownym wejściu na stronę
 * dane są od razu widoczne (także offline), a w tle sprawdzamy, czy są aktualne.
 */
function getPersister() {
  // Na serwerze storage = undefined, więc persister nic nie robi.
  if (typeof window === "undefined")
    return createAsyncStoragePersister({ storage: undefined });
  browserPersister ??= createAsyncStoragePersister({
    storage: getLocalStorage(),
    key: "cocktails:query-cache",
  });
  return browserPersister;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <PersistQueryClientProvider
        client={getQueryClient()}
        persistOptions={{
          persister: getPersister(),
          maxAge: ONE_DAY,
          // Zmiana tej wartości unieważnia stary cache (np. po zmianie schematów danych).
          buster: "v1",
        }}
      >
        {/* reducedMotion="user": wyłącza animacje, jeśli użytkownik ma to ustawione w systemie. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
