import { Button } from "@/components/ui/button";
import { Shield, Eye, Lock, User, FileText } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-transparent z-0" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Privacy Policy
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Information about how we collect, use, and protect your personal data
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
                  <Shield className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">1. Information We Collect</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Account information (name, email address, phone number)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Payment information (processed securely by third-party providers)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Shipping and billing addresses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Order history and preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Communication preferences and customer service interactions</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">2. How We Use Your Information</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Process and fulfill your orders</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Communicate with you about your orders and account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Provide customer support and respond to your inquiries</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Send you marketing communications (with your consent)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Improve our services and personalize your experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Comply with legal obligations</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">3. Data Security</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="space-y-3 text-[#5D4037] pl-6 mt-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Encryption of sensitive data in transit and at rest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Secure access controls and authentication</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Employee training on data protection practices</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">4. Your Rights</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul className="space-y-3 text-[#5D4037] pl-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Access to your personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Correction of inaccurate information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Deletion of your personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Restriction of processing in certain circumstances</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Data portability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Objection to processing</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">5. Third-Party Services</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed">
                We may use third-party services for payment processing, analytics, and other functions. These services may collect information as part of their operations. We only work with providers that maintain appropriate security measures and privacy standards.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">6. Data Retention</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. The specific retention period depends on the type of information and the purpose for which it was collected.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A3526]">7. Contact Us</h2>
              </div>
              <p className="text-[#5D4037] leading-relaxed">
                If you have questions about this privacy policy or concerns about our data practices, please contact us at hello@artisansloom.in or through our Contact Us page.
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
            Accept Policy
          </Button>
        </div>
      </div>
    </div>
  );
}