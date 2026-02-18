import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatCentsToBRL } from "@/helpers/money";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  productVariantSlug: string;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  productVariantSlug,
  quantity,
}: CartItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={`/product-variant/${productVariantSlug}`}>
          <Image
            src={productVariantImageUrl}
            alt={productVariantName}
            width={78}
            height={78}
            className="rounded-lg"
          />
        </Link>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-20 items-center justify-between rounded-md border">
            <Button variant="ghost" className="h-7 w-7" onClick={() => {}}>
              {quantity === 1 ? <TrashIcon /> : <MinusIcon />}
            </Button>
            <p className="font-medium">{quantity}</p>
            <Button variant="ghost" className="h-7 w-7" onClick={() => {}}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex self-end">
        <p className="text-sm font-medium">
          {formatCentsToBRL(productVariantPriceInCents)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
