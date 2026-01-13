import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { TimeLapseCalculator } from "./time-lapse-calculator";

export const metadata: Metadata = {
  title: "Time Lapse Calculator",
  description:
    "Calculate clip length, shooting interval, photos needed, and memory usage for time lapse.",
  keywords: ["time lapse", "timelapse", "interval", "photography", "video", "memory"],
};

export default function TimeLapsePage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Time Lapse Calculator"
      description="Plan your time lapse: calculate interval, clip length, photos, and memory."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <TimeLapseCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
