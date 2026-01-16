# Architecture

**Analysis Date:** 2026-01-16

## Pattern Overview

**Overall:** Feature-Sliced Layered Architecture with Static Site Generation

**Key Characteristics:**

- Static Site Generation (SSG) via Next.js 16 App Router with `output: "export"`
- Layered separation: Pages (server) -> Components (client) -> Logic (pure functions)
- Registry-based metadata system for calculators and categories
- Internationalization-first with locale-prefixed routes (`/[locale]/...`)
- Client-side state management via Zustand or `useConverter` hook
- URL state synchronization for shareable calculator links

## Layers

**Pages Layer (Server Components):**

- Purpose: Route handling, metadata generation, static params, layout composition
- Location: `src/app/[locale]/`
- Contains: Server components that fetch translations and render layouts
- Depends on: Components layer, Registry, i18n
- Used by: Next.js routing system

**Components Layer (Client Components):**

- Purpose: Interactive UI components and calculator state management
- Location: `src/components/`, `src/app/[locale]/*/[calculator]-calculator.tsx`
- Contains: React components with client-side interactivity
- Depends on: Hooks/Stores, Converters (logic), UI primitives
- Used by: Pages layer

**Logic Layer (Pure Functions):**

- Purpose: All calculation logic, isolated from React
- Location: `src/lib/converters/[category]/`
- Contains: Pure TypeScript functions with typed interfaces
- Depends on: Nothing (framework-agnostic)
- Used by: Components layer via hooks/stores

**Registry Layer:**

- Purpose: Metadata for categories and converters
- Location: `src/lib/registry/`
- Contains: Category definitions, converter metadata, helper functions
- Depends on: Types, lucide-react icons
- Used by: Pages, Components, Navigation

**State Layer:**

- Purpose: Client-side state management with URL sync
- Location: `src/stores/`, `src/hooks/`
- Contains: Zustand stores and React hooks
- Depends on: Logic layer (converters)
- Used by: Calculator components

## Data Flow

**Page Load (Static):**

1. Next.js generates static HTML at build time using `generateStaticParams()`
2. `setRequestLocale(locale)` enables static rendering for next-intl
3. Server component fetches translations via `getTranslations()`
4. Layout (`ConverterLayout`) and calculator component rendered
5. Calculator component hydrates with client-side interactivity

**Calculator Interaction:**

1. User inputs value in `InputField` component
2. `setValue()` updates Zustand store or `useConverter` state
3. State change triggers `calculate()` function with debounce
4. Pure calculation function in `src/lib/converters/` executes
5. Result displayed via `OutputDisplay` or `ResultGrid`
6. URL params updated (debounced) for shareability

**State Management:**

- **Zustand Pattern (newer):** `createCalculatorStore()` factory in `src/stores/calculator-store.ts`
- **Hook Pattern (legacy):** `useConverter()` hook in `src/hooks/use-converter.ts`
- Both patterns support URL state synchronization and validation

## Key Abstractions

**ConverterMeta:**

- Purpose: Describes a calculator's metadata for registry and navigation
- Examples: `src/lib/registry/converters.ts`
- Pattern: Record keyed by converter ID (kebab-case)

```typescript
interface ConverterMeta {
  id: string; // "compound-interest"
  slug: string; // "compound-interest" (URL segment)
  name: string; // "Compound Interest Calculator"
  description: string;
  category: string; // "finance"
  subcategory?: string; // "interest"
  keywords: string[];
  icon: LucideIcon;
  featured?: boolean;
}
```

**Category:**

- Purpose: Groups converters into navigable sections
- Examples: `src/lib/registry/categories.ts`
- Pattern: Array of category objects with optional subcategories

```typescript
interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subcategories?: Subcategory[];
}
```

**Calculator Store:**

- Purpose: Generic state management for calculators
- Examples: `src/stores/calculator-store.ts`
- Pattern: Factory function creating typed Zustand stores

```typescript
const useStore = createCalculatorStore({
  name: "calculator-name",
  initialValues: { ... },
  calculate: (values) => result,
});
```

**Converter Logic:**

- Purpose: Pure calculation functions with typed I/O
- Examples: `src/lib/converters/health/bmi.ts`
- Pattern: Export `Input` interface, `Result` interface, `calculate()` function

```typescript
export interface BMIInput {
  weight: number;
  height: number;
}
export interface BMIResult {
  bmi: number;
  category: string;
}
export function calculateBMI(input: BMIInput): BMIResult | null;
```

## Entry Points

**Root Layout:**

- Location: `src/app/layout.tsx`
- Triggers: All page requests
- Responsibilities: HTML structure, global styles, font loading

**Locale Layout:**

- Location: `src/app/[locale]/layout.tsx`
- Triggers: All locale-prefixed routes
- Responsibilities: i18n provider, theme provider, header/footer, metadata

**Homepage:**

- Location: `src/app/[locale]/page.tsx`
- Triggers: `/[locale]` routes
- Responsibilities: Category grid display

**Category Pages:**

- Location: `src/app/[locale]/[category]/page.tsx`
- Triggers: `/[locale]/[category]` routes
- Responsibilities: Calculator listing for category

**Calculator Pages:**

- Location: `src/app/[locale]/[category]/[calculator]/page.tsx`
- Triggers: `/[locale]/[category]/[calculator]` routes
- Responsibilities: Metadata, layout wrapper, calculator component render

## Error Handling

**Strategy:** Return null for invalid inputs, validate before calculate

**Patterns:**

- Calculation functions return `null` instead of throwing for invalid inputs
- Store/hook validation via optional `validate` function
- Errors stored in state as `Partial<Record<keyof T, string>>`
- UI displays error text via `InputField` error prop

```typescript
// Converter pattern
export function calculateBMI(input: BMIInput): BMIResult | null {
  if (input.weight <= 0 || input.height <= 0) return null;
  // ... calculation
}

// Store pattern
const errors = validate?.(values) ?? {};
const result = Object.keys(errors).length === 0 ? calculate(values) : null;
```

## Cross-Cutting Concerns

**Logging:** No structured logging; console.log in development only

**Validation:** Per-calculator validation functions, no global validation library

**Authentication:** None (static site, no auth required)

**Internationalization:**

- next-intl for translations
- Locale-prefixed routes (`/en/`, `/fr/`, `/de/`, `/it/`)
- Swiss locale formats (CHF currency, CH date/number formats)
- Translation keys match converter IDs (kebab-case)

**Theming:**

- next-themes for dark/light mode
- CSS variables in `globals.css`
- Tailwind CSS with theme-aware classes

**URL State:**

- Calculator inputs synced to URL query params
- Enables shareable calculator links
- Debounced updates (150ms default)

---

_Architecture analysis: 2026-01-16_
