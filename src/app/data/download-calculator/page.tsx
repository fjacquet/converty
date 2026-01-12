import { Metadata } from "next";
import { Suspense } from "react";
import { DownloadCalculator } from "./download-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Download Time Calculator",
  description: "Calculate download time from file size and bandwidth. Estimate how long downloads will take.",
  keywords: ["download", "time", "calculator", "bandwidth", "file size", "transfer"],
};

export default function DownloadCalculatorPage() {
  const category = getCategoryBySlug("data")!;

  return (
    <ConverterLayout
      title="Download Time Calculator"
      description="Calculate how long it will take to download a file based on your connection speed."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DownloadCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
