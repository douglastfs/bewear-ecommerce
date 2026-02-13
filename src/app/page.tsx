import { desc } from "drizzle-orm";

import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import HeroBanner from "@/components/common/hero-banner";
import PartnersBrands from "@/components/common/partners-brands";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

const heroBannerSlides = [
  {
    id: 1,
    image: "/banner-01.png",
    alt: "Leve uma vida com estilo",
    cta: { label: "Ver coleção", href: "/authentication" },
  },
  {
    id: 2,
    image: "/banner-02.png",
    alt: "Seja autêntico",
    cta: { label: "Ver coleção", href: "/authentication" },
  },
];

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  const categories = await db.query.categoryTable.findMany();
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <div className="space-y-6">
        <HeroBanner slides={heroBannerSlides} />

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
