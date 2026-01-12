import { Metadata } from "next";
import { Suspense } from "react";
import { VideoFileSizeCalculator } from "./video-file-size-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Video File Size Calculator",
  description: "Calculate video file size based on duration, bitrate, and resolution. Estimate storage needs for video production.",
  keywords: ["video", "file size", "bitrate", "calculator", "storage", "video production"],
};

export default function VideoFileSizePage() {
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title="Video File Size Calculator"
      description="Estimate video file size based on duration, resolution, and bitrate settings."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <VideoFileSizeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
