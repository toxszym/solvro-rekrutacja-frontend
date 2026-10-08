import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=true buduje aplikację jako zwykłe pliki HTML/CSS/JS (katalog out/),
 * które można wrzucić na dowolny hosting, np. DirectAdmin bez Node.js.
 * Bez tej zmiennej to standardowa aplikacja Next.js (`next start`).
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  // Ładne adresy na Apache: /cocktails/11003/ -> /cocktails/11003/index.html
  trailingSlash: isStaticExport,
  images: {
    // Optymalizacja obrazków wymaga serwera Node.js.
    unoptimized: isStaticExport,
    remotePatterns: [new URL("https://cocktails.solvro.pl/images/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
