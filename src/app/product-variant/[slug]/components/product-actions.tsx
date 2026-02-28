"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { addProductToCart } from "@/actions/add-cart-product";
import AuthRedirectDialog from "@/components/common/auth-redirect-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const { mutate: buyNow, isPending: isBuyingNow } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      router.push("/cart/identification");
    },
  });

  const handleBuyNow = () => {
    if (!session?.user) {
      setIsAuthDialogOpen(true);
      return;
    }
    buyNow();
  };

  return (
    <>
      <AuthRedirectDialog isOpen={isAuthDialogOpen} callbackURL={pathname} />
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
        <Button
          className="rounded-full lg:flex-1"
          size="lg"
          onClick={handleBuyNow}
          disabled={isBuyingNow}
        >
          {isBuyingNow && <Loader2 className="mr-2 animate-spin" />}
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
