import { Metadata } from "next";
import { Suspense } from "react";
import { LightEVCalculator } from "./light-ev-calculator";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Light EV Calculator",
  description: "Calculate Exposure Value from aperture, shutter speed, and ISO. Find equivalent exposures.",
  keywords: ["exposure", "ev", "aperture", "shutter", "iso", "photography", "light meter"],
};

export default function LightEVPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Light EV Calculator"
      description="Calculate Exposure Value from camera settings."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <LightEVCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
