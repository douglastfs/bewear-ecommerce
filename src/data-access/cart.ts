import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";

import type { Product, ProductVariant } from "./product";
import type { ShippingAddress } from "./shipping-address";

// Tipos inferidos do Drizzle
export type Cart = typeof cartTable.$inferSelect;
export type CartItem = typeof cartItemTable.$inferSelect;

// Tipo do item com variante (sem product, usado no finish-order)
export type CartItemWithVariant = CartItem & {
  productVariant: ProductVariant;
};

// Tipo do carrinho com itens e variantes (para finish-order)
export type CartWithItemsAndAddress = Cart & {
  shippingAddress: ShippingAddress | null;
  items: CartItemWithVariant[];
};

// Tipo do item do carrinho com variante e produto aninhados
export type CartItemWithDetails = CartItem & {
  productVariant: ProductVariant & {
    product: Product;
  };
};

// Tipo do carrinho completo com endereço e itens detalhados
export type CartWithDetails = Cart & {
  shippingAddress: ShippingAddress | null;
  items: CartItemWithDetails[];
};

// === LEITURA ===

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

export const getCartWithItemsAndAddress = async (
  userId: string
): Promise<CartWithItemsAndAddress | undefined> => {
  return db.query.cartTable.findFirst({
    where: eq(cartTable.userId, userId),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });
};

export const getCartSimpleByUserId = async (
  userId: string
): Promise<Cart | undefined> => {
  return db.query.cartTable.findFirst({
    where: eq(cartTable.userId, userId),
  });
};

export const getCartItemByCartAndVariant = async (
  cartId: string,
  productVariantId: string
): Promise<CartItem | undefined> => {
  return db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      and(
        eq(cartItem.cartId, cartId),
        eq(cartItem.productVariantId, productVariantId)
      ),
  });
};

export type CartItemWithCart = CartItem & {
  cart: Cart;
};

export const getCartItemById = async (
  cartItemId: string
): Promise<CartItemWithCart | undefined> => {
  return db.query.cartItemTable.findFirst({
    where: eq(cartItemTable.id, cartItemId),
    with: {
      cart: true,
    },
  });
};

// === ESCRITA ===

export const createCart = async (userId: string): Promise<Cart> => {
  const [cart] = await db.insert(cartTable).values({ userId }).returning();
  return cart;
};

export const createCartItem = async (
  cartId: string,
  productVariantId: string,
  quantity: number
): Promise<void> => {
  await db.insert(cartItemTable).values({
    cartId,
    productVariantId,
    quantity,
  });
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
): Promise<void> => {
  await db
    .update(cartItemTable)
    .set({ quantity })
    .where(eq(cartItemTable.id, cartItemId));
};

export const updateCartShippingAddressId = async (
  cartId: string,
  shippingAddressId: string
): Promise<Cart> => {
  const [cart] = await db
    .update(cartTable)
    .set({ shippingAddressId })
    .where(eq(cartTable.id, cartId))
    .returning();
  return cart;
};

export const deleteCartItem = async (cartItemId: string): Promise<void> => {
  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItemId));
};

export const deleteCartByUserId = async (userId: string): Promise<void> => {
  await db.delete(cartTable).where(eq(cartTable.userId, userId));
};

export const deleteCartItemsByCartId = async (
  cartId: string
): Promise<void> => {
  await db.delete(cartItemTable).where(eq(cartItemTable.cartId, cartId));
};
