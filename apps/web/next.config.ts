import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/tools"],
  async rewrites() {
    return [
      {
        source: '/script.js',
        destination: 'https://a.cerebro.top/script.js'
      },
      {
        source: '/api/send',
        destination: 'https://a.cerebro.top/api/send'
      }
    ];
  },
};

export default nextConfig;
