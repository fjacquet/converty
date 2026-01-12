import { Metadata } from "next";
import { Suspense } from "react";
import { DPICalculator } from "./dpi-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "DPI Calculator",
  description: "Calculate required megapixels from print size and DPI. Check print quality.",
  keywords: ["dpi", "ppi", "print", "resolution", "megapixels", "photo printing"],
};

export default function DPIPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="DPI Calculator"
      description="Calculate required image resolution for print size and DPI."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DPICalculator />
      </Suspense>
    </ConverterLayout>
  );
}
