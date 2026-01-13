import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { CircleOfConfusionCalculator } from "./circle-of-confusion-calculator";

export const metadata: Metadata = {
  title: "Circle of Confusion Calculator | Photography Tools",
  description:
    "Calculate the Circle of Confusion (CoC) based on sensor size, print dimensions, viewing distance, and visual acuity for optimal depth of field.",
  keywords: [
    "circle of confusion",
    "CoC calculator",
    "depth of field",
    "photography",
    "sensor size",
    "print size",
    "visual acuity",
    "sharpness",
  ],
};

export default function CircleOfConfusionPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Circle of Confusion Calculator"
      description="Calculate the Circle of Confusion (CoC) based on sensor size, print dimensions, viewing distance, and visual acuity."
      category={category}
      infoContent={
        <>
          <h3>What is Circle of Confusion?</h3>
          <p>
            The Circle of Confusion (CoC) is the largest blur spot that will still appear sharp to
            the human eye. It&apos;s a fundamental concept in depth of field calculations and
            determines the acceptable sharpness in your photographs.
          </p>

          <h3>Factors Affecting CoC</h3>
          <ul>
            <li>
              <strong>Sensor Size:</strong> Larger sensors allow for larger CoC values
            </li>
            <li>
              <strong>Print Size:</strong> Larger prints require smaller CoC (sharper images)
            </li>
            <li>
              <strong>Viewing Distance:</strong> Greater distances allow for larger CoC
            </li>
            <li>
              <strong>Visual Acuity:</strong> Sharper vision requires smaller CoC
            </li>
          </ul>

          <h3>Standard vs Adjusted CoC</h3>
          <p>
            Standard CoC values (like 0.03mm for full frame) assume a specific viewing condition: an
            8×10&quot; print viewed at about 25cm. For different print sizes or viewing distances,
            you may need to calculate an adjusted CoC.
          </p>

          <h3>Practical Application</h3>
          <p>
            Use the calculated CoC in depth of field calculators for more accurate results tailored
            to your specific output and viewing conditions.
          </p>
        </>
      }
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <CircleOfConfusionCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
