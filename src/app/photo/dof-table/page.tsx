import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { DoFTableCalculator } from "./dof-table-calculator";

export const metadata: Metadata = {
  title: "Depth of Field Table | Photography Tools",
  description:
    "Interactive depth of field table showing how DoF changes with aperture, focal length, and subject distance. Essential reference for landscape and portrait photographers.",
  keywords: [
    "depth of field table",
    "DoF table",
    "aperture chart",
    "photography reference",
    "focal length DoF",
    "hyperfocal distance",
  ],
};

export default function DoFTablePage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Depth of Field Table"
      description="Interactive table showing how depth of field changes across different apertures and subject distances."
      category={category}
      infoContent={
        <>
          <h3>Using the DoF Table</h3>
          <p>
            This table helps you quickly understand how depth of field changes across different
            shooting conditions. Select your focal length and sensor to see DoF values for various
            aperture and distance combinations.
          </p>

          <h3>Reading the Table</h3>
          <ul>
            <li>Rows represent different apertures (f-stops)</li>
            <li>Columns represent different subject distances</li>
            <li>Each cell shows the total depth of field</li>
            <li>∞ means infinity focus (everything beyond near limit is sharp)</li>
          </ul>

          <h3>Key Insights</h3>
          <ul>
            <li>Smaller apertures (larger f-numbers) give more DoF</li>
            <li>Greater subject distance gives more DoF</li>
            <li>Shorter focal lengths give more DoF at the same distance</li>
            <li>Smaller sensors give more DoF at equivalent framing</li>
          </ul>

          <h3>Practical Tips</h3>
          <ul>
            <li>For landscapes: use hyperfocal distance for maximum sharpness</li>
            <li>For portraits: wider apertures give more background blur</li>
            <li>When subject is at hyperfocal distance, far limit reaches infinity</li>
          </ul>
        </>
      }
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DoFTableCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
