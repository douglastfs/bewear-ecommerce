"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const router = useRouter();
  const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false);
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
    setSuccessDialogIsOpen(true);
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

      <Dialog open={successDialogIsOpen} onOpenChange={setSuccessDialogIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col items-center gap-8 rounded-3xl px-5 pt-16 pb-8"
          onInteractOutside={e => e.preventDefault()}
        >
          <Image
            src="/order-success.svg"
            alt="Pedido efetuado com sucesso"
            width={251}
            height={234}
          />

          <DialogHeader className="items-center gap-6">
            <DialogTitle className="text-2xl font-semibold text-black">
              Pedido Efetuado!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm font-medium">
              Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
              na seção de &ldquo;Meus Pedidos&rdquo;.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full flex-col gap-3 sm:flex-col">
            <Button
              size="lg"
              className="w-full rounded-full"
              onClick={() => router.push("/orders")}
            >
              Ver meu pedido
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full border-[1.6px] border-[#f1f1f1] text-black hover:bg-gray-50"
              onClick={() => router.push("/")}
            >
              Página inicial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinishOrderButton;
