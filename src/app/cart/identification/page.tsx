import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { getCartByUserId } from "@/data-access/cart";
import { getShippingAddressesByUserId } from "@/data-access/shipping-address";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import Addresses from "./components/addresses";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
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
    <>
      <Header />
      <div className="mb-9 space-y-4 px-5">
        <Addresses
          shippingAddresses={shippingAddresses}
          selectedShippingAddressId={cart.shippingAddressId}
        />
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
      <Footer />
    </>
  );
};

export default IdentificationPage;
