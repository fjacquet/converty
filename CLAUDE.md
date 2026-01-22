# Converty - Claude Configuration

Project context for Claude (AI assistant).

## Project Overview

Converty is a collection of **156+ calculators** built with Next.js 16, React 19, and TypeScript 5. Static site generation for GitHub Pages deployment.

## Quick Start

```bash
npm run dev          # Start at http://localhost:3000
npm run build        # Build static export
npm run check:fix    # Fix lint issues
npm run type-check   # TypeScript check
```

## Key Directories

| Path | Purpose |
|------|---------|
| `src/app/[locale]/` | Next.js pages with locale routing |
| `src/components/converter/` | Reusable calculator components |
| `src/lib/converters/` | Pure calculation functions |
| `src/lib/registry/` | Calculator metadata |
| `src/stores/` | Zustand state management |
| `src/messages/` | Translation files (en, fr, de, it) |

## Adding a Calculator

1. Create calculation logic in `src/lib/converters/[category]/[name].ts`
2. Register in `src/lib/registry/converters.ts`
3. Add translations to all 4 locale files in `src/messages/`
4. Create component in `src/app/[locale]/[category]/[name]/[name]-calculator.tsx`
5. Create page in `src/app/[locale]/[category]/[name]/page.tsx`

**Detailed guide:** [docs/CALCULATOR_GUIDE.md](docs/CALCULATOR_GUIDE.md)

## Categories

| Category | Slug | Count |
|----------|------|-------|
| Math | `math` | 38 |
| Health | `health` | 28 |
| Finance | `finance` | 24 |
| Photo | `photo` | 22 |
| Web | `web` | 10 |
| Video | `video` | 9 |
| DateTime | `datetime` | 8 |
| Network | `network` | 5 |
| Data | `data` | 3 |
| Physics | `physics` | 1 |
| Music | `music` | 1 |
| Color | `color` | 1 |

## Detailed Guides

| Guide | Content |
|-------|---------|
| [Calculator Guide](docs/CALCULATOR_GUIDE.md) | Step-by-step for adding calculators |
| [Code Style](docs/CODE_STYLE.md) | TypeScript, naming, linting |
| [I18N Guide](docs/I18N_GUIDE.md) | Internationalization patterns |
| [Architecture](.planning/codebase/ARCHITECTURE.md) | System design |

## Important Notes

1. **Static Export** - No server-side features (`output: "export"`)
2. **URL State** - Calculators sync state to URL for shareability
3. **Zustand** - All calculators use `createCalculatorStore` factory
4. **i18n** - All user-facing text uses `useTranslations()`
5. **No `any` types** - Strict TypeScript enforced

## Linting

```bash
npm run check:fix  # Fix issues
npm run format     # Format code
```

Common issues: unused imports, missing return types, `let` instead of `const`
