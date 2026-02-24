import Image from "next/image";

import { formatCentsToBRL } from "@/helpers/money";

interface OrderProductItemProps {
  name: string;
  variantName: string;
  variantColor: string;
  quantity: number;
  priceInCents: number;
  imageUrl: string;
}

const OrderProductItem = ({
  name,
  variantName,
  variantColor,
  quantity,
  priceInCents,
  imageUrl,
}: OrderProductItemProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-accent relative size-[86px] shrink-0 overflow-hidden rounded-xl md:size-24">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-semibold md:text-lg">{name}</p>
          <p className="text-muted-foreground text-xs font-medium md:text-base">
            {variantName}
          </p>
          <p className="text-muted-foreground text-xs font-medium md:text-base">
            {variantColor} | {quantity}
          </p>
          {/* Preço visível apenas no mobile (abaixo das infos) */}
          <p className="text-sm font-semibold md:hidden">
            {formatCentsToBRL(priceInCents)}
          </p>
        </div>

        {/* Preço visível apenas no desktop (ao lado direito) */}
        <p className="hidden text-base font-semibold md:block">
          {formatCentsToBRL(priceInCents)}
        </p>
      </div>
    </div>
  );
};

export default OrderProductItem;
