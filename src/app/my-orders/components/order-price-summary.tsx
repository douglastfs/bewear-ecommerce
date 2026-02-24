import { formatCentsToBRL } from "@/helpers/money";

interface OrderPriceSummaryProps {
  totalPriceInCents: number;
}

const OrderPriceSummary = ({ totalPriceInCents }: OrderPriceSummaryProps) => {
  return (
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

      <div className="flex items-center justify-between">
        <p className="font-medium">Total</p>
        <p className="font-semibold">{formatCentsToBRL(totalPriceInCents)}</p>
      </div>
    </div>
  );
};

export default OrderPriceSummary;
