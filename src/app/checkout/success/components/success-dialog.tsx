"use client";

import Image from "next/image";
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

const SuccessDialog = () => {
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={() => router.push("/")}>
      <DialogContent
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
          <Button asChild size="lg" className="w-full rounded-full">
            <Link href="/my-orders">Ver meu pedido</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full rounded-full border-[1.6px] border-[#f1f1f1] text-black hover:bg-gray-50"
          >
            <Link href="/">Página inicial</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
