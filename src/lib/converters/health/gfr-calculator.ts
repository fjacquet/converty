export interface GfrInput {
  creatinine: number; // mg/dL or umol/L
  creatinineUnit: "mgdl" | "umol";
  age: number;
  gender: "male" | "female";
  race: "black" | "other";
  weight?: number; // kg (for Cockcroft-Gault)
  height?: number; // cm (for body surface area adjustment)
}

export interface GfrResult {
  egfrMdrd: number;
  egfrCkdEpi: number;
  egfrCockcroftGault: number | null;
  stage: number;
  stageDescription: string;
  kidneyFunction: string;
  recommendation: string;
  creatinineMgdl: number;
}

export function calculateGfr(input: GfrInput): GfrResult | null {
  const { creatinine, creatinineUnit, age, gender, race, weight, height: _height } = input;

  if (creatinine <= 0 || age <= 0 || age > 120) {
    return null;
  }

  // Convert creatinine to mg/dL if needed
  const creatinineMgdl = creatinineUnit === "umol" ? creatinine / 88.4 : creatinine;

  // CKD-EPI equation (2021 - race-free version)
  // GFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^age × (1.012 if female)
  const kappa = gender === "female" ? 0.7 : 0.9;
  const alpha = gender === "female" ? -0.241 : -0.302;

  const scrOverKappa = creatinineMgdl / kappa;
  const minTerm = Math.pow(Math.min(scrOverKappa, 1), alpha);
  const maxTerm = Math.pow(Math.max(scrOverKappa, 1), -1.2);
  const ageTerm = Math.pow(0.9938, age);
  const genderMultiplier = gender === "female" ? 1.012 : 1;

  const egfrCkdEpi = 142 * minTerm * maxTerm * ageTerm * genderMultiplier;

  // MDRD equation (original with race adjustment for comparison)
  // GFR = 175 × Scr^-1.154 × age^-0.203 × 0.742 (if female) × 1.212 (if Black)
  let egfrMdrd = 175 * Math.pow(creatinineMgdl, -1.154) * Math.pow(age, -0.203);
  if (gender === "female") egfrMdrd *= 0.742;
  if (race === "black") egfrMdrd *= 1.212;

  // Cockcroft-Gault equation (requires weight)
  let egfrCockcroftGault: number | null = null;
  if (weight && weight > 0) {
    egfrCockcroftGault = ((140 - age) * weight) / (72 * creatinineMgdl);
    if (gender === "female") egfrCockcroftGault *= 0.85;
  }

  // Determine CKD stage
  const gfr = egfrCkdEpi;
  let stage: number;
  let stageDescription: string;
  let kidneyFunction: string;
  let recommendation: string;

  if (gfr >= 90) {
    stage = 1;
    stageDescription = "Stage 1: Normal or high GFR";
    kidneyFunction = "Normal kidney function";
    recommendation = "Monitor if you have risk factors for kidney disease";
  } else if (gfr >= 60) {
    stage = 2;
    stageDescription = "Stage 2: Mildly decreased GFR";
    kidneyFunction = "Mild loss of kidney function";
    recommendation = "Lifestyle changes, monitor blood pressure";
  } else if (gfr >= 45) {
    stage = 3;
    stageDescription = "Stage 3a: Mild to moderate decrease";
    kidneyFunction = "Mild to moderate loss of kidney function";
    recommendation = "See a nephrologist, manage complications";
  } else if (gfr >= 30) {
    stage = 3;
    stageDescription = "Stage 3b: Moderate to severe decrease";
    kidneyFunction = "Moderate to severe loss of kidney function";
    recommendation = "See a nephrologist, dietary changes";
  } else if (gfr >= 15) {
    stage = 4;
    stageDescription = "Stage 4: Severely decreased GFR";
    kidneyFunction = "Severe loss of kidney function";
    recommendation = "Prepare for dialysis or transplant";
  } else {
    stage = 5;
    stageDescription = "Stage 5: Kidney failure";
    kidneyFunction = "Kidney failure (ESRD)";
    recommendation = "Dialysis or kidney transplant needed";
  }

  return {
    egfrMdrd,
    egfrCkdEpi,
    egfrCockcroftGault,
    stage,
    stageDescription,
    kidneyFunction,
    recommendation,
    creatinineMgdl,
  };
}
