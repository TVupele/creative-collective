import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pre-launch: the root URL shows the "launching soon" page. `beforeFiles`
  // runs ahead of app/page.tsx, so the full homepage is kept intact and every
  // other route (/shop, /join, /admin, …) is unaffected. Delete this block to
  // put the real homepage back at "/".
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/coming-soon" }],
      afterFiles: [],
      fallback: [],
    };
  },
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
