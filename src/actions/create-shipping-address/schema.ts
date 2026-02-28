import z from "zod";

export const createShippingAddressSchema = z.object({
  email: z.email("E-mail inválido."),
  fullName: z
    .string({ message: "Nome completo é obrigatório." })
    .trim()
    .min(5, "Nome completo muito curto.")
    .regex(
      /^[a-zA-ZÀ-ÿ]+\s+[a-zA-ZÀ-ÿ]+/,
      "Digite seu nome e pelo menos um sobrenome."
    ),
  cpf: z
    .string({ message: "CPF é obrigatório." })
    .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF incompleto ou inválido."),
  phone: z
    .string({ message: "Celular é obrigatório." })
    .regex(
      /^\(\d{2}\) \d{5}\-\d{4}$/,
      "Preencha o celular com DDD e 9 dígitos."
    ),
  cep: z
    .string({ message: "CEP é obrigatório." })
    .regex(/^\d{5}\-\d{3}$/, "Digite um CEP válido com 8 dígitos."),
  address: z
    .string({ message: "Endereço é obrigatório." })
    .trim()
    .min(1, "Endereço é obrigatório."),
  number: z
    .string({ message: "Número é obrigatório." })
    .trim()
    .min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  neighborhood: z
    .string({ message: "Bairro é obrigatório." })
    .trim()
    .min(1, "Bairro é obrigatório."),
  city: z
    .string({ message: "Cidade é obrigatória." })
    .trim()
    .min(1, "Cidade é obrigatória."),
  state: z
    .string({ message: "Estado é obrigatório." })
    .trim()
    .min(2, "Estado é obrigatório."),
});

export type CreateShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
