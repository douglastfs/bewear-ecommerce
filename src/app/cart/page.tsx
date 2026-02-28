import { headers } from "next/headers";

import { getCartByUserId } from "@/data-access/cart";
import { getNewlyCreatedProducts } from "@/data-access/product";
import { auth } from "@/lib/auth";

import CartPageClient from "./components/cart-page-client";

export const metadata = {
  title: "Sacola | BEWEAR",
  description: "Revise os itens da sua sacola antes de finalizar a compra.",
};

const CartPage = async () => {
  // 1. Verificação da Sessão (Auth)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se o usuário não estiver logado, repassamos um initialCart indefinido
  // e recomendamos recém-criados. O Client side via CartClient lidará com o Empty State.
  // Não há redirecionamento agressivo pois usuários não-logados podem querer ver a página vazia.

  // 2. Fetch da DAL do Carrinho e Cálculos
  let cart = undefined;
  if (session?.user) {
    const rawCart = await getCartByUserId(session.user.id);
    if (rawCart) {
      const totalPriceInCents = rawCart.items.reduce((acc, item) => {
        return acc + item.productVariant.priceInCents * item.quantity;
      }, 0);

      cart = {
        ...rawCart,
        totalPriceInCents,
      };
    }
  }

  const recommendedProducts = await getNewlyCreatedProducts();

  // 4. Injetar num Client Component sem quebras/erros
  return (
    <main className="bg-white">
      <CartPageClient
        initialCart={
          cart as Parameters<typeof CartPageClient>[0]["initialCart"]
        }
        recommendedProducts={recommendedProducts}
      />
    </main>
  );
};

export default CartPage;
