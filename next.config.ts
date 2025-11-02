import type { NextConfig } from "next";

const nextConfig: NextConfig & { eslint: { ignoreDuringBuilds: boolean } } = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thispersondoesnotexist.com",
      },
    ],
  },
};

export default nextConfig;
