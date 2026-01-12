import { Metadata } from "next";
import { Suspense } from "react";
import { SpotStarsCalculator } from "./spot-stars-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Spot Stars Calculator (NPF Rule)",
  description: "Calculate maximum exposure time to prevent star trailing for Milky Way photography.",
  keywords: ["spot stars", "npf rule", "milky way", "astrophotography", "exposure", "500 rule"],
};

export default function SpotStarsPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Spot Stars Calculator"
      description="Calculate maximum exposure time to capture stars as points without trailing."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <SpotStarsCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
