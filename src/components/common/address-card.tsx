import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AddressCardProps {
  address: string;
  children?: React.ReactNode;
}

const AddressCard = ({ address, children }: AddressCardProps) => {
  return (
    <Card className="rounded-3xl border-[1.6px] border-[#f1f1f1] px-0 py-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 lg:px-6">
        <CardTitle>Revise o pedido para prosseguir com o pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="rounded-xl border-[1.6px] border-[#f1f1f1]">
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-xs font-medium">
                Endereço de entrega
              </Label>
              <p className="text-sm leading-normal font-medium">{address}</p>
            </div>
            <Link
              href="/cart/identification"
              className="shrink-0 text-sm font-semibold underline"
            >
              Alterar
            </Link>
          </CardContent>
        </Card>
        {children}
      </CardContent>
    </Card>
  );
};

export default AddressCard;
