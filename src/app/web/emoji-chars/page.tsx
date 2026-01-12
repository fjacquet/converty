import { Metadata } from "next";
import { Suspense } from "react";
import { EmojiMap } from "./emoji-map";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Emoji Character Map",
  description: "Browse and copy emoji with Unicode and HTML codes.",
  keywords: ["emoji", "unicode", "html", "copy", "emoticons", "symbols"],
};

export default function EmojiCharsPage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="Emoji Character Map"
      description="Browse, search, and copy emoji with their codes."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <EmojiMap />
      </Suspense>
    </ConverterLayout>
  );
}
