"use server";

import { headers } from "next/headers";

import { getShippingAddressesByUserId } from "@/data-access/shipping-address";
import { auth } from "@/lib/auth";

export const getShippingAddresses = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autorizado");
  }

  return getShippingAddressesByUserId(session.user.id);
};
