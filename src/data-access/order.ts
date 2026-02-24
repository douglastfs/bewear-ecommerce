import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { orderItemTable, orderTable } from "@/db/schema";

import type { Product, ProductVariant } from "./product";

// Tipos inferidos do Drizzle
export type Order = typeof orderTable.$inferSelect;
export type OrderItem = typeof orderItemTable.$inferSelect;

// Tipo completo: pedido com itens, variantes e produtos
export type OrderItemWithDetails = OrderItem & {
  productVariant: ProductVariant & {
    product: Product;
  };
};

export type OrderWithItems = Order & {
  items: OrderItemWithDetails[];
};

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

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<void> => {
  await db.update(orderTable).set({ status }).where(eq(orderTable.id, orderId));
};
