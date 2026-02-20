/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "svfxlxuiyjd7rt5z.public.blob.vercel-storage.com",
      },
    ],
  },
};

module.exports = nextConfig;
