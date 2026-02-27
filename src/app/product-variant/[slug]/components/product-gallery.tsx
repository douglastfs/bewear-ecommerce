"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductVariantImage } from "@/data-access/product";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  mainImageUrl: string;
  productName: string;
  galleryImages: ProductVariantImage[];
}

const ProductGallery = ({
  mainImageUrl,
  productName,
  galleryImages,
}: ProductGalleryProps) => {
  // A imagem selecionada inicia com a imagem principal da variante
  const [selectedImageUrl, setSelectedImageUrl] = useState(mainImageUrl);

  // Se não houver imagens de galeria, usa apenas a imagem principal
  const imagesToShow =
    galleryImages.length > 0
      ? galleryImages
      : [{ id: "main", imageUrl: mainImageUrl, displayOrder: 0 }];

  return (
    <div className="flex flex-col lg:flex-row lg:gap-4">
      {/* Thumbnails — visíveis apenas no desktop */}
      <div className="hidden flex-col gap-3 lg:flex">
        {imagesToShow.map(image => (
          <button
            key={image.id}
            onClick={() => setSelectedImageUrl(image.imageUrl)}
            className={cn(
              "relative size-[60px] shrink-0 overflow-hidden rounded-xl transition-all",
              selectedImageUrl === image.imageUrl
                ? "opacity-100"
                : "opacity-50 hover:opacity-100"
            )}
          >
            <Image
              src={image.imageUrl}
              alt={`${productName} - foto ${image.displayOrder + 1}`}
              fill
              sizes="60px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Imagem principal */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
        <Image
          src={selectedImageUrl}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default ProductGallery;
