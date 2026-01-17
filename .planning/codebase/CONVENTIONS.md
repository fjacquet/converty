# Coding Conventions

**Analysis Date:** 2026-01-17

## Naming Patterns

**Files:**

- kebab-case for all files: `mortgage-calculator.tsx`, `bmi.ts`, `use-converter.ts`
- Calculator components: `[name]-calculator.tsx` (e.g., `mortgage-calculator.tsx`)
- Pure calculation logic: `[name].ts` (e.g., `mortgage.ts`, `bmi.ts`)
- Hooks: `use-[name].ts` (e.g., `use-debounce.ts`, `use-converter.ts`)
- Component files match component name in kebab-case

**Functions:**

- camelCase for all functions: `calculateMortgage`, `convertWeightToKg`, `getBMICategory`
- Calculate functions: `calculate[Name]` (e.g., `calculateBMI`, `calculateMortgage`)
- Getter functions: `get[Name]` (e.g., `getConverterById`, `getBMICategoryInfo`)
- Handler functions: `handle[Action]Change` (e.g., `handleDownPaymentChange`)
- Boolean functions: `is[Condition]` or verb (e.g., `isValid`, `hasErrors`)

**Variables:**

- camelCase for variables: `loanAmount`, `monthlyRate`, `pieData`
- Boolean variables: descriptive names (`isValid`, `hasError`, `syncUrl`)
- React state: descriptive names matching domain (`values`, `result`, `errors`)

**Constants:**

- UPPER_SNAKE_CASE for true constants: `COLORS`, `CONSTANTS`, `BMI_CATEGORIES`, `RESOLUTIONS`
- Arrays of configuration data: UPPER_SNAKE_CASE (e.g., `COMMON_BITRATES`)
- Color theme references use hsl CSS variables: `hsl(var(--primary))`

**Types/Interfaces:**

- PascalCase for all types and interfaces: `MortgageInput`, `BMIResult`, `CalculatorState`
- Input interfaces: `[Name]Input` (e.g., `MortgageInput`, `BMIInput`)
- Result interfaces: `[Name]Result` (e.g., `MortgageResult`, `BMIResult`)
- Props interfaces: `[ComponentName]Props` (e.g., `InputFieldProps`, `ButtonProps`)
- Union types: descriptive names (e.g., `WeightUnit`, `HeightUnit`, `BMICategory`)

**Components:**

- PascalCase for components: `MortgageCalculator`, `InputField`, `Button`
- Calculator components: `[Name]Calculator` (e.g., `MortgageCalculator`, `AgeCalculator`)
- UI components: descriptive names (`Button`, `Card`, `InputField`)
- Layout components: descriptive names (`Header`, `Footer`, `ConverterLayout`)

## Code Style

**Formatting:**

- Tool: Biome v2.3.11 (`biome.json`)
- Indent: 2 spaces
- Line width: 100 characters
- Quote style: double quotes (`"`)
- Semicolons: always required
- Trailing commas: ES5 style (arrays, objects)
- Run: `npm run format` or `npm run check:fix`

**Linting:**

- Tools: ESLint (v9) + Biome
- ESLint config: `eslint.config.mjs` (flat config)
- Biome config: `biome.json`
- Run: `npm run lint` (ESLint), `npm run lint:biome` (Biome), `npm run check` (Biome comprehensive)
- Auto-fix: `npm run lint:fix`, `npm run check:fix`

**Key ESLint Rules:**

- `react/react-in-jsx-scope`: off (React 19)
- `react/prop-types`: off (TypeScript)
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- `@typescript-eslint/no-unused-vars`: warn (allow `_` prefix for intentionally unused)
- `@typescript-eslint/no-explicit-any`: warn
- `@next/next/no-html-link-for-pages`: error
- `@next/next/no-img-element`: warn

**Key Biome Rules:**

- `noUnusedImports`: warn
- `noUnusedFunctionParameters`: warn
- `useExhaustiveDependencies`: warn
- `noExplicitAny`: off (TypeScript handles this)
- `useBlockStatements`: off (allows single-line arrow functions)
- `noNonNullAssertion`: off (allowed when needed)
- Organize imports automatically: enabled

## Import Organization

**Order:**

1. React imports: `import { useState } from "react";`
2. Third-party libraries: `import { useTranslations } from "next-intl";`
3. Internal components: `import { InputField } from "@/components/converter";`
4. Internal utilities: `import { cn } from "@/lib/utils";`
5. Types: `import type { Metadata } from "next";` (can be mixed or at end)

**Path Aliases:**

- `@/*` maps to `src/*` (configured in `tsconfig.json`)
- Always use alias for internal imports: `@/components/ui/button` not `../../components/ui/button`

**Example:**

```typescript
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Area, AreaChart } from "recharts";
import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent } from "@/components/ui/card";
import { calculateMortgage, type MortgageInput } from "@/lib/converters/finance/mortgage";
import { createCalculatorStore } from "@/stores/calculator-store";
```

## Error Handling

**Patterns:**

- Return `null` for invalid inputs (preferred in calculation functions)
- Rarely throw errors (only for truly exceptional cases)
- Validate inputs early, return null immediately for invalid cases
- No try-catch unless calling external APIs or browser APIs

**Example (calculation function):**

```typescript
export function calculateBMI(input: BMIInput): BMIResult | null {
  if (weight <= 0 || height <= 0) {
    return null;  // Invalid input
  }
  // ... calculation
  return { bmi, category, ... };
}
```

**Example (browser API):**

```typescript
try {
  await navigator.clipboard.writeText(text);
} catch (error) {
  console.error("Failed to copy:", error);
}
```

## Logging

**Framework:** Console (no logging library)

**Patterns:**

- Development only: `console.log`, `console.error`
- Minimal logging in production builds
- Error logging for caught exceptions: `console.error("Failed to copy:", error)`
- No verbose debug logging

## Comments

**When to Comment:**

- Complex calculations: explain algorithm or formula
- Business logic: clarify non-obvious requirements
- Workarounds: explain why workaround is needed
- Type definitions: JSDoc for public APIs (optional)

**When NOT to Comment:**

- Self-explanatory code
- Obvious variable names
- Simple calculations
- Standard patterns

**Examples:**

```typescript
// Good: explains formula
// Calculate monthly principal and interest payment using standard mortgage formula
const monthlyPrincipalInterest =
  (loanAmount * (monthlyRate * (1 + monthlyRate) ** numberOfPayments)) /
  ((1 + monthlyRate) ** numberOfPayments - 1);

// Good: explains constant value
const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio

// Bad: restates code
// Set the loan amount
const loanAmount = homePrice - downPayment;
```

**JSDoc/TSDoc:**

- Used for Zustand store factory: `createCalculatorStore`
- Used for complex utility functions
- Optional for most component props (TypeScript interfaces are self-documenting)
- Include `@param`, `@returns`, `@example` when helpful

**Example:**

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
  // ...
}
```

## Function Design

**Size:**

- Keep functions focused and single-purpose
- Large calculator functions (100+ lines) acceptable if doing complex calculations
- Extract helper functions for repeated logic
- Component render functions can be large if structured with cards/sections

**Parameters:**

- Use interface for multiple related parameters
- Prefer object parameters over positional for >2 params
- Make optional params explicit with `?`

**Example:**

```typescript
// Good: interface for related params
export function calculateMortgage(input: MortgageInput): MortgageResult | null;

// Bad: many positional params
export function calculateMortgage(
  homePrice: number,
  downPayment: number,
  loanTerm: number
  // ... 8 more params
): MortgageResult | null;
```

**Return Values:**

- Return `null` for error states in calculations
- Return typed objects or primitives
- Avoid returning `any` or `unknown` unless necessary
- Use union types for multiple return possibilities: `Result | null`

## Module Design

**Exports:**

- Named exports preferred: `export function calculateBMI(...)`
- Default export for React components in pages: `export default function Page(...)`
- Export types alongside implementations

**Example:**

```typescript
// Converter file (lib/converters/health/bmi.ts)
export interface BMIInput { ... }
export interface BMIResult { ... }
export function calculateBMI(input: BMIInput): BMIResult | null { ... }
```

**Barrel Files:**

- Used extensively: `index.ts` re-exports from directory
- Simplifies imports: `import { Button, Card } from "@/components/ui"`
- Pattern: `export * from "./module-name"`

**Example (components/ui/index.ts):**

```typescript
export * from "./button";
export * from "./card";
export * from "./input";
// ...
```

## TypeScript

**Configuration:**

- Strict mode: enabled (`strict: true`)
- No emit: enabled (Next.js handles compilation)
- Module resolution: bundler
- JSX: react-jsx (React 19, no React import needed)
- Target: ES2017

**Type Safety:**

- Avoid `any` (warn level in ESLint)
- Use `unknown` for truly unknown types
- Explicit return types on exported functions preferred
- Interface over type alias for object shapes (style preference)
- Use union types for enums: `type Mode = "add" | "subtract"`

**Generic Usage:**

- Generic stores: `createCalculatorStore<Input, Result>`
- Generic hooks: `useConverter<FormValues, Result>`
- Constrain generics when needed: `<T extends object>`

## Client vs Server Components

**Directive:**

- Client components: `"use client"` at top of file
- Server components: no directive (default)

**When to use Client:**

- Uses React hooks (`useState`, `useEffect`, etc.)
- Uses browser APIs (`window`, `navigator`, etc.)
- Interactive components (buttons, inputs, calculators)
- Uses next-intl client hooks (`useTranslations`, `useFormatter`)

**When to use Server:**

- Static pages
- Metadata generation
- Server-side data fetching
- Uses next-intl server functions (`getTranslations`, `setRequestLocale`)

## State Management

**Zustand (Preferred):**

- New calculators use `createCalculatorStore` factory
- URL sync built-in via middleware
- Type-safe with generics: `createCalculatorStore<Input, Result>`
- Example: `src/stores/calculator-store.ts`

**useConverter Hook (Legacy):**

- Older pattern, being phased out
- Still used in many calculators
- Provides similar API to Zustand stores
- Example: `src/hooks/use-converter.ts`

**Pattern (Zustand):**

```typescript
const useMyStore = createCalculatorStore<MyInput, MyResult>({
  name: "my-calculator",
  initialValues: {
    /* defaults */
  },
  calculate: calculateMy,
});

// In component
const { values, setValue, result } = useMyStore();
```

## Internationalization

**Keys:**

- kebab-case to match registry IDs: `"compound-interest"` not `"compoundInterest"`
- Namespace-qualified: `t("calculator.labels.amount")`
- Translation files: `src/messages/{locale}.json`

**Usage:**

- Server: `const t = await getTranslations("namespace")`
- Client: `const t = useTranslations("namespace")`
- Formatting: `const format = useFormatter()` then `format.number(value, options)`

## Accessibility

**Practices:**

- Use Radix UI primitives (built-in a11y)
- Proper label associations: `<Label htmlFor="id">`
- ARIA attributes when needed
- Keyboard navigation supported by Radix components
- Semantic HTML: `<button>` not `<div onClick>`

## AI Assistant Tools

**Serena (Code Editing):**

- **Preferred method** for all code editing operations
- Provides semantic, symbol-level code manipulation
- Use symbolic tools for precise modifications:
  - `find_symbol`: locate classes, methods, functions by name path
  - `replace_symbol_body`: replace entire symbol definitions
  - `insert_before_symbol` / `insert_after_symbol`: add code around symbols
  - `rename_symbol`: rename with automatic reference updates
  - `replace_content`: regex-based replacements for targeted edits
- Benefits:
  - Type-aware editing (understands code structure)
  - Automatic reference tracking
  - No need to read entire files for small changes
  - Reliable, no need to verify results
- Avoids common pitfalls of text-based editing (indentation, syntax errors)

**Web Search (Internet Research):**

- Use WebSearch tool for:
  - Current events and up-to-date information
  - Documentation for libraries not in Context7
  - Best practices and community solutions
  - Troubleshooting errors and issues
- Use WebFetch tool for:
  - Fetching specific documentation pages
  - Reading GitHub issues/discussions
  - Accessing API documentation
- Always include sources in responses

**Context7 (Library Documentation):**

- **Preferred method** for researching library features and APIs
- Provides up-to-date, curated documentation for popular libraries
- Workflow:
  1. Use `resolve-library-id` to find the correct library ID
  2. Use `get-library-docs` with the library ID and optional topic
- Example use cases:
  - Learning new Next.js features
  - Understanding Zustand API changes
  - Researching Radix UI component props
  - Exploring TypeScript utility types
- More reliable than web search for library-specific questions

---

_Convention analysis: 2026-01-17_
