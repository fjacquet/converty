import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { ScreenSizeCalculator } from "./screen-size-calculator";

export const metadata: Metadata = {
  title: "Screen Size Calculator",
  description: "Calculate screen width and height from diagonal and aspect ratio.",
  keywords: ["screen size", "diagonal", "aspect ratio", "tv size", "monitor", "display"],
};

export default function ScreenSizePage() {
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title="Screen Size Calculator"
      description="Calculate screen dimensions from diagonal and aspect ratio."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <ScreenSizeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
