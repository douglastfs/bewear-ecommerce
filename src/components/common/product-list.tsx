"use client";

import type { ProductWithVariants } from "@/data-access/product";

import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: ProductWithVariants[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  return (
    <section className="space-y-6">
      <h3 className="px-5 font-semibold">{title}</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {products.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
