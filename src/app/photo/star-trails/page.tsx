import { Metadata } from "next";
import { Suspense } from "react";
import { StarTrailsCalculator } from "./star-trails-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Star Trails Calculator",
  description: "Calculate exposure time for desired star trail length and rotation angle.",
  keywords: ["star trails", "astrophotography", "long exposure", "night photography", "rotation"],
};

export default function StarTrailsPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Star Trails Calculator"
      description="Calculate exposure time for star trail photography based on desired rotation."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <StarTrailsCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
