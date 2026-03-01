import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, Shield, Database } from "lucide-react";

export default async function AdminSettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const settingsSections = [
    {
      title: "Notifications",
      description: "Configure admin notification preferences",
      icon: Bell,
      status: "Coming Soon"
    },
    {
      title: "Security",
      description: "Manage security settings and access controls",
      icon: Shield,
      status: "Coming Soon"
    },
    {
      title: "Database",
      description: "Database maintenance and backup options",
      icon: Database,
      status: "Coming Soon"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A3526]">Admin Settings</h1>
        <p className="text-[#8C7B70] mt-1">Configure platform settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => (
          <Card key={section.title} className="border-none shadow-md opacity-75">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-[#4A3526] flex items-center gap-2">
                <section.icon className="w-5 h-5 text-[#D4AF37]" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#8C7B70] mb-4">{section.description}</p>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                {section.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-[#4A3526] flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Admin Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-[#8C7B70]">Name</span>
              <span className="font-medium text-[#4A3526]">{user.name || "Not set"}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-[#8C7B70]">Email</span>
              <span className="font-medium text-[#4A3526]">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-[#8C7B70]">Role</span>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[#8C7B70]">Member Since</span>
              <span className="font-medium text-[#4A3526]">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
