"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  UpdateCartShippingAddressSchema,
  updateCartShippingAddressSchema,
} from "./schema";

export const updateCartShippingAddress = async (
  data: UpdateCartShippingAddressSchema
) => {
  // Valida os dados
  updateCartShippingAddressSchema.parse(data);

  // Pega a session do usuário
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se não tiver session, lança um erro
  if (!session?.user) {
    throw new Error("Usuário não autorizado");
  }

  // Busca o carrinho do usuário
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
  });

  if (!cart) {
    throw new Error("Carrinho não encontrado");
  }

  // Vincula o endereço de entrega ao carrinho
  const [updatedCart] = await db
    .update(cartTable)
    .set({ shippingAddressId: data.shippingAddressId })
    .where(eq(cartTable.id, cart.id))
    .returning();

  return updatedCart;
};
