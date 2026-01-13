import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { MacroDiffractionCalculator } from "./macro-diffraction-calculator";

export const metadata: Metadata = {
  title: "Macro Diffraction Calculator | Photography Tools",
  description:
    "Calculate effective aperture and diffraction effects in macro photography. Find the optimal marked aperture for maximum sharpness at different magnifications.",
  keywords: [
    "macro diffraction",
    "effective aperture",
    "macro photography",
    "magnification",
    "diffraction limit",
    "macro sharpness",
    "close-up photography",
  ],
};

export default function MacroDiffractionPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Macro Diffraction Calculator"
      description="Calculate how magnification affects effective aperture and diffraction in macro photography."
      category={category}
      infoContent={
        <>
          <h3>Effective Aperture in Macro</h3>
          <p>
            In macro photography, the effective aperture increases with magnification. This means
            diffraction becomes a problem at much wider marked apertures than in normal photography.
          </p>
          <p>
            <code>N_effective = N × (1 + m)</code>
          </p>
          <p>Where N is the marked f-number and m is the magnification ratio.</p>

          <h3>Practical Examples</h3>
          <ul>
            <li>At 1:1 (1×): f/8 becomes effectively f/16</li>
            <li>At 2:1 (2×): f/8 becomes effectively f/24</li>
            <li>At 5:1 (5×): f/8 becomes effectively f/48</li>
          </ul>

          <h3>Light Loss</h3>
          <p>
            Magnification also causes light loss. At 1:1, you lose 2 stops of light. This is because
            light has to travel further from the lens to the sensor.
          </p>
          <p>
            <code>Light loss (stops) = 2 × log₂(1 + m)</code>
          </p>

          <h3>Recommendations</h3>
          <ul>
            <li>Use wider marked apertures than you would normally</li>
            <li>Consider focus stacking at wider apertures for best results</li>
            <li>Increase ISO or use flash to compensate for light loss</li>
            <li>At extreme magnifications, even f/4 may be diffraction-limited</li>
          </ul>
        </>
      }
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <MacroDiffractionCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
