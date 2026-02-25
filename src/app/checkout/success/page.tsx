import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AddressCard from "@/components/common/address-card";
import CartSummary from "@/components/common/cart-summary";
import CheckoutSteps from "@/components/common/checkout-steps";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { getOrderById, getOrderItemsByOrderId } from "@/data-access/order";
import { auth } from "@/lib/auth";

import SuccessDialog from "./components/success-dialog";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

const CheckoutSuccessPage = async ({
  searchParams,
}: CheckoutSuccessPageProps) => {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const order = await getOrderById(orderId);

  if (!order || order.userId !== session.user.id) {
    redirect("/");
  }

  const orderItems = await getOrderItemsByOrderId(orderId);

  const formattedAddress = `${order.recipientName}, ${order.street}, ${order.number}${order.complement ? `, ${order.complement}` : ""}, ${order.neighborhood}, ${order.zipCode}, ${order.city}, ${order.state}, Brasil`;

  return (
    <>
      <Header />
      <div className="mb-8 space-y-4 px-5">
        <CheckoutSteps currentStep={3} />

        <AddressCard address={formattedAddress} />

        {/* Resumo do pedido */}
        <CartSummary
          subTotalInCents={order.totalPriceInCents}
          totalInCents={order.totalPriceInCents}
          products={orderItems.map(item => ({
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.priceInCents * item.quantity,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <Footer />

      {/* Dialog de sucesso por cima de tudo */}
      <SuccessDialog />
    </>
  );
};

export default CheckoutSuccessPage;
