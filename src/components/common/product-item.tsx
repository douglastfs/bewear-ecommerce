import Image from "next/image";
import Link from "next/link";

import type { ProductWithVariants } from "@/data-access/product";
import { formatCentsToBRL } from "@/helpers/money";
import { cn } from "@/lib/utils";

interface ProductItemProps {
  product: ProductWithVariants;
  textContainerClassName?: string;
  priority?: boolean;
}

const ProductItem = ({
  product,
  textContainerClassName,
  priority = false,
}: ProductItemProps) => {
  const firstVariant = product.variants[0];
  return (
    <Link
      href={`/product-variant/${firstVariant.slug}`}
      className="flex flex-col gap-4 rounded-[1.5rem]"
    >
      <Image
        src={firstVariant.imageUrl}
        alt={product.name}
        width={0}
        height={0}
        sizes="(max-width: 1024px) 50vw, 25vw"
        priority={priority}
        className="h-auto w-full rounded-3xl"
      />
      <div
        className={cn(
          "flex max-w-[200px] flex-col gap-1 lg:max-w-none",
          textContainerClassName
        )}
      >
        <p className="truncate text-sm font-medium lg:text-base">
          {product.name}
        </p>
        <p className="text-muted-foreground truncate text-xs font-medium lg:text-sm">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold lg:text-base">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
