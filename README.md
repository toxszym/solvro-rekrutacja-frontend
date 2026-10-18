# Shaker

Aplikacja webowa do przeglądania koktajli, zrobiona jako zadanie rekrutacyjne do KN Solvro.
Dane pochodzą z [Cocktails API](https://cocktails.solvro.pl).

**Wersja online:** https://szymon.r.tox.pl

## Funkcje

- **Lista koktajli** z infinite scrollem
- **Wyszukiwanie po nazwie** z debouncingiem (jedno zapytanie po skończeniu pisania, a nie po każdej literze)
- **Filtrowanie** po kategorii, rodzaju szkła i zawartości alkoholu oraz **sortowanie** po nazwie
  lub od najnowszych; na telefonie filtry są w panelu wysuwanym z dołu
- **Przyklejona wyszukiwarka** – przy przewijaniu listy zostaje pod nagłówkiem, więc nie trzeba
  wracać na górę
- **Filtry zapisane w URL** – link z wynikami można komuś wysłać, a przycisk „wstecz” działa
- **Szczegóły koktajlu** – składniki z miarami, typem i procentem alkoholu, sposób przygotowania
- **Kopiowanie linku** do koktajlu jednym kliknięciem
- **Strony składników** – opis, typ i moc oraz wszystkie koktajle z danym składnikiem
- **Ulubione** zapisywane w `localStorage`, z osobną stroną i licznikiem w nawigacji
- **Jasny i ciemny motyw** (domyślnie ciemny, wybór zapamiętywany w przeglądarce)
- **Cache danych** zapisywany w przeglądarce – po ponownym wejściu lista pokazuje się od razu,
  nawet gdy API jest niedostępne
- **Animacje** (z poszanowaniem ustawienia „ogranicz ruch” w systemie)
- **Responsywność** – od telefonu po duży monitor

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [TanStack Query](https://tanstack.com/query) – pobieranie i cache danych
- [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS 4, kroje Geist i Bricolage Grotesque
- [zod](https://zod.dev) – walidacja odpowiedzi API
- [next-themes](https://github.com/pacocoursey/next-themes), [Motion](https://motion.dev)

## Decyzje techniczne

**Walidacja API przez zod.** Typy TypeScript wynikają ze schematów, a odpowiedź jest sprawdzana
w runtime. Jeśli API zwróci coś innego niż zakładamy, dostaniemy czytelny błąd zamiast
`undefined` gdzieś w środku komponentu.

**URL jako źródło prawdy dla filtrów.** Zamiast trzymać filtry w stanie Reacta, czytam je
z `useSearchParams`. Dzięki temu nie trzeba ich nigdzie synchronizować, a odświeżenie strony
niczego nie gubi.

**Ulubione bez biblioteki do stanu.** Store to kilkadziesiąt linijek nad `localStorage`,
podpięty do Reacta przez `useSyncExternalStore`. Nie potrzeba Providera, nie ma problemów
z hydratacją, a zmiany synchronizują się między kartami przeglądarki.
Zapisuję też podstawowe dane koktajlu, więc strona ulubionych nie robi żadnych zapytań.

**Strony szczegółów generowane przy buildzie.** `generateStaticParams` tworzy stronę dla każdego
koktajlu, więc wchodzi się na gotowy HTML (szybko i dobrze dla SEO).
Na serwerze Node strony odświeżają się raz na dobę (ISR).

**Strony składników tylko dla użytych składników.** API ma ponad 500 składników, ale w koktajlach
występuje ok. 160. Przy buildzie generuję strony tylko dla nich, bo tylko do nich prowadzą linki.

**Uwaga o danych z API.** Składniki bez uzupełnionego pola `type` mają zawsze `alcohol: true`
(np. sok z limonki), więc w takim przypadku aplikacja nie pokazuje informacji o alkoholu.

## Struktura

```
src/
  app/                  # trasy: lista, /cocktails/[id], /favorites
  components/           # wspólne komponenty (header, nawigacja, motyw)
    ui/                 # komponenty shadcn/ui
  features/
    cocktails/          # API, schematy, filtry, zapytania i komponenty koktajli
    favorites/          # store ulubionych, hook i komponenty
  hooks/                # useDebounce, useInView, useIsClient
  lib/                  # klient API
```

## Uruchomienie

Wymagany Node.js 20+.

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem http://localhost:3000.

Pozostałe skrypty: `npm run lint`, `npm run typecheck`, `npm run format`.

## Wdrożenie

Aplikację można wdrożyć na dwa sposoby:

**Serwer Node.js** (np. Vercel albo hosting z obsługą Node):

```bash
npm run build
npm start
```

**Statyczne pliki** (dowolny hosting, np. Apache / DirectAdmin bez Node):

```bash
npm run build:static
```

Zawartość katalogu `out/` (razem z plikiem `.htaccess`) wystarczy wrzucić do `public_html`.
W tej wersji nowe koktajle dodane do API pojawią się dopiero po ponownym buildzie.
