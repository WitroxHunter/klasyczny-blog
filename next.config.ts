import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = {
  images: {
    remotePatterns: [new URL("https://thispersondoesnotexist.com/")],
  },
};
export default nextConfig;
