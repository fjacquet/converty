import { Metadata } from "next";
import { Suspense } from "react";
import { AspectFitCalculator } from "./aspect-fit-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Aspect Fit Calculator",
  description: "Calculate how an image fits on a screen. Find letterbox/pillarbox dimensions.",
  keywords: ["aspect fit", "letterbox", "pillarbox", "image", "screen", "resize"],
};

export default function AspectFitPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Aspect Fit Calculator"
      description="Calculate how an image fits on a screen with letterboxing."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <AspectFitCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
