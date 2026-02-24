import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

// Tipo inferido do Drizzle — exportado para uso nas pages e componentes
export type Category = typeof categoryTable.$inferSelect;

export const getCategories = async (): Promise<Category[]> => {
  const categories = await db.query.categoryTable.findMany();
  return categories;
};

export const getCategoryBySlug = async (
  slug: string
): Promise<Category | undefined> => {
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  return category;
};
