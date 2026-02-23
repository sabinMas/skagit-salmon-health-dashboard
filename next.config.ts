import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow MDX files as pages
  pageExtensions: ["ts", "tsx", "mdx"],

  // Enable gzip compression for all responses
  compress: true,

  // Remove the X-Powered-By: Next.js header
  poweredByHeader: false,

  // Long-lived cache headers for static assets that don't change between deploys
  async headers() {
    return [
      {
        // GeoJSON watershed boundaries are versioned by content; safe to cache for a year
        source: "/data/puget-sound-watersheds.geojson",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
