import { notFound } from "next/navigation";

import ProductList from "@/components/common/product-list";
import {
  getProductsByCategoryId,
  getProductVariantBySlug,
} from "@/data-access/product";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import ProductGallery from "./components/product-gallery";
import VariantSelector from "./components/variant-selector";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;

  const productVariant = await getProductVariantBySlug(slug);
  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await getProductsByCategoryId(
    productVariant.product.categoryId
  );

  return (
    <>
      {/* Container centralizado com max-width — evita esticar em telas ultra-largas */}
      <div className="mx-auto max-w-[1440px] px-5 lg:px-11">
        {/* Mobile: empilhado | Desktop: grid 3 colunas (thumbnails + imagem + info) */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-8">
          {/* ProductGallery renderiza as 2 primeiras colunas do grid (thumbnails + imagem) */}
          <ProductGallery
            mainImageUrl={productVariant.imageUrl}
            productName={productVariant.product.name}
            galleryImages={productVariant.images}
          />

          {/* Coluna direita: Informações do produto */}
          <div className="flex flex-col gap-6 lg:gap-7 lg:py-4">
            {/* Nome e subtítulo */}
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold lg:text-[32px] lg:leading-tight">
                {productVariant.product.name}
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                {productVariant.name}
              </p>
            </div>

            {/* Preço */}
            <p className="text-lg font-semibold lg:text-xl">
              {formatCentsToBRL(productVariant.priceInCents)}
            </p>

            {/* Seletor de variantes */}
            <VariantSelector
              selectedVariantSlug={productVariant.slug}
              variants={productVariant.product.variants}
            />

            {/* Quantidade e botões */}
            <ProductActions productVariantId={productVariant.id} />

            {/* Descrição */}
            <p className="text-base leading-relaxed">
              {productVariant.product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Produtos similares */}
      <div className="my-6 lg:my-16">
        <ProductList
          products={likelyProducts}
          title="Você também pode gostar"
        />
      </div>
    </>
  );
};

export default ProductVariantPage;
