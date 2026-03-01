import CategorySelector from "@/components/common/category-selector";
import type { ShowcaseItem } from "@/components/common/category-showcase";
import CategoryShowcase from "@/components/common/category-showcase";
import HeroBanner from "@/components/common/hero-banner";
import PartnersBrands from "@/components/common/partners-brands";
import ProductList from "@/components/common/product-list";
import { getCategories } from "@/data-access/category";
import {
  getNewlyCreatedProducts,
  getProductsWithVariants,
} from "@/data-access/product";

export const metadata = {
  title: "BEWEAR | A sua loja de Moda Online",
  description:
    "Descubra as últimas tendências em moda. Roupas, acessórios e muito mais com entrega para todo o Brasil.",
  openGraph: {
    title: "BEWEAR | A sua loja de Moda Online",
    description:
      "Descubra as últimas tendências em moda. Roupas, acessórios e muito mais com entrega para todo o Brasil.",
    url: "/",
    images: [
      {
        url: "/banner-01.png",
        width: 1200,
        height: 630,
        alt: "Hero Banner BEWEAR",
      },
    ],
  },
};

// Configuração estática do showcase — preparado para virar dinâmico via admin
const SHOWCASE_CONFIG = [
  {
    imageUrl: "/showcase/acessorios.png",
    gradient: "from-[#b9bbca] to-[#eeeff6]",
  },
  {
    imageUrl: "/showcase/bermudas.png",
    gradient: "from-[#b0b1f0] to-[#eaeffe]",
  },
  {
    imageUrl: "/showcase/calcas.png",
    gradient: "from-[#a0cbe9] to-[#eaeffe]",
  },
];

const Home = async () => {
  const [products, categories, newlyCreatedProducts] = await Promise.all([
    getProductsWithVariants(),
    getCategories(),
    getNewlyCreatedProducts(),
  ]);

  // Monta os itens do showcase a partir das 3 primeiras categorias
  const showcaseItems: ShowcaseItem[] = categories
    .slice(0, 3)
    .map((category, index) => ({
      title: category.name,
      imageUrl: SHOWCASE_CONFIG[index].imageUrl,
      href: `/category/${category.slug}`,
      gradient: SHOWCASE_CONFIG[index].gradient,
    }));

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

      <div className="mx-auto max-w-[1440px] px-5 lg:hidden lg:px-11">
        <CategorySelector categories={categories} />
      </div>

      <div className="lg:hidden">
        <HeroBanner
          slides={[{ id: 2, image: "/banner-02.png", alt: "Seja autêntico" }]}
        />
      </div>

      <CategoryShowcase items={showcaseItems} />

      <ProductList title="Novos produtos" products={newlyCreatedProducts} />
    </div>
  );
};

export default Home;
