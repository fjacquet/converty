import { Metadata } from "next";
import { Suspense } from "react";
import { MegapixelAspectsCalculator } from "./megapixel-aspects-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Megapixel Aspects",
  description: "View megapixels in different aspect ratios. Compare dimensions for various formats.",
  keywords: ["megapixel", "aspect ratio", "resolution", "format", "16:9", "4:3", "3:2"],
};

export default function MegapixelAspectsPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Megapixel Aspects"
      description="See how megapixels translate to different aspect ratios."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <MegapixelAspectsCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
