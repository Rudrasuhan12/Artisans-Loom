import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { updateArtisanProfile } from "@/app/actions/settings";
import { RoyalDivider } from "@/components/ui/royal-divider";

export default async function SettingsPage() {
  const { userId } = await auth();
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
    include: { profile: true }
  });

  if (!user || !user.profile) return null;

  return (
    <div className="space-y-8 min-h-screen pb-20 max-w-3xl mx-auto">

      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-[#4A3526]">Studio Settings</h1>
        <p className="text-[#8C7B70] mt-2">Manage your public profile and account details.</p>
      </div>
      
      <div className="flex justify-center scale-100 opacity-60"><RoyalDivider /></div>
      <div className="relative group rounded-4xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-xl">
        <Card className="border-none bg-[#FFFBF5] rounded-[1.8rem] overflow-hidden">
          <CardHeader className="bg-[#2F334F] text-[#FDFBF7] p-8 flex flex-row items-center gap-4">
             <div className="h-16 w-16 rounded-full bg-[#FFFBF5]/10 flex items-center justify-center border border-[#D4AF37]/50">
                <User className="w-8 h-8 text-[#D4AF37]" />
             </div>
             <div>
               <CardTitle className="text-2xl font-serif">Artisan Profile</CardTitle>
               <p className="text-sm text-[#D4AF37]/80">This information is visible to customers.</p>
             </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form action={updateArtisanProfile} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4A3526] ml-1">Business Name</label>
                  <Input 
                    name="businessName" 
                    defaultValue={user.profile.businessName || ""} 
                    className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4A3526] ml-1">Location</label>
                  <Input 
                    name="location" 
                    defaultValue={user.profile.location || ""} 
                    className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#4A3526] ml-1">Bio / Story</label>
                <Textarea 
                  name="bio" 
                  defaultValue={user.profile.bio || ""} 
                  rows={5}
                  className="bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl resize-none"
                />
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