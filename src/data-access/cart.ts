import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";

import type { Product, ProductVariant } from "./product";
import type { ShippingAddress } from "./shipping-address";

// Tipos inferidos do Drizzle
export type Cart = typeof cartTable.$inferSelect;
export type CartItem = typeof cartItemTable.$inferSelect;

// Tipo do item do carrinho com variante e produto aninhados
export type CartItemWithDetails = CartItem & {
  productVariant: ProductVariant & {
    product: Product;
  };
};

// Tipo do carrinho completo com endereço e itens
export type CartWithDetails = Cart & {
  shippingAddress: ShippingAddress | null;
  items: CartItemWithDetails[];
};

export const getCartByUserId = async (
  userId: string
): Promise<CartWithDetails | undefined> => {
  return db.query.cartTable.findFirst({
    where: eq(cartTable.userId, userId),
    with: {
      shippingAddress: true,
      items: {
        orderBy: asc(cartItemTable.createdAt),
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
};
