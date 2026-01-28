import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Bundle analyzer for performance monitoring
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Only use static export in production to avoid dev server issues
  ...(isProd && { output: "export" }),
  // Force trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment with custom base path (only in production)
  basePath: isProd ? "/converty" : "",
  assetPrefix: isProd ? "/converty" : "",
  // Allow cross-origin requests in development
  allowedDevOrigins: ["172.16.86.102"],
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
