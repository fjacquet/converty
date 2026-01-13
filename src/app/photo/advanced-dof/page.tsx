import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { AdvancedDoFCalculator } from "./advanced-dof-calculator";

export const metadata: Metadata = {
  title: "Advanced Depth of Field Calculator | Photography Tools",
  description:
    "Calculate depth of field with adjustable Circle of Confusion based on print size, viewing distance, and visual acuity for precise DoF control.",
  keywords: [
    "depth of field",
    "DoF calculator",
    "circle of confusion",
    "photography",
    "aperture",
    "focal length",
    "print size",
    "advanced DoF",
  ],
};

export default function AdvancedDoFPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Advanced Depth of Field Calculator"
      description="Calculate depth of field using an adjusted Circle of Confusion based on your specific print size, viewing distance, and visual acuity."
      category={category}
      infoContent={
        <>
          <h3>Why Advanced DoF?</h3>
          <p>
            Standard DoF calculators use a fixed Circle of Confusion (CoC) that assumes an
            8×10&quot; print viewed at 25cm. This advanced calculator lets you adjust the CoC based
            on your actual output and viewing conditions.
          </p>

          <h3>When to Use This Calculator</h3>
          <ul>
            <li>Making large prints that will be viewed up close</li>
            <li>Creating small prints or web images viewed at distance</li>
            <li>Critical work requiring maximum sharpness precision</li>
            <li>Understanding how viewing conditions affect perceived sharpness</li>
          </ul>

          <h3>Adjusted vs Standard CoC</h3>
          <p>
            The calculator shows results for both your adjusted CoC and the standard CoC, allowing
            you to compare. A smaller adjusted CoC (demanding conditions) will result in a narrower
            depth of field.
          </p>

          <h3>Tips</h3>
          <ul>
            <li>Larger prints viewed closely require smaller CoC (stricter DoF)</li>
            <li>Smaller prints or greater viewing distance allow larger CoC (more forgiving)</li>
            <li>Use standard CoC values when unsure of final output</li>
          </ul>
        </>
      }
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <AdvancedDoFCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
