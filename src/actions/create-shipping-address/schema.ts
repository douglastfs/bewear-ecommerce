import z from "zod";

export const createShippingAddressSchema = z.object({
  email: z.email("E-mail inválido."),
  fullName: z
    .string("Nome completo inválido.")
    .trim()
    .min(2, "Nome completo deve ter pelo menos 2 caracteres."),
  cpf: z.string("CPF inválido.").min(14, "CPF deve ter 11 dígitos."),
  phone: z.string("Celular inválido.").trim().min(1, "Celular é obrigatório."),
  cep: z.string("CEP inválido.").min(9, "CEP deve ter 8 dígitos."),
  address: z
    .string("Endereço inválido.")
    .trim()
    .min(1, "Endereço é obrigatório."),
  number: z.string("Número inválido.").trim().min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  neighborhood: z
    .string("Bairro inválido.")
    .trim()
    .min(1, "Bairro é obrigatório."),
  city: z.string("Cidade inválida.").trim().min(1, "Cidade é obrigatória."),
  state: z.string("Estado inválido.").trim().min(2, "Estado é obrigatório."),
});

export type CreateShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
