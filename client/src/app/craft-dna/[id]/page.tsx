import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Layers,
  Fingerprint,
  BadgeCheck,
  ExternalLink,
  Award,
  Sparkles,
  Clock,
  Gem,
  Hammer,
  ShieldCheck,
} from "lucide-react";
import CraftDNAQR from "@/components/shop/CraftDNAQR";

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      artisan: {
        include: { profile: true },
      },
    },
  });
}

export default async function CraftDNAPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const artisan = product.artisan;
  const profile = artisan?.profile;
  const createdDate = new Date(product.createdAt);

  // Build the journey timeline
  const journey = [
    {
      icon: Hammer,
      title: "Crafted By Hand",
      detail: `Made by ${artisan?.name || "Traditional Artisan"} using time-honored techniques`,
    },
    {
      icon: MapPin,
      title: "Origin",
      detail: [profile?.city, profile?.state, profile?.country || "India"]
        .filter(Boolean)
        .join(", "),
    },
    {
      icon: Layers,
      title: "Materials",
      detail: product.materials?.join(", ") || "Traditional materials",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      detail: profile?.isVerified
        ? "Artisan identity verified by Artisans Loom"
        : "Authenticity guaranteed by Artisans Loom",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FDF8F0] via-[#FDFBF7] to-[#F5EDE0] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ── HEADER RIBBON ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
            <Fingerprint className="w-4 h-4" />
            Craft DNA &middot; Product Passport
          </div>
        </div>

        {/* ── CERTIFICATE CARD ── */}
        <div className="relative bg-white rounded-[2rem] shadow-2xl border border-[#E5DCCA] overflow-hidden">
          {/* Decorative corner ornaments */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#D4AF37]/30 rounded-tl-[2rem]" />
          <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#D4AF37]/30 rounded-tr-[2rem]" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#D4AF37]/30 rounded-bl-[2rem]" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#D4AF37]/30 rounded-br-[2rem]" />

          {/* ── PRODUCT HERO ── */}
          <div className="relative h-72 sm:h-80 w-full">
            <Image
              src={product.images?.[0] || "/p1.png"}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold mb-1">
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight drop-shadow-lg">
                {product.title}
              </h1>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="px-8 sm:px-12 py-10 space-y-10">
            {/* ID & Date strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#8C7B70] border-b border-dashed border-[#E5DCCA] pb-6">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-mono tracking-wider">
                  ID: {product.id.slice(0, 12).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  Created{" "}
                  {createdDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* ── THE STORY ── */}
            <section>
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#8C7B70] mb-3">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                The Story
              </h2>
              <p className="text-[#5D4037] leading-relaxed text-lg italic font-serif">
                &ldquo;{product.description}&rdquo;
              </p>
            </section>

            {/* ── MATERIALS & TAGS ── */}
            <section className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#8C7B70] mb-3">
                  <Gem className="w-4 h-4 text-[#D4AF37]" />
                  Materials
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials?.length ? (
                    product.materials.map((m, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-[#FDF8F0] border border-[#E5DCCA] rounded-full text-sm text-[#5D4037] font-medium"
                      >
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#8C7B70]">
                      Traditional materials
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#8C7B70] mb-3">
                  <Layers className="w-4 h-4 text-[#D4AF37]" />
                  Craft Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.length ? (
                    product.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-sm text-[#D4AF37] font-medium"
                      >
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#8C7B70]">Handcrafted</span>
                  )}
                </div>
              </div>
            </section>

            {/* ── JOURNEY TIMELINE ── */}
            <section>
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#8C7B70] mb-6">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                Product Journey
              </h2>
              <div className="relative pl-8 space-y-6">
                {/* Vertical line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-[#D4AF37]/10" />
                {journey.map((step, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="absolute -left-8 w-6 h-6 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center">
                      <step.icon className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#4A3526]">
                        {step.title}
                      </p>
                      <p className="text-sm text-[#8C7B70]">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── ARTISAN CARD ── */}
            <section className="bg-[#FDF8F0] rounded-2xl p-6 sm:p-8 border border-[#E5DCCA]">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#8C7B70] mb-5">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                The Artisan
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24 rounded-full border-4 border-[#D4AF37] overflow-hidden shadow-lg shrink-0">
                  <Image
                    src={artisan?.image || "/avatar.png"}
                    alt={artisan?.name || "Artisan"}
                    fill
                    className="object-cover"
                  />
                  {profile?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white shadow">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-serif font-bold text-[#4A3526] flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    {artisan?.name || "Traditional Artisan"}
                    {profile?.isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </h3>
                  {profile?.craftType && (
                    <p className="text-sm text-[#D4AF37] font-semibold mb-1">
                      {profile.craftType}
                    </p>
                  )}
                  <p className="text-sm text-[#8C7B70] mb-2">
                    {[profile?.city, profile?.state]
                      .filter(Boolean)
                      .join(", ") || "India"}{" "}
                    {profile?.yearsOfExperience
                      ? `· ${profile.yearsOfExperience}+ years of experience`
                      : ""}
                  </p>
                  <p className="text-sm text-[#5D4037] leading-relaxed line-clamp-3">
                    {profile?.bio ||
                      "Preserving ancient craft traditions for generations."}
                  </p>
                </div>
              </div>
            </section>

            {/* ── QR CODE & LINKS ── */}
            <section className="flex flex-col items-center gap-6 pt-6 border-t border-dashed border-[#E5DCCA]">
              <p className="text-xs uppercase tracking-widest text-[#8C7B70] font-bold text-center">
                Scan to verify authenticity
              </p>
              <CraftDNAQR productId={product.id} />
              <Link
                href={`/shop/${product.id}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-[#b8962e] transition-colors"
              >
                View Product Page
                <ExternalLink className="w-4 h-4" />
              </Link>
            </section>

            {/* ── FOOTER SEAL ── */}
            <div className="text-center pt-6 border-t border-[#E5DCCA]">
              <div className="inline-flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-1">
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <p className="text-xs font-bold text-[#8C7B70] uppercase tracking-widest">
                  Certified by Artisans Loom
                </p>
                <p className="text-[10px] text-[#B3A89A]">
                  This product passport certifies that the above craft is an
                  authentic, handmade creation supporting Indian artisans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
