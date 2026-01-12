import { Metadata } from "next";
import { Suspense } from "react";
import { CommonBitratesViewer } from "./common-bitrates-viewer";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Common Video Bitrates",
  description: "Reference list of common video bitrates for ProRes, DNxHD, DV, DCP, MPEG, and streaming.",
  keywords: ["bitrate", "prores", "dnxhd", "dcp", "mpeg", "h264", "streaming"],
};

export default function CommonBitratesPage() {
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title="Common Video Bitrates"
      description="Reference list of common video bitrates by codec and format."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <CommonBitratesViewer />
      </Suspense>
    </ConverterLayout>
  );
}
