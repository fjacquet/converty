import { Metadata } from "next";
import { Suspense } from "react";
import { FootLambertCalculator } from "./foot-lambert-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Foot-Lambert Calculator",
  description: "Calculate screen luminance in foot-lamberts, nits, and lumens for cinema and home theater.",
  keywords: ["foot-lambert", "nits", "luminance", "cinema", "projection", "brightness"],
};

export default function FootLambertPage() {
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title="Foot-Lambert Calculator"
      description="Calculate screen luminance for cinema and projection."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <FootLambertCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
