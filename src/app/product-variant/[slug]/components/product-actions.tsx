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

      <div className="flex w-full flex-col gap-2 lg:flex-row">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
          className="lg:flex-1"
        />
        <Button className="rounded-full lg:flex-1" size="lg">
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
