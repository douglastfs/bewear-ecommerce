"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { createShippingAddress as createShippingAddressDAL } from "@/data-access/shipping-address";
import { auth } from "@/lib/auth";

import {
  CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "./schema";

export const createShippingAddress = async (
  data: CreateShippingAddressSchema
) => {
  // Valida os dados
  createShippingAddressSchema.parse(data);

  // Pega a session do usuário
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se não tiver session, lança um erro
  if (!session?.user) {
    throw new Error("Usuário não autorizado");
  }

  // Cria o endereço de entrega via DAL
  const shippingAddress = await createShippingAddressDAL({
    userId: session.user.id,
    recipientName: data.fullName,
    street: data.address,
    number: data.number,
    complement: data.complement ?? null,
    city: data.city,
    state: data.state,
    neighborhood: data.neighborhood,
    zipCode: data.cep,
    country: "BR",
    phone: data.phone,
    email: data.email,
    cpfOrCnpj: data.cpf,
  });

  revalidatePath("/cart/identification");

  return shippingAddress;
};
