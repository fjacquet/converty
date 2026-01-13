export interface CorpulenceResult {
  corpulenceIndex: number;
  category: string;
  description: string;
  healthRisk: string;
}

// Corpulence Index (Ponderal Index) = weight (kg) / height (m)³
// Normal range is typically 11-14 kg/m³

export function calculateCorpulence(
  weight: number,
  height: number,
  unit: "metric" | "imperial" = "metric"
): CorpulenceResult | null {
  if (weight <= 0 || height <= 0) return null;

  let weightKg: number;
  let heightM: number;

  if (unit === "imperial") {
    // Convert lbs to kg and inches to meters
    weightKg = weight * 0.453592;
    heightM = height * 0.0254;
  } else {
    weightKg = weight;
    heightM = height / 100; // cm to meters
  }

  // Corpulence Index = weight / height³
  const corpulenceIndex = weightKg / heightM ** 3;

  const { category, description, healthRisk } = getCorpulenceCategory(corpulenceIndex);

  return {
    corpulenceIndex: Math.round(corpulenceIndex * 100) / 100,
    category,
    description,
    healthRisk,
  };
}

function getCorpulenceCategory(ci: number): {
  category: string;
  description: string;
  healthRisk: string;
} {
  if (ci < 11) {
    return {
      category: "Underweight",
      description: "Below normal corpulence range",
      healthRisk: "Increased risk of nutritional deficiencies",
    };
  } else if (ci < 13) {
    return {
      category: "Normal (Lower)",
      description: "Lower end of normal corpulence range",
      healthRisk: "Low health risk",
    };
  } else if (ci < 14) {
    return {
      category: "Normal",
      description: "Optimal corpulence range",
      healthRisk: "Minimal health risk",
    };
  } else if (ci < 15) {
    return {
      category: "Normal (Upper)",
      description: "Upper end of normal corpulence range",
      healthRisk: "Low health risk",
    };
  } else if (ci < 17) {
    return {
      category: "Overweight",
      description: "Above normal corpulence range",
      healthRisk: "Moderate health risk",
    };
  } else {
    return {
      category: "Obese",
      description: "Significantly above normal range",
      healthRisk: "Increased health risk",
    };
  }
}

// Compare CI with BMI
export function compareToBMI(
  weight: number,
  height: number,
  unit: "metric" | "imperial" = "metric"
): { bmi: number; ci: number; difference: string } | null {
  if (weight <= 0 || height <= 0) return null;

  let weightKg: number;
  let heightM: number;

  if (unit === "imperial") {
    weightKg = weight * 0.453592;
    heightM = height * 0.0254;
  } else {
    weightKg = weight;
    heightM = height / 100;
  }

  const bmi = weightKg / heightM ** 2;
  const ci = weightKg / heightM ** 3;

  let difference: string;
  if (Math.abs(bmi - ci) < 2) {
    difference = "BMI and CI indicate similar body composition";
  } else if (ci > bmi) {
    difference = "CI suggests relatively more mass for height than BMI indicates";
  } else {
    difference = "CI suggests relatively less mass for height than BMI indicates";
  }

  return {
    bmi: Math.round(bmi * 100) / 100,
    ci: Math.round(ci * 100) / 100,
    difference,
  };
}
