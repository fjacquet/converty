import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment with custom base path
  basePath: "/converty",
  assetPrefix: "/converty",
};

export default nextConfig;
