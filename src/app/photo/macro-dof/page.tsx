import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { MacroDoFCalculator } from "./macro-dof-calculator";

export const metadata: Metadata = {
  title: "Macro Depth of Field Calculator | Photography Tools",
  description:
    "Calculate accurate depth of field for macro and close-up photography using magnification ratio. Essential for focus stacking planning.",
  keywords: [
    "macro DoF",
    "macro depth of field",
    "focus stacking",
    "magnification ratio",
    "close-up photography",
    "macro photography",
    "effective aperture",
  ],
};

export default function MacroDoFPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Macro Depth of Field Calculator"
      description="Calculate accurate depth of field for macro and close-up photography using magnification ratio."
      category={category}
      infoContent={
        <>
          <h3>Why a Separate Macro Calculator?</h3>
          <p>
            Standard DoF formulas assume the subject is relatively far from the lens. In macro
            photography, the magnification ratio becomes significant, and standard formulas
            underestimate how shallow the DoF actually is.
          </p>

          <h3>The Macro DoF Formula</h3>
          <p>
            <code>DoF = 2 × N × c × (m + 1) / m²</code>
          </p>
          <p>
            Where N is the f-number, c is the Circle of Confusion, and m is the magnification ratio.
          </p>

          <h3>Effective Aperture</h3>
          <p>
            At high magnification, light loss through the lens increases. The effective aperture is
            higher than the marked aperture: <code>N_eff = N × (1 + m)</code>
          </p>
          <p>This is why macro shots often need more light or longer exposures.</p>

          <h3>Focus Stacking</h3>
          <p>
            Because macro DoF is extremely shallow (often less than 1mm), photographers use focus
            stacking - combining multiple shots at different focus distances to achieve greater
            apparent DoF.
          </p>

          <h3>Magnification Ratios</h3>
          <ul>
            <li>
              <strong>1:2 (0.5×)</strong> - Half life-size on sensor
            </li>
            <li>
              <strong>1:1 (1×)</strong> - Life-size (true macro)
            </li>
            <li>
              <strong>2:1 (2×)</strong> - Twice life-size on sensor
            </li>
          </ul>
        </>
      }
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <MacroDoFCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
