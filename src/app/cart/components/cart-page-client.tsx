"use client";

import { ClockIcon, Loader2 } from "lucide-react";
import Link from "next/link";

import { getCart } from "@/actions/get-cart";
import CartItem from "@/components/common/cart-item";
import ProductList from "@/components/common/product-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ProductWithVariants } from "@/data-access/product";
import { useCart } from "@/hooks/queries/use-cart";

import CartPageSummary from "./cart-page-summary";

interface CartPageClientProps {
  initialCart?: Awaited<ReturnType<typeof getCart>>;
  recommendedProducts: ProductWithVariants[];
}

const CartPageClient = ({
  initialCart,
  recommendedProducts,
}: CartPageClientProps) => {
  const { data: cart, isLoading } = useCart({ initialData: initialCart });

  // Mostra um loader centralizado se estiver carregando do zero e não temos dados iniciais
  if (isLoading && !initialCart) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 lg:px-11">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24 text-center">
            <h1 className="text-2xl font-semibold lg:text-3xl">
              Sua sacola está vazia.
            </h1>
            <p className="text-muted-foreground max-w-md">
              Que tal conferir algumas de nossas novidades ou encontrar o
              produto perfeito para você?
            </p>
            <Button size="lg" className="mt-4 rounded-full" asChild>
              <Link href="/">Continuar comprando</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-16 lg:py-8">
            {/* Esquerda: Lista de itens + Continuar Comprando */}
            <div className="flex flex-col">
              {/* Título Mobile/Desktop */}
              <h1 className="mb-6 text-2xl font-semibold lg:text-[32px]">
                Sacola
              </h1>

              {/* Itens do Carrinho */}
              <div className="flex flex-col gap-6 lg:rounded-3xl lg:border-[1.6px] lg:border-[#f1f1f1] lg:p-8">
                {cart.items.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-6">
                    <CartItem
                      id={item.id}
                      quantity={item.quantity}
                      productName={item.productVariant.product.name}
                      productVariantId={item.productVariant.id}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantName={item.productVariant.name}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      productVariantSlug={item.productVariant.slug}
                      variant="full"
                    />

                    {index < cart.items.length - 1 && <Separator />}
                  </div>
                ))}

                <Separator className="mt-2" />

                {/* Frase de urgência */}
                <div className="flex items-center gap-2">
                  <ClockIcon className="text-primary size-5" />
                  <p className="font-medium">Apenas algumas restantes.</p>
                </div>
              </div>

              {/* Botão voltar para loja (só visível no desktop, no mobile fica menos útil pois já tem o header) */}
              <div className="mt-8 hidden lg:block">
                <Link
                  href="/"
                  className="hover:text-primary text-sm font-semibold underline underline-offset-4"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>

            {/* Direita: Resumo e Cupom */}
            {/* Título mobile para Resumo (opcional, o design Figma pode não ter, mas vou focar no Card) */}
            <div className="flex flex-col">
              <h2 className="invisible mb-6 hidden text-2xl font-semibold lg:block lg:text-[32px]">
                Resumo
              </h2>
              <CartPageSummary totalPriceInCents={cart.totalPriceInCents} />
            </div>
          </div>
        )}
      </div>

      {/* Produtos Recomendados / Você também pode gostar */}
      {recommendedProducts.length > 0 && (
        <div className="my-10 lg:my-16">
          <ProductList
            products={recommendedProducts}
            title="Você também pode gostar"
          />
        </div>
      )}
    </>
  );
};

export default CartPageClient;
