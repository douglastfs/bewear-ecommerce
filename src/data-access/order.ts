import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  cartItemTable,
  cartTable,
  orderItemTable,
  orderTable,
} from "@/db/schema";

import type { Product, ProductVariant } from "./product";

// Tipos inferidos do Drizzle
export type Order = typeof orderTable.$inferSelect;
export type OrderItem = typeof orderItemTable.$inferSelect;
export type NewOrderItem = typeof orderItemTable.$inferInsert;

// Tipo completo: pedido com itens, variantes e produtos
export type OrderItemWithDetails = OrderItem & {
  productVariant: ProductVariant & {
    product: Product;
  };
};

export type OrderWithItems = Order & {
  items: OrderItemWithDetails[];
};

// === LEITURA ===

export const getOrdersByUserId = async (
  userId: string
): Promise<OrderWithItems[]> => {
  return db.query.orderTable.findMany({
    where: eq(orderTable.userId, userId),
    orderBy: desc(orderTable.createdAt),
    with: {
      items: {
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

export const getOrderById = async (
  orderId: string
): Promise<Order | undefined> => {
  return db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });
};

export const getOrderItemsByOrderId = async (
  orderId: string
): Promise<OrderItemWithDetails[]> => {
  return db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: {
        with: {
          product: true,
        },
      },
    },
  });
};

// === ESCRITA ===

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<void> => {
  await db.update(orderTable).set({ status }).where(eq(orderTable.id, orderId));
};

/**
 * Cria um pedido com seus itens em uma transação atômica.
 * Também limpa o carrinho e seus itens.
 */
export const createOrderWithItems = async (
  orderData: typeof orderTable.$inferInsert,
  items: Omit<NewOrderItem, "orderId">[],
  cartUserId: string,
  cartId: string
): Promise<string> => {
  let orderId: string | undefined;

  await db.transaction(async tx => {
    const [order] = await tx.insert(orderTable).values(orderData).returning();

    if (!order) {
      throw new Error("Failed to create order");
    }

    orderId = order.id;

    const orderItemsPayload: NewOrderItem[] = items.map(item => ({
      ...item,
      orderId: order.id,
    }));

    await tx.insert(orderItemTable).values(orderItemsPayload);
    await tx.delete(cartTable).where(eq(cartTable.userId, cartUserId));
    await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cartId));
  });

  if (!orderId) {
    throw new Error("Failed to create order");
  }

  return orderId;
};
