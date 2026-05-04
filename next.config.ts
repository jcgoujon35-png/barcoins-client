import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/marketing',
        destination: '/marketing/index.html',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
