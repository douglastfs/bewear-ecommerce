"use client";

import { useIsMutating } from "@tanstack/react-query";
import { Loader2, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

const Cart = () => {
  const { data: cart } = useCart();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isAdding = useIsMutating({ mutationKey: ["add-cart-product"] });
  const isRemoving = useIsMutating({ mutationKey: ["remove-cart-product"] });
  const isCartMutating = isAdding > 0 || isRemoving > 0;

  // Fecha o Sheet do carrinho automaticamente ao navegar
  useEffect(() => {
    requestAnimationFrame(() => setIsCartOpen(false));
  }, [pathname]);

  return (
    <div className="">
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <ShoppingBagIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <ShoppingBagIcon size={20} className="text-muted-foreground" />
              Sacola
            </SheetTitle>
          </SheetHeader>
          <div className="flex h-full min-h-0 flex-col px-5 pb-5">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-5">
                  {cart?.items.map(item => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productName={item.productVariant.product.name}
                      productVariantId={item.productVariant.id}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      productVariantSlug={item.productVariant.slug}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {cart?.items && cart?.items.length > 0 && (
              <div className="flex shrink-0 flex-col gap-4 pt-4">
                <Separator />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Subtotal</p>
                    <p className="text-sm font-medium">
                      {formatCentsToBRL(cart?.totalPriceInCents ?? 0)}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Frete</p>
                    <p className="text-sm font-medium">
                      Grátis
                      {/* {formatCentsToBRL(cart.shippingInCents)} */}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-sm font-medium">
                      {formatCentsToBRL(cart?.totalPriceInCents ?? 0)}
                    </p>
                  </div>
                </div>
                {isCartMutating ? (
                  <Button className="rounded-full" disabled>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Atualizando...
                  </Button>
                ) : (
                  <Button className="rounded-full" asChild>
                    <Link href="/cart/identification">Finalizar compra</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Cart;
