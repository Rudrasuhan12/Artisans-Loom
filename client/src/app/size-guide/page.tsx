import { Button } from "@/components/ui/button";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Size Guide
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Find your perfect fit with our comprehensive size guide
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Clothing Size Guide */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
              <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-6">Clothing Size Guide</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[#5D4037]">
                  <thead>
                    <tr className="border-b border-[#E5DCCA]">
                      <th className="text-left py-3 px-4 font-bold">Size</th>
                      <th className="text-left py-3 px-4 font-bold">Chest (in)</th>
                      <th className="text-left py-3 px-4 font-bold">Waist (in)</th>
                      <th className="text-left py-3 px-4 font-bold">Hip (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E5DCCA]">
                      <td className="py-3 px-4">XS</td>
                      <td className="py-3 px-4">32-34</td>
                      <td className="py-3 px-4">24-26</td>
                      <td className="py-3 px-4">34-36</td>
                    </tr>
                    <tr className="border-b border-[#E5DCCA]">
                      <td className="py-3 px-4">S</td>
                      <td className="py-3 px-4">34-36</td>
                      <td className="py-3 px-4">26-28</td>
                      <td className="py-3 px-4">36-38</td>
                    </tr>
                    <tr className="border-b border-[#E5DCCA]">
                      <td className="py-3 px-4">M</td>
                      <td className="py-3 px-4">36-38</td>
                      <td className="py-3 px-4">28-30</td>
                      <td className="py-3 px-4">38-40</td>
                    </tr>
                    <tr className="border-b border-[#E5DCCA]">
                      <td className="py-3 px-4">L</td>
                      <td className="py-3 px-4">38-40</td>
                      <td className="py-3 px-4">30-32</td>
                      <td className="py-3 px-4">40-42</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">XL</td>
                      <td className="py-3 px-4">40-42</td>
                      <td className="py-3 px-4">32-34</td>
                      <td className="py-3 px-4">42-44</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-[#4A3526] mb-4">How to Measure</h3>
                <ul className="space-y-3 text-[#5D4037]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape measure level.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Waist:</strong> Measure around your natural waistline, keeping the tape measure comfortably loose.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Hip:</strong> Measure around the fullest part of your hips, keeping the tape measure level.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Jewelry Size Guide */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
              <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-6">Jewelry Size Guide</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[#5D4037]">
                  <thead>
                    <tr className="border-b border-[#E5DCCA]">
                      <th className="text-left py-3 px-4 font-bold">Item</th>
                      <th className="text-left py-3 px-4 font-bold">Size</th>
                      <th className="text-left py-3 px-4 font-bold">Measurement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E5DCCA]">
                      <td className="py-3 px-4">Rings</td>
                      <td className="py-3 px-4">Size 6</td>
                      <td className="py-3 px-4">16.5mm diameter</td>
                    </tr>
                    <tr className="border-b border-[#E5DCCA]">
                      <td className="py-3 px-4">Rings</td>
                      <td className="py-3 px-4">Size 7</td>
                      <td className="py-3 px-4">17.3mm diameter</td>
                    </tr>
                    <tr className="border-b border-[#E5DCCA]">
                      <td className="py-3 px-4">Rings</td>
                      <td className="py-3 px-4">Size 8</td>
                      <td className="py-3 px-4">18.1mm diameter</td>
                    </tr>
                    <tr className="border-b border-[#E5DCCA]">
                      <td className="py-3 px-4">Bracelets</td>
                      <td className="py-3 px-4">Small</td>
                      <td className="py-3 px-4">6.5 inches</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Bracelets</td>
                      <td className="py-3 px-4">Medium</td>
                      <td className="py-3 px-4">7 inches</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-[#4A3526] mb-4">Jewelry Measurement Tips</h3>
                <ul className="space-y-3 text-[#5D4037]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Measure your finger at the end of the day when fingers are warmest for the most accurate fit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>If you're between sizes, we recommend going up to the next size for rings.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>For bracelets, measure the circumference of your wrist and add 0.5 inches for comfort.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Textile & Home Decor Guide */}
          <div className="mt-12 bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-6">Textiles & Home Decor Size Guide</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-4">Saree Sizes</h3>
                <ul className="space-y-3 text-[#5D4037]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Standard:</strong> Length: 5.5-6 meters, Width: 1.1-1.2 meters</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Handloom:</strong> Length: 5.25 meters, Width: 1 meter</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Pure Silk:</strong> Length: 6 meters, Width: 1.25 meters</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-4">Carpet & Rug Sizes</h3>
                <ul className="space-y-3 text-[#5D4037]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Small:</strong> 2x3 feet (6x9 feet)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Medium:</strong> 4x6 feet (24 sq ft)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Large:</strong> 8x10 feet (80 sq ft)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span><strong>Extra Large:</strong> 9x12 feet (108 sq ft)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#E5DCCA]">
              <h3 className="text-xl font-bold text-[#4A3526] mb-4">General Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E5DCCA]">
                  <h4 className="font-bold text-[#4A3526] mb-2">Handmade Variations</h4>
                  <p className="text-[#5D4037] text-sm">Due to the handmade nature of our products, slight size variations are normal and add to the uniqueness of each piece.</p>
                </div>
                <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E5DCCA]">
                  <h4 className="font-bold text-[#4A3526] mb-2">Care Instructions</h4>
                  <p className="text-[#5D4037] text-sm">Follow specific care instructions for each product to maintain size and shape over time.</p>
                </div>
                <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E5DCCA]">
                  <h4 className="font-bold text-[#4A3526] mb-2">Questions?</h4>
                  <p className="text-[#5D4037] text-sm">Contact our customer service team if you need help determining the right size for your purchase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}