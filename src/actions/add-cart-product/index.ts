"use server";

import { headers } from "next/headers";

import {
  createCart,
  createCartItem,
  getCartItemByCartAndVariant,
  getCartSimpleByUserId,
  updateCartItemQuantity,
} from "@/data-access/cart";
import { getProductVariantById } from "@/data-access/product";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  // Valida os dados
  addProductToCartSchema.parse(data);

  // Pega a session do usuário
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se não tiver session, lança um erro
  if (!session?.user) {
    throw new Error("Usuário não autorizado");
  }

  // Busca o produto enviado
  const productVariant = await getProductVariantById(data.productVariantId);

  // Se não tiver produto, lança um erro
  if (!productVariant) {
    throw new Error("Produto não encontrado");
  }

  // Pegar o carrinho
  const cart = await getCartSimpleByUserId(session.user.id);

  let cartId = cart?.id;

  if (!cartId) {
    const newCart = await createCart(session.user.id);
    cartId = newCart.id;
  }

  // Verificar se a variante já existe no carrinho
  const cartItem = await getCartItemByCartAndVariant(
    cartId,
    data.productVariantId
  );

  // Se existir, atualizar a quantidade
  if (cartItem) {
    await updateCartItemQuantity(
      cartItem.id,
      cartItem.quantity + data.quantity
    );
    return;
  }

  // Se não existir, adicionar ao carrinho
  await createCartItem(cartId, data.productVariantId, data.quantity);
};
