import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

export interface ShowcaseItem {
  title: string;
  imageUrl: string;
  href: string;
  gradient: string;
}

interface CategoryShowcaseProps {
  items: ShowcaseItem[];
}

const ShowcaseCard = ({
  item,
  className = "",
}: {
  item: ShowcaseItem;
  className?: string;
}) => (
  <Link
    href={item.href}
    className={`group relative overflow-hidden rounded-2xl bg-linear-to-b ${item.gradient} ${className}`}
  >
    {/* Título */}
    <p className="absolute top-7 left-7 z-10 text-2xl font-medium text-white">
      {item.title}
    </p>

    {/* Imagem centralizada */}
    <div className="absolute inset-0 flex items-center justify-center">
      <Image
        src={item.imageUrl}
        alt={item.title}
        width={0}
        height={0}
        sizes="(max-width: 1440px) 50vw, 400px"
        className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <Button
      variant="ghost"
      className="absolute right-6 bottom-6 z-10 rounded-full bg-white/80 px-5 py-4 text-lg font-semibold backdrop-blur-sm transition-colors hover:bg-white"
    >
      Explorar
    </Button>
  </Link>
);

const CategoryShowcase = ({ items }: CategoryShowcaseProps) => {
  // Espera 3 itens: [esquerda-top, esquerda-bottom, direita]
  const [topLeft, bottomLeft, right] = items;

  if (!topLeft || !bottomLeft || !right) return null;

  return (
    <section className="mx-auto hidden max-w-[1440px] px-11 py-15 lg:block">
      <div className="flex h-[638px] gap-6">
        {/* Coluna esquerda: 2 cards empilhados */}
        <div className="flex flex-1 flex-col gap-6">
          <ShowcaseCard item={topLeft} className="flex-1" />
          <ShowcaseCard item={bottomLeft} className="flex-1" />
        </div>

        {/* Coluna direita: 1 card grande */}
        <ShowcaseCard item={right} className="w-[60%]" />
      </div>
    </section>
  );
};

export default CategoryShowcase;
