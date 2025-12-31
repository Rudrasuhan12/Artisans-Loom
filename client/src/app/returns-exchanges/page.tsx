import { Button } from "@/components/ui/button";
import { Package, RotateCcw, Calendar, FileText } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";

export default function ReturnsExchangesPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-transparent z-0" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Returns & Exchanges
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Our simple return and exchange process for your satisfaction
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        {/* Return Policy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">30-Day Window</h3>
            <p className="text-[#5D4037]">
              Returns accepted within 30 days of delivery
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Original Condition</h3>
            <p className="text-[#5D4037]">
              Items must be unused and in original packaging
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Easy Process</h3>
            <p className="text-[#5D4037]">
              Simple steps to return or exchange your items
            </p>
          </div>
        </div>

        {/* Return Policy Details */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg mb-20">
          <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">Return Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-3">Eligibility</h3>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Items must be returned within 30 days of delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Items must be in original, unused condition with all tags attached</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Original packaging must be included</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Proof of purchase is required</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-3">Non-Returnable Items</h3>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Custom or personalized items</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Items marked as final sale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Undergarments or items in contact with skin for hygiene reasons</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg mb-20">
          <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">Exchange Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-3">Eligibility</h3>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Exchanges must be requested within 30 days of delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Items must be in original, unused condition</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Size or color exchanges are allowed for the same product</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Product availability is required for exchanges</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-3">Exchange Process</h3>
              <ol className="space-y-3 text-[#5D4037] pl-6 list-decimal">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">1.</span>
                  <span>Contact us to initiate the exchange request</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">2.</span>
                  <span>Ship the original item back to us using the provided return label</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">3.</span>
                  <span>Once received, we'll ship the replacement item</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg mb-20">
          <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">How to Return an Item</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Contact Us</h3>
                  <p className="text-[#5D4037]">
                    Reach out to our customer service team via email or phone to initiate a return. Provide your order number and reason for return.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Pack the Item</h3>
                  <p className="text-[#5D4037]">
                    Securely pack the item in its original packaging. Include all tags, accessories, and documentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Ship Back</h3>
                  <p className="text-[#5D4037]">
                    Use the return label provided by our customer service team to ship the item back to us.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Refund Processed</h3>
                  <p className="text-[#5D4037]">
                    Once received and inspected, we'll process your refund to the original payment method.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E5DCCA]">
              <h3 className="text-xl font-bold text-[#4A3526] mb-6">Return Form</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-[#4A3526] font-medium mb-2">Order Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AL-12345" 
                    className="w-full h-12 px-4 border border-[#E5DCCA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A3526] font-medium mb-2">Item to Return</label>
                  <input 
                    type="text" 
                    placeholder="Product name" 
                    className="w-full h-12 px-4 border border-[#E5DCCA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#4A3526] font-medium mb-2">Reason for Return</label>
                  <select className="w-full h-12 px-4 border border-[#E5DCCA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white">
                    <option value="">Select a reason</option>
                    <option value="wrong-size">Wrong Size</option>
                    <option value="not-as-expected">Not as Expected</option>
                    <option value="quality-issue">Quality Issue</option>
                    <option value="changed-mind">Changed Mind</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A3526] font-medium mb-2">Additional Comments</label>
                  <textarea 
                    placeholder="Please provide any additional information" 
                    rows={4}
                    className="w-full px-4 py-3 border border-[#E5DCCA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white"
                  ></textarea>
                </div>

                <Button className="w-full h-12 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
                  Submit Return Request
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg">
          <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">Refund Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-4">Refund Timeline</h3>
              <ul className="space-y-3 text-[#5D4037]">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Processing: 3-5 business days after receiving the item</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Bank/Credit card: Additional 5-10 business days</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#4A3526] mb-4">Refund Method</h3>
              <ul className="space-y-3 text-[#5D4037]">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Refunds are issued to the original payment method</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Original shipping costs are non-refundable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Return shipping costs may be deducted from refund</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}