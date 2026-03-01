"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Shield,
  AlertTriangle,
  Play,
  Loader2,
  ChevronDown,
  Mail,
  Calendar,
  Package,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewVerification } from "@/app/actions/verification";
import { toast } from "sonner";
import { format } from "date-fns";
import PremiumAvatar from "@/components/ui/premium-avatar";

interface Props {
  pendingVerifications: any[];
  allArtisans: any[];
  stats: {
    total: number;
    verified: number;
    pending: number;
    unverified: number;
  };
}

export default function AdminVerificationDashboard({
  pendingVerifications,
  allArtisans,
  stats,
}: Props) {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (profileId: string) => {
    setProcessingId(profileId);
    startTransition(async () => {
      const result = await reviewVerification(profileId, "approve");
      if (result.success) {
        toast.success("Artisan verified successfully!");
        // Refresh page to update data
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to approve");
      }
      setProcessingId(null);
    });
  };

  const handleReject = async (profileId: string) => {
    setProcessingId(profileId);
    startTransition(async () => {
      const result = await reviewVerification(
        profileId,
        "reject",
        rejectionNote || "Video did not meet verification requirements"
      );
      if (result.success) {
        toast.success("Verification rejected");
        setRejectionNote("");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to reject");
      }
      setProcessingId(null);
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#4A3526] mb-2">
            Artisan Verification
          </h1>
          <p className="text-[#8C7B70]">
            Review and approve artisan verification videos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#E5DCCA] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FFF5E1] rounded-xl">
                <Users className="w-5 h-5 text-[#D97742]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#4A3526]">{stats.total}</p>
                <p className="text-xs text-[#8C7B70]">Total Artisans</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.verified}</p>
                <p className="text-xs text-green-600">Verified</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
                <p className="text-xs text-amber-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5DCCA] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{stats.unverified}</p>
                <p className="text-xs text-gray-500">Unverified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === "pending"
                ? "bg-[#2F334F] text-white"
                : "bg-white text-[#4A3526] border border-[#E5DCCA] hover:bg-[#FFF5E1]"
            }`}
          >
            Pending Reviews ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === "all"
                ? "bg-[#2F334F] text-white"
                : "bg-white text-[#4A3526] border border-[#E5DCCA] hover:bg-[#FFF5E1]"
            }`}
          >
            All Artisans
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "pending" ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {pendingVerifications.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-[#E5DCCA] text-center">
                  <Shield className="w-16 h-16 text-[#E5DCCA] mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-[#4A3526] mb-2">
                    No Pending Verifications
                  </h3>
                  <p className="text-[#8C7B70]">
                    All verification requests have been reviewed.
                  </p>
                </div>
              ) : (
                pendingVerifications.map((profile) => (
                  <motion.div
                    key={profile.id}
                    layout
                    className="bg-white rounded-2xl border border-[#E5DCCA] overflow-hidden shadow-sm"
                  >
                    {/* Header */}
                    <div
                      onClick={() =>
                        setExpandedId(expandedId === profile.id ? null : profile.id)
                      }
                      className="p-6 cursor-pointer hover:bg-[#FDFBF7] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <PremiumAvatar
                            src={profile.user.image}
                            name={profile.user.name || "Artisan"}
                            size="md"
                          />
                          <div>
                            <h3 className="font-bold text-[#4A3526]">
                              {profile.user.name || "Unknown Artisan"}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-[#8C7B70]">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {profile.user.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {profile.user._count?.products || 0} products
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                            Pending Review
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-[#8C7B70] transition-transform ${
                              expandedId === profile.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedId === profile.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-[#E5DCCA]"
                        >
                          <div className="p-6 space-y-6">
                            {/* Artisan Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-[#8C7B70]">Business Name</p>
                                <p className="font-medium text-[#4A3526]">
                                  {profile.businessName || "Not provided"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[#8C7B70]">Craft Type</p>
                                <p className="font-medium text-[#4A3526]">
                                  {profile.craftType || "Not specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[#8C7B70]">Location</p>
                                <p className="font-medium text-[#4A3526]">
                                  {profile.location || "Not provided"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[#8C7B70]">Experience</p>
                                <p className="font-medium text-[#4A3526]">
                                  {profile.yearsOfExperience
                                    ? `${profile.yearsOfExperience} years`
                                    : "Not provided"}
                                </p>
                              </div>
                            </div>

                            {/* Video */}
                            <div>
                              <p className="text-sm font-medium text-[#4A3526] mb-2 flex items-center gap-2">
                                <Play className="w-4 h-4 text-[#D4AF37]" />
                                Verification Video
                              </p>
                              <div className="rounded-xl overflow-hidden border border-[#E5DCCA] bg-black">
                                <video
                                  src={profile.verificationVideoUrl}
                                  controls
                                  className="w-full max-h-80 object-contain"
                                />
                              </div>
                            </div>

                            {/* Rejection Note */}
                            <div>
                              <p className="text-sm font-medium text-[#4A3526] mb-2">
                                Rejection Note (optional)
                              </p>
                              <Textarea
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                placeholder="Provide feedback if rejecting..."
                                className="bg-[#FDFBF7] border-[#E5DCCA]"
                                rows={2}
                              />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                              <Button
                                onClick={() => handleReject(profile.id)}
                                disabled={isPending && processingId === profile.id}
                                variant="outline"
                                className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                              >
                                {isPending && processingId === profile.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4 mr-2" />
                                )}
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleApprove(profile.id)}
                                disabled={isPending && processingId === profile.id}
                                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
                              >
                                {isPending && processingId === profile.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                Approve & Verify
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-[#E5DCCA] overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-[#FDFBF7] border-b border-[#E5DCCA]">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold text-[#8C7B70] uppercase tracking-wider">
                      Artisan
                    </th>
                    <th className="text-left p-4 text-xs font-bold text-[#8C7B70] uppercase tracking-wider">
                      Craft
                    </th>
                    <th className="text-left p-4 text-xs font-bold text-[#8C7B70] uppercase tracking-wider">
                      Products
                    </th>
                    <th className="text-left p-4 text-xs font-bold text-[#8C7B70] uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-left p-4 text-xs font-bold text-[#8C7B70] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allArtisans.map((artisan, index) => (
                    <tr
                      key={artisan.id}
                      className={`border-b border-[#E5DCCA] hover:bg-[#FDFBF7] ${
                        index === allArtisans.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <PremiumAvatar
                            src={artisan.image}
                            name={artisan.name || "Artisan"}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-[#4A3526]">
                              {artisan.name || "Unknown"}
                            </p>
                            <p className="text-xs text-[#8C7B70]">{artisan.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#5D4037]">
                        {artisan.profile?.craftType || "-"}
                      </td>
                      <td className="p-4 text-sm text-[#5D4037]">
                        {artisan._count.products}
                      </td>
                      <td className="p-4 text-sm text-[#8C7B70]">
                        {format(new Date(artisan.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="p-4">
                        {artisan.profile?.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            <BadgeCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : artisan.profile?.verificationStatus === "pending" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        ) : artisan.profile?.verificationStatus === "rejected" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                            Not Submitted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
