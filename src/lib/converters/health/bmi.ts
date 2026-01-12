export type WeightUnit = "kg" | "lb";
export type HeightUnit = "cm" | "m" | "in" | "ft";

export interface BMIInput {
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  heightUnit: HeightUnit;
}

export type BMICategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obese-1"
  | "obese-2"
  | "obese-3";

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryLabel: string;
  healthyWeightRange: { min: number; max: number };
  weightToHealthy: number | null;
}

const BMI_CATEGORIES: Record<BMICategory, { label: string; color: string }> = {
  underweight: { label: "Underweight", color: "text-blue-500" },
  normal: { label: "Normal weight", color: "text-green-500" },
  overweight: { label: "Overweight", color: "text-yellow-500" },
  "obese-1": { label: "Obese Class I", color: "text-orange-500" },
  "obese-2": { label: "Obese Class II", color: "text-red-500" },
  "obese-3": { label: "Obese Class III", color: "text-red-700" },
};

function convertWeightToKg(weight: number, unit: WeightUnit): number {
  return unit === "lb" ? weight * 0.453592 : weight;
}

function convertHeightToMeters(height: number, unit: HeightUnit): number {
  switch (unit) {
    case "cm":
      return height / 100;
    case "m":
      return height;
    case "in":
      return height * 0.0254;
    case "ft":
      return height * 0.3048;
  }
}

function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  if (bmi < 35) return "obese-1";
  if (bmi < 40) return "obese-2";
  return "obese-3";
}

export function calculateBMI(input: BMIInput): BMIResult | null {
  const { weight, weightUnit, height, heightUnit } = input;

  if (weight <= 0 || height <= 0) {
    return null;
  }

  const weightKg = convertWeightToKg(weight, weightUnit);
  const heightM = convertHeightToMeters(height, heightUnit);

  if (heightM <= 0) {
    return null;
  }

  const bmi = weightKg / (heightM * heightM);
  const category = getBMICategory(bmi);

  // Calculate healthy weight range (BMI 18.5 - 24.9)
  const healthyWeightRange = {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  };

  // Calculate weight to reach healthy range
  let weightToHealthy: number | null = null;
  if (bmi < 18.5) {
    weightToHealthy = Math.round((healthyWeightRange.min - weightKg) * 10) / 10;
  } else if (bmi > 24.9) {
    weightToHealthy = Math.round((weightKg - healthyWeightRange.max) * 10) / 10;
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    categoryLabel: BMI_CATEGORIES[category].label,
    healthyWeightRange,
    weightToHealthy,
  };
}

export function getBMICategoryInfo(category: BMICategory) {
  return BMI_CATEGORIES[category];
}
