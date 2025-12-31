import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-transparent z-0" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Get in Touch
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
              <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3526] mb-1">Our Location</h3>
                    <p className="text-[#5D4037]">123 Heritage Lane, Connaught Place, New Delhi, India 110001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3526] mb-1">Phone</h3>
                    <p className="text-[#5D4037]">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3526] mb-1">Email</h3>
                    <p className="text-[#5D4037]">hello@artisansloom.in</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[#E5DCCA]">
                <h3 className="font-bold text-[#4A3526] mb-4">Business Hours</h3>
                <ul className="space-y-2 text-[#5D4037]">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-6">Send us a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-[#4A3526] font-medium mb-2">First Name</label>
                  <Input id="firstName" placeholder="Your first name" className="h-12 bg-white border-[#E5DCCA] rounded-xl" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[#4A3526] font-medium mb-2">Last Name</label>
                  <Input id="lastName" placeholder="Your last name" className="h-12 bg-white border-[#E5DCCA] rounded-xl" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[#4A3526] font-medium mb-2">Email Address</label>
                <Input id="email" type="email" placeholder="your.email@example.com" className="h-12 bg-white border-[#E5DCCA] rounded-xl" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-[#4A3526] font-medium mb-2">Subject</label>
                <Input id="subject" placeholder="What is this regarding?" className="h-12 bg-white border-[#E5DCCA] rounded-xl" />
              </div>

              <div>
                <label htmlFor="message" className="block text-[#4A3526] font-medium mb-2">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Your message here..." 
                  rows={5}
                  className="bg-white border-[#E5DCCA] rounded-xl" 
                />
              </div>

              <Button className="w-full h-14 bg-[#2F334F] hover:bg-[#1E2135] text-white text-lg font-serif font-bold rounded-xl shadow-lg">
                <Send className="w-5 h-5 mr-2" /> Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}