import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeProductFromCart } from "@/actions/remove-cart-product";

import {
  type CartQueryData,
  rollbackCartCache,
  syncCartCache,
  updateCartCacheOptimistically,
} from "./cart-optimistic-update";

export const getRemoveProductFromCartMutationKey = (cartItemId: string) =>
  ["remove-cart-product", cartItemId] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getRemoveProductFromCartMutationKey(cartItemId),
    mutationFn: () => removeProductFromCart({ cartItemId }),
    onMutate: () =>
      updateCartCacheOptimistically({
        queryClient,
        action: "DECREASE",
        targetId: cartItemId,
      }),
    onError: (_err, _variables, context) =>
      rollbackCartCache(
        queryClient,
        context as { previousCart: CartQueryData } | undefined
      ),
    onSettled: () => syncCartCache(queryClient),
  });
};
