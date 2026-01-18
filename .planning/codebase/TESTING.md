# Testing Patterns

**Analysis Date:** 2026-01-17

## Test Framework

**Runner:**

- None currently configured
- No test files found in `src/`
- No test framework dependencies in `package.json`

**Run Commands:**

```bash
# No test commands available
# Quality checks use:
npm run type-check     # TypeScript type checking
npm run lint           # ESLint
npm run lint:biome     # Biome linting
npm run quality        # All quality checks (lint + biome + type-check)
```

## Test File Organization

**Location:**

- No test files currently exist

**Expected Pattern (if tests were added):**

- Co-located: `src/lib/converters/health/bmi.test.ts` next to `bmi.ts`
- Or separate: `__tests__/lib/converters/health/bmi.test.ts`
- Or test directory: `tests/lib/converters/health/bmi.test.ts`

**Naming:**

- `*.test.ts` or `*.spec.ts` for TypeScript files
- `*.test.tsx` or `*.spec.tsx` for component tests

## Current Quality Assurance

**Type Checking:**

- TypeScript compiler with strict mode
- Run: `npx tsc --noEmit`
- Configured in `tsconfig.json`

**Linting:**

- ESLint v9 with TypeScript support
- Biome v2.3.11 for additional checks
- Run: `npm run lint` or `npm run check`

**Manual Testing:**

- Development server: `npm run dev`
- Visual testing in browser
- Calculator outputs verified manually
- URL state persistence tested interactively

## Testing Approach (Current)

**Validation:**

- Input validation in calculator functions (return `null` for invalid)
- TypeScript ensures type safety at compile time
- Biome checks code quality and patterns

**Calculation Verification:**

- Manual testing with known inputs/outputs
- Visual verification in browser
- No automated test suite

**Regression Prevention:**

- Type checking catches many bugs
- Linting prevents common mistakes
- Build process (`npm run build`) must succeed

## What Would Be Tested (Recommendations)

**Unit Tests (Calculation Functions):**

```typescript
// src/lib/converters/health/bmi.test.ts
import { calculateBMI } from "./bmi";

describe("calculateBMI", () => {
  it("calculates BMI correctly", () => {
    const result = calculateBMI({
      weight: 70,
      weightUnit: "kg",
      height: 175,
      heightUnit: "cm",
    });

    expect(result?.bmi).toBeCloseTo(22.9, 1);
    expect(result?.category).toBe("normal");
  });

  it("returns null for invalid inputs", () => {
    const result = calculateBMI({
      weight: -10,
      weightUnit: "kg",
      height: 175,
      heightUnit: "cm",
    });

    expect(result).toBeNull();
  });
});
```

**Integration Tests (Stores):**

```typescript
// src/stores/calculator-store.test.ts
import { createCalculatorStore } from "./calculator-store";

describe("createCalculatorStore", () => {
  it("updates values and calculates result", () => {
    const useStore = createCalculatorStore({
      name: "test",
      initialValues: { a: 0, b: 0 },
      calculate: (vals) => ({ sum: vals.a + vals.b }),
    });

    const { setValue, result } = useStore.getState();
    setValue("a", 5);
    setValue("b", 3);

    expect(result?.sum).toBe(8);
  });
});
```

**Component Tests:**

```typescript
// src/components/converter/input-field.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { InputField } from "./input-field";

describe("InputField", () => {
  it("renders label and input", () => {
    render(
      <InputField
        id="test"
        label="Test Input"
        value="100"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const onChange = jest.fn();
    render(
      <InputField id="test" label="Test" value="100" onChange={onChange} />
    );

    fireEvent.change(screen.getByLabelText("Test"), {
      target: { value: "200" },
    });

    expect(onChange).toHaveBeenCalledWith("200");
  });
});
```

## Test Framework Recommendations

**For Unit Tests:**

- Vitest (fast, Vite-based, modern)
- Jest (established, widely used)

**For Component Tests:**

- React Testing Library (recommended for React 19)
- Vitest + @testing-library/react

**For E2E Tests:**

- Playwright (recommended for Next.js)
- Cypress (alternative)

**Setup Example (Vitest):**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Config (`vitest.config.ts`):**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

## Coverage

**Requirements:** None enforced

**View Coverage:**

```bash
# Would be (if Vitest configured):
npx vitest run --coverage
```

**Target Areas for Coverage:**

- Calculation functions in `src/lib/converters/` (high value)
- Store logic in `src/stores/`
- Utilities in `src/lib/utils/`
- Component rendering (lower priority due to type safety)

## Test Types

**Unit Tests (Recommended Priority):**

- Calculation functions (highest ROI)
- Pure functions in converters
- Utility functions
- Store factories

**Integration Tests:**

- Zustand stores with calculation functions
- URL state sync middleware
- Component + store integration

**E2E Tests (Future):**

- Full calculator flows
- URL parameter persistence
- Multi-language support
- PDF export functionality

## Common Patterns (If Tests Existed)

**Async Testing:**

```typescript
it("handles async operations", async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});
```

**Error Testing:**

```typescript
it("returns null for division by zero", () => {
  const result = calculate({ divisor: 0 });
  expect(result).toBeNull();
});
```

**Snapshot Testing (Component Structure):**

```typescript
it("matches snapshot", () => {
  const { container } = render(<Component />);
  expect(container.firstChild).toMatchSnapshot();
});
```

## Quality Gates (Current)

**Build-time:**

1. TypeScript compilation must succeed
2. Biome linting must pass (or have no errors)
3. ESLint checks must pass
4. Static export generation must succeed

**Pre-commit (Recommended):**

- Run `npm run quality` before commits
- Format with `npm run format`
- Type check with `npm run type-check`

**CI/CD (If configured):**

```yaml
# Example GitHub Actions workflow
- name: Quality Check
  run: |
    npm run type-check
    npm run lint
    npm run lint:biome
    npm run build
```

## Test Coverage Gaps (Current State)

**Untested Areas:**

- All calculation functions in `src/lib/converters/` (no automated tests)
- Zustand store logic
- Component rendering and interactions
- URL state synchronization
- Translation key coverage
- Error handling paths

**Risk:**

- High complexity functions (mortgage amortization, statistical calculations) have no automated verification
- Regressions must be caught manually
- Refactoring carries higher risk without test safety net

**Priority:**

1. Add tests for calculation functions (highest value)
2. Add store tests for state management
3. Add component tests for critical UI components
4. Add E2E tests for user workflows

---

_Testing analysis: 2026-01-17_
