import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { SpeedConverter } from "./speed-converter";

export const metadata: Metadata = {
  title: "Speed Converter",
  description: "Convert between m/s, km/h, mph, knots, and Mach. Free online speed converter.",
  keywords: ["speed", "velocity", "converter", "mph", "km/h", "m/s", "knots", "mach"],
};

export default function SpeedPage() {
  const category = getCategoryBySlug("physics")!;

  return (
    <ConverterLayout
      title="Speed Converter"
      description="Convert between meters per second, kilometers per hour, miles per hour, knots, and Mach."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <SpeedConverter />
      </Suspense>
    </ConverterLayout>
  );
}
