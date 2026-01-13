import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { RGBConverter } from "./rgb-converter";

export const metadata: Metadata = {
  title: "RGB Color Converter",
  description:
    "Convert between RGB, HEX, HSL, and CMYK color formats. Free online color converter.",
  keywords: ["rgb", "hex", "hsl", "cmyk", "color converter", "color picker"],
};

export default function RGBPage() {
  const category = getCategoryBySlug("color")!;

  return (
    <ConverterLayout
      title="RGB Color Converter"
      description="Convert colors between RGB, HEX, HSL, and CMYK formats."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <RGBConverter />
      </Suspense>
    </ConverterLayout>
  );
}
