"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  description: string;
}

export default function PremiumAlert({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
}: PremiumAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#FDFBF7] rounded-4xl p-0.75 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#F3E5AB] via-[#D4AF37] to-[#8B6508]" />

            <div className="relative bg-[#FFFBF5] rounded-[1.8rem] p-8 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[50px] pointer-events-none"></div>

              <div className="mx-auto w-16 h-16 bg-[#FFF5E1] rounded-full flex items-center justify-center border border-[#D4AF37]/30 mb-6 shadow-sm">
                <AlertTriangle className="w-8 h-8 text-[#D97742]" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-2">
                {title}
              </h3>
              <p className="text-[#8C7B70] mb-8 leading-relaxed">
                {description}
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                  className="h-12 px-6 rounded-xl text-[#8C7B70] hover:bg-[#F2E6D8]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="h-12 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}