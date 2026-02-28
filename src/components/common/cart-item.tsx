"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { formatCentsToBRL } from "@/helpers/money";
import { useIncreaseCartProduct } from "@/hooks/mutations/use-increase-cart-product";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";
import { cn } from "@/lib/utils";

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
  /** compact = Sheet do carrinho (78px) | full = Página /cart (164px) */
  variant?: "compact" | "full";
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
  variant = "compact",
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

  const isFullVariant = variant === "full";

  return (
    <div className="flex items-stretch justify-between">
      <div
        className={cn("flex items-stretch", isFullVariant ? "gap-5" : "gap-4")}
      >
        {/* Imagem do produto */}
        <Link
          href={`/product-variant/${productVariantSlug}`}
          className="shrink-0"
        >
          <Image
            src={productVariantImageUrl}
            alt={productVariantName}
            width={isFullVariant ? 164 : 78}
            height={isFullVariant ? 164 : 78}
            className={cn(
              "rounded-lg object-cover",
              isFullVariant ? "size-[120px] lg:size-[164px]" : "size-[78px]"
            )}
          />
        </Link>

        {/* Info + controles de quantidade */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <p
              className={cn(
                "font-semibold",
                isFullVariant ? "text-base lg:text-lg" : "text-sm"
              )}
            >
              {productName}
            </p>
            <p
              className={cn(
                "text-muted-foreground font-medium",
                isFullVariant ? "text-sm" : "text-xs"
              )}
            >
              {productVariantName}
            </p>
          </div>

          {/* Controles de quantidade */}
          <div
            className={cn(
              "flex items-center justify-between rounded-md border",
              isFullVariant ? "w-[100px] lg:w-[134px]" : "w-20"
            )}
          >
            <Button
              variant="ghost"
              className={cn(isFullVariant ? "size-8 lg:size-10" : "h-6 w-6")}
              onClick={handleDeleteClick}
            >
              {quantity === 1 ? <TrashIcon /> : <MinusIcon />}
            </Button>
            <p className="font-medium">{quantity}</p>
            <Button
              variant="ghost"
              className={cn(isFullVariant ? "size-8 lg:size-10" : "h-6 w-6")}
              onClick={handleAddClick}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Preço */}
      <div className={cn("flex", isFullVariant ? "items-center" : "items-end")}>
        <p
          className={cn(
            "font-medium",
            isFullVariant ? "text-sm lg:text-base" : "text-sm"
          )}
        >
          {formatCentsToBRL(productVariantPriceInCents * quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
