import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";

interface CartSummaryProduct {
  name: string;
  variantName: string;
  quantity: number;
  priceInCents: number;
  imageUrl: string;
}

interface CartSummaryProps {
  subTotalInCents: number;
  totalInCents: number;
  products: CartSummaryProduct[];
}

const CartSummary = ({
  subTotalInCents,
  totalInCents,
  products,
}: CartSummaryProps) => {
  return (
    <Card className="rounded-3xl border-[1.6px] border-[#f1f1f1] px-0 py-8 shadow-none">
      <CardHeader className="flex-row">
        <CardTitle className="flex items-center justify-between text-lg">
          Seu pedido
          <Link href="/" className="text-sm font-semibold underline">
            Editar
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Seção de preços */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">Subtotal</p>
            <p className="font-medium text-[#656565]">
              {formatCentsToBRL(subTotalInCents)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">Transporte e Manuseio</p>
            <p className="font-medium text-[#656565]">Grátis</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">Taxa Estimada</p>
            <p className="font-medium text-[#656565]">—</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">Total</p>
            <p className="font-semibold text-black">
              {formatCentsToBRL(totalInCents)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Seção de produtos */}
        <div className="flex flex-col gap-6">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="relative size-[86px] shrink-0 overflow-hidden rounded-xl bg-[#eff1f3]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs font-medium text-[#656565]">
                    {product.variantName}
                  </p>
                  <p className="text-xs font-medium text-[#656565]">
                    {product.quantity}
                  </p>
                  <p className="text-sm font-semibold">
                    {formatCentsToBRL(product.priceInCents)}
                  </p>
                </div>
              </div>

              {/* Separador entre produtos (exceto após o último) */}
              {index < products.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
