import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import OrderCard from "./components/order-card";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/login");
  }

  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session.user.id),
    orderBy: desc(orderTable.createdAt),
    with: {
      items: {
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

  // Numeração inversa: o pedido mais antigo é #001, o mais recente é #N
  const totalOrders = orders.length;

  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-200px)] flex-col gap-6 px-5 pt-6 pb-8 md:px-11 md:pt-8 md:pb-10">
        <h1 className="text-lg font-semibold md:text-2xl">Meus pedidos</h1>

        {orders.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Você ainda não possui pedidos.
          </p>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            {orders.map((order, index) => (
              <OrderCard
                key={order.id}
                orderNumber={totalOrders - index}
                totalPriceInCents={order.totalPriceInCents}
                status={order.status}
                createdAt={order.createdAt}
                items={order.items}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrdersPage;
