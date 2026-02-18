"use client";

import { useQuery } from "@tanstack/react-query";
import { Divide, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/get-cart";
import { formatCentsToBRL } from "@/helpers/money";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

const Cart = () => {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  return (
    <div className="">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <ShoppingBagIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Carrinho</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-4">
            {cartIsLoading && <div>Carregando...</div>}
            {cart?.items.map(item => (
              <CartItem
                key={item.id}
                id={item.id}
                productName={item.productVariant.product.name}
                productVariantName={item.productVariant.name}
                productVariantImageUrl={item.productVariant.imageUrl}
                productVariantPriceInCents={item.productVariant.priceInCents}
                productVariantSlug={item.productVariant.slug}
                quantity={item.quantity}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Cart;
