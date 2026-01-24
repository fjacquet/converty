// src/lib/converters/cooking/food-cost.ts

export type CostUnit = "kg" | "l" | "piece" | "g" | "ml";
export type Currency = "CHF" | "EUR" | "USD";

export interface IngredientCost {
  id: string;
  name: string;
  costPerUnit: number; // Price per unit (kg, l, piece)
  unit: CostUnit;
  amountUsed: number; // Amount used in recipe
  amountUnit: CostUnit; // Unit for amount used
}

export interface FoodCostInput {
  recipeName: string;
  servings: number;
  currency: Currency;
  ingredients: IngredientCost[];
}

export interface IngredientBreakdown {
  id: string;
  name: string;
  cost: number;
  percentageOfTotal: number;
  costPerUnit: number;
  unit: CostUnit;
  amountUsed: number;
  amountUnit: CostUnit;
}

export interface FoodCostResult {
  recipeName: string;
  servings: number;
  currency: Currency;
  totalCost: number;
  costPerServing: number;
  ingredientBreakdown: IngredientBreakdown[];
  mostExpensiveIngredient: string | null;
  leastExpensiveIngredient: string | null;
  steps: string[];
}

/**
 * Unit conversion factors to base units (kg for weight, l for volume)
 */
const UNIT_TO_BASE: Record<CostUnit, number> = {
  kg: 1,
  g: 0.001,
  l: 1,
  ml: 0.001,
  piece: 1,
};

/**
 * Convert amount to base unit (kg or l)
 */
function convertToBaseUnit(amount: number, unit: CostUnit): number {
  return amount * UNIT_TO_BASE[unit];
}

/**
 * Check if units are compatible for calculation
 */
function areUnitsCompatible(unit1: CostUnit, unit2: CostUnit): boolean {
  const weightUnits: CostUnit[] = ["kg", "g"];
  const volumeUnits: CostUnit[] = ["l", "ml"];

  if (unit1 === "piece" || unit2 === "piece") {
    return unit1 === unit2;
  }

  const unit1IsWeight = weightUnits.includes(unit1);
  const unit2IsWeight = weightUnits.includes(unit2);
  const unit1IsVolume = volumeUnits.includes(unit1);
  const unit2IsVolume = volumeUnits.includes(unit2);

  return (unit1IsWeight && unit2IsWeight) || (unit1IsVolume && unit2IsVolume);
}

/**
 * Calculate cost for a single ingredient
 */
function calculateIngredientCost(ingredient: IngredientCost): number {
  // Check unit compatibility
  if (!areUnitsCompatible(ingredient.unit, ingredient.amountUnit)) {
    throw new Error(
      `Incompatible units for ${ingredient.name}: cost is per ${ingredient.unit}, amount is in ${ingredient.amountUnit}`
    );
  }

  // Convert both to base units
  const costPerBaseUnit = ingredient.costPerUnit / UNIT_TO_BASE[ingredient.unit];
  const amountInBaseUnit = convertToBaseUnit(ingredient.amountUsed, ingredient.amountUnit);

  return costPerBaseUnit * amountInBaseUnit;
}

/**
 * Main food cost calculation function
 */
export function calculateFoodCost(input: FoodCostInput): FoodCostResult {
  const { recipeName, servings, currency, ingredients } = input;
  const steps: string[] = [];

  if (servings <= 0) {
    throw new Error("Servings must be greater than zero");
  }

  if (ingredients.length === 0) {
    return {
      recipeName,
      servings,
      currency,
      totalCost: 0,
      costPerServing: 0,
      ingredientBreakdown: [],
      mostExpensiveIngredient: null,
      leastExpensiveIngredient: null,
      steps: ["No ingredients added"],
    };
  }

  // Calculate cost for each ingredient
  const ingredientBreakdown: IngredientBreakdown[] = ingredients.map((ing) => {
    const cost = calculateIngredientCost(ing);
    steps.push(
      `${ing.name}: ${ing.amountUsed} ${ing.amountUnit} @ ${currency} ${ing.costPerUnit.toFixed(2)}/${ing.unit} = ${currency} ${cost.toFixed(2)}`
    );

    return {
      id: ing.id,
      name: ing.name,
      cost,
      percentageOfTotal: 0, // Calculate after
      costPerUnit: ing.costPerUnit,
      unit: ing.unit,
      amountUsed: ing.amountUsed,
      amountUnit: ing.amountUnit,
    };
  });

  // Calculate total cost
  const totalCost = ingredientBreakdown.reduce((sum, item) => sum + item.cost, 0);
  steps.push(`Total cost: ${currency} ${totalCost.toFixed(2)}`);

  // Calculate percentages
  ingredientBreakdown.forEach((item) => {
    item.percentageOfTotal = totalCost > 0 ? (item.cost / totalCost) * 100 : 0;
  });

  // Calculate cost per serving
  const costPerServing = totalCost / servings;
  steps.push(`Cost per serving (${servings} servings): ${currency} ${costPerServing.toFixed(2)}`);

  // Find most and least expensive ingredients
  const sortedByCost = [...ingredientBreakdown].sort((a, b) => b.cost - a.cost);
  const mostExpensiveIngredient = sortedByCost.length > 0 ? sortedByCost[0].name : null;
  const leastExpensiveIngredient =
    sortedByCost.length > 0 ? sortedByCost[sortedByCost.length - 1].name : null;

  return {
    recipeName,
    servings,
    currency,
    totalCost,
    costPerServing,
    ingredientBreakdown,
    mostExpensiveIngredient,
    leastExpensiveIngredient,
    steps,
  };
}

/**
 * Currency symbols
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CHF: "CHF",
  EUR: "€",
  USD: "$",
};

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (currency === "CHF") {
    return `${symbol} ${amount.toFixed(2)}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}
