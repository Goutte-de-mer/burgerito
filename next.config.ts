import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "svfxlxuiyjd7rt5z.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
