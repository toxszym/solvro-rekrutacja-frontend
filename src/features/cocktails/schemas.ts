import { z } from "zod";

export const cocktailSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  glass: z.string(),
  instructions: z.string(),
  imageUrl: z.string().nullable(),
  alcoholic: z.boolean(),
});

export const ingredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  alcohol: z.boolean(),
  type: z.string().nullable(),
  percentage: z.number().nullable(),
  imageUrl: z.string().nullable(),
  // Ilość składnika w danym koktajlu, np. "1 oz". Nie zawsze jest podana.
  measure: z.string().nullish(),
});

export const cocktailDetailsSchema = cocktailSchema.extend({
  ingredients: z.array(ingredientSchema),
});

const paginationMetaSchema = z.object({
  total: z.number(),
  perPage: z.number(),
  currentPage: z.number(),
  lastPage: z.number(),
});

export const cocktailsPageSchema = z.object({
  meta: paginationMetaSchema,
  data: z.array(cocktailSchema),
});

export const cocktailDetailsResponseSchema = z.object({
  data: cocktailDetailsSchema,
});

export const ingredientResponseSchema = z.object({
  data: ingredientSchema,
});

/** Lista koktajli z `?ingredients=true`, z której potrzebujemy tylko ID składników. */
export const cocktailIngredientIdsPageSchema = z.object({
  meta: paginationMetaSchema,
  data: z.array(z.object({ ingredients: z.array(z.object({ id: z.number() })) })),
});

export const stringListResponseSchema = z.object({
  data: z.array(z.string()),
});

export type Cocktail = z.infer<typeof cocktailSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type CocktailDetails = z.infer<typeof cocktailDetailsSchema>;
export type CocktailsPage = z.infer<typeof cocktailsPageSchema>;
