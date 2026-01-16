# Testing Patterns

**Analysis Date:** 2026-01-16

## Test Framework

**Runner:**

- No test framework currently installed
- No test configuration files present
- No test scripts in `package.json`

**Status:** Testing infrastructure is not set up in this codebase.

**Recommended setup (not yet implemented):**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## Test File Organization

**Current State:** No test files exist in the codebase.

**Recommended Pattern:**

- Location: Co-located with source files
- Naming: `[name].test.ts` or `[name].test.tsx`

**Suggested structure:**

```
src/
├── lib/
│   └── converters/
│       └── finance/
│           ├── mortgage.ts
│           └── mortgage.test.ts      # Unit tests for calculation
├── components/
│   └── converter/
│       ├── input-field.tsx
│       └── input-field.test.tsx      # Component tests
└── app/
    └── [locale]/
        └── finance/
            └── mortgage/
                ├── page.tsx
                └── page.test.tsx     # Integration tests
```

## Test Structure

**Recommended patterns for this codebase:**

**Unit tests for calculation functions:**

```typescript
// src/lib/converters/finance/mortgage.test.ts
import { describe, it, expect } from "vitest";
import { calculateMortgage, type MortgageInput } from "./mortgage";

describe("calculateMortgage", () => {
  it("returns null for invalid home price", () => {
    const input: MortgageInput = {
      homePrice: 0,
      downPayment: 0,
      downPaymentPercent: 0,
      loanTerm: 30,
      interestRate: 6.5,
      propertyTax: 0,
      homeInsurance: 0,
      pmi: 0,
      hoaFees: 0,
      startDate: "2024-01-01",
    };

    expect(calculateMortgage(input)).toBeNull();
  });

  it("calculates monthly payment correctly", () => {
    const input: MortgageInput = {
      homePrice: 400000,
      downPayment: 80000,
      downPaymentPercent: 20,
      loanTerm: 30,
      interestRate: 6.5,
      propertyTax: 4800,
      homeInsurance: 1200,
      pmi: 0,
      hoaFees: 0,
      startDate: "2024-01-01",
    };

    const result = calculateMortgage(input);

    expect(result).not.toBeNull();
    expect(result?.loanAmount).toBe(320000);
    expect(result?.monthlyPrincipalInterest).toBeCloseTo(2022.53, 0);
  });
});
```

**Component tests:**

```typescript
// src/components/converter/input-field.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputField } from "./input-field";

describe("InputField", () => {
  it("renders label and input", () => {
    render(
      <InputField
        id="test"
        label="Test Label"
        value="100"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(100);
  });

  it("calls onChange when value changes", () => {
    const handleChange = vi.fn();

    render(
      <InputField id="test" label="Test" value="" onChange={handleChange} />
    );

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "200" },
    });

    expect(handleChange).toHaveBeenCalledWith("200");
  });
});
```

## Mocking

**Framework:** Would use Vitest's built-in mocking (not yet implemented)

**Recommended patterns:**

**Mocking modules:**

```typescript
import { vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useFormatter: () => ({
    number: (n: number) => n.toString(),
  }),
}));
```

**Mocking Zustand stores:**

```typescript
import { vi } from "vitest";

vi.mock("@/stores/calculator-store", () => ({
  createCalculatorStore: vi.fn(() => () => ({
    values: { homePrice: 400000 },
    setValue: vi.fn(),
    result: null,
  })),
}));
```

**What to Mock:**

- External APIs (none currently used)
- Browser APIs (localStorage, URL)
- next-intl hooks for translations
- Zustand store implementations

**What NOT to Mock:**

- Pure calculation functions (test directly)
- UI component rendering
- CSS class application

## Fixtures and Factories

**Recommended test data patterns:**

```typescript
// src/lib/converters/finance/__fixtures__/mortgage.ts

export const createMortgageInput = (
  overrides?: Partial<MortgageInput>
): MortgageInput => ({
  homePrice: 400000,
  downPayment: 80000,
  downPaymentPercent: 20,
  loanTerm: 30,
  interestRate: 6.5,
  propertyTax: 4800,
  homeInsurance: 1200,
  pmi: 0,
  hoaFees: 0,
  startDate: "2024-01-01",
  ...overrides,
});

export const validMortgageResult: MortgageResult = {
  loanAmount: 320000,
  monthlyPrincipalInterest: 2022.53,
  // ... rest of result
};
```

**Location:**

- `__fixtures__/` directories alongside test files
- Or inline within test files for simple cases

## Coverage

**Requirements:** None enforced (no testing infrastructure)

**Recommended targets for future:**

- Calculation functions: 90%+ coverage
- UI components: 70%+ coverage
- Integration tests: Key user flows

**View Coverage (when implemented):**

```bash
npm run test:coverage
```

## Test Types

**Unit Tests:**

- Scope: Pure calculation functions in `src/lib/converters/`
- Approach: Test input/output, edge cases, null returns
- Priority: HIGH - Most critical for correctness

**Integration Tests:**

- Scope: Calculator components with store
- Approach: Test user interactions and state changes
- Priority: MEDIUM

**E2E Tests:**

- Framework: Not used
- Status: Could consider Playwright for critical paths
- Priority: LOW

## Common Patterns

**Testing null returns:**

```typescript
it("returns null for zero value", () => {
  const result = calculateBMI({ weight: 0, height: 170, ... });
  expect(result).toBeNull();
});
```

**Testing calculation accuracy:**

```typescript
it("calculates BMI correctly", () => {
  const result = calculateBMI({
    weight: 70,
    weightUnit: "kg",
    height: 170,
    heightUnit: "cm",
  });

  expect(result?.bmi).toBeCloseTo(24.2, 1);
  expect(result?.category).toBe("normal");
});
```

**Testing with translations:**

```typescript
// Mock the translation hook
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => `translated:${key}`,
}));

it("displays translated label", () => {
  render(<InputField id="test" label={t("labels.amount")} ... />);
  expect(screen.getByText("translated:labels.amount")).toBeInTheDocument();
});
```

## Recommended Next Steps

1. **Install test framework:**

   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
   ```

2. **Create vitest config:**

   ```typescript
   // vitest.config.ts
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react";
   import { resolve } from "path";

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: "jsdom",
       setupFiles: ["./src/test/setup.ts"],
       globals: true,
     },
     resolve: {
       alias: {
         "@": resolve(__dirname, "./src"),
       },
     },
   });
   ```

3. **Add test scripts to package.json:**

   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:coverage": "vitest run --coverage",
       "test:ui": "vitest --ui"
     }
   }
   ```

4. **Start with calculation function tests:**
   - `src/lib/converters/finance/mortgage.test.ts`
   - `src/lib/converters/health/bmi.test.ts`
   - Focus on edge cases and null returns

---

_Testing analysis: 2026-01-16_
