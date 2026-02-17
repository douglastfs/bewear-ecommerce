"use client";

import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
  selectedVariantSlug,
  variants,
}: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map(variant => (
        <Link
          key={variant.id}
          href={`/product-variant/${variant.slug}`}
          className={
            selectedVariantSlug === variant.slug
              ? "border-primary rounded-xl border-2"
              : ""
          }
        >
          <Image
            src={variant.imageUrl}
            alt={variant.name}
            width={68}
            height={68}
            className="rounded-xl"
          />
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
