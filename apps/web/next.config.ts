import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@repo/tools": path.resolve(__dirname, "../../packages/tools/src"),
    };
    return config;
  },
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
