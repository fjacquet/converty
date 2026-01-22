# Codebase Structure

**Analysis Date:** 2026-01-17

## Directory Layout

```text
converty/
├── .github/                    # GitHub Actions workflows
├── .planning/                  # GSD planning artifacts
│   └── codebase/              # Codebase documentation
├── docs/                       # Project documentation
│   └── ARCHITECTURE.md        # Detailed architecture doc
├── public/                     # Static assets
├── scripts/                    # Build/deployment scripts
├── src/                        # Source code
│   ├── app/                   # Next.js App Router pages
│   │   ├── [locale]/          # Locale-specific routes
│   │   ├── layout.tsx         # Root HTML layout
│   │   └── globals.css        # Global styles + CSS variables
│   ├── components/            # React components
│   │   ├── converter/         # Calculator-specific components
│   │   ├── layout/            # Header, Footer, ThemeProvider
│   │   └── ui/                # Base UI primitives (shadcn style)
│   ├── data/                  # Static data files
│   ├── hooks/                 # React hooks (legacy pattern)
│   ├── i18n/                  # i18n configuration
│   │   ├── config.ts          # Locale definitions
│   │   ├── navigation.ts      # Localized routing helpers
│   │   └── request.ts         # next-intl server setup
│   ├── lib/                   # Core utilities and business logic
│   │   ├── converters/        # Pure calculation functions
│   │   ├── registry/          # Category and converter metadata
│   │   └── utils/             # Shared utilities (cn, etc.)
│   ├── messages/              # Translation files
│   │   ├── en.json            # English (source of truth)
│   │   ├── fr.json            # French
│   │   ├── de.json            # German
│   │   └── it.json            # Italian
│   ├── stores/                # Zustand state management
│   └── types/                 # Shared TypeScript types
├── biome.json                 # Biome linter/formatter config
├── CLAUDE.md                  # AI assistant project guide
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Directory Purposes

**src/app/[locale]/**

- Purpose: Next.js pages with dynamic locale routing
- Contains: Server component pages, client component calculators, category directories
- Key files: `layout.tsx` (locale-specific layout), `page.tsx` (homepage)
- Pattern: `[locale]/[category]/[calculator]/page.tsx` + `[calculator]-calculator.tsx`

**src/app/[locale]/[category]/**

- Purpose: Category-specific calculators (11 categories: color, data, datetime, finance, health, math, music, photo, physics, video, web)
- Contains: Calculator directories with page.tsx and component files
- Example: `src/app/[locale]/finance/mortgage/` contains `page.tsx` and `mortgage-calculator.tsx`

**src/components/converter/**

- Purpose: Reusable calculator UI components
- Contains: InputField, OutputDisplay, ResultGrid, ConverterLayout, PdfExportButton, Breadcrumbs, SubcategoryNav
- Key files: `input-field.tsx`, `result-grid.tsx`, `converter-layout.tsx`, `index.ts` (barrel export)

**src/components/layout/**

- Purpose: Site-wide layout components
- Contains: Header, Footer, ThemeProvider, ThemeToggle, LocaleHtmlLang
- Mounted in: `src/app/[locale]/layout.tsx`

**src/components/ui/**

- Purpose: Base UI primitives (shadcn/ui style with Radix UI)
- Contains: Button, Card, Input, Label, Select, Switch, Tabs, Badge, Command, Popover, RadioGroup, Textarea
- Pattern: Single component per file, direct exports (no barrel file except index.ts)

**src/lib/converters/**

- Purpose: Pure calculation functions organized by category
- Contains: 11 category subdirectories matching app structure
- Pattern: Each file exports interfaces (Input, Result) and pure function
- Example: `src/lib/converters/health/bmi.ts` exports `BmiInput`, `BmiResult`, `calculateBmi`

**src/lib/registry/**

- Purpose: Centralized metadata for categories and converters
- Contains: `categories.ts`, `converters.ts`, category-specific registries (e.g., `health-converters.ts`)
- Key files: `categories.ts` (11 categories), `converters.ts` (merges all category registries)

**src/lib/utils/**

- Purpose: Shared utility functions
- Contains: `cn()` for class name merging (Tailwind utility)

**src/messages/**

- Purpose: i18n translation files (JSON)
- Contains: en.json, fr.json, de.json, it.json (Swiss locales)
- Structure: Nested JSON with common, categories, converters, calculator namespaces
- Important: Keys must use kebab-case to match converter IDs

**src/stores/**

- Purpose: Zustand state management
- Contains: `calculator-store.ts` (factory function), `index.ts` (exports)
- Pattern: `createCalculatorStore<InputType, ResultType>()` with URL sync middleware

**src/hooks/**

- Purpose: React hooks (legacy pattern being phased out)
- Contains: `use-converter.ts`, `use-url-state.ts`, `use-debounce.ts`
- Note: New calculators prefer Zustand stores over useConverter hook

**src/i18n/**

- Purpose: Internationalization configuration
- Contains: `config.ts` (locale definitions), `request.ts` (next-intl setup), `navigation.ts` (localized routing)
- Locales: en, fr, de, it (Swiss variants with CHF currency)

**src/types/**

- Purpose: Shared TypeScript type definitions
- Contains: `converter.ts` (ConverterMeta, CalculationStep), `index.ts`

**docs/**

- Purpose: Project documentation
- Contains: `ARCHITECTURE.md` (detailed system design)

**public/**

- Purpose: Static assets served at root
- Contains: Images, favicons, robots.txt, sitemap.xml

## Key File Locations

**Entry Points:**

- `src/app/layout.tsx`: Root HTML layout
- `src/app/[locale]/layout.tsx`: Locale-specific layout with providers
- `src/app/[locale]/page.tsx`: Homepage
- `src/i18n/request.ts`: i18n request handler

**Configuration:**

- `next.config.ts`: Next.js config (static export, basePath for GitHub Pages)
- `biome.json`: Linter and formatter
- `tailwind.config.ts`: Tailwind CSS
- `tsconfig.json`: TypeScript compiler options
- `package.json`: Dependencies and scripts

**Core Logic:**

- `src/lib/converters/`: All calculation functions (538 total TypeScript files in project)
- `src/lib/registry/categories.ts`: Category definitions
- `src/lib/registry/converters.ts`: Converter metadata registry

**Testing:**

- No test files detected (testing not yet implemented)

## Naming Conventions

**Files:**

- kebab-case for all files: `mortgage-calculator.tsx`, `use-converter.ts`
- Component files: `[name]-[type].tsx` (e.g., `age-calculator.tsx`)
- Page files: `page.tsx` (Next.js convention)
- Layout files: `layout.tsx` (Next.js convention)

**Directories:**

- kebab-case: `datetime`, `finance`, `photo`
- Dynamic segments: `[locale]`, `[category]` (Next.js convention)
- Category slugs match directory names: finance category → `src/app/[locale]/finance/`

**Components:**

- PascalCase: `AgeCalculator`, `InputField`, `ConverterLayout`

**Functions:**

- camelCase: `calculateAge`, `getConverterById`, `createCalculatorStore`

**Types/Interfaces:**

- PascalCase: `AgeInput`, `BmiResult`, `ConverterMeta`, `Category`

**Constants:**

- SCREAMING_SNAKE_CASE: `ZODIAC_SIGNS`, `CHINESE_ZODIAC` (in calculation files)

## Where to Add New Code

**New Calculator:**

- Primary code: `src/app/[locale]/[category]/[slug]/[slug]-calculator.tsx` (client component)
- Page wrapper: `src/app/[locale]/[category]/[slug]/page.tsx` (server component)
- Calculation logic: `src/lib/converters/[category]/[slug].ts` (pure function)
- Registry entry: Add to `src/lib/registry/[category]-converters.ts`
- Translations: Add to all 4 files in `src/messages/` with key matching slug

**New Category:**

- Category definition: Add to `src/lib/registry/categories.ts`
- Category page: `src/app/[locale]/[category]/page.tsx`
- Category registry: Create `src/lib/registry/[category]-converters.ts`
- Converters directory: Create `src/lib/converters/[category]/`
- Import in registry: Add to `src/lib/registry/converters.ts` imports and merge
- Translations: Add to `categories` section in all 4 `src/messages/*.json`

**New Component/Module:**

- UI component: `src/components/ui/[name].tsx`
- Converter component: `src/components/converter/[name].tsx`
- Layout component: `src/components/layout/[name].tsx`
- Utility: `src/lib/utils/[name].ts`
- Hook: `src/hooks/use-[name].ts` (legacy pattern, prefer Zustand)
- Store: `src/stores/[name]-store.ts` (preferred pattern)

**Utilities:**

- Shared helpers: `src/lib/utils/`
- React hooks: `src/hooks/` (legacy)
- Zustand stores: `src/stores/` (preferred)

**Translations:**

- Add to all 4 locale files: `src/messages/en.json`, `fr.json`, `de.json`, `it.json`
- Use kebab-case keys matching converter IDs
- Structure: `converters.[id].name`, `converters.[id].description`, `converters.[id].metaDescription`

## Special Directories

**out/**

- Purpose: Next.js static export output
- Generated: Yes (via `npm run build`)
- Committed: No (in .gitignore)
- Contents: Production-ready static HTML/CSS/JS

**.next/**

- Purpose: Next.js build cache and artifacts
- Generated: Yes (during dev and build)
- Committed: No (in .gitignore)

**node_modules/**

- Purpose: npm dependencies
- Generated: Yes (via `npm install`)
- Committed: No (in .gitignore)

**.planning/codebase/**

- Purpose: GSD codebase analysis documents
- Generated: By GSD commands
- Committed: Yes
- Contents: Architecture and planning documentation

**.github/workflows/**

- Purpose: CI/CD automation
- Generated: No (manually maintained)
- Committed: Yes
- Contents: GitHub Actions workflow definitions

---

_Structure analysis: 2026-01-17_
