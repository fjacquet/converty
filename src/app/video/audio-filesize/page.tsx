import { Metadata } from "next";
import { Suspense } from "react";
import { AudioFilesizeCalculator } from "./audio-filesize-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Audio File Size Calculator",
  description: "Estimate audio file size for WAV, FLAC, MP3, AAC, and other formats.",
  keywords: ["audio", "file size", "wav", "mp3", "flac", "bitrate", "compression"],
};

export default function AudioFilesizePage() {
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title="Audio File Size Calculator"
      description="Estimate audio file size based on duration and format."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <AudioFilesizeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
