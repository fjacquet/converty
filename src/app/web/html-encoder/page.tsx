import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { HTMLEncoderTool } from "./html-encoder-tool";

export const metadata: Metadata = {
  title: "HTML Encoder/Decoder",
  description: "Encode and decode HTML entities for safe display.",
  keywords: ["html", "encode", "decode", "entities", "escape", "xss"],
};

export default function HTMLEncoderPage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="HTML Encoder/Decoder"
      description="Encode special characters as HTML entities or decode them back."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <HTMLEncoderTool />
      </Suspense>
    </ConverterLayout>
  );
}
