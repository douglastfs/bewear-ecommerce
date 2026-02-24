import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import HeroBanner from "@/components/common/hero-banner";
import PartnersBrands from "@/components/common/partners-brands";
import ProductList from "@/components/common/product-list";

import { getCategories } from "./data/categories/get";
import {
  getNewlyCreatedProducts,
  getProductsWithVariants,
} from "./data/products/get";

const heroBannerSlides = [
  {
    id: 1,
    image: "/banner-01.png",
    alt: "Leve uma vida com estilo",
    cta: { label: "Ver coleção", href: "/category/jaquetas-moletons" },
  },
  {
    id: 2,
    image: "/banner-02.png",
    alt: "Seja autêntico",
    cta: { label: "Ver coleção", href: "/category/camisetas" },
  },
];

const Home = async () => {
  const [products, categories, newlyCreatedProducts] = await Promise.all([
    getProductsWithVariants(),
    getCategories(),
    getNewlyCreatedProducts(),
  ]);

  return (
    <>
      <Header />
      <div className="space-y-6">
        <HeroBanner slides={heroBannerSlides} autoplay={false} />

        <PartnersBrands />

        <ProductList title="Mais vendidos" products={products} />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <ProductList title="Novos produtos" products={newlyCreatedProducts} />

        <Footer />
      </div>
    </>
  );
};

export default Home;
