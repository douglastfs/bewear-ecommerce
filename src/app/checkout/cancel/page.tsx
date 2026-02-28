import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AddressCard from "@/components/common/address-card";
import CartSummary from "@/components/common/cart-summary";
import CheckoutSteps from "@/components/common/checkout-steps";
import { getCartByUserId } from "@/data-access/cart";
import { auth } from "@/lib/auth";

import CancelDialog from "./components/cancel-dialog";

export const metadata = {
  title: "Pagamento Cancelado | BEWEAR",
  description: "Seu pagamento não foi concluído.",
};

const CheckoutPageCancel = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Busca o carrinho abandonado que FOI preservado
  const cart = await getCartByUserId(session.user.id);

  if (!cart) {
    redirect("/cart");
  }

  const totalPriceInCents = cart.items.reduce((acc, item) => {
    return acc + item.productVariant.priceInCents * item.quantity;
  }, 0);

  let formattedAddress = "";
  if (cart.shippingAddress) {
    const address = cart.shippingAddress;
    formattedAddress = `${address.recipientName}, ${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ""}, ${address.neighborhood}, ${address.zipCode}, ${address.city}, ${address.state}, Brasil`;
  }

  return (
    <>
      <div className="mb-8 space-y-4 px-5">
        <CheckoutSteps currentStep={2} />

        {formattedAddress && <AddressCard address={formattedAddress} />}

        {/* Resumo do carrinho (agora que mantivemos os dados!!) */}
        <CartSummary
          subTotalInCents={totalPriceInCents}
          totalInCents={totalPriceInCents}
          products={cart.items.map(item => ({
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents * item.quantity,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>

      {/* Dialog de Cancelamento por cima de tudo */}
      <CancelDialog />
    </>
  );
};

export default CheckoutPageCancel;
