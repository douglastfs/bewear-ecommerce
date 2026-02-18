import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseIncreaseCartProductQueryKey = (productVariantId: string) =>
  ["add-cart-product", productVariantId] as const;

export const useIncreaseCartProduct = (productVariantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseIncreaseCartProductQueryKey(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
