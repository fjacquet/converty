import { Metadata } from "next";
import { Suspense } from "react";
import { BPMCalculator } from "./bpm-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "BPM Calculator",
  description: "Convert BPM to Hz, bar length, and note durations. Calculate tempo and delay times for music production.",
  keywords: ["bpm", "tempo", "beats per minute", "music", "delay", "note duration"],
};

export default function BPMPage() {
  const category = getCategoryBySlug("music")!;

  return (
    <ConverterLayout
      title="BPM Calculator"
      description="Convert beats per minute (BPM) to Hz, bar lengths, and note durations."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <BPMCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
