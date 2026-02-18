"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-medium">Quantidade</h3>
        <div className="flex w-24 items-center justify-between rounded-lg border">
          <Button variant="ghost" size="icon" onClick={handleDecrement}>
            <MinusIcon />
          </Button>
          <p className="font-medium">{quantity}</p>
          <Button variant="ghost" size="icon" onClick={handleIncrement}>
            <PlusIcon />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        <Button className="rounded-full" size="lg">
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
