import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { GoldenHourGuide } from "./golden-hour-guide";

export const metadata: Metadata = {
  title: "Golden Hour & Twilight Guide",
  description: "Reference guide for golden hour, blue hour, and twilight photography.",
  keywords: ["golden hour", "blue hour", "twilight", "sunrise", "sunset", "photography"],
};

export default function GoldenHourPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Golden Hour & Twilight Guide"
      description="Reference guide for optimal photography lighting conditions."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <GoldenHourGuide />
      </Suspense>
    </ConverterLayout>
  );
}
