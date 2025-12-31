import { Button } from "@/components/ui/button";
import { Package, Truck, MapPin, Clock, Star } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-transparent z-0" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Shipping & Delivery
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Information about our shipping policies and delivery options
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        {/* Shipping Information Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <Truck className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Fast Delivery</h3>
            <p className="text-[#5D4037]">
              Domestic orders typically arrive within 3-5 business days
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Worldwide Shipping</h3>
            <p className="text-[#5D4037]">
              We ship to over 50 countries with reliable carriers
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Careful Packaging</h3>
            <p className="text-[#5D4037]">
              All items are carefully packaged to ensure safe delivery
            </p>
          </div>
        </div>

        {/* Domestic Shipping */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#4A3526]">Domestic Shipping</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-4">Delivery Time</h3>
              <ul className="space-y-3 text-[#5D4037]">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Standard shipping: 3-5 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Express shipping: 1-2 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Free shipping on orders over ₹5,000</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-4">Shipping Costs</h3>
              <ul className="space-y-3 text-[#5D4037]">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Standard: ₹150</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Express: ₹300</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* International Shipping */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
              <Package className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#4A3526]">International Shipping</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-4">Delivery Time</h3>
              <ul className="space-y-3 text-[#5D4037]">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Standard international: 7-14 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Express international: 5-7 business days</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-4">Shipping Costs</h3>
              <ul className="space-y-3 text-[#5D4037]">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Standard: ₹800-1500 (varies by destination)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Express: ₹1500-2500 (varies by destination)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#E5DCCA]">
            <h3 className="text-xl font-bold text-[#4A3526] mb-4">Important Information</h3>
            <ul className="space-y-3 text-[#5D4037]">
              <li className="flex items-start gap-3">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>Customs duties and taxes may apply depending on your country</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>We are not responsible for customs delays or fees</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>All international shipments include tracking</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tracking Information */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#4A3526]">Order Tracking</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#4A3526] mb-4">Track Your Order</h3>
              <p className="text-[#5D4037] mb-6">
                Once your order ships, you'll receive a tracking number via email. You can also view your order status in your account dashboard.
              </p>
              <ul className="space-y-3 text-[#5D4037]">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Real-time tracking updates from our shipping partners</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Delivery notifications sent to your email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Estimated delivery dates provided</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E5DCCA]">
              <h4 className="font-bold text-[#4A3526] mb-4">Enter Tracking Number</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Tracking number" 
                  className="flex-1 h-12 px-4 border border-[#E5DCCA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                />
                <Button className="h-12 px-6 bg-[#2F334F] hover:bg-[#1E2135] text-white rounded-xl">
                  Track
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Packaging Information */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg">
          <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">Our Packaging Promise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-3">Secure Packaging</h3>
              <p className="text-[#5D4037]">
                Each item is carefully wrapped to prevent damage during transit
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-3">Eco-Friendly Materials</h3>
              <p className="text-[#5D4037]">
                We use recyclable and biodegradable packaging materials
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-3">Beautiful Presentation</h3>
              <p className="text-[#5D4037]">
                Items are presented beautifully, perfect for gifting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}