import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx"],
  turbopack: {
    resolveAlias: {
      "node:zlib": "./lib/empty.ts",
      "brotli-wasm": "./lib/empty.ts",
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "brotli-wasm": false,
    };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        zlib: false,
        "node:zlib": false,
      };
    }
    return config;
  },
};

export default nextConfig;
