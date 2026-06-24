import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
