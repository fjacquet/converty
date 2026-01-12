import { Metadata } from "next";
import { Suspense } from "react";
import { DCPFilesizeCalculator } from "./dcp-filesize-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "DCP File Size Calculator",
  description: "Calculate Digital Cinema Package (DCP) file size for 2K and 4K cinema.",
  keywords: ["dcp", "digital cinema", "file size", "jpeg2000", "cinema", "2k", "4k"],
};

export default function DCPFilesizePage() {
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title="DCP File Size Calculator"
      description="Calculate Digital Cinema Package file size for theatrical distribution."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DCPFilesizeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
