import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AddressCard from "@/components/common/address-card";
import CartSummary from "@/components/common/cart-summary";
import CheckoutSteps from "@/components/common/checkout-steps";
import { getCartByUserId } from "@/data-access/cart";
import { auth } from "@/lib/auth";

import { formatAddress } from "../helpers/address";
import FinishOrderButton from "./components/finish-order-button";

export const metadata = {
  title: "Confirmação | BEWEAR",
  description: "Revise e confirme os detalhes do seu pedido.",
};

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/authentication");
  }
  const cart = await getCartByUserId(session.user.id);
  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }

  const CartTotalPriceInCents = cart.items.reduce((acc, item) => {
    return acc + item.productVariant.priceInCents * item.quantity;
  }, 0);

  return (
    <div className="mx-auto mb-8 max-w-[1440px] space-y-4 px-5 lg:px-20">
      <CheckoutSteps currentStep={2} />

      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-12">
        <div className="lg:w-[60%] lg:flex-none">
          <AddressCard address={formatAddress(cart.shippingAddress)}>
            <FinishOrderButton />
          </AddressCard>
        </div>

        <div className="lg:w-[40%] lg:flex-none">
          <CartSummary
            subTotalInCents={CartTotalPriceInCents}
            totalInCents={CartTotalPriceInCents}
            products={cart.items.map(item => ({
              name: item.productVariant.product.name,
              variantName: item.productVariant.name,
              quantity: item.quantity,
              priceInCents: item.productVariant.priceInCents * item.quantity,
              imageUrl: item.productVariant.imageUrl,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
