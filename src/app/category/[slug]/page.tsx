import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductItem from "@/components/common/product-item";
import { getCategoryBySlug } from "@/data-access/category";
import { getProductsByCategoryId } from "@/data-access/product";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: CategoryPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  // Puxa o primeiro produto da categoria (se existir) para servir de Thumbnail Rica!
  const products = await getProductsByCategoryId(category.id);
  const ogImage =
    products.length > 0 && products[0].variants.length > 0
      ? products[0].variants[0].imageUrl
      : "/banner-01.png";

  return {
    title: category.name,
    description: `Confira os produtos da categoria ${category.name}. Diversas opções e estilos.`,
    openGraph: {
      title: `${category.name} | BEWEAR`,
      description: `Confira os produtos da categoria ${category.name} direto pelo site da BEWEAR.`,
      url: `/category/${slug}`,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: `Categoria ${category.name}`,
        },
      ],
    },
  };
};

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
        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            textContainerClassName="max-w-full"
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
