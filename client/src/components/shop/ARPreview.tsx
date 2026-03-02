"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  CameraOff,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  Download,
  Smartphone,
  Maximize2,
  Lock,
  Unlock,
  SunMedium,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ARPreviewProps {
  productImage: string;
  productTitle: string;
  category: string;
  onClose: () => void;
}

export default function ARPreview({
  productImage,
  productTitle,
  category,
  onClose,
}: ARPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [productPosition, setProductPosition] = useState({ x: 50, y: 50 }); // percentage
  const [productScale, setProductScale] = useState(40); // percentage of container width
  const [productRotation, setProductRotation] = useState(0);
  const [productFlipped, setProductFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [opacity, setOpacity] = useState(85);
  const [isLocked, setIsLocked] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(
        "Camera access denied. Please allow camera permissions to use AR Preview."
      );
    }
  }, [facingMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Switch camera
  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, [stopCamera]);

  useEffect(() => {
    if (facingMode) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Auto-hide tips after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTips(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isLocked) return;
      e.preventDefault();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      dragStartRef.current = {
        x: clientX,
        y: clientY,
        posX: productPosition.x,
        posY: productPosition.y,
      };
      setIsDragging(true);
    },
    [isLocked, productPosition]
  );

  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || isLocked) return;
      e.preventDefault();

      const container = containerRef.current;
      if (!container) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      const deltaX = ((clientX - dragStartRef.current.x) / rect.width) * 100;
      const deltaY = ((clientY - dragStartRef.current.y) / rect.height) * 100;

      setProductPosition({
        x: Math.max(0, Math.min(100, dragStartRef.current.posX + deltaX)),
        y: Math.max(0, Math.min(100, dragStartRef.current.posY + deltaY)),
      });
    },
    [isDragging, isLocked]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Capture screenshot
  const captureScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw product overlay
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = (productScale / 100) * canvas.width;
      const x = (productPosition.x / 100) * canvas.width - size / 2;
      const y = (productPosition.y / 100) * canvas.height - size / 2;

      ctx.save();
      ctx.globalAlpha = opacity / 100;
      ctx.translate(x + size / 2, y + size / 2);
      ctx.rotate((productRotation * Math.PI) / 180);
      if (productFlipped) ctx.scale(-1, 1);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();

      // Download
      const link = document.createElement("a");
      link.download = `ar-preview-${productTitle.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = productImage;
  }, [productImage, productTitle, productScale, productPosition, productRotation, productFlipped, opacity]);

  // Determine product size presets based on category
  const getSizePresets = () => {
    const lower = category.toLowerCase();
    if (lower.includes("rug") || lower.includes("textile") || lower.includes("carpet"))
      return { small: 30, medium: 50, large: 70, label: "Rug/Textile" };
    if (lower.includes("painting") || lower.includes("art") || lower.includes("wall"))
      return { small: 20, medium: 35, large: 55, label: "Wall Art" };
    if (lower.includes("pottery") || lower.includes("vase") || lower.includes("decor"))
      return { small: 15, medium: 25, large: 40, label: "Decor" };
    return { small: 20, medium: 35, large: 50, label: "Product" };
  };

  const presets = getSizePresets();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
      >
        {/* Camera Feed */}
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden"
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Fallback when no camera - show a room background */}
          {!cameraActive && !cameraError && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6D3] via-[#E8D5C0] to-[#D4C4AE] flex items-center justify-center">
              <div className="text-center space-y-4">
                <Camera className="w-16 h-16 mx-auto text-[#8C7B70] animate-pulse" />
                <p className="text-[#5D4037] text-lg">Starting camera...</p>
              </div>
            </div>
          )}

          {/* Camera Error */}
          {cameraError && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C1810] to-[#1a0f0a] flex items-center justify-center p-8">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                  <CameraOff className="w-10 h-10 text-red-400" />
                </div>
                <div>
                  <p className="text-white text-lg font-serif mb-2">Camera Not Available</p>
                  <p className="text-gray-400 text-sm">{cameraError}</p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={startCamera}
                    className="w-full bg-[#D4AF37] hover:bg-[#B8961F] text-white"
                  >
                    Try Again
                  </Button>
                  <p className="text-gray-500 text-xs">
                    Tip: You can still drag the product over the background to preview it
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Product Overlay */}
          <div
            className={`absolute select-none ${
              isLocked ? "cursor-not-allowed" : isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              left: `${productPosition.x}%`,
              top: `${productPosition.y}%`,
              width: `${productScale}%`,
              transform: `translate(-50%, -50%) rotate(${productRotation}deg) ${
                productFlipped ? "scaleX(-1)" : ""
              }`,
              opacity: opacity / 100,
              transition: isDragging ? "none" : "all 0.15s ease-out",
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            {/* Product image */}
            <div className="relative w-full aspect-square">
              <Image
                src={productImage}
                alt={productTitle}
                fill
                className="object-contain drop-shadow-2xl pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Drag handle indicator */}
            {!isLocked && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                <Move className="w-3 h-3 text-white" />
                <span className="text-[10px] text-white/80 font-medium">Drag to move</span>
              </div>
            )}

            {/* Selection border when not locked */}
            {!isLocked && (
              <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-lg pointer-events-none" />
            )}
          </div>

          {/* Tips overlay */}
          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-2xl p-4 max-w-sm text-center"
              >
                <div className="flex items-center gap-2 text-white mb-2">
                  <Info className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-semibold">AR Preview Tips</span>
                </div>
                <ul className="text-xs text-gray-300 space-y-1 text-left">
                  <li>• Point camera at your wall or floor</li>
                  <li>• Drag the product to position it</li>
                  <li>• Use controls below to resize & rotate</li>
                  <li>• Tap 📸 to save a screenshot</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 via-black/20 to-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-white font-serif text-sm font-semibold truncate max-w-[200px]">
                  {productTitle}
                </h3>
                <span className="text-white/60 text-xs">AR Preview</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={switchCamera}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                title="Switch Camera"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTips(true)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                title="Show Tips"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pb-8 pt-16 px-4">
            {/* Size Presets */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-white/50 text-xs">{presets.label} Size:</span>
              {[
                { label: "S", value: presets.small },
                { label: "M", value: presets.medium },
                { label: "L", value: presets.large },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setProductScale(preset.value)}
                  className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                    Math.abs(productScale - preset.value) < 3
                      ? "bg-[#D4AF37] text-white scale-110"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Opacity Slider */}
            <div className="flex items-center gap-3 max-w-xs mx-auto mb-4">
              <SunMedium className="w-4 h-4 text-white/50" />
              <input
                type="range"
                min={20}
                max={100}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="flex-1 h-1 accent-[#D4AF37] cursor-pointer"
              />
              <span className="text-white/50 text-xs w-8">{opacity}%</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setProductScale((s) => Math.max(10, s - 5))}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setProductRotation((r) => (r + 15) % 360)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Rotate"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Capture Button */}
              <button
                onClick={captureScreenshot}
                className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-white shadow-lg shadow-[#D4AF37]/30 hover:bg-[#B8961F] transition-all hover:scale-105 active:scale-95"
                title="Capture Screenshot"
              >
                <Download className="w-6 h-6" />
              </button>

              <button
                onClick={() => setProductFlipped((f) => !f)}
                className={`w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center text-white transition-colors ${
                  productFlipped ? "bg-[#D4AF37]/50" : "bg-white/10 hover:bg-white/20"
                }`}
                title="Flip"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>

              <button
                onClick={() => setProductScale((s) => Math.min(90, s + 5))}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Lock & Fullscreen */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setIsLocked((l) => !l)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  isLocked
                    ? "bg-[#D4AF37] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {isLocked ? "Locked" : "Lock Position"}
              </button>
              <button
                onClick={() => {
                  setProductPosition({ x: 50, y: 50 });
                  setProductScale(presets.medium);
                  setProductRotation(0);
                  setProductFlipped(false);
                  setOpacity(85);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-medium hover:bg-white/20 transition-all"
              >
                <Maximize2 className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
