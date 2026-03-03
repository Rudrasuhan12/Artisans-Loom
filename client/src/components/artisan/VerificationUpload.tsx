"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Video,
  Upload,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Play,
  Info,
} from "lucide-react";
import { submitVerificationVideo } from "@/app/actions/verification";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface VerificationUploadProps {
  isVerified: boolean;
  verificationStatus: string;
  verificationNote?: string | null;
}

type VerificationState = {
  isVerified: boolean;
  status: string;
  videoUrl: string | null;
  note: string | null;
};

export default function VerificationUpload({ 
  isVerified, 
  verificationStatus, 
  verificationNote 
}: VerificationUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationState, setVerificationState] = useState<VerificationState>({
    isVerified,
    status: verificationStatus,
    videoUrl: null,
    note: verificationNote || null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error("Video must be under 50MB");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a video file.");
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Cloudinary via API route
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/upload-verification", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        toast.error(data.error || "Upload failed");
        setIsUploading(false);
        return;
      }

      const url = data.url;

      // Submit for verification
      const result = await submitVerificationVideo(url);

      if (result.success) {
        toast.success("Verification video submitted! We'll review it shortly.");
        setVerificationState({
          isVerified: false,
          status: "pending",
          videoUrl: url,
          note: null,
        });
        setFile(null);
        setPreview(null);
      } else {
        toast.error(result.error || "Submission failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 border border-[#E5DCCA] rounded-2xl bg-white/50">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
          <span className="text-[#8C7B70]">Loading verification status...</span>
        </div>
      </div>
    );
  }

  // Already verified
  if (verificationState?.isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-2 border-green-200 rounded-2xl bg-green-50/50"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-green-800">Verified Artisan</h3>
            <p className="text-sm text-green-600">
              Your craft has been authenticated. The verified badge is now visible on your profile and products.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Pending verification
  if (verificationState?.status === "pending") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-2 border-amber-200 rounded-2xl bg-amber-50/50"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-full">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-800">Verification Pending</h3>
            <p className="text-sm text-amber-600 mt-1">
              Your verification video is being reviewed. This usually takes 24-48 hours.
            </p>
            {verificationState.videoUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-amber-200">
                <video
                  src={verificationState.videoUrl}
                  controls
                  className="w-full max-h-48 object-cover bg-black"
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Rejected - can resubmit
  if (verificationState?.status === "rejected") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="p-6 border-2 border-red-200 rounded-2xl bg-red-50/50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-800">Verification Not Approved</h3>
              <p className="text-sm text-red-600 mt-1">
                {verificationState.note || "Your video didn't meet our verification requirements."}
              </p>
              <p className="text-sm text-red-500 mt-2">
                You can submit a new video below.
              </p>
            </div>
          </div>
        </div>

        {/* Show upload form for resubmission */}
        {renderUploadForm()}
      </motion.div>
    );
  }

  // No verification submitted yet
  function renderUploadForm() {
    return (
      <div className="p-6 border border-[#E5DCCA] rounded-2xl bg-white/80 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FFF5E1] rounded-full">
            <Video className="w-6 h-6 text-[#D97742]" />
          </div>
          <div>
            <h3 className="font-bold text-[#4A3526]">Get Verified</h3>
            <p className="text-sm text-[#8C7B70] mt-1">
              Upload a short video (30-60 seconds) showing your craft process to earn the Verified Artisan badge.
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#E5DCCA] space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#4A3526]">
            <Info className="w-4 h-4 text-[#D4AF37]" />
            Video Guidelines:
          </div>
          <ul className="text-xs text-[#8C7B70] space-y-1 ml-6 list-disc">
            <li>Show yourself creating or working on your craft</li>
            <li>Include your workspace or studio</li>
            <li>30-60 seconds duration recommended</li>
            <li>Good lighting and clear video quality</li>
            <li>Maximum file size: 50MB</li>
          </ul>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.button
              key="upload-button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-[#D4AF37]/30 rounded-xl bg-[#FDFBF7] hover:bg-[#FFF5E1] hover:border-[#D4AF37] transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                <Upload className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#4A3526]">Click to upload video</p>
                <p className="text-xs text-[#8C7B70]">MP4, MOV, or WebM up to 50MB</p>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="relative rounded-xl overflow-hidden border border-[#E5DCCA]">
                <video
                  src={preview}
                  controls
                  className="w-full max-h-64 object-cover bg-black"
                />
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#8C7B70]">
                <Play className="w-4 h-4" />
                {file?.name} ({(file!.size / 1024 / 1024).toFixed(2)} MB)
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={clearFile}
                  variant="outline"
                  className="flex-1 h-12 border-[#E5DCCA] hover:bg-[#FFF5E1]"
                >
                  Choose Different
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 h-12 bg-[#2F334F] hover:bg-[#1E2135] text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return renderUploadForm();
}
