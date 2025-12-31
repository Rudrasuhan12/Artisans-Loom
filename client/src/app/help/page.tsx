import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, MessageCircle, Phone, Mail, BookOpen } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-transparent z-0" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Help Center
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Find answers to your questions or contact our support team
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B70]" />
            <Input 
              placeholder="Search for help topics..." 
              className="h-14 pl-12 pr-4 text-lg bg-white border-[#E5DCCA] rounded-xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
            <div className="w-14 h-14 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Getting Started</h3>
            <ul className="space-y-3 text-[#5D4037]">
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> How to create an account
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Navigating the marketplace
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Browsing and searching products
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Creating a wishlist
              </li>
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
            <div className="w-14 h-14 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mb-6">
              <MessageCircle className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Orders & Returns</h3>
            <ul className="space-y-3 text-[#5D4037]">
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> How to place an order
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Tracking your order
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Return policy and process
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Canceling an order
              </li>
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
            <div className="w-14 h-14 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mb-6">
              <HelpCircle className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Account & Payments</h3>
            <ul className="space-y-3 text-[#5D4037]">
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Managing your account
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Payment methods and security
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Updating billing information
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:text-[#D4AF37] transition-colors">
                <span>•</span> Account security
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white/80 backdrop-blur-md p-12 rounded-3xl border border-[#E5DCCA] shadow-lg mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-[#4A3526] mb-6">Still need help?</h2>
            <p className="text-[#5D4037] text-lg mb-10 max-w-2xl mx-auto">
              Our support team is here to assist you with any questions or concerns.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border border-[#E5DCCA]">
                <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-2">Email Support</h3>
                <p className="text-[#5D4037] mb-4">Get a response within 24 hours</p>
                <Button className="h-12 px-6 bg-white hover:bg-[#FDFBF7] text-[#D4AF37] border border-[#D4AF37] rounded-xl">
                  Send Email
                </Button>
              </div>

              <div className="p-6 rounded-2xl border border-[#E5DCCA]">
                <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-2">Phone Support</h3>
                <p className="text-[#5D4037] mb-4">Mon-Fri, 9am-6pm IST</p>
                <Button className="h-12 px-6 bg-white hover:bg-[#FDFBF7] text-[#D4AF37] border border-[#D4AF37] rounded-xl">
                  Call Now
                </Button>
              </div>

              <div className="p-6 rounded-2xl border border-[#E5DCCA]">
                <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-2">Live Chat</h3>
                <p className="text-[#5D4037] mb-4">Instant help from our team</p>
                <Button className="h-12 px-6 bg-white hover:bg-[#FDFBF7] text-[#D4AF37] border border-[#D4AF37] rounded-xl">
                  Start Chat
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-sm">
              <h3 className="text-xl font-bold text-[#4A3526] mb-2">How long does shipping take?</h3>
              <p className="text-[#5D4037]">Shipping times vary by location. Domestic orders typically arrive within 3-5 business days, while international orders may take 7-14 business days.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-sm">
              <h3 className="text-xl font-bold text-[#4A3526] mb-2">Can I return a product if I'm not satisfied?</h3>
              <p className="text-[#5D4037]">Yes, we offer a 30-day return policy for unused items in their original condition. Please contact our support team to initiate a return.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-sm">
              <h3 className="text-xl font-bold text-[#4A3526] mb-2">Are the products authentic?</h3>
              <p className="text-[#5D4037]">Absolutely. All products are handcrafted by verified artisans and come with authenticity certificates where applicable.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-sm">
              <h3 className="text-xl font-bold text-[#4A3526] mb-2">How do I track my order?</h3>
              <p className="text-[#5D4037]">Once your order ships, you'll receive a tracking number via email. You can also view your order status in your account dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}