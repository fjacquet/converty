# Technology Stack

**Analysis Date:** 2026-01-16

## Languages

**Primary:**

- TypeScript 5.9.3 - All application code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**

- CSS - Global styles via Tailwind (`src/app/globals.css`)
- JSON - Translation files (`src/messages/*.json`)

## Runtime

**Environment:**

- Node.js 20+ (specified in CI: `.github/workflows/static.yml`)
- Node.js 22 (specified in Dockerfile)

**Package Manager:**

- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**

- Next.js 16.1.1 - React framework with App Router
  - Static export mode (`output: "export"` in `next.config.ts`)
  - No server-side features, fully client-rendered
- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering

**Internationalization:**

- next-intl 4.7.0 - Localized routing and translations
  - Config: `src/i18n/config.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`
  - 4 locales: en, fr, de, it (Swiss variants)

**State Management:**

- Zustand 5.0.10 - Calculator state stores
  - Factory: `src/stores/calculator-store.ts`
  - URL sync middleware for shareable links

**UI Components:**

- Radix UI primitives:
  - `@radix-ui/react-dropdown-menu` 2.1.16
  - `@radix-ui/react-label` 2.1.8
  - `@radix-ui/react-radio-group` 1.3.8
  - `@radix-ui/react-select` 2.2.6
  - `@radix-ui/react-slot` 1.2.4
  - `@radix-ui/react-switch` 1.2.6
  - `@radix-ui/react-tabs` 1.1.13
  - `@radix-ui/react-tooltip` 1.2.8

**Styling:**

- Tailwind CSS 4.1.18 - Utility-first CSS
  - Config: `tailwind.config.ts`
  - PostCSS plugin: `@tailwindcss/postcss` 4.1.18
- tailwind-merge 3.4.0 - Class merging utility
- tailwindcss-animate 1.0.7 - Animation utilities
- class-variance-authority 0.7.1 - Component variants
- clsx 2.1.1 - Conditional class names

**Visualization:**

- Recharts 3.6.0 - Data visualization charts
  - Used in: `src/app/[locale]/finance/mortgage/mortgage-calculator.tsx`
  - Components: AreaChart, PieChart, CartesianGrid, Legend, Tooltip

**Icons:**

- Lucide React 0.562.0 - Icon library

**PDF Export:**

- jsPDF 4.0.0 - PDF generation
  - Utility: `src/lib/utils/pdf-export.ts`

**Theming:**

- next-themes 0.4.6 - Dark/light mode support

**Build/Dev:**

- @swc/helpers 0.5.18 - SWC compilation helpers
- autoprefixer 10.4.23 - CSS vendor prefixing

## Linting & Formatting

**Primary Linter:**

- Biome 2.3.11 - Fast linter and formatter
  - Config: `biome.json`
  - Rules: recommended with customizations
  - Format: 2 spaces, double quotes, semicolons, ES5 trailing commas

**Secondary Linter:**

- ESLint 9.39.2 - JavaScript/TypeScript linting
  - Config: `eslint.config.mjs` (flat config)
  - Plugins: react, react-hooks, @next/next
- typescript-eslint 8.53.0 - TypeScript rules

## TypeScript Configuration

**Config File:** `tsconfig.json`

**Key Settings:**

- Target: ES2017
- Module: ESNext with bundler resolution
- Strict mode: enabled
- JSX: react-jsx
- Path alias: `@/*` -> `./src/*`
- Incremental compilation: enabled

## Key Dependencies

**Critical:**

- `next` 16.1.1 - Application framework
- `react` 19.2.3 - UI rendering
- `next-intl` 4.7.0 - i18n (required for all routes)
- `zustand` 5.0.10 - State management

**Infrastructure:**

- `jspdf` 4.0.0 - PDF export functionality
- `recharts` 3.6.0 - Financial calculator charts

**UI:**

- `@radix-ui/*` - Accessible component primitives
- `lucide-react` - Icons throughout the app

## Configuration

**Environment:**

- No environment variables required for core functionality
- All calculations run client-side
- `NODE_ENV` controls basePath in `next.config.ts`

**Build:**

- `next.config.ts` - Next.js configuration
  - Static export enabled
  - GitHub Pages basePath: `/converty` (production only)
  - Images: unoptimized (static export requirement)
- `tsconfig.json` - TypeScript compiler options
- `biome.json` - Linting and formatting rules
- `tailwind.config.ts` - Tailwind content paths
- `postcss.config.mjs` - PostCSS with Tailwind plugin

## Platform Requirements

**Development:**

- Node.js 20+
- npm (included with Node.js)
- Modern browser for testing

**Production (GitHub Pages):**

- Static HTML/CSS/JS files
- No server required
- Deployment: GitHub Actions -> GitHub Pages

**Production (Docker):**

- nginx:alpine for serving static files
- Multi-stage build:
  1. `node:22-alpine` for dependencies
  2. `node:22-alpine` for build
  3. `nginx:alpine` for production
- Config: `Dockerfile`, `nginx.conf`

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build static export to ./out
npm run start        # Start production server (not used for static)
npm run lint         # Run ESLint
npm run lint:biome   # Run Biome linter
npm run format       # Format with Biome
npm run check        # Check with Biome
npm run check:fix    # Fix with Biome
npm run type-check   # TypeScript type checking
npm run quality      # Run all quality checks
```

---

_Stack analysis: 2026-01-16_
