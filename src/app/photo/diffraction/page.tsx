import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { DiffractionCalculator } from "./diffraction-calculator";

export const metadata: Metadata = {
  title: "Diffraction Calculator | Photography Tools",
  description:
    "Calculate when your camera becomes diffraction-limited. Find the optimal aperture range for maximum sharpness based on your sensor and pixel density.",
  keywords: [
    "diffraction calculator",
    "diffraction limited",
    "airy disk",
    "optimal aperture",
    "pixel pitch",
    "camera sharpness",
    "photography optics",
  ],
};

export default function DiffractionPage() {
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title="Diffraction Calculator"
      description="Determine when your camera becomes diffraction-limited and find the optimal aperture range for maximum sharpness."
      category={category}
      infoContent={
        <>
          <h3>What is Diffraction?</h3>
          <p>
            Diffraction is the bending of light waves as they pass through a small aperture. While
            stopping down increases depth of field, it also creates a pattern called the Airy disk
            that can reduce image sharpness.
          </p>

          <h3>The Airy Disk</h3>
          <p>
            When light passes through an aperture, it doesn&apos;t focus to a perfect point but
            creates a circular pattern called the Airy disk. Its diameter is:
          </p>
          <p>
            <code>Airy Disk = 2.44 × wavelength × f-number</code>
          </p>

          <h3>Diffraction Limited</h3>
          <p>
            A camera is &quot;diffraction-limited&quot; when the Airy disk becomes larger than the
            pixel pitch (distance between pixel centers). At this point, stopping down further no
            longer improves depth of field perception - it just softens the image.
          </p>

          <h3>Practical Implications</h3>
          <ul>
            <li>High-resolution sensors become diffraction-limited sooner</li>
            <li>f/8-f/11 is often the sweet spot for most cameras</li>
            <li>Landscape photographers must balance DoF against diffraction</li>
            <li>Consider focus stacking instead of very small apertures</li>
          </ul>
        </>
      }
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DiffractionCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
