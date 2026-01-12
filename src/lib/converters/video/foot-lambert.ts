export interface FootLambertResult {
  footLamberts: number;
  nits: number;
  candelasPerM2: number;
  lumens: number;
  description: string;
  useCase: string;
}

// 1 foot-lambert = 3.426 nits (cd/m²)
const FL_TO_NITS = 3.426;

export function calculateFootLambert(
  value: number,
  fromUnit: "fl" | "nits" | "lumens",
  screenWidthFt?: number,
  screenHeightFt?: number,
  gain: number = 1.0
): FootLambertResult | null {
  if (value <= 0) return null;

  let footLamberts: number;
  let lumens: number;

  if (fromUnit === "fl") {
    footLamberts = value;
  } else if (fromUnit === "nits") {
    footLamberts = value / FL_TO_NITS;
  } else {
    // From lumens - need screen size
    if (!screenWidthFt || !screenHeightFt) return null;
    const screenAreaSqFt = screenWidthFt * screenHeightFt;
    // FL = Lumens / (Screen Area × π × Gain)
    footLamberts = value / (screenAreaSqFt * Math.PI * gain);
  }

  const nits = footLamberts * FL_TO_NITS;
  const candelasPerM2 = nits; // nits = cd/m²

  // Calculate lumens if screen size provided
  if (screenWidthFt && screenHeightFt) {
    const screenAreaSqFt = screenWidthFt * screenHeightFt;
    lumens = footLamberts * screenAreaSqFt * Math.PI * gain;
  } else {
    lumens = 0;
  }

  const { description, useCase } = getBrightnessCategory(footLamberts);

  return {
    footLamberts: Math.round(footLamberts * 100) / 100,
    nits: Math.round(nits * 100) / 100,
    candelasPerM2: Math.round(candelasPerM2 * 100) / 100,
    lumens: Math.round(lumens),
    description,
    useCase,
  };
}

function getBrightnessCategory(fl: number): { description: string; useCase: string } {
  if (fl < 10) {
    return { description: "Very dim", useCase: "Not suitable for most viewing" };
  } else if (fl < 14) {
    return { description: "Dim", useCase: "3D cinema presentation" };
  } else if (fl < 16) {
    return { description: "Standard 2D Cinema", useCase: "DCI standard for 2D (14 fL target)" };
  } else if (fl < 22) {
    return { description: "Bright cinema", useCase: "Premium large format" };
  } else if (fl < 50) {
    return { description: "Very bright", useCase: "HDR cinema, Dolby Cinema" };
  } else if (fl < 100) {
    return { description: "Home theater", useCase: "High-end home projection" };
  } else {
    return { description: "Display brightness", useCase: "Direct-view displays, monitors" };
  }
}

export const REFERENCE_VALUES = [
  { name: "DCI 2D Standard", fl: 14, description: "Industry standard" },
  { name: "DCI 3D Standard", fl: 4.5, description: "With 3D glasses" },
  { name: "Dolby Cinema", fl: 31, description: "Laser projection" },
  { name: "IMAX", fl: 22, description: "Large format" },
  { name: "Home Theater", fl: 16, description: "Recommended minimum" },
  { name: "HDR Display", fl: 300, description: "Peak HDR" },
];
