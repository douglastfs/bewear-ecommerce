import { useQuery } from "@tanstack/react-query";

import { getShippingAddresses } from "@/actions/get-shipping-addresses";
import type { ShippingAddress } from "@/data-access/shipping-address";

export const getUseUserAddressesQueryKey = () => ["user-addresses"] as const;

export const useUserAddresses = (params: {
  initialData?: ShippingAddress[];
}) => {
  return useQuery({
    queryKey: getUseUserAddressesQueryKey(),
    queryFn: () => getShippingAddresses(),
    initialData: params?.initialData,
  });
};
