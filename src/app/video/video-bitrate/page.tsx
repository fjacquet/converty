import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { VideoBitrateCalculator } from "./video-bitrate-calculator";

export const metadata: Metadata = {
  title: "Video Bitrate Calculator",
  description: "Estimate video bitrate based on resolution, frame rate, and codec.",
  keywords: ["bitrate", "video", "resolution", "fps", "codec", "h264", "h265"],
};

export default function VideoBitratePage() {
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title="Video Bitrate Calculator"
      description="Estimate video bitrate based on resolution and encoding settings."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <VideoBitrateCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
