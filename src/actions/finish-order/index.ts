"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { getCartWithItemsAndAddress } from "@/data-access/cart";
import { createOrderWithItems } from "@/data-access/order";
import { auth } from "@/lib/auth";

export const finishOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const cart = await getCartWithItemsAndAddress(session.user.id);

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (!cart.shippingAddress) {
    throw new Error("Shipping address not found");
  }

  const totalPriceInCents = cart.items.reduce((acc, item) => {
    return acc + item.productVariant.priceInCents * item.quantity;
  }, 0);

  const shippingAddress = cart.shippingAddress;

  const orderId = await createOrderWithItems(
    {
      email: shippingAddress.email,
      zipCode: shippingAddress.zipCode,
      country: shippingAddress.country,
      phone: shippingAddress.phone,
      cpfOrCnpj: shippingAddress.cpfOrCnpj,
      state: shippingAddress.state,
      city: shippingAddress.city,
      complement: shippingAddress.complement,
      neighborhood: shippingAddress.neighborhood,
      number: shippingAddress.number,
      recipientName: shippingAddress.recipientName,
      street: shippingAddress.street,
      userId: session.user.id,
      totalPriceInCents,
      shippingAddressId: cart.shippingAddressId,
    },
    cart.items.map(item => ({
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      priceInCents: item.productVariant.priceInCents,
    }))
  );

  // Invalida cache de rota após persistir na base
  revalidatePath("/");
  revalidatePath("/cart");

  return { orderId };
};
