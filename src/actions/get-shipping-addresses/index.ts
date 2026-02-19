"use server";

import { asc } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAdressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getShippingAddresses = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autorizado");
  }

  const addresses = await db.query.shippingAdressTable.findMany({
    where: (address, { eq }) => eq(address.userId, session.user.id),
    orderBy: asc(shippingAdressTable.createdAt),
  });

  return addresses;
};
