import Link from "next/link";

import type { Category } from "@/data-access/category";

import { Button } from "../ui/button";

interface CategorySelectorProps {
  categories: Category[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map(category => (
          <Button
            variant="ghost"
            key={category.id}
            className="h-auto rounded-full bg-white px-2 py-3 text-center text-xs font-semibold whitespace-normal sm:px-4 sm:text-sm"
            asChild
          >
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
