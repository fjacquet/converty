# Technology Stack

**Analysis Date:** 2026-01-17

## Languages

**Primary:**

- TypeScript 5.9.3 - All source code (`src/`)
  - Strict mode enabled
  - Target: ES2017
  - Module resolution: bundler

**Secondary:**

- JavaScript (ESM) - Configuration files only (eslint.config.mjs, postcss.config.mjs)

## Runtime

**Environment:**

- Node.js 20+ (specified in GitHub Actions CI)

**Package Manager:**

- npm (latest)
- Lockfile: Not committed to repository (npm ci used in CI/CD)

## Frameworks

**Core:**

- Next.js 16.1.1 - App Router with static export (`output: "export"`)

  - Static site generation (SSG) only
  - Locale routing via `[locale]` segments
  - next-intl plugin for i18n
  - GitHub Pages deployment target (base path: `/converty`)

- React 19.2.3 - UI framework
  - react-dom 19.2.3
  - JSX transform: `react-jsx`

**Styling:**

- Tailwind CSS 4.1.18 - Utility-first CSS framework
  - PostCSS plugin: `@tailwindcss/postcss` 4.1.18
  - autoprefixer 10.4.23
  - CSS variables for theming

**UI Components:**

- Radix UI - Accessible UI primitives
  - @radix-ui/react-label 2.1.8
  - @radix-ui/react-popover 1.1.15
  - @radix-ui/react-radio-group 1.3.8
  - @radix-ui/react-select 2.2.6
  - @radix-ui/react-slot 1.2.4
  - @radix-ui/react-switch 1.2.6
  - @radix-ui/react-tabs 1.1.13

**State Management:**

- Zustand 5.0.10 - Lightweight state management
  - Custom calculator store pattern in `src/stores/calculator-store.ts`
  - Built-in URL sync middleware for shareable links

**Internationalization:**

- next-intl 4.7.0 - i18n for Next.js
  - 4 locales: en, fr, de, it (Swiss variants)
  - Server and client component support
  - Locale-based formatting (CHF currency)

**Theming:**

- next-themes 0.4.6 - Dark/light mode toggle

**Visualization:**

- Recharts 3.6.0 - React chart library for data visualization

**Document Generation:**

- jsPDF 4.0.0 - Client-side PDF generation

**Icons:**

- Lucide React 0.562.0 - Icon library

**Build/Dev:**

- @swc/helpers 0.5.18 - SWC runtime helpers
- PostCSS 8.5.6 - CSS processing
- Autoprefixer 10.4.23 - CSS vendor prefixing

**Testing:**

- None - No test framework configured

## Key Dependencies

**Critical:**

- next 16.1.1 - Framework core
- react 19.2.3 - UI library
- zustand 5.0.10 - State management (replacing legacy useConverter hook)
- next-intl 4.7.0 - Internationalization

**Infrastructure:**

- class-variance-authority 0.7.1 - CVA for variant-based components
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.4.0 - Tailwind class merging
- cmdk 1.1.1 - Command menu component

## Configuration

**Environment:**

- No environment variables in use
- Pure client-side application
- Static export with no runtime configuration

**Build:**

- `next.config.ts` - Next.js configuration
  - Static export in production
  - basePath: `/converty` (GitHub Pages)
  - unoptimized images
  - next-intl plugin

**TypeScript:**

- `tsconfig.json` - TypeScript configuration
  - Strict mode: enabled
  - Path aliases: `@/*` → `./src/*`
  - incremental compilation

**Linting:**

- `biome.json` - Biome configuration

  - Formatter: 2-space indent, 100 line width
  - Linter: security rules enabled
  - Organizes imports automatically

- `eslint.config.mjs` - ESLint 9 flat config
  - TypeScript ESLint
  - React plugin
  - React Hooks plugin
  - Next.js plugin

**Styling:**

- `tailwind.config.ts` - Tailwind configuration
  - Content: `src/**/*.{js,ts,jsx,tsx,mdx}`
- `postcss.config.mjs` - PostCSS configuration
  - Plugin: `@tailwindcss/postcss`

## Platform Requirements

**Development:**

- Node.js 20 or higher
- npm
- Operating System: macOS, Linux, Windows (via WSL recommended)

**Production:**

- Static hosting (GitHub Pages)
- No server-side runtime required
- Can be containerized with nginx (see `Dockerfile`)

**Container:**

- Docker multi-stage build
  - Base: node:22-alpine (deps and builder stages)
  - Runtime: nginx:alpine
  - Port: 8080 (non-root nginx)
  - Healthcheck included

---

_Stack analysis: 2026-01-17_
