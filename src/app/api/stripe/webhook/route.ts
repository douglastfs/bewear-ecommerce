import { NextResponse } from "next/server";
import Stripe from "stripe";

import { updateOrderStatus } from "@/data-access/order";

export const POST = async (request: Request) => {
  // Verificar se as variáveis de ambiente estão definidas
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key or webhook secret not found");
  }
  // Verificar a assinatura do webhook
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  // Construir o evento
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  //
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  // Verificar o tipo do evento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    // Verificar se o orderId foi enviado
    if (!orderId) {
      return NextResponse.error();
    }

    // Atualizar o status do pedido via DAL
    await updateOrderStatus(orderId, "paid");
  }

  return NextResponse.json({ received: true });
};
