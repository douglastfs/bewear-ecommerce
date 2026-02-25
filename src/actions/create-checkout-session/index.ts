"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

import { getOrderById, getOrderItemsByOrderId } from "@/data-access/order";
import { auth } from "@/lib/auth";

import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";

export const createCheckoutSession = async (
  data: CreateCheckoutSessionSchema
) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { orderId } = createCheckoutSessionSchema.parse(data);

  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const orderItems = await getOrderItemsByOrderId(orderId);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: { orderId },
    line_items: orderItems.map(orderItem => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
          description: orderItem.productVariant.product.description,
          images: [orderItem.productVariant.imageUrl],
        },
        // em centavos
        unit_amount: orderItem.priceInCents,
      },
      quantity: orderItem.quantity,
    })),
  });

  return {
    id: checkoutSession.id,
    url: checkoutSession.url,
  };
};
