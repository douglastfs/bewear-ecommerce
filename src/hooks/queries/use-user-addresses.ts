import { useQuery } from "@tanstack/react-query";

import { getShippingAddresses } from "@/actions/get-shipping-addresses";
import { shippingAddressTable } from "@/db/schema";

export const getUseUserAddressesQueryKey = () => ["user-addresses"] as const;

export const useUserAddresses = (params: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUseUserAddressesQueryKey(),
    queryFn: () => getShippingAddresses(),
    initialData: params?.initialData,
  });
};
