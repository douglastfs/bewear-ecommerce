import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import {
  type CartQueryData,
  rollbackCartCache,
  syncCartCache,
  updateCartCacheOptimistically,
} from "./cart-optimistic-update";

export const getUseIncreaseCartProductQueryKey = (productVariantId: string) =>
  ["add-cart-product", productVariantId] as const;

export const useIncreaseCartProduct = (productVariantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseIncreaseCartProductQueryKey(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onMutate: () =>
      updateCartCacheOptimistically({
        queryClient,
        action: "INCREASE",
        targetId: productVariantId,
      }),
    onError: (_err, _variables, context) =>
      rollbackCartCache(
        queryClient,
        context as { previousCart: CartQueryData } | undefined
      ),
    onSettled: () => syncCartCache(queryClient),
  });
};
