import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { ImageFilesizeCalculator } from "./image-filesize-calculator";

export const metadata: Metadata = {
  title: "Image File Size Calculator",
  description: "Estimate image file size for JPEG, PNG, RAW, and other formats.",
  keywords: ["image", "file size", "jpeg", "png", "raw", "photo", "compression"],
};

export default function ImageFilesizePage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Image File Size Calculator"
      description="Estimate image file size based on resolution and format."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <ImageFilesizeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
