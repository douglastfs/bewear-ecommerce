"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  RemoveProductFromCartSchema,
  removeProductFromCartSchema,
} from "./schema";

export const removeProductFromCart = async (
  data: RemoveProductFromCartSchema
) => {
  // Valida os dados
  removeProductFromCartSchema.parse(data);

  // Pega a session do usuário
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se não tiver session, lança um erro
  if (!session?.user) {
    throw new Error("Usuário não autorizado");
  }

  // Verificar se a variante já existe no carrinho
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });

  // Verifica se o item do carrinho não pertence ao usuário que está logado
  const cartDoesNotBelongToUser = cartItem?.cart.userId !== session.user.id;
  if (cartDoesNotBelongToUser) {
    throw new Error("Não autorizado");
  }

  // Se não tiver item do carrinho, lança um erro
  if (!cartItem) {
    throw new Error("Produto não encontrado no carrinho");
  }

  // Se a quantidade for maior que 1, diminui
  if (cartItem.quantity > 1) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity - 1,
      })
      .where(eq(cartItemTable.id, cartItem.id));
    return;
  }

  // Se a quantidade for menor ou igual a 1, remove o produto
  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
