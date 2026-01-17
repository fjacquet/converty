export interface FatIntakeInput {
  calories: number;
  goal: "weightLoss" | "maintenance" | "muscleGain" | "keto" | "lowFat";
}

export interface FatIntakeResult {
  dailyFatGrams: number;
  dailyFatCalories: number;
  fatPercent: number;
  saturatedFatMax: number;
  transFatMax: number;
  omega3Min: number;
  omega6Max: number;
  breakdown: {
    saturated: { grams: number; percent: number };
    monounsaturated: { grams: number; percent: number };
    polyunsaturated: { grams: number; percent: number };
  };
  foodSources: {
    healthy: string[];
    limit: string[];
    avoid: string[];
  };
}

export function calculateFatIntake(input: FatIntakeInput): FatIntakeResult | null {
  const { calories, goal } = input;

  if (calories <= 0) {
    return null;
  }

  // Fat percentage based on goal
  let fatPercent: number;
  switch (goal) {
    case "weightLoss":
      fatPercent = 25;
      break;
    case "maintenance":
      fatPercent = 30;
      break;
    case "muscleGain":
      fatPercent = 25;
      break;
    case "keto":
      fatPercent = 70;
      break;
    case "lowFat":
      fatPercent = 20;
      break;
    default:
      fatPercent = 30;
  }

  const dailyFatCalories = (calories * fatPercent) / 100;
  const dailyFatGrams = dailyFatCalories / 9; // 9 calories per gram of fat

  // Recommended limits
  const saturatedFatMax = dailyFatGrams * 0.33; // Max 1/3 of total fat
  const transFatMax = 2; // Grams, should be as low as possible
  const omega3Min = 1.1; // Grams (ALA)
  const omega6Max = dailyFatGrams * 0.1; // Should be balanced with omega-3

  // Ideal fat breakdown
  const breakdown = {
    saturated: {
      grams: dailyFatGrams * 0.25,
      percent: 25,
    },
    monounsaturated: {
      grams: dailyFatGrams * 0.45,
      percent: 45,
    },
    polyunsaturated: {
      grams: dailyFatGrams * 0.3,
      percent: 30,
    },
  };

  const foodSources = {
    healthy: [
      "Avocados",
      "Olive oil",
      "Nuts (almonds, walnuts, cashews)",
      "Seeds (chia, flax, pumpkin)",
      "Fatty fish (salmon, mackerel, sardines)",
      "Eggs",
      "Dark chocolate (70%+ cocoa)",
      "Nut butters",
    ],
    limit: ["Butter", "Cheese", "Red meat", "Coconut oil", "Full-fat dairy", "Palm oil"],
    avoid: [
      "Trans fats (partially hydrogenated oils)",
      "Deep-fried foods",
      "Margarine",
      "Processed snacks",
      "Fast food",
      "Commercially baked goods",
    ],
  };

  return {
    dailyFatGrams,
    dailyFatCalories,
    fatPercent,
    saturatedFatMax,
    transFatMax,
    omega3Min,
    omega6Max,
    breakdown,
    foodSources,
  };
}
