import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

// Tipo inferido do Drizzle
export type ShippingAddress = typeof shippingAddressTable.$inferSelect;
export type NewShippingAddress = typeof shippingAddressTable.$inferInsert;

export const getShippingAddressesByUserId = async (
  userId: string
): Promise<ShippingAddress[]> => {
  return db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, userId),
    orderBy: asc(shippingAddressTable.createdAt),
  });
};

export const createShippingAddress = async (
  data: NewShippingAddress
): Promise<ShippingAddress> => {
  const [address] = await db
    .insert(shippingAddressTable)
    .values(data)
    .returning();
  return address;
};
