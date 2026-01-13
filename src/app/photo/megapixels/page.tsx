import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { MegapixelCalculator } from "./megapixel-calculator";

export const metadata: Metadata = {
  title: "Megapixel Calculator",
  description: "Calculate megapixels from image width and height. Find total pixel count.",
  keywords: ["megapixel", "resolution", "image", "width", "height", "pixels"],
};

export default function MegapixelsPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Megapixel Calculator"
      description="Calculate megapixels from image dimensions."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <MegapixelCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
