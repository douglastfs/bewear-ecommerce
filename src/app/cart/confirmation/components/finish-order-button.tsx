"use client";

import { Loader2 } from "lucide-react";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const finishOrderMutation = useFinishOrder();
  const handleFinishOrder = async () => {
    const { orderId } = await finishOrderMutation.mutateAsync();
    const checkoutSession = await createCheckoutSession({
      orderId,
    });
    // Redireciona para a página de pagamento da Stripe
    if (checkoutSession.url) {
      window.location.href = checkoutSession.url;
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full rounded-full"
        onClick={handleFinishOrder}
        disabled={finishOrderMutation.isPending}
      >
        {finishOrderMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Finalizar compra
      </Button>
    </>
  );
};

export default FinishOrderButton;
