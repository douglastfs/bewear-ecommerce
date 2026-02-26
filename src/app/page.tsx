import CategorySelector from "@/components/common/category-selector";
import HeroBanner from "@/components/common/hero-banner";
import PartnersBrands from "@/components/common/partners-brands";
import ProductList from "@/components/common/product-list";
import { getCategories } from "@/data-access/category";
import {
  getNewlyCreatedProducts,
  getProductsWithVariants,
} from "@/data-access/product";

const Home = async () => {
  const [products, categories, newlyCreatedProducts] = await Promise.all([
    getProductsWithVariants(),
    getCategories(),
    getNewlyCreatedProducts(),
  ]);

  return (
    <div className="space-y-6 lg:space-y-10">
      <HeroBanner
        slides={[
          {
            id: 1,
            image: "/banner-01.png",
            desktopImage: "/banner-01-desktop-view.png",
            alt: "Leve uma vida com estilo",
          },
        ]}
      />

      <PartnersBrands />

      <ProductList title="Mais vendidos" products={products} />

      <div className="mx-auto max-w-[1440px] px-5 lg:px-11">
        <CategorySelector categories={categories} />
      </div>

      <HeroBanner
        slides={[{ id: 2, image: "/banner-02.png", alt: "Seja autêntico" }]}
      />

      <ProductList title="Novos produtos" products={newlyCreatedProducts} />
    </div>
  );
};

export default Home;
