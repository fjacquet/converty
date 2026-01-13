import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { URLEncoderConverter } from "./url-encoder-converter";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder",
  description:
    "Encode and decode URLs online. Convert special characters to percent-encoded format for safe URL usage.",
  keywords: ["url", "encoder", "decoder", "percent encoding", "uri", "web development"],
};

export default function URLEncoderPage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="URL Encoder/Decoder"
      description="Encode special characters for URLs or decode percent-encoded strings."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <URLEncoderConverter />
      </Suspense>
    </ConverterLayout>
  );
}
