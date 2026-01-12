import { Metadata } from "next";
import { Suspense } from "react";
import { FocalEquivalentCalculator } from "./focal-equivalent-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Focal Length Equivalent Calculator",
  description: "Match field of view and depth of field between different camera sensor sizes.",
  keywords: ["focal length", "equivalent", "crop factor", "sensor", "field of view", "depth of field"],
};

export default function FocalEquivalentPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Focal Length Equivalent"
      description="Match settings between different camera sensor sizes."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <FocalEquivalentCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
