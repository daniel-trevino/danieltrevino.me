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
};

export default nextConfig;
