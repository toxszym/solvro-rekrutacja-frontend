import type { z } from "zod";

export const API_URL = "https://cocktails.solvro.pl/api/v1";

/** Błąd HTTP z API. Trzymamy status, żeby np. odróżnić 404 od awarii serwera. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildUrl(path: string, params?: QueryParams) {
  const url = new URL(`${API_URL}${path}`);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

/**
 * Wykonuje GET do API i waliduje odpowiedź schematem zod.
 * Dzięki temu typ wyniku wynika ze schematu, a nie z założenia,
 * że API zawsze zwróci to, czego się spodziewamy.
 */
export async function apiGet<TSchema extends z.ZodType>(
  path: string,
  schema: TSchema,
  options: { params?: QueryParams; signal?: AbortSignal } = {},
): Promise<z.infer<TSchema>> {
  const response = await fetch(buildUrl(path, options.params), {
    signal: options.signal,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.status}`);
  }

  return schema.parse(await response.json());
}
