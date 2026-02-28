"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import AuthRedirectDialog from "@/components/common/auth-redirect-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
  className?: string;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
  className,
}: AddToCartButtonProps) => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const { mutate, isPending } = useMutation({
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
      toast.success("Produto adicionado à sacola");
    },
  });

  const handlePress = () => {
    if (!session?.user) {
      setIsAuthDialogOpen(true);
      return;
    }
    mutate();
  };
  return (
    <>
      <AuthRedirectDialog isOpen={isAuthDialogOpen} callbackURL={pathname} />
      <Button
        variant="outline"
        className={cn("rounded-full", className)}
        size="lg"
        disabled={isPending}
        onClick={handlePress}
      >
        {isPending && <Loader2 className="mr-2 animate-spin" />}
        Adicionar à sacola
      </Button>
    </>
  );
};

export default AddToCartButton;
