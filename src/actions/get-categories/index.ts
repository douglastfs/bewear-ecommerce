"use server";

import { getCategories } from "@/data-access/category";

export const fetchCategories = async () => {
  return getCategories();
};
