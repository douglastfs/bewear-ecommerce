"use server";

import { headers } from "next/headers";

import { createCart, getCartByUserId } from "@/data-access/cart";
import { auth } from "@/lib/auth";

export const getCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await getCartByUserId(session.user.id);

  if (!cart) {
    const newCart = await createCart(session.user.id);
    return {
      ...newCart,
      items: [],
      totalPriceInCents: 0,
      shippingAddress: null,
    };
  }

  const totalPriceInCents = cart.items.reduce((acc, item) => {
    return acc + item.productVariant.priceInCents * item.quantity;
  }, 0);

  return {
    ...cart,
    totalPriceInCents,
  };
};
