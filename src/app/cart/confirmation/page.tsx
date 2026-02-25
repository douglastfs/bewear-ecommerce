import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CartSummary from "@/components/common/cart-summary";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getCartByUserId } from "@/data-access/cart";
import { auth } from "@/lib/auth";

import { formatAddress } from "../helpers/address";
import FinishOrderButton from "./components/finish-order-button";

const ConfirmationPage = async () => {
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

  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }

  const CartTotalPriceInCents = cart.items.reduce((acc, item) => {
    return acc + item.productVariant.priceInCents * item.quantity;
  }, 0);
  return (
    <>
      <Header />
      <div className="mb-8 space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Confirmação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <Label
                  htmlFor={cart.shippingAddress?.id}
                  className="text-sm leading-normal font-medium"
                >
                  {formatAddress(cart.shippingAddress)}
                </Label>
              </CardContent>
            </Card>
            <FinishOrderButton />
          </CardContent>
        </Card>
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

export default ConfirmationPage;
