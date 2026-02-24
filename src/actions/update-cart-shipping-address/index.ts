"use server";

import { headers } from "next/headers";

import {
  getCartSimpleByUserId,
  updateCartShippingAddressId,
} from "@/data-access/cart";
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
  const cart = await getCartSimpleByUserId(session.user.id);

  if (!cart) {
    throw new Error("Carrinho não encontrado");
  }

  // Vincula o endereço de entrega ao carrinho
  return updateCartShippingAddressId(cart.id, data.shippingAddressId);
};
