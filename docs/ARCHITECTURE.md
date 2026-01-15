# Converty Architecture

> **Last Updated:** 2025-01-14
> **Status:** Active Development

## Overview

Converty is a comprehensive collection of calculators and converters built with Next.js. The project follows a modular architecture that separates calculation logic from UI components, enabling easy addition of new calculators.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | Framework (App Router, Static Export) |
| React | 19.x | UI Framework |
| TypeScript | 5.x | Type Safety (Strict Mode) |
| Tailwind CSS | 4.x | Styling |
| Radix UI | - | Accessible UI Primitives |
| Zustand | 5.x | State Management |
| Recharts | - | Data Visualization |
| jsPDF | - | PDF Report Generation |
| Lucide React | - | Icons |
| next-themes | - | Dark/Light Mode |

## Directory Structure

```
converty/
├── docs/
│   └── ARCHITECTURE.md          # This file
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── [category]/          # Dynamic category pages
│   │   │   ├── page.tsx         # Category listing
│   │   │   └── [tool]/          # Individual calculator pages
│   │   │       ├── page.tsx     # Page wrapper
│   │   │       └── *-calculator.tsx  # Calculator component
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles & CSS variables
│   │   └── page.tsx             # Homepage
│   ├── components/
│   │   ├── ui/                  # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── select.tsx
│   │   ├── converter/           # Calculator-specific components
│   │   │   ├── input-field.tsx      # Input with unit selector
│   │   │   ├── output-display.tsx   # Result display with copy
│   │   │   ├── result-grid.tsx      # Multi-result grid
│   │   │   ├── converter-layout.tsx # Page wrapper
│   │   │   ├── subcategory-nav.tsx  # Subcategory navigation
│   │   │   └── chart-display.tsx    # Recharts wrapper
│   │   └── layout/
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       └── theme-toggle.tsx
│   ├── hooks/                   # React hooks (legacy, migrating to Zustand)
│   │   ├── use-converter.ts     # Calculator state hook
│   │   ├── use-debounce.ts      # Debounce utility
│   │   ├── use-url-state.ts     # URL persistence
│   │   └── use-copy-to-clipboard.ts
│   ├── stores/                  # Zustand stores
│   │   ├── calculator-store.ts  # Generic calculator store pattern
│   │   └── url-sync.ts          # URL persistence middleware
│   ├── lib/
│   │   ├── converters/          # Calculation logic by category
│   │   │   ├── health/          # BMI, body composition
│   │   │   ├── photo/           # Photography calculators
│   │   │   ├── video/           # Video/media calculators
│   │   │   ├── finance/         # Financial calculators
│   │   │   ├── datetime/        # Date & time calculators
│   │   │   ├── math/            # Math calculators
│   │   │   └── ...
│   │   ├── registry/
│   │   │   ├── categories.ts    # Category definitions
│   │   │   └── converters.ts    # Calculator metadata registry
│   │   └── utils/
│   │       ├── cn.ts            # Class name utility
│   │       ├── format.ts        # Number/date formatting
│   │       ├── date.ts          # Date calculation helpers
│   │       ├── financial.ts     # Financial calculation helpers
│   │       └── pdf-export.ts    # PDF generation
│   └── types/
│       └── converter.ts         # TypeScript interfaces
├── CLAUDE.md                    # AI assistant configuration
├── package.json
└── next.config.ts
```

## Calculator Architecture

### Three-Layer Pattern

```
┌─────────────────────────────────────────────────────────┐
│                    Page Component                        │
│  src/app/[category]/[tool]/page.tsx                     │
│  - Imports calculator component                          │
│  - Provides metadata (title, description)               │
│  - Wraps in ConverterLayout                             │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               Calculator Component                       │
│  src/app/[category]/[tool]/*-calculator.tsx             │
│  - Uses Zustand store for state                         │
│  - Composes InputField, OutputDisplay components        │
│  - Handles user interaction                             │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Calculation Logic                           │
│  src/lib/converters/[category]/*.ts                     │
│  - Pure TypeScript functions                            │
│  - Input/Output interfaces                              │
│  - Unit conversion helpers                              │
│  - No React dependencies                                │
└─────────────────────────────────────────────────────────┘
```

### State Management (Zustand)

```typescript
// src/stores/calculator-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { urlSync } from './url-sync';

interface CalculatorState<T, R> {
  values: T;
  result: R | null;
  errors: Partial<Record<keyof T, string>>;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setValues: (values: T) => void;
  reset: () => void;
}

// Factory function for creating calculator stores
export function createCalculatorStore<T extends object, R>(
  name: string,
  initialValues: T,
  calculate: (values: T) => R | null,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  return create<CalculatorState<T, R>>()(
    urlSync(
      (set, get) => ({
        values: initialValues,
        result: null,
        errors: {},
        setValue: (key, value) => {
          const newValues = { ...get().values, [key]: value };
          const errors = validate?.(newValues) ?? {};
          const result = Object.keys(errors).length === 0 ? calculate(newValues) : null;
          set({ values: newValues, errors, result });
        },
        setValues: (values) => {
          const errors = validate?.(values) ?? {};
          const result = Object.keys(errors).length === 0 ? calculate(values) : null;
          set({ values, errors, result });
        },
        reset: () => set({ values: initialValues, errors: {}, result: null }),
      }),
      { name }
    )
  );
}
```

### Category & Subcategory System

```typescript
// src/lib/registry/categories.ts
export interface Subcategory {
  id: string;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subcategories?: Subcategory[];
}

// Example with subcategories
{
  id: "finance",
  slug: "finance",
  name: "Finance",
  description: "Financial calculators and converters",
  icon: DollarSign,
  subcategories: [
    { id: "loans", name: "Loans & Mortgages" },
    { id: "investments", name: "Retirement & Investments" },
    { id: "taxes", name: "Income & Taxes" },
    // ...
  ]
}
```

```typescript
// src/lib/registry/converters.ts
export interface ConverterMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;  // Links to subcategory.id
  keywords: string[];
  icon: LucideIcon;
  featured: boolean;
}
```

## Adding a New Calculator

### Step 1: Create Calculation Logic

```typescript
// src/lib/converters/datetime/age.ts
export interface AgeInput {
  birthDate: string;  // ISO date string
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: Date;
}

export function calculateAge(input: AgeInput): AgeResult | null {
  const birth = new Date(input.birthDate);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  // ... calculation logic

  return { years, months, days, totalDays, nextBirthday };
}
```

### Step 2: Register the Calculator

```typescript
// src/lib/registry/converters.ts
"age": {
  id: "age",
  slug: "age",
  name: "Age Calculator",
  description: "Calculate exact age from birthdate",
  category: "datetime",
  subcategory: "date-time",
  keywords: ["age", "birthday", "years", "days"],
  icon: Calendar,
  featured: true,
},
```

### Step 3: Create Calculator Component

```typescript
// src/app/datetime/age/age-calculator.tsx
"use client";

import { useCalculatorStore } from "@/stores/calculator-store";
import { calculateAge, AgeInput, AgeResult } from "@/lib/converters/datetime/age";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";

const useAgeStore = createCalculatorStore<AgeInput, AgeResult>(
  "age-calculator",
  { birthDate: "" },
  calculateAge
);

export function AgeCalculator() {
  const { values, setValue, result } = useAgeStore();

  return (
    <div className="space-y-6">
      <InputField
        id="birthDate"
        label="Birth Date"
        type="date"
        value={values.birthDate}
        onChange={(e) => setValue("birthDate", e.target.value)}
      />

      {result && (
        <ResultGrid
          results={[
            { label: "Years", value: result.years },
            { label: "Months", value: result.months },
            { label: "Days", value: result.days },
          ]}
          columns={3}
        />
      )}
    </div>
  );
}
```

### Step 4: Create Page

```typescript
// src/app/datetime/age/page.tsx
import { ConverterLayout } from "@/components/converter/converter-layout";
import { AgeCalculator } from "./age-calculator";

export const metadata = {
  title: "Age Calculator - Converty",
  description: "Calculate exact age from birthdate",
};

export default function AgePage() {
  return (
    <ConverterLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days"
      category="datetime"
    >
      <AgeCalculator />
    </ConverterLayout>
  );
}
```

## Component Reference

### InputField
```typescript
<InputField
  id="weight"
  label="Weight"
  value={value}
  onChange={(e) => setValue("weight", e.target.value)}
  type="number"  // "text" | "number" | "date" | "time"
  min={0}
  max={500}
  step={0.1}
  units={[
    { value: "kg", label: "kg" },
    { value: "lb", label: "lb" },
  ]}
  selectedUnit={unit}
  onUnitChange={setUnit}
  error="Error message"
  helperText="Helper text"
/>
```

### OutputDisplay
```typescript
<OutputDisplay
  label="BMI"
  value={22.5}
  unit="kg/m²"
  copyable={true}
  size="lg"  // "default" | "lg"
/>
```

### ResultGrid
```typescript
<ResultGrid
  results={[
    { label: "Weight", value: 70, unit: "kg" },
    { label: "Height", value: 175, unit: "cm" },
  ]}
  columns={2}  // 2 | 3 | 4
/>
```

### ChartDisplay (Recharts wrapper)
```typescript
<ChartDisplay
  type="line"  // "line" | "bar" | "area" | "pie"
  data={chartData}
  xKey="month"
  yKey="balance"
  title="Loan Balance Over Time"
/>
```

## Styling Conventions

### Theme System
- CSS Custom Properties in `globals.css`
- Light/Dark mode via `next-themes`
- Semantic color tokens: `--background`, `--foreground`, `--primary`, etc.

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- Use Tailwind's responsive prefixes

### Component Styling
```typescript
// Use cn() for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary text-primary-foreground"
)} />
```

## Performance Considerations

1. **Debouncing**: Calculator inputs are debounced (150ms default) to prevent excessive recalculation
2. **URL Sync**: URL updates are debounced to avoid browser history pollution
3. **Static Export**: All pages are statically generated for fast loading
4. **Code Splitting**: Each calculator is in its own page for automatic code splitting

## Testing Checklist

- [ ] Calculator renders correctly
- [ ] Calculations are mathematically accurate
- [ ] URL state persistence works
- [ ] Mobile responsive layout
- [ ] Dark mode styling
- [ ] Accessibility (labels, ARIA attributes)
- [ ] Error states display correctly

## Future Enhancements

- [ ] PDF export for all calculators
- [ ] Comparison mode (compare results across calculators)
- [ ] Calculator history/favorites
- [ ] PWA support for offline use
- [ ] Internationalization (i18n)

---

## Updates Required

When you make changes to the architecture, update this document:

1. **New Categories**: Add to the category list and update directory structure
2. **New Components**: Document in Component Reference section
3. **New Patterns**: Add examples in relevant sections
4. **New Dependencies**: Update Technology Stack table
