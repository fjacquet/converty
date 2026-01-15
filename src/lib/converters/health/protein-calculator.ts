export interface ProteinInput {
  weight: number; // kg
  goal: "sedentary" | "maintenance" | "muscleGain" | "fatLoss" | "athlete" | "endurance";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "veryActive";
  age?: number;
  gender?: "male" | "female";
}

export interface ProteinResult {
  dailyProteinMin: number; // grams
  dailyProteinMax: number; // grams
  dailyProteinOptimal: number; // grams
  proteinPerKg: { min: number; max: number };
  perMeal: { meals3: number; meals4: number; meals5: number; meals6: number };
  percentOfCalories: number; // assuming 2000 cal diet
  foodSources: Array<{
    food: string;
    protein: number; // grams per serving
    servingSize: string;
    servingsNeeded: number;
  }>;
}

export function calculateProtein(input: ProteinInput): ProteinResult | null {
  const { weight, goal, activityLevel, age } = input;

  if (weight <= 0) {
    return null;
  }

  // Protein requirements based on goal (grams per kg body weight)
  const proteinRanges: Record<string, { min: number; max: number }> = {
    sedentary: { min: 0.8, max: 1.0 },
    maintenance: { min: 1.0, max: 1.2 },
    muscleGain: { min: 1.6, max: 2.2 },
    fatLoss: { min: 1.6, max: 2.4 },
    athlete: { min: 1.4, max: 2.0 },
    endurance: { min: 1.2, max: 1.6 },
  };

  const baseRange = proteinRanges[goal];

  // Adjust for activity level
  let activityMultiplier = 1.0;
  switch (activityLevel) {
    case "sedentary":
      activityMultiplier = 0.9;
      break;
    case "light":
      activityMultiplier = 0.95;
      break;
    case "moderate":
      activityMultiplier = 1.0;
      break;
    case "active":
      activityMultiplier = 1.05;
      break;
    case "veryActive":
      activityMultiplier = 1.1;
      break;
  }

  // Age adjustment (older adults need more protein)
  let ageMultiplier = 1.0;
  if (age && age > 65) {
    ageMultiplier = 1.1;
  }

  const adjustedMin = baseRange.min * activityMultiplier * ageMultiplier;
  const adjustedMax = baseRange.max * activityMultiplier * ageMultiplier;
  const optimal = (adjustedMin + adjustedMax) / 2;

  const dailyProteinMin = weight * adjustedMin;
  const dailyProteinMax = weight * adjustedMax;
  const dailyProteinOptimal = weight * optimal;

  // Per meal distribution
  const perMeal = {
    meals3: dailyProteinOptimal / 3,
    meals4: dailyProteinOptimal / 4,
    meals5: dailyProteinOptimal / 5,
    meals6: dailyProteinOptimal / 6,
  };

  // Percent of 2000 calorie diet (protein = 4 cal/g)
  const proteinCalories = dailyProteinOptimal * 4;
  const percentOfCalories = (proteinCalories / 2000) * 100;

  // Common food sources
  const foodSources = [
    { food: "Chicken Breast", protein: 31, servingSize: "100g cooked" },
    { food: "Eggs", protein: 6, servingSize: "1 large" },
    { food: "Greek Yogurt", protein: 17, servingSize: "170g" },
    { food: "Salmon", protein: 25, servingSize: "100g" },
    { food: "Lean Beef", protein: 26, servingSize: "100g" },
    { food: "Tofu", protein: 8, servingSize: "100g" },
    { food: "Lentils", protein: 9, servingSize: "100g cooked" },
    { food: "Whey Protein", protein: 25, servingSize: "1 scoop (30g)" },
    { food: "Cottage Cheese", protein: 11, servingSize: "100g" },
    { food: "Tuna", protein: 30, servingSize: "100g canned" },
  ].map((source) => ({
    ...source,
    servingsNeeded: Math.ceil(dailyProteinOptimal / source.protein),
  }));

  return {
    dailyProteinMin,
    dailyProteinMax,
    dailyProteinOptimal,
    proteinPerKg: { min: adjustedMin, max: adjustedMax },
    perMeal,
    percentOfCalories,
    foodSources,
  };
}
