import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  // Enable experimental features if needed
  experimental: {
    // This is needed for path aliases to work in some cases
    externalDir: true,
  },
};

export default nextConfig;
