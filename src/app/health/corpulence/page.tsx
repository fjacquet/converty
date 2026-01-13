import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { CorpulenceCalculator } from "./corpulence-calculator";

export const metadata: Metadata = {
  title: "Corpulence Index Calculator",
  description:
    "Calculate your Corpulence Index (Ponderal Index) from weight and height. Compare with BMI.",
  keywords: ["corpulence", "ponderal index", "body composition", "weight", "height", "health"],
};

export default function CorpulencePage() {
  const category = getCategoryBySlug("health")!;

  return (
    <ConverterLayout
      title="Corpulence Index Calculator"
      description="Calculate your Corpulence Index (CI), also known as the Ponderal Index."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <CorpulenceCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
