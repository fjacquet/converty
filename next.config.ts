import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment with custom base path
  basePath: "/converty",
  assetPrefix: "/converty",
};

export default withNextIntl(nextConfig);
