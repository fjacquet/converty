# Codebase Structure

**Analysis Date:** 2026-01-16

## Directory Layout

```
converty/
├── src/                    # Source code
│   ├── app/               # Next.js App Router pages
│   │   ├── [locale]/      # Locale-prefixed routes
│   │   │   ├── layout.tsx # Locale layout with providers
│   │   │   ├── page.tsx   # Homepage
│   │   │   ├── all/       # All calculators listing
│   │   │   ├── color/     # Color category
│   │   │   ├── data/      # Data category
│   │   │   ├── datetime/  # Date & Time category
│   │   │   ├── finance/   # Finance category (24 calculators)
│   │   │   ├── health/    # Health category (28 calculators)
│   │   │   ├── math/      # Math category (38 calculators)
│   │   │   ├── music/     # Music category
│   │   │   ├── other/     # Other/misc category
│   │   │   ├── photo/     # Photo category (22 calculators)
│   │   │   ├── physics/   # Physics category
│   │   │   ├── video/     # Video category (9 calculators)
│   │   │   └── web/       # Web category (10 calculators)
│   │   ├── layout.tsx     # Root HTML layout
│   │   ├── page.tsx       # Root redirect
│   │   └── globals.css    # Global styles + CSS variables
│   ├── components/        # React components
│   │   ├── converter/     # Calculator-specific components
│   │   ├── layout/        # Header, Footer, Theme
│   │   └── ui/            # Base UI primitives
│   ├── lib/               # Core logic and utilities
│   │   ├── converters/    # Pure calculation functions
│   │   ├── registry/      # Category/converter metadata
│   │   └── utils/         # Shared utilities (cn, format, pdf)
│   ├── hooks/             # React hooks (useConverter, useDebounce)
│   ├── stores/            # Zustand state stores
│   ├── types/             # TypeScript type definitions
│   ├── i18n/              # Internationalization config
│   └── messages/          # Translation JSON files
├── public/                # Static assets
├── docs/                  # Documentation
├── out/                   # Build output (static export)
├── .planning/             # GSD planning documents
├── next.config.ts         # Next.js configuration
├── biome.json             # Biome linter/formatter config
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config
└── package.json           # Dependencies and scripts
```

## Directory Purposes

**`src/app/[locale]/`:**

- Purpose: All user-facing pages with locale routing
- Contains: Server components (page.tsx), client components (\*-calculator.tsx)
- Key files: `layout.tsx` (providers), `page.tsx` (homepage), category directories

**`src/app/[locale]/[category]/[calculator]/`:**

- Purpose: Individual calculator pages
- Contains: `page.tsx` (metadata + layout), `*-calculator.tsx` (interactive component)
- Pattern: One directory per calculator, matching registry slug

**`src/components/converter/`:**

- Purpose: Reusable components for calculator UIs
- Contains: InputField, OutputDisplay, ResultGrid, ConverterLayout, Breadcrumbs
- Key files: `input-field.tsx`, `converter-layout.tsx`, `result-grid.tsx`

**`src/components/layout/`:**

- Purpose: Page-level layout components
- Contains: Header, Footer, ThemeProvider, LanguageSwitcher
- Key files: `header.tsx`, `footer.tsx`, `theme-provider.tsx`

**`src/components/ui/`:**

- Purpose: Base UI primitives (shadcn/ui style)
- Contains: Button, Card, Input, Select, Label, Switch, Tabs, Badge
- Key files: `button.tsx`, `card.tsx`, `select.tsx`, `input.tsx`

**`src/lib/converters/`:**

- Purpose: Pure calculation functions by category
- Contains: TypeScript files with Input/Result interfaces and calculate functions
- Key files: `health/bmi.ts`, `finance/mortgage.ts`, `math/quadratic.ts`

**`src/lib/registry/`:**

- Purpose: Central metadata for categories and calculators
- Contains: Category definitions, converter metadata, helper functions
- Key files: `categories.ts`, `converters.ts`

**`src/lib/utils/`:**

- Purpose: Shared utility functions
- Contains: Class name merger (cn), formatters, PDF export
- Key files: `cn.ts`, `format.ts`, `pdf-export.ts`

**`src/hooks/`:**

- Purpose: Custom React hooks
- Contains: useConverter, useDebounce, useUrlState, useCopyToClipboard
- Key files: `use-converter.ts`, `use-url-state.ts`

**`src/stores/`:**

- Purpose: Zustand state management
- Contains: Calculator store factory
- Key files: `calculator-store.ts`

**`src/i18n/`:**

- Purpose: Internationalization configuration
- Contains: Locale config, navigation helpers, request setup
- Key files: `config.ts`, `navigation.ts`, `request.ts`

**`src/messages/`:**

- Purpose: Translation files for all 4 locales
- Contains: JSON translation files
- Key files: `en.json`, `fr.json`, `de.json`, `it.json`

## Key File Locations

**Entry Points:**

- `src/app/layout.tsx`: Root HTML structure
- `src/app/[locale]/layout.tsx`: Locale layout with providers
- `src/app/[locale]/page.tsx`: Homepage

**Configuration:**

- `next.config.ts`: Next.js config (static export, basePath, i18n plugin)
- `biome.json`: Linter/formatter rules
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Tailwind CSS settings

**Core Logic:**

- `src/lib/registry/converters.ts`: All calculator metadata (53KB, ~1400 lines)
- `src/lib/registry/categories.ts`: Category definitions
- `src/stores/calculator-store.ts`: Zustand store factory

**Testing:**

- No test files detected; no test configuration

## Naming Conventions

**Files:**

- kebab-case for all files: `bmi-calculator.tsx`, `compound-interest.ts`
- Calculator components: `[name]-calculator.tsx`
- Page files: `page.tsx` (Next.js convention)

**Directories:**

- kebab-case matching slugs: `compound-interest/`, `body-fat/`
- Category directories match category.slug: `finance/`, `health/`

**Components:**

- PascalCase: `BMICalculator`, `ConverterLayout`, `InputField`

**Functions:**

- camelCase: `calculateBMI`, `getBMICategoryInfo`, `createCalculatorStore`

**Types/Interfaces:**

- PascalCase: `BMIInput`, `BMIResult`, `ConverterMeta`

**Translation Keys:**

- kebab-case matching converter IDs: `"compound-interest"`, `"body-fat"`

## Where to Add New Code

**New Calculator:**

1. Calculation logic: `src/lib/converters/[category]/[name].ts`
2. Registry entry: `src/lib/registry/converters.ts`
3. Translations: `src/messages/[en|fr|de|it].json` under `converters.[name]`
4. Page: `src/app/[locale]/[category]/[name]/page.tsx`
5. Component: `src/app/[locale]/[category]/[name]/[name]-calculator.tsx`

**New Category:**

1. Category definition: `src/lib/registry/categories.ts`
2. Category page: `src/app/[locale]/[category]/page.tsx`
3. Category translations: `src/messages/*.json` under `categories.[name]`
4. Logic directory: `src/lib/converters/[category]/`

**New UI Component:**

- Primitive: `src/components/ui/[name].tsx`
- Calculator-specific: `src/components/converter/[name].tsx`
- Export from barrel: Update `src/components/[dir]/index.ts`

**New Utility:**

- `src/lib/utils/[name].ts`
- Export from barrel: Update `src/lib/utils/index.ts`

**New Hook:**

- `src/hooks/use-[name].ts`
- Export from barrel: Update `src/hooks/index.ts`

**New Store:**

- Use `createCalculatorStore()` factory in component file
- Or add to `src/stores/` for shared stores

## Special Directories

**`out/`:**

- Purpose: Static site export output
- Generated: Yes (by `npm run build`)
- Committed: No (in .gitignore)

**`.next/`:**

- Purpose: Next.js build cache
- Generated: Yes
- Committed: No (in .gitignore)

**`node_modules/`:**

- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in .gitignore)

**`public/`:**

- Purpose: Static assets served at root
- Generated: No
- Committed: Yes

**`.planning/`:**

- Purpose: GSD planning and analysis documents
- Generated: By GSD commands
- Committed: Typically no

**`docs/`:**

- Purpose: Project documentation
- Contains: ARCHITECTURE.md, CALCULATORS.md
- Committed: Yes

---

_Structure analysis: 2026-01-16_
