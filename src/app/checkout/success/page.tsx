import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AddressCard from "@/components/common/address-card";
import CartSummary from "@/components/common/cart-summary";
import CheckoutSteps from "@/components/common/checkout-steps";
import { getOrderById, getOrderItemsByOrderId } from "@/data-access/order";
import { auth } from "@/lib/auth";

import SuccessDialog from "./components/success-dialog";

export const metadata = {
  title: "Pedido Confirmado | BEWEAR",
  description: "Seu pedido foi efetuado com sucesso.",
};

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
      <div className="mx-auto mb-8 max-w-[1440px] space-y-4 px-5 lg:px-20">
        <CheckoutSteps currentStep={3} />

        <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-12">
          <div className="lg:w-[60%] lg:flex-none">
            <AddressCard address={formattedAddress} />
          </div>

          <div className="lg:w-[40%] lg:flex-none">
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
        </div>
      </div>

      {/* Dialog de sucesso por cima de tudo */}
      <SuccessDialog />
    </>
  );
};

export default CheckoutSuccessPage;
