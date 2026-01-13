import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { SEOAnalyzer } from "./seo-analyzer";

export const metadata: Metadata = {
  title: "SEO Performance Analyzer",
  description: "Analyze page SEO metrics and get optimization recommendations.",
  keywords: ["seo", "performance", "optimization", "meta tags", "content", "analysis"],
};

export default function SEOPerformancePage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="SEO Performance Analyzer"
      description="Analyze your page's SEO metrics and get recommendations."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <SEOAnalyzer />
      </Suspense>
    </ConverterLayout>
  );
}
