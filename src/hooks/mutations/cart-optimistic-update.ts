import { QueryClient } from "@tanstack/react-query";

import type { getCart } from "@/actions/get-cart";

import { getUseCartQueryKey } from "../queries/use-cart";

export type CartQueryData = Awaited<ReturnType<typeof getCart>>;

type OptimisticUpdateParams = {
  queryClient: QueryClient;
  action: "INCREASE" | "DECREASE";
  targetId: string; // productVariantId (se INCREASE) ou cartItemId (se DECREASE)
};

export const updateCartCacheOptimistically = async ({
  queryClient,
  action,
  targetId,
}: OptimisticUpdateParams) => {
  // 1. Cancela procuras ativas
  await queryClient.cancelQueries({ queryKey: getUseCartQueryKey() });

  // 2. Tira uma foto de "como estava antes" (para Rollback)
  const previousCart =
    queryClient.getQueryData<CartQueryData>(getUseCartQueryKey());

  // 3. Atualiza o cache do Carrinho simulando o DB
  queryClient.setQueryData<CartQueryData>(
    getUseCartQueryKey(),
    (old: CartQueryData | undefined) => {
      if (!old) return old;

      let newItems = [...old.items];

      if (action === "INCREASE") {
        newItems = newItems.map(item => {
          if (item.productVariantId === targetId) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }

      if (action === "DECREASE") {
        newItems = newItems
          .map(item => {
            if (item.id === targetId) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          })
          .filter(item => item.quantity > 0);
      }

      // Recalcular Subtotal instantaneamente
      const newTotal = newItems.reduce((acc, item) => {
        return acc + item.productVariant.priceInCents * item.quantity;
      }, 0);

      return { ...old, items: newItems, totalPriceInCents: newTotal };
    }
  );

  return { previousCart };
};

export const rollbackCartCache = (
  queryClient: QueryClient,
  context: { previousCart?: CartQueryData } | undefined
) => {
  if (context?.previousCart) {
    queryClient.setQueryData(getUseCartQueryKey(), context.previousCart);
  }
};

export const syncCartCache = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
};
