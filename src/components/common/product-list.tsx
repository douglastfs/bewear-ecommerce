"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import type { ProductWithVariants } from "@/data-access/product";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: ProductWithVariants[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="mx-auto max-w-[1440px] space-y-6 lg:space-y-9">
      {/* Header: título + "Ver todos" com setas de navegação no desktop */}
      <div className="flex items-center justify-between px-5 lg:px-11">
        <h3 className="font-semibold lg:text-2xl">{title}</h3>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href="#"
            className="hover:text-muted-foreground text-sm font-semibold transition-colors"
          >
            Ver todos
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Produtos anteriores"
              className="text-foreground hover:text-muted-foreground flex items-center justify-center transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Próximos produtos"
              className="text-foreground hover:text-muted-foreground flex items-center justify-center transition-colors disabled:opacity-30"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: scroll horizontal */}
      <div className="flex w-full gap-4 overflow-x-auto px-5 lg:hidden [&::-webkit-scrollbar]:hidden">
        {products.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop: Carousel com 4 itens visíveis */}
      <div className="hidden lg:block">
        <Carousel
          opts={{ align: "start" }}
          setApi={setApi}
          className="w-full px-11"
        >
          <CarouselContent>
            {products.map(product => (
              <CarouselItem key={product.id} className="basis-1/4">
                <ProductItem
                  key={product.id}
                  product={product}
                  textContainerClassName="max-w-none"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ProductList;
