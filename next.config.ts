import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://lh3.googleusercontent.com/**')]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '999mb',
    }
  }
};

export default nextConfig;
