import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  productTable,
  productVariantImageTable,
  productVariantTable,
} from "@/db/schema";

// Tipos inferidos do Drizzle — exportados para uso nas pages e componentes
export type Product = typeof productTable.$inferSelect;
export type ProductVariant = typeof productVariantTable.$inferSelect;
export type ProductVariantImage = typeof productVariantImageTable.$inferSelect;
export type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

export const getProductsWithVariants = async (): Promise<
  ProductWithVariants[]
> => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  return products;
};

export const getNewlyCreatedProducts = async (): Promise<
  ProductWithVariants[]
> => {
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return newlyCreatedProducts;
};

// Tipo para a page de detalhe: variante com produto, variantes e imagens de galeria
export type ProductVariantWithProduct = ProductVariant & {
  images: ProductVariantImage[];
  product: Product & {
    variants: ProductVariant[];
  };
};

export const getProductVariantBySlug = async (
  slug: string
): Promise<ProductVariantWithProduct | undefined> => {
  return db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.displayOrder)],
      },
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
};

export const getProductVariantById = async (
  id: string
): Promise<ProductVariant | undefined> => {
  return db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.id, id),
  });
};

export const getProductsByCategoryId = async (
  categoryId: string
): Promise<ProductWithVariants[]> => {
  return db.query.productTable.findMany({
    where: eq(productTable.categoryId, categoryId),
    with: {
      variants: true,
    },
  });
};
