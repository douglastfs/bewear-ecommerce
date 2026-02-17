import z from "zod";

export const addProductToCartSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().min(1),
});

export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>;
