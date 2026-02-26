import { notFound } from "next/navigation";

import ProductItem from "@/components/common/product-item";
import { getCategoryBySlug } from "@/data-access/category";
import { getProductsByCategoryId } from "@/data-access/product";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return notFound();
  }
  const products = await getProductsByCategoryId(category.id);
  return (
    <div className="space-y-6 px-5">
      <h2 className="text-xl font-bold">{category.name}</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map(product => (
          <ProductItem
            key={product.id}
            product={product}
            textContainerClassName="max-w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
