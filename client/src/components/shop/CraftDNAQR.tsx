"use client";

import QRCode from "react-qr-code";


interface CraftDNAQRProps {
  productId: string;
  size?: number;
}

export default function CraftDNAQR({ productId, size = 140 }: CraftDNAQRProps) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/craft-dna/${productId}`
      : `/craft-dna/${productId}`;

  return (
    <div className="bg-white p-4 rounded-xl shadow-inner border border-[#E5DCCA]">
      <QRCode
        value={url}
        size={size}
        bgColor="#FFFFFF"
        fgColor="#4A3526"
        level="M"
      />
    </div>
  );
}
