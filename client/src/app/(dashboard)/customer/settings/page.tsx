import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin } from "lucide-react";
import { updateCustomerProfile } from "@/app/actions/settings";
import { RoyalDivider } from "@/components/ui/royal-divider";

export default async function CustomerSettings() {
  const { userId } = await auth();
  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
    include: { profile: true }
  });

  if (!user?.profile) return null;

  return (
    <div className="max-w-3xl mx-auto min-h-screen pb-20 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-[#4A3526]">Account Settings</h1>
        <p className="text-[#8C7B70] mt-2">Update your contact and shipping details.</p>
      </div>
      <div className="scale-100 opacity-60 flex justify-center"><RoyalDivider /></div>

      <div className="relative group rounded-4xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-xl">
        <Card className="border-none bg-[#FFFBF5] rounded-[1.8rem] overflow-hidden">
          <CardHeader className="bg-[#2F334F] text-[#FDFBF7] p-8 flex flex-row items-center gap-4">
             <div className="h-14 w-14 rounded-full bg-[#FFFBF5]/10 flex items-center justify-center border border-[#D4AF37]/50">
                <User className="w-7 h-7 text-[#D4AF37]" />
             </div>
             <div>
               <CardTitle className="text-2xl font-serif">Personal Details</CardTitle>
               <p className="text-sm text-[#D4AF37]/80">Used for shipping and contact.</p>
             </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form action={updateCustomerProfile} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-[#4A3526] ml-1">Phone Number</label>
                 <Input name="phoneNumber" defaultValue={user.profile.phoneNumber || ""} className="h-12 bg-white border-[#E5DCCA] rounded-xl" />
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-bold text-[#4A3526] ml-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D97742]"/> Address</label>
                 <Input name="streetAddress" defaultValue={user.profile.streetAddress || ""} placeholder="Street Address" className="h-12 bg-white border-[#E5DCCA] rounded-xl mb-4" />
                 <div className="grid grid-cols-3 gap-4">
                    <Input name="city" defaultValue={user.profile.city || ""} placeholder="City" className="h-12 bg-white border-[#E5DCCA] rounded-xl" />
                    <Input name="state" defaultValue={user.profile.state || ""} placeholder="State" className="h-12 bg-white border-[#E5DCCA] rounded-xl" />
                    <Input name="pincode" defaultValue={user.profile.pincode || ""} placeholder="Pincode" className="h-12 bg-white border-[#E5DCCA] rounded-xl" />
                 </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="h-12 px-8 rounded-full bg-[#D97742] hover:bg-[#C26635] text-white shadow-lg text-lg font-serif">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}