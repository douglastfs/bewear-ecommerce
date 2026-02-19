import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createShippingAddress } from "@/actions/create-shipping-address";
import { CreateShippingAddressSchema } from "@/actions/create-shipping-address/schema";

export const getUseCreateShippingAddressMutationKey = () =>
  ["create-shipping-address"] as const;

export const useCreateShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseCreateShippingAddressMutationKey(),
    mutationFn: (data: CreateShippingAddressSchema) =>
      createShippingAddress(data),
    onSuccess: () => {
      // Invalida queries relacionadas para atualizar a lista de endereços
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] });
      toast.success("Endereço cadastrado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao cadastrar endereço. Tente novamente.");
    },
  });
};
