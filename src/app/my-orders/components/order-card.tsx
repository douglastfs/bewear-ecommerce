"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  formatDate,
  getOrderStatusColor,
  getOrderStatusLabel,
} from "@/helpers/order";

import OrderPriceSummary from "./order-price-summary";
import OrderProductItem from "./order-product-item";

interface OrderItem {
  id: string;
  quantity: number;
  priceInCents: number;
  productVariant: {
    name: string;
    color: string;
    imageUrl: string;
    product: {
      name: string;
    };
  };
}

interface OrderCardProps {
  orderNumber: number;
  totalPriceInCents: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
}

const OrderCard = ({
  orderNumber,
  totalPriceInCents,
  status,
  createdAt,
  items,
}: OrderCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formattedOrderNumber = String(orderNumber).padStart(3, "0");

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border gap-0 border-[1.6px] p-0 shadow-none">
        {/* Trigger */}
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between p-5 md:px-6 md:py-8">
          {/* Mobile: número + chevron */}
          {/* Desktop: número, status, data, pagamento, "detalhes do pedido" */}
          <div className="flex w-full items-center justify-between">
            {/* Número do Pedido */}
            <div className="flex flex-col items-start text-sm md:text-base">
              <p className="font-semibold">Número do Pedido</p>
              <p className="text-muted-foreground font-medium">
                #{formattedOrderNumber}
              </p>
            </div>

            {/* Status - visível no desktop e mobile */}
            <div className="hidden flex-col items-start md:flex">
              <p className="text-base font-semibold">Status</p>
              <p
                className={`text-sm font-semibold ${getOrderStatusColor(status)}`}
              >
                {getOrderStatusLabel(status)}
              </p>
            </div>

            {/* Data - visível apenas no desktop */}
            <div className="hidden flex-col items-start md:flex">
              <p className="text-base font-semibold">Data</p>
              <p className="text-muted-foreground text-base font-medium">
                {formatDate(createdAt)}
              </p>
            </div>

            {/* Pagamento - visível apenas no desktop */}
            <div className="hidden flex-col items-start md:flex">
              <p className="text-base font-semibold">Pagamento</p>
              <p className="text-muted-foreground text-base font-medium">
                Cartão
              </p>
            </div>

            {/* Desktop: texto "Detalhes do Pedido" */}
            <div className="hidden items-center gap-1 md:flex">
              <ChevronDown
                className={`text-primary size-5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "-rotate-90"
                }`}
              />
              <p className="text-primary text-sm font-semibold">
                Detalhes do Pedido
              </p>
            </div>

            {/* Mobile: status + chevron */}
            <div className="flex items-center gap-3 md:hidden">
              <span
                className={`text-xs font-semibold ${getOrderStatusColor(status)}`}
              >
                {getOrderStatusLabel(status)}
              </span>
              <ChevronDown
                className={`text-primary size-5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </CollapsibleTrigger>

        {/* Conteúdo expandido */}
        <CollapsibleContent>
          <div className="flex flex-col gap-6 px-5 pb-5 md:px-6 md:pb-8">
            <Separator />

            {/* Lista de produtos */}
            <div className="flex flex-col gap-6">
              {items.map(item => (
                <OrderProductItem
                  key={item.id}
                  name={item.productVariant.product.name}
                  variantName={item.productVariant.name}
                  variantColor={item.productVariant.color}
                  quantity={item.quantity}
                  priceInCents={item.priceInCents * item.quantity}
                  imageUrl={item.productVariant.imageUrl}
                />
              ))}
            </div>

            <Separator />

            {/* Resumo de preços */}
            <OrderPriceSummary totalPriceInCents={totalPriceInCents} />
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default OrderCard;
