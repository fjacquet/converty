import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { AspectRatioConverter } from "./aspect-ratio-converter";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator",
  description:
    "Calculate aspect ratios from width and height. Find common aspect ratios for video, photo, and screens.",
  keywords: ["aspect ratio", "calculator", "width", "height", "16:9", "4:3", "video", "photo"],
};

export default function AspectRatioPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Aspect Ratio Calculator"
      description="Calculate the aspect ratio from width and height dimensions."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <AspectRatioConverter />
      </Suspense>
    </ConverterLayout>
  );
}
