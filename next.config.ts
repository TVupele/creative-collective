import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos are uploaded to Vercel Blob (see app/api/admin/upload).
    // next/image refuses to optimise remote hosts that aren't listed here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
