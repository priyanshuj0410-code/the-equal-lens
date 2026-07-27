import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/join", destination: "/careers", permanent: true }];
  },
};

export default nextConfig;
