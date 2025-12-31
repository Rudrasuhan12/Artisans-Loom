import { Button } from "@/components/ui/button";
import { FileText, Scale, Shield, User } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-transparent z-0" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Terms of Service
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Legal terms governing your use of The Artisan's Loom platform
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg">
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">1. Acceptance of Terms</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed">
                By accessing and using The Artisan's Loom website and services, you accept and agree to be bound by the following terms and conditions. If you do not agree to these terms, you may not use our services.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">2. User Responsibilities</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-4">
                When using our platform, you agree to:
              </p>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Provide accurate and complete information during registration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Maintain the security of your account credentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Notify us immediately of any unauthorized use of your account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Use the platform in compliance with applicable laws</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Not use the platform for any illegal or unauthorized purpose</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">3. Product Information</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-4">
                All products featured on our platform are handcrafted by artisans. We strive to provide accurate descriptions and images of our products. However, please note:
              </p>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Colors may vary slightly due to photography and screen settings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Handmade items may have slight variations from the images shown</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Product dimensions are approximate and may vary slightly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>We do not make warranties beyond what is explicitly stated</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">4. Intellectual Property</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-4">
                The Artisan's Loom and its licensors own all intellectual property rights in the platform and its content. This includes:
              </p>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>All trademarks, service marks, and trade names</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>All designs, text, graphics, and other material</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>All software and code underlying the platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Artisan designs and creative works (with respective ownership)</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">5. Limitation of Liability</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed">
                The Artisan's Loom shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of our platform.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">6. Changes to Terms</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed">
                We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting to the website. Your continued use of the platform after changes are posted constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">7. Contact Information</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed">
                If you have questions about these Terms of Service, please contact us at hello@artisansloom.in or through our Contact Us page.
              </p>
            </div>

            <div className="pt-8 border-t border-[#E5DCCA]">
              <p className="text-[#8C7B70] text-sm text-center">
                Last updated: December 31, 2025
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button className="h-12 px-8 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
            Accept Terms
          </Button>
        </div>
      </div>
    </div>
  );
}