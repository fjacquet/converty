import { Metadata } from "next";
import { Suspense } from "react";
import { BandwidthConverter } from "./bandwidth-converter";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Bandwidth Converter",
  description: "Convert bandwidth units: Mbps to KB/s, GB/day, TB/week, and more. Calculate data transfer rates.",
  keywords: ["bandwidth", "converter", "mbps", "kbps", "data transfer", "network speed"],
};

export default function BandwidthPage() {
  const category = getCategoryBySlug("data")!;

  return (
    <ConverterLayout
      title="Bandwidth Converter"
      description="Convert between bandwidth units and calculate data transfer over time."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <BandwidthConverter />
      </Suspense>
    </ConverterLayout>
  );
}
