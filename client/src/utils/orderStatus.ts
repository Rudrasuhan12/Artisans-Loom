export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Out for Delivery" | "Delivered" | "Auction Won";

export function getOrderStatus(createdAt: Date, dbStatus?: string): { status: string; progress: number } {

  if (dbStatus === "Auction Won") {
    return { status: "Auction Won", progress: 100 };
  }

  const now = new Date();
  const diffHours = (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);

  if (diffHours > 72) return { status: "Delivered", progress: 100 };
  if (diffHours > 48) return { status: "Out for Delivery", progress: 75 };
  if (diffHours > 24) return { status: "Shipped", progress: 50 };
  if (diffHours > 12) return { status: "Confirmed", progress: 25 };
  
  return { status: "Pending", progress: 5 };
}

export const STATUS_COLORS: Record<string, string> = {
  "Pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Confirmed": "bg-blue-100 text-blue-700 border-blue-200",
  "Shipped": "bg-purple-100 text-purple-700 border-purple-200",
  "Out for Delivery": "bg-orange-100 text-orange-700 border-orange-200",
  "Delivered": "bg-green-100 text-green-700 border-green-200",
  "Auction Won": "bg-[#D4AF37] text-[#2C1810] border-[#B8860B] shadow-[0_0_10px_rgba(212,175,55,0.4)]", 
};