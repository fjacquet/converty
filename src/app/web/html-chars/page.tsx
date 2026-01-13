import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { HTMLCharMap } from "./html-char-map";

export const metadata: Metadata = {
  title: "HTML Character Map",
  description: "Browse and copy HTML character entities.",
  keywords: ["html", "entities", "characters", "symbols", "unicode", "special characters"],
};

export default function HTMLCharsPage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="HTML Character Map"
      description="Browse, search, and copy HTML character entities."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <HTMLCharMap />
      </Suspense>
    </ConverterLayout>
  );
}
