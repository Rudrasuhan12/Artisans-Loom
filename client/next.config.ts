import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allows loading SVG placeholders from placehold.co
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.transparenttextures.com" },
      { protocol: "https", hostname: "placehold.co" },
      // Search Engines & CDNs (Consolidated)
      { protocol: "https", hostname: "**.bing.com" },
      { protocol: "https", hostname: "**.bing.net" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      // Social Media & E-commerce (Consolidated)
      { protocol: "https", hostname: "**.pinimg.com" },
      { protocol: "https", hostname: "**.shopify.com" },
      { protocol: "https", hostname: "**.etsystatic.com" },
      { protocol: "https", hostname: "**.imimg.com" },
      { protocol: "https", hostname: "**.wordpress.com" },
      { protocol: "https", hostname: "**.alamy.com" },
      { protocol: "https", hostname: "**.medium.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      // News & Indian Heritage (Consolidated)
      { protocol: "https", hostname: "**.s3waas.gov.in" },
      { protocol: "https", hostname: "**.revv.co.in" },
      { protocol: "https", hostname: "**.toiimg.com" },
      { protocol: "https", hostname: "**.cottage9.com" },
      { protocol: "https", hostname: "static.toiimg.com" },
      // Specific Artisan & Craft Sites
      { protocol: "https", hostname: "traditionalartofnepal.com" },
      { protocol: "https", hostname: "magikindia.com" },
      { protocol: "https", hostname: "tripinic.com" },
      { protocol: "https", hostname: "arts.mojarto.com" },
      { protocol: "https", hostname: "whatshelikes.in" },
      { protocol: "https", hostname: "infinitylearn.com" },
      { protocol: "https", hostname: "shaadiwish.com" },
      { protocol: "https", hostname: "mapacademy.io" },
      { protocol: "https", hostname: "www.indiaunveiled.in" },
      { protocol: "https", hostname: "www.iasgyan.in" },
      { protocol: "https", hostname: "www.gitagged.com" },
      { protocol: "https", hostname: "tiimg.tistatic.com" },
      { protocol: "https", hostname: "cdn.magicdecor.in" },
      { protocol: "https", hostname: "www.iiad.edu.in" },
      { protocol: "https", hostname: "www.golokaso.com" },
      { protocol: "https", hostname: "www.garhatours.in" },
      { protocol: "https", hostname: "travelsetu.com" },
      { protocol: "https", hostname: "cdn.exoticindia.com" },
      { protocol: "https", hostname: "www.oddessemania.in" },
      { protocol: "https", hostname: "singhanias.in" },
      { protocol: "https", hostname: "uniquelytelangana.in" },
      { protocol: "https", hostname: "cdn.yehaindia.com" },
      { protocol: "https", hostname: "tasidola.com" }
    ],
  },
};

export default nextConfig;