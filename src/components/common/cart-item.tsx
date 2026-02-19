import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { formatCentsToBRL } from "@/helpers/money";
import { useIncreaseCartProduct } from "@/hooks/mutations/use-increase-cart-product";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  productVariantSlug: string;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  productVariantSlug,
  quantity,
}: CartItemProps) => {
  const removeProductFromCartMutation = useRemoveProductFromCart(id);

  const increaseCartProductQuabtityMutation =
    useIncreaseCartProduct(productVariantId);

  const handleDeleteClick = () => {
    removeProductFromCartMutation.mutate(undefined, {
      onSuccess: () => {
        if (quantity === 1) {
          toast.success("Produto removido do carrinho");
        }
      },
      onError: () => {
        toast.error("Erro ao remover produto do carrinho");
      },
    });
  };

  const handleAddClick = () => {
    increaseCartProductQuabtityMutation.mutate(undefined, {
      onError: () => {
        toast.error("Erro ao adicionar produto ao carrinho");
      },
    });
  };

  return (
    <div className="flex items-stretch justify-between">
      <div className="flex items-stretch gap-4">
        <Link
          href={`/product-variant/${productVariantSlug}`}
          className="shrink-0"
        >
          <Image
            src={productVariantImageUrl}
            alt={productVariantName}
            width={78}
            height={78}
            className="rounded-lg"
          />
        </Link>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{productName}</p>
            <p className="text-muted-foreground text-xs font-medium">
              {productVariantName}
            </p>
          </div>
          <div className="flex w-20 items-center justify-between rounded-md border">
            <Button
              variant="ghost"
              className="h-6 w-6"
              onClick={handleDeleteClick}
            >
              {quantity === 1 ? <TrashIcon /> : <MinusIcon />}
            </Button>
            <p className="font-medium">{quantity}</p>
            <Button
              variant="ghost"
              className="h-6 w-6"
              onClick={handleAddClick}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-end">
        <p className="text-sm font-medium">
          {formatCentsToBRL(productVariantPriceInCents * quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
