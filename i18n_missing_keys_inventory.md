# Internationalization Audit: Missing Key Inventory

This document provides a comprehensive inventory of all translation keys that are used in the application's components but are missing from the `en.json` message file.

---

## Components

### `src/app/[locale]/health/gfr-calculator/gfr-calculator-component.tsx`

- `calculator.results.estimatedGFR`
- `calculator.results.gfrByFormula`
- `calculator.results.ckdStages`

---

### `src/app/[locale]/health/macro-calculator/macro-calculator-component.tsx`

- `calculator.results.dailyMacros`
- `calculator.results.caloriesFromMacros`
- `calculator.results.proteinCalories`
- `calculator.results.carbsCalories`
- `calculator.results.fatCalories`
- `calculator.results.carbs` (Potentially inconsistent with `calculator.results.carbohydrates`)

---
