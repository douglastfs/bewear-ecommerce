import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CartSummary from "@/components/common/cart-summary";
import CheckoutSteps from "@/components/common/checkout-steps";
import { getCartByUserId } from "@/data-access/cart";
import { getShippingAddressesByUserId } from "@/data-access/shipping-address";
import { auth } from "@/lib/auth";

import Addresses from "./components/addresses";

export const metadata = {
  title: "Identificação | BEWEAR",
  description: "Selecione o endereço de entrega para o seu pedido.",
};

const IdentificationPage = async () => {
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
  const shippingAddresses = await getShippingAddressesByUserId(session.user.id);

  const CartTotalPriceInCents = cart.items.reduce((acc, item) => {
    return acc + item.productVariant.priceInCents * item.quantity;
  }, 0);

  return (
    <div className="mx-auto mb-9 max-w-[1440px] space-y-4 px-5 lg:px-20">
      <CheckoutSteps currentStep={1} />

      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-12">
        <div className="lg:w-[60%] lg:flex-none">
          <Addresses
            shippingAddresses={shippingAddresses}
            selectedShippingAddressId={cart.shippingAddressId}
          />
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

export default IdentificationPage;
