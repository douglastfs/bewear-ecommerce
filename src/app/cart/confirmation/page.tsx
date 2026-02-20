import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { cartItemTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/address";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        orderBy: asc(cartItemTable.createdAt),
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart.items.length === 0) {
    redirect("/");
  }
  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session?.user.id),
  });

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
            <Button size="lg" className="w-full rounded-full">
              Finalizar compra
            </Button>
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
