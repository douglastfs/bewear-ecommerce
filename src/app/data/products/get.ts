// DTO (Data Transfer Object)

import { desc } from "drizzle-orm";

import { db } from "@/db";
import { productTable } from "@/db/schema";

// DTO (Data Transfer Object)
// interface ProductDto {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   price: number;
//   image: string;
//   category: string;
//   variants: ProductVariant[];
// }

export const getProductsWithVariants = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  return products;
};

export const getNewlyCreatedProducts = async () => {
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return newlyCreatedProducts;
};
