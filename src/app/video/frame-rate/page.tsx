import { Metadata } from "next";
import { Suspense } from "react";
import { FrameRateConverter } from "./frame-rate-converter";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Frame Rate Converter",
  description: "Convert between frame rates with ffmpeg and sox commands. Calculate speed changes.",
  keywords: ["frame rate", "fps", "convert", "ffmpeg", "sox", "video", "film"],
};

export default function FrameRatePage() {
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title="Frame Rate Converter"
      description="Convert between frame rates and get ffmpeg commands."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <FrameRateConverter />
      </Suspense>
    </ConverterLayout>
  );
}
