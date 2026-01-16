# Converty Architecture

> **Last Updated:** 2026-01-16
> **Status:** Active Development

## Overview

Converty is a comprehensive collection of calculators and converters built with Next.js. The project follows a modular architecture that separates calculation logic from UI components, enabling easy addition of new calculators.

## Technology Stack

| Technology   | Version | Purpose                               |
| ------------ | ------- | ------------------------------------- |
| Next.js      | 16.x    | Framework (App Router, Static Export) |
| React        | 19.x    | UI Framework                          |
| TypeScript   | 5.x     | Type Safety (Strict Mode)             |
| Tailwind CSS | 4.x     | Styling                               |
| Radix UI     | -       | Accessible UI Primitives              |
| Zustand      | 5.x     | State Management                      |
| Recharts     | -       | Data Visualization                    |
| jsPDF        | -       | PDF Report Generation                 |
| Lucide React | -       | Icons                                 |
| next-themes  | -       | Dark/Light Mode                       |
| next-intl    | -       | Internationalization (4 locales)      |

## Directory Structure

```
converty/
├── docs/
│   └── ARCHITECTURE.md          # This file
├── src/
│   ├── app/
│   │   └── [locale]/            # Locale-prefixed routes (en, fr, de, it)
│   │       ├── [category]/      # Dynamic category pages
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
│   ├── i18n/                    # Internationalization config
│   │   ├── config.ts            # Locale definitions
│   │   ├── request.ts           # Server-side i18n setup
│   │   └── navigation.ts        # Localized Link, redirect
│   ├── messages/                # Translation files
│   │   ├── en.json              # English (source of truth)
│   │   ├── fr.json              # French
│   │   ├── de.json              # German
│   │   └── it.json              # Italian
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
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { urlSync } from "./url-sync";

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
          const result =
            Object.keys(errors).length === 0 ? calculate(newValues) : null;
          set({ values: newValues, errors, result });
        },
        setValues: (values) => {
          const errors = validate?.(values) ?? {};
          const result =
            Object.keys(errors).length === 0 ? calculate(values) : null;
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
// Note: name and description come from translations (src/messages/*.json)
export interface ConverterMeta {
  id: string;           // Must match translation key in converters section
  slug: string;
  category: string;
  subcategory?: string; // Links to subcategory.id
  keywords: string[];
  icon: LucideIcon;
  featured?: boolean;
}
```

## Design Principles (MANDATORY)

These rules MUST be followed for all calculator development:

### 1. Three-Layer Pattern

**Rule**: "Logic never lives in the Component."

```
1. Write Pure Logic in src/lib/converters/ first (no React code)
2. Create Zustand Store using createCalculatorStore factory
3. Build UI Component only after logic and store are defined
```

### 2. Design System Consistency (Tailwind & Radix)

**Rule**: "Use Semantic Variables, not arbitrary colors."

```
❌ DO NOT use: bg-blue-500, text-gray-700, border-slate-300
✅ ALWAYS use: bg-primary, text-muted-foreground, border-input
```

All colors must use CSS variables from `globals.css`. Use Radix UI primitives for interactive elements.

### 3. Component Reusability ("Lego" Approach)

**Rule**: "Don't build an input; configure the InputField."

```
❌ Never use raw HTML <input> tags for calculator inputs
✅ Always use InputField, OutputDisplay, ResultGrid components
```

Only create custom UI if existing components cannot support the data visualization.

### 4. State Management Discipline

**Rule**: "URL Persistence is mandatory."

```
❌ DO NOT use useState for calculation parameters
✅ ALWAYS use createCalculatorStore with urlSync middleware
```

All calculator state must be shareable via URL.

### 5. Mobile-First & Responsive

**Rule**: "Layouts must break gracefully."

```
ResultGrid defaults: 1 column (mobile)
Use breakpoints: sm:grid-cols-2, lg:grid-cols-3
```

---

## Internationalization (i18n)

Converty supports 4 Swiss languages: **English (en)**, **French (fr)**, **German (de)**, **Italian (it)**.

### URL Structure

All pages are prefixed with locale: `/en/finance/mortgage`, `/fr/finance/mortgage`, etc.

### Server Components (Pages)

```typescript
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function MyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("namespace");
  return <div>{t("key")}</div>;
}

// REQUIRED: Generate all locale variants
export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "fr" },
    { locale: "de" },
    { locale: "it" },
  ];
}
```

### Client Components (Calculators)

```typescript
"use client";
import { useTranslations, useFormatter } from "next-intl";

export function MyCalculator() {
  const t = useTranslations("calculator.category");
  const format = useFormatter();

  // Format numbers/currency with locale
  const formatted = format.number(1234.56, {
    style: "currency",
    currency: "CHF",
  });

  return <Label>{t("labelKey")}</Label>; // ✅ Never hardcode text
}
```

### Translation File Structure

```json
{
  "common": { "siteName": "Converty" },
  "categories": { "finance": { "name": "Finance", "description": "..." } },
  "converters": {
    "mortgage": {
      "name": "Mortgage Calculator",
      "description": "Calculate monthly payments",
      "metaDescription": "SEO description"
    }
  },
  "calculator": {
    "labels": { "amount": "Amount", "rate": "Rate" },
    "sections": { "input": "Input", "results": "Results" }
  }
}
```

### Key Rules

- Translation keys use **kebab-case** matching registry IDs
- Add to `en.json` first, then translate to `fr.json`, `de.json`, `it.json`
- **NEVER hardcode UI text** - always use `t("key")`
- Use `useFormatter()` for numbers, currency, dates

---

## Adding a New Calculator

### Step 1: Create Calculation Logic

```typescript
// src/lib/converters/datetime/age.ts
export interface AgeInput {
  birthDate: string; // ISO date string
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
// src/app/[locale]/datetime/age/age-calculator.tsx
"use client";

import { useTranslations } from "next-intl";
import { createCalculatorStore } from "@/stores/calculator-store";
import {
  calculateAge,
  AgeInput,
  AgeResult,
} from "@/lib/converters/datetime/age";
import { InputField, ResultGrid } from "@/components/converter";

const useAgeStore = createCalculatorStore<AgeInput, AgeResult>(
  "age-calculator",
  { birthDate: "" },
  calculateAge
);

export function AgeCalculator() {
  const t = useTranslations("calculator.age"); // ✅ i18n hook
  const { values, setValue, result } = useAgeStore();

  return (
    <div className="space-y-6">
      <InputField
        id="birthDate"
        label={t("birthDate")} // ✅ Never hardcode text
        type="date"
        value={values.birthDate}
        onChange={(e) => setValue("birthDate", e.target.value)}
      />

      {result && (
        <ResultGrid
          results={[
            { label: t("years"), value: result.years }, // ✅ Translated
            { label: t("months"), value: result.months },
            { label: t("days"), value: result.days },
          ]}
          columns={3}
        />
      )}
    </div>
  );
}
```

### Step 4: Add Translations

```json
// src/messages/en.json (then translate to fr, de, it)
{
  "converters": {
    "age": {
      "name": "Age Calculator",
      "description": "Calculate exact age from birthdate",
      "metaDescription": "Calculate your exact age in years, months, and days"
    }
  },
  "calculator": {
    "age": {
      "birthDate": "Birth Date",
      "years": "Years",
      "months": "Months",
      "days": "Days"
    }
  }
}
```

### Step 5: Create Page

```typescript
// src/app/[locale]/datetime/age/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { AgeCalculator } from "./age-calculator";
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.age" });
  return { title: t("name"), description: t("metaDescription") };
}

export default async function AgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("converters.age");

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
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
  type="number" // "text" | "number" | "date" | "time"
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
  size="lg" // "default" | "lg"
/>
```

### ResultGrid

```typescript
<ResultGrid
  results={[
    { label: "Weight", value: 70, unit: "kg" },
    { label: "Height", value: 175, unit: "cm" },
  ]}
  columns={2} // 2 | 3 | 4
/>
```

### ChartDisplay (Recharts wrapper)

```typescript
<ChartDisplay
  type="line" // "line" | "bar" | "area" | "pie"
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

<div
  className={cn(
    "p-4 rounded-lg",
    isActive && "bg-primary text-primary-foreground"
  )}
/>;
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
- [x] Internationalization (i18n) - ✅ **Implemented** (en, fr, de, it)

---

## Updates Required

When you make changes to the architecture, update this document:

1. **New Categories**: Add to the category list and update directory structure
2. **New Components**: Document in Component Reference section
3. **New Patterns**: Add examples in relevant sections
4. **New Dependencies**: Update Technology Stack table
5. **New Translations**: Add to all 4 locale files (en, fr, de, it)
6. **Design Violations**: If a design principle is violated, fix it before merging

### Design Principle Enforcement

Before every commit, verify:

- [ ] No hardcoded UI text (use `useTranslations()`)
- [ ] No arbitrary Tailwind colors (use semantic variables)
- [ ] No raw `<input>` tags (use `InputField`)
- [ ] No `useState` for calculator params (use Zustand store)
- [ ] Mobile-first responsive layout
