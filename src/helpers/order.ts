const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  production: "Em Produção",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-600",
  paid: "text-green-600",
  production: "text-blue-600",
  shipped: "text-orange-600",
  delivered: "text-green-700",
  cancelled: "text-red-600",
};

export const getOrderStatusLabel = (status: string) => {
  return ORDER_STATUS_LABELS[status] || status;
};

export const getOrderStatusColor = (status: string) => {
  return ORDER_STATUS_COLORS[status] || "text-muted-foreground";
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
};
