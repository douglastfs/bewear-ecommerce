"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CancelDialog = () => {
  const router = useRouter();

  // Quando o Dialog for fechado (clicar fora ou press ESC), volta para o cart
  return (
    <Dialog open={true} onOpenChange={() => router.push("/cart")}>
      <DialogContent className="flex flex-col items-center gap-8 rounded-3xl px-5 pt-16 pb-8 sm:max-w-md">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-red-50">
          <XCircle strokeWidth={1.5} className="h-16 w-16 text-red-500" />
        </div>

        <DialogHeader className="items-center gap-6 text-center">
          <DialogTitle className="text-2xl font-semibold text-red-600">
            Pagamento não concluído
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm font-medium">
            Não se preocupe, seus itens continuam seguros na sua sacola. Você
            pode voltar e tentar finalizar o pedido novamente quando quiser.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full flex-col gap-3 sm:flex-col">
          <Button asChild size="lg" className="w-full rounded-full">
            <Link href="/cart">Voltar para a sacola</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border w-full rounded-full border-[1.6px] bg-white text-black hover:bg-gray-50"
          >
            <Link href="/">Página inicial</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;
