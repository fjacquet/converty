export interface BodyTypeInput {
  gender: "male" | "female";
  wristCircumference: number; // cm
  height: number; // cm
  shoulderWidth?: number; // cm
  hipWidth?: number; // cm
  waist?: number; // cm
}

export interface BodyTypeResult {
  frameSize: "small" | "medium" | "large";
  bodyType: "ectomorph" | "mesomorph" | "endomorph" | "combination";
  wristRatio: number;
  shoulderToHipRatio?: number;
  waistToHipRatio?: number;
  characteristics: string[];
  trainingRecommendations: string[];
  nutritionRecommendations: string[];
}

export function calculateBodyType(input: BodyTypeInput): BodyTypeResult | null {
  const { gender, wristCircumference, height, shoulderWidth, hipWidth, waist } = input;

  if (wristCircumference <= 0 || height <= 0) {
    return null;
  }

  // Frame size calculation using wrist circumference
  // Height in cm / wrist circumference in cm
  const wristRatio = height / wristCircumference;

  let frameSize: "small" | "medium" | "large";
  if (gender === "male") {
    if (wristRatio > 10.4) {
      frameSize = "small";
    } else if (wristRatio >= 9.6) {
      frameSize = "medium";
    } else {
      frameSize = "large";
    }
  } else {
    if (wristRatio > 11.0) {
      frameSize = "small";
    } else if (wristRatio >= 10.1) {
      frameSize = "medium";
    } else {
      frameSize = "large";
    }
  }

  // Calculate ratios if data available
  const shoulderToHipRatio = shoulderWidth && hipWidth ? shoulderWidth / hipWidth : undefined;
  const waistToHipRatio = waist && hipWidth ? waist / hipWidth : undefined;

  // Determine body type (somatotype)
  let bodyType: "ectomorph" | "mesomorph" | "endomorph" | "combination";
  let characteristics: string[];
  let trainingRecommendations: string[];
  let nutritionRecommendations: string[];

  // Primary determination based on frame size and ratios
  if (frameSize === "small") {
    bodyType = "ectomorph";
    characteristics = [
      "Narrow shoulders and hips",
      "Long limbs",
      "Fast metabolism",
      "Difficulty gaining weight",
      "Low body fat",
      "Lean muscle mass",
    ];
    trainingRecommendations = [
      "Focus on compound movements",
      "Limit cardio to preserve calories",
      "Train 3-4 times per week",
      "Use heavier weights with lower reps",
      "Allow adequate rest between sessions",
    ];
    nutritionRecommendations = [
      "Eat calorie-dense foods",
      "Consume 1.6-2g protein per kg body weight",
      "Eat every 2-3 hours",
      "Include healthy fats",
      "Post-workout carbs are important",
    ];
  } else if (frameSize === "large" || (waistToHipRatio && waistToHipRatio > 0.9)) {
    bodyType = "endomorph";
    characteristics = [
      "Wide hips and waist",
      "Larger bone structure",
      "Slower metabolism",
      "Gains weight easily",
      "Stores fat readily",
      "Strong lower body",
    ];
    trainingRecommendations = [
      "Include regular cardio sessions",
      "Circuit training for fat loss",
      "High-intensity interval training (HIIT)",
      "Full body workouts",
      "Stay active throughout the day",
    ];
    nutritionRecommendations = [
      "Monitor carbohydrate intake",
      "Focus on protein and vegetables",
      "Eat smaller, frequent meals",
      "Avoid processed foods",
      "Time carbs around workouts",
    ];
  } else {
    bodyType = "mesomorph";
    characteristics = [
      "Broad shoulders",
      "Narrow waist",
      "Athletic build",
      "Gains muscle easily",
      "Moderate metabolism",
      "Well-proportioned body",
    ];
    trainingRecommendations = [
      "Balanced strength and cardio",
      "Variety in training methods",
      "Can handle higher volume",
      "Progressive overload",
      "Mix of compound and isolation exercises",
    ];
    nutritionRecommendations = [
      "Balanced macronutrient intake",
      "Moderate carbohydrates",
      "1.4-1.8g protein per kg body weight",
      "Adjust calories based on goals",
      "Flexible dieting works well",
    ];
  }

  // Check for combination types based on ratios
  if (shoulderToHipRatio) {
    if (frameSize === "small" && shoulderToHipRatio > 1.3) {
      bodyType = "combination";
      characteristics.push("Ecto-Mesomorph traits");
    } else if (frameSize === "large" && shoulderToHipRatio > 1.2) {
      bodyType = "combination";
      characteristics.push("Meso-Endomorph traits");
    }
  }

  return {
    frameSize,
    bodyType,
    wristRatio,
    shoulderToHipRatio,
    waistToHipRatio,
    characteristics,
    trainingRecommendations,
    nutritionRecommendations,
  };
}
