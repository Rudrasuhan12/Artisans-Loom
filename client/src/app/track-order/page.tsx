"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Truck, MapPin, Calendar, CheckCircle2, Clock, X } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderStatus {
  id: string;
  status: string;
  estimatedDelivery: string;
  shippedDate: string;
  carrier: string;
  items: OrderItem[];
  shippingAddress: string;
  progress: number;
}

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to track order
    setTimeout(() => {
      // Mock order status data
      setOrderStatus({
        id: trackingNumber,
        status: "Shipped",
        estimatedDelivery: "Dec 28, 2025",
        shippedDate: "Dec 22, 2025",
        carrier: "India Post",
        items: [
          { name: "Handwoven Silk Saree", quantity: 1, price: 4500 },
          { name: "Embroidered Cushion Covers", quantity: 2, price: 1800 }
        ],
        shippingAddress: "123 Heritage Lane, Connaught Place, New Delhi, India 110001",
        progress: 70 // percentage
      });
      setLoading(false);
    }, 1500);
  };

  // Mock order tracking steps
  const trackingSteps = [
    { id: 1, title: "Order Placed", date: "Dec 20, 2025", completed: true },
    { id: 2, title: "Processing", date: "Dec 21, 2025", completed: true },
    { id: 3, title: "Shipped", date: "Dec 22, 2025", completed: true },
    { id: 4, title: "In Transit", date: "Dec 24, 2025", completed: true },
    { id: 5, title: "Out for Delivery", date: "Dec 27, 2025", completed: false },
    { id: 6, title: "Delivered", date: "Dec 28, 2025", completed: false }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Track Your Order
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Enter your order number to track your package
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="trackingNumber" className="block text-[#4A3526] font-medium mb-2">Order Number</label>
                  <Input 
                    id="trackingNumber" 
                    type="text" 
                    placeholder="Enter your order number (e.g. AL-12345)" 
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="h-12 bg-white border-[#E5DCCA] rounded-xl" 
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    type="submit" 
                    className="h-12 px-8 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg w-full sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Tracking...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        <span>Track Order</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Status */}
        {orderStatus && (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#4A3526] mb-2">Order #{orderStatus.id}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-[#5D4037]">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Status: <span className="font-bold">{orderStatus.status}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Est. Delivery: {orderStatus.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[#5D4037]">Progress:</span>
                  <div className="w-40 h-2 bg-[#E5DCCA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D4AF37] rounded-full transition-all duration-500" 
                      style={{ width: `${orderStatus.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[#4A3526] font-bold">{orderStatus.progress}%</span>
                </div>
              </div>

              {/* Tracking Steps */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#4A3526] mb-6">Tracking Information</h3>
                <div className="space-y-4">
                  {trackingSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed 
                          ? 'bg-[#D4AF37] text-white' 
                          : 'bg-[#E5DCCA] text-[#8C7B70]'
                      }`}>
                        {step.completed ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-[#8C7B70]"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className={`font-medium ${
                          step.completed ? 'text-[#4A3526]' : 'text-[#8C7B70]'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-sm text-[#8C7B70]">{step.date}</div>
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div className="absolute left-5 mt-10 w-0.5 h-16 bg-[#E5DCCA]"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-4">Order Details</h3>
                  <div className="space-y-3">
                    {orderStatus.items.map((item: OrderItem, index: number) => (
                      <div key={index} className="flex justify-between py-2 border-b border-[#E5DCCA]">
                        <div>
                          <div className="font-medium text-[#4A3526]">{item.name}</div>
                          <div className="text-sm text-[#8C7B70]">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-medium">₹{item.price.toLocaleString()}</div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 font-bold text-lg">
                      <div>Total</div>
                      <div>₹{(orderStatus.items.reduce((sum, item: OrderItem) => sum + item.price, 0)).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-4">Shipping Information</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[#5D4037] font-medium mb-1">Carrier</div>
                      <div className="text-[#4A3526]">{orderStatus.carrier}</div>
                    </div>
                    <div>
                      <div className="text-[#5D4037] font-medium mb-1">Shipped Date</div>
                      <div className="text-[#4A3526]">{orderStatus.shippedDate}</div>
                    </div>
                    <div>
                      <div className="text-[#5D4037] font-medium mb-1">Shipping Address</div>
                      <div className="text-[#4A3526] text-sm">{orderStatus.shippingAddress}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Without Tracking */}
        {!orderStatus && !loading && (
          <div className="max-w-4xl mx-auto text-center py-20">
            <Package className="w-24 h-24 text-[#E5DCCA] mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Track Your Order</h3>
            <p className="text-[#8C7B70] max-w-md mx-auto">
              Enter your order number in the form above to track your shipment and view detailed delivery information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}