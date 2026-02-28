"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";

interface CartPageSummaryProps {
  totalPriceInCents: number;
}

const CartPageSummary = ({ totalPriceInCents }: CartPageSummaryProps) => {
  return (
    <Card className="border-border rounded-3xl border-[1.6px] px-0 py-8">
      <CardHeader>
        <CardTitle className="text-lg">Resumo</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Linhas de preço */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">Subtotal</p>
            <p className="text-muted-foreground font-medium">
              {formatCentsToBRL(totalPriceInCents)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">Transporte e Manuseio</p>
            <p className="text-muted-foreground font-medium">Grátis</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">Taxa Estimada</p>
            <p className="text-muted-foreground font-medium">—</p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <p className="font-medium">Total</p>
            <p className="font-semibold">
              {formatCentsToBRL(totalPriceInCents)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Input de cupom — visual, sem funcionalidade por enquanto */}
        <div className="flex gap-2">
          <Input
            placeholder="Código do cupom"
            className="rounded-full"
            disabled
          />
          <Button variant="outline" className="shrink-0 rounded-full" disabled>
            Aplicar
          </Button>
        </div>

        {/* Botão continuar */}
        <Button className="w-full rounded-full" size="lg" asChild>
          <Link href="/cart/identification">Continuar</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartPageSummary;
