import { Metadata } from "next";
import { Suspense } from "react";
import { PortraitDistanceCalculator } from "./portrait-distance-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Portrait Distance Calculator",
  description: "Calculate ideal shooting distance for portraits based on focal length and composition.",
  keywords: ["portrait", "distance", "focal length", "photography", "composition", "headshot"],
};

export default function PortraitDistancePage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Portrait Distance Calculator"
      description="Find the ideal distance for portrait photography."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <PortraitDistanceCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
