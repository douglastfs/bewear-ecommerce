import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

// Tipo inferido do Drizzle
export type ShippingAddress = typeof shippingAddressTable.$inferSelect;

export const getShippingAddressesByUserId = async (
  userId: string
): Promise<ShippingAddress[]> => {
  return db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, userId),
  });
};
