# Coding Conventions

**Analysis Date:** 2026-01-16

## Naming Patterns

**Files:**

- Component files: kebab-case (`mortgage-calculator.tsx`, `input-field.tsx`)
- Utility files: kebab-case (`calculator-store.ts`, `use-converter.ts`)
- Page files: `page.tsx` in kebab-case directories

**Functions:**

- camelCase for all functions (`calculateMortgage`, `setValue`, `handleDownPaymentChange`)
- Prefix event handlers with `handle` (`handleHomePriceChange`)
- Prefix hooks with `use` (`useConverter`, `useMortgageStore`)

**Variables:**

- camelCase for variables (`monthlyRate`, `numberOfPayments`)
- SCREAMING_SNAKE_CASE for constants (`COLORS`, `BMI_CATEGORIES`)

**Types/Interfaces:**

- PascalCase for types and interfaces (`MortgageInput`, `BMIResult`, `CalculatorState`)
- Suffix input types with `Input` (`MortgageInput`, `BMIInput`, `StatisticsInput`)
- Suffix result types with `Result` (`MortgageResult`, `BMIResult`, `StatisticsResult`)
- Use `type` for union types, `interface` for object shapes

**Components:**

- PascalCase (`MortgageCalculator`, `InputField`, `ResultGrid`)
- Match filename (kebab-case) to component name (PascalCase)

## Code Style

**Formatting:**

- Tool: Biome (configured in `biome.json`)
- Indent: 2 spaces
- Line width: 100 characters
- Semicolons: always required
- Quotes: double quotes for strings
- Trailing commas: ES5 style (in arrays and objects)

**Linting:**

- Tools: Biome + ESLint (configured in `biome.json` and `eslint.config.mjs`)
- Key rules enforced:
  - No unused imports (warning)
  - No unused function parameters (warning)
  - Exhaustive React hook dependencies (warning)
  - No explicit `any` (warning, not error)
  - No non-null assertions allowed in style
  - No `dangerouslySetInnerHTML`
  - React hooks rules strictly enforced

**Run commands:**

```bash
npm run lint         # Run ESLint
npm run lint:biome   # Run Biome linter
npm run format       # Format with Biome
npm run check:fix    # Fix all issues
```

## Import Organization

**Order:**

1. React and Next.js imports
2. Third-party libraries (radix-ui, recharts, lucide-react)
3. Internal aliases (`@/components/*`, `@/lib/*`, `@/stores/*`)
4. Relative imports (same directory)

**Path Aliases:**

- `@/*` maps to `./src/*` (configured in `tsconfig.json`)

**Example:**

```typescript
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { MortgageCalculator } from "./mortgage-calculator";
```

## Error Handling

**Patterns:**

- Return `null` for invalid inputs instead of throwing errors
- Validate inputs at the start of calculation functions
- Use early returns for validation failures

**Calculation functions:**

```typescript
export function calculateMortgage(input: MortgageInput): MortgageResult | null {
  const { homePrice, loanTerm, interestRate } = input;

  // Return null for invalid inputs
  if (homePrice <= 0 || loanTerm <= 0 || interestRate < 0) {
    return null;
  }

  // Proceed with calculation...
}
```

**UI handling:**

- Conditionally render results only when `result` is not null
- Use optional chaining for safe property access
- Display loading states with Suspense fallbacks

## Logging

**Framework:** Browser console (no dedicated logging library)

**Patterns:**

- No logging in production code
- Remove `console.log` statements before committing
- Use React DevTools for state debugging

## Comments

**When to Comment:**

- Complex calculation formulas
- Non-obvious business logic
- TypeScript interfaces (JSDoc style for public APIs)

**JSDoc/TSDoc:**

```typescript
/**
 * Calculator store state interface
 * @template T - Input values type
 * @template R - Result type
 */
export interface CalculatorState<T extends object, R> {
  /** Current input values */
  values: T;
  /** Calculated result (null if invalid inputs) */
  result: R | null;
}
```

**Inline comments:**

- Use `//` for single-line explanations
- Place above the code being explained

## Function Design

**Size:**

- Keep functions focused on single responsibility
- Extract helper functions for complex calculations
- Calculation files typically 50-200 lines

**Parameters:**

- Use object destructuring for multiple parameters
- Define explicit input interfaces
- Optional parameters use `?` suffix

**Return Values:**

- Always define explicit return types
- Return `null` for invalid inputs (not `undefined`)
- Include `steps: string[]` array in results for showing calculation work

**Example:**

```typescript
export function calculateBMI(input: BMIInput): BMIResult | null {
  const { weight, weightUnit, height, heightUnit } = input;

  if (weight <= 0 || height <= 0) {
    return null;
  }

  // ... calculation
  return { bmi, category, categoryLabel, healthyWeightRange, weightToHealthy };
}
```

## Module Design

**Exports:**

- Named exports for all public APIs
- Export types alongside implementations
- No default exports (except Next.js pages)

**Barrel Files:**

- Use `index.ts` for directory exports
- Example: `src/hooks/index.ts`, `src/components/converter/index.ts`

**Pattern:**

```typescript
// src/hooks/index.ts
export * from "./use-converter";
export * from "./use-copy-to-clipboard";
export * from "./use-debounce";
export * from "./use-url-state";
```

## Component Patterns

**Client vs Server:**

- Mark client components with `"use client"` directive at top of file
- Pages are server components by default
- Calculator logic components are always client components

**Props interface:**

```typescript
interface InputFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  min?: number | string;
  className?: string;
}
```

**Component structure:**

```typescript
export function InputField({
  id,
  label,
  value,
  onChange,
  type = "number",
  min,
  className,
}: InputFieldProps) {
  return <div className={cn("space-y-2", className)}>{/* ... */}</div>;
}
```

## State Management

**Preferred: Zustand stores** (see `src/stores/calculator-store.ts`)

```typescript
const useMortgageStore = createCalculatorStore<MortgageInput, MortgageResult>({
  name: "mortgage-calculator",
  initialValues: {
    /* ... */
  },
  calculate: calculateMortgage,
});

// Usage in component
const { values, setValue, result } = useMortgageStore();
```

**Legacy: useConverter hook** (being phased out)

```typescript
const { values, setValue, result } = useConverter<FormValues, Result>({
  initialValues: {
    /* ... */
  },
  calculate: (vals) => calculateSomething(vals),
});
```

## Styling Conventions

**Framework:** Tailwind CSS v4 with CSS variables

**Class merging:**

```typescript
import { cn } from "@/lib/utils";

<div
  className={cn("base-classes", condition && "conditional-class", className)}
/>;
```

**Spacing:** Use Tailwind spacing utilities (`space-y-4`, `gap-2`, `p-6`)

**Responsive:** Mobile-first (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)

**Theme colors:** Use CSS variables (`bg-primary`, `text-muted-foreground`, `border-destructive`)

## TypeScript Conventions

**Strict mode:** Enabled in `tsconfig.json`

**Type assertions:**

- Avoid type assertions when possible
- Use `as const` for literal types
- Non-null assertions (`!`) are allowed but discouraged

**Generics:**

```typescript
export function createCalculatorStore<T extends object, R>({
  initialValues,
  calculate,
}: CreateCalculatorStoreOptions<T, R>) {
  // ...
}
```

---

_Convention analysis: 2026-01-16_
