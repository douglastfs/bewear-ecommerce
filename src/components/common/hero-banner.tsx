"use client";

import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button } from "../ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";

interface HeroBannerSlide {
  id: number;
  image: string;
  alt: string;
  cta?: {
    label: string;
    href: string;
  };
}

interface HeroBannerProps {
  slides: HeroBannerSlide[];
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showIndicators?: boolean;
  showArrows?: boolean;
}

const HeroBanner = ({
  slides,
  autoplay = true,
  autoplayDelay = 5000,
  loop = true,
  showIndicators = true,
  showArrows = true,
}: HeroBannerProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(Autoplay({ delay: autoplayDelay }));

  // Rastreia o slide ativo para os indicadores
  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const isSingleSlide = slides.length === 1;

  // Banner estático (1 slide apenas)
  if (isSingleSlide) {
    const slide = slides[0];

    return (
      <section className="px-5">
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={slide.image}
            alt={slide.alt}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full"
          />
          {slide.cta && (
            <div className="absolute bottom-6 flex w-full justify-center px-5">
              <Button asChild className="w-40 rounded-full">
                <Link href={slide.cta.href}>{slide.cta.label}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Carousel (2+ slides)
  return (
    <section className="space-y-3">
      <Carousel
        opts={{ loop }}
        plugins={autoplay ? [plugin.current] : []}
        setApi={setApi}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="ml-0">
          {slides.map(slide => (
            <CarouselItem key={slide.id} className="px-5">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-auto w-full"
                />
                {slide.cta && (
                  <div className="absolute bottom-6 flex w-full justify-center px-5">
                    <Button
                      asChild
                      variant="outline"
                      className="w-40 rounded-full"
                    >
                      <Link href={slide.cta.href}>{slide.cta.label}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Setas de navegação */}
        {showArrows && (
          <>
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute top-1/2 left-7 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="size-5 text-gray-800" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute top-1/2 right-7 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Próximo slide"
            >
              <ChevronRight className="size-5 text-gray-800" />
            </button>
          </>
        )}
      </Carousel>

      {/* Indicadores (dots) */}
      {showIndicators && count > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 w-2"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
