"use server";

import { headers } from "next/headers";

import {
  deleteCartItem,
  getCartItemById,
  updateCartItemQuantity,
} from "@/data-access/cart";
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
  const cartItem = await getCartItemById(data.cartItemId);

  // Se não tiver item do carrinho, lança um erro
  if (!cartItem) {
    throw new Error("Produto não encontrado no carrinho");
  }

  // Verifica se o item do carrinho não pertence ao usuário que está logado
  const cartDoesNotBelongToUser = cartItem.cart.userId !== session.user.id;
  if (cartDoesNotBelongToUser) {
    throw new Error("Não autorizado");
  }

  // Se a quantidade for maior que 1, diminui
  if (cartItem.quantity > 1) {
    await updateCartItemQuantity(cartItem.id, cartItem.quantity - 1);
    return;
  }

  // Se a quantidade for menor ou igual a 1, remove o produto
  await deleteCartItem(cartItem.id);
};
