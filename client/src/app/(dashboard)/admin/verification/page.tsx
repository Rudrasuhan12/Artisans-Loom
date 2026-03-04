import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminVerificationDashboard from "@/components/admin/AdminVerificationDashboard";

export default async function AdminVerificationPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch pending verifications
  const pendingVerifications = await prisma.profile.findMany({
    where: {
      verificationStatus: "pending",
      verificationVideoUrl: { not: null },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          _count: { select: { products: true } },
        },
      },
    },
    orderBy: { id: "desc" },
  });

  // Fetch all artisans for overview
  const allArtisans = await prisma.user.findMany({
    where: { role: "ARTISAN" },
    include: {
      profile: true,
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: allArtisans.length,
    verified: allArtisans.filter((a) => a.profile?.isVerified).length,
    pending: pendingVerifications.length,
    unverified: allArtisans.filter(
      (a) => !a.profile?.isVerified && a.profile?.verificationStatus !== "pending"
    ).length,
  };

  return (
    <AdminVerificationDashboard
      pendingVerifications={pendingVerifications}
      allArtisans={allArtisans}
      stats={stats}
    />
  );
}
