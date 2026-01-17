export interface BacInput {
  gender: "male" | "female";
  weight: number; // kg
  drinks: number;
  drinkType: "beer" | "wine" | "spirits" | "custom";
  customAlcoholGrams?: number;
  hoursSinceDrinking: number;
}

export interface BacResult {
  bac: number; // Blood Alcohol Content percentage
  status: string;
  timeToSober: number; // hours
  timeToLegal: number; // hours to reach 0.08%
  alcoholGrams: number;
  peakBac: number;
  effects: string[];
  legalToDrive: boolean;
}

export function calculateBac(input: BacInput): BacResult | null {
  const { gender, weight, drinks, drinkType, customAlcoholGrams, hoursSinceDrinking } = input;

  if (weight <= 0 || drinks < 0 || hoursSinceDrinking < 0) {
    return null;
  }

  // Standard drink alcohol content in grams
  const alcoholPerDrink: Record<string, number> = {
    beer: 14, // 355ml beer at 5%
    wine: 14, // 150ml wine at 12%
    spirits: 14, // 44ml spirits at 40%
    custom: customAlcoholGrams || 14,
  };

  const alcoholGrams = drinks * alcoholPerDrink[drinkType];

  // Widmark formula for BAC
  // BAC = (A / (r × W)) - (β × t)
  // A = alcohol consumed in grams
  // r = Widmark factor (0.68 for men, 0.55 for women)
  // W = body weight in grams
  // β = alcohol elimination rate (0.015% per hour average)
  // t = time since drinking in hours

  const widmarkFactor = gender === "male" ? 0.68 : 0.55;
  const weightGrams = weight * 1000;
  const eliminationRate = 0.015;

  // Calculate peak BAC (at time 0)
  const peakBac = (alcoholGrams / (widmarkFactor * weightGrams)) * 100;

  // Current BAC after elimination
  const bac = Math.max(0, peakBac - eliminationRate * hoursSinceDrinking);

  // Time to reach 0% BAC
  const timeToSober = bac > 0 ? bac / eliminationRate : 0;

  // Time to reach legal limit (0.08%)
  const legalLimit = 0.08;
  const timeToLegal = bac > legalLimit ? (bac - legalLimit) / eliminationRate : 0;

  // Determine status and effects
  let status: string;
  let effects: string[];

  if (bac === 0) {
    status = "Sober";
    effects = ["No impairment"];
  } else if (bac < 0.02) {
    status = "Minimal";
    effects = ["Slight mood elevation", "Relaxation"];
  } else if (bac < 0.05) {
    status = "Euphoria";
    effects = ["Lowered inhibitions", "Mild euphoria", "Slight impairment of reasoning"];
  } else if (bac < 0.08) {
    status = "Excitement";
    effects = ["Impaired judgment", "Reduced coordination", "Slower reaction time"];
  } else if (bac < 0.15) {
    status = "Confusion";
    effects = [
      "Poor muscle coordination",
      "Slurred speech",
      "Impaired balance",
      "Memory blackouts possible",
    ];
  } else if (bac < 0.25) {
    status = "Stupor";
    effects = ["Severe motor impairment", "Vomiting likely", "Loss of consciousness possible"];
  } else if (bac < 0.35) {
    status = "Coma";
    effects = ["Unconsciousness", "Depressed reflexes", "Respiratory depression"];
  } else {
    status = "Death Risk";
    effects = ["Life-threatening", "Respiratory arrest possible", "Seek emergency help"];
  }

  return {
    bac,
    status,
    timeToSober,
    timeToLegal,
    alcoholGrams,
    peakBac,
    effects,
    legalToDrive: bac < legalLimit,
  };
}
