export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Out for Delivery" | "Delivered";

export function getOrderStatus(createdAt: Date): { status: OrderStatus; progress: number } {
  const now = new Date();
  const diffHours = (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);

  if (diffHours > 72) return { status: "Delivered", progress: 100 };
  if (diffHours > 48) return { status: "Out for Delivery", progress: 75 };
  if (diffHours > 24) return { status: "Shipped", progress: 50 };
  if (diffHours > 12) return { status: "Confirmed", progress: 25 };
  
  return { status: "Pending", progress: 5 };
}

export const STATUS_COLORS = {
  "Pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Confirmed": "bg-blue-100 text-blue-700 border-blue-200",
  "Shipped": "bg-purple-100 text-purple-700 border-purple-200",
  "Out for Delivery": "bg-orange-100 text-orange-700 border-orange-200",
  "Delivered": "bg-green-100 text-green-700 border-green-200",
};