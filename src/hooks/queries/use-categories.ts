import { useQuery } from "@tanstack/react-query";

import { fetchCategories } from "@/actions/get-categories";
import type { Category } from "@/data-access/category";

export const getUseCategoriesQueryKey = () => ["categories"] as const;

export const useCategories = (params?: { initialData?: Category[] }) => {
  return useQuery({
    queryKey: getUseCategoriesQueryKey(),
    queryFn: () => fetchCategories(),
    initialData: params?.initialData,
  });
};
