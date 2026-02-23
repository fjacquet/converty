# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Converty - Configuration

## Project Overview

Converty is a collection of **167+ calculators** built with Next.js 16, React 19, and TypeScript 5. Static site generation for GitHub Pages deployment.

## Quick Start

```bash
npm run dev          # Start at http://localhost:3000
npm run build        # Build static export (runs prebuild → next build → service worker)
npm run check:fix    # Fix lint issues
npm run type-check   # TypeScript check
```

## Build Process

The build has multiple stages:

```bash
npm run build
  ↓
  1. prebuild (fetch-crypto-prices, fetch-mining-data, generate-search-index)
  2. next build (static site generation)
  3. generate-sw.js (Workbox service worker for PWA)
```

**Build Constraints:**

- Static export only (`output: "export"`)
- Base path `/converty` for GitHub Pages
- Images unoptimized (required for static export)
- Build-time data: crypto prices, mining data, search indexes (4 locales)

**Bundle Analysis:**

```bash
ANALYZE=true npm run build
```

## Key Directories

| Path | Purpose |
|------|---------|
| `src/app/[locale]/` | Next.js pages with locale routing |
| `src/components/converter/` | Reusable calculator components |
| `src/lib/converters/` | Pure calculation functions (framework-agnostic) |
| `src/lib/registry/` | Calculator metadata and categories |
| `src/stores/` | Zustand state management with URL sync |
| `src/messages/` | Translation files (en, fr, de, it) |
| `scripts/` | Build scripts (data fetching, search indexing, packaging) |

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
| Finance | `finance` | 28 |
| Photo | `photo` | 22 |
| Web | `web` | 10 |
| Video | `video` | 9 |
| DateTime | `datetime` | 8 |
| Network | `network` | 5 |
| Crypto | `crypto` | 4 |
| Cooking | `cooking` | 4 |
| Automotive | `automotive` | 4 |
| Data | `data` | 3 |
| Physics | `physics` | 1 |
| Music | `music` | 1 |
| Color | `color` | 1 |

## Documentation

| Guide | Content |
|-------|---------|
| [User Guide](docs/USER_GUIDE.md) | **End-user documentation** - How to use calculators, share links, PWA |
| [Calculator Guide](docs/CALCULATOR_GUIDE.md) | Step-by-step for adding calculators |
| [Code Style](docs/CODE_STYLE.md) | TypeScript, naming, linting, precision |
| [I18N Guide](docs/I18N_GUIDE.md) | Internationalization patterns |
| [Engineering Patterns](docs/ENGINEERING_PATTERNS.md) | Material databases, structural formulas, NIST precision |
| [Chemistry Patterns](docs/CHEMISTRY_PATTERNS.md) | Formula parsing, periodic table, IUPAC standards |
| [Reference Data Guide](docs/REFERENCE_DATA_GUIDE.md) | Data sourcing, versioning, quality checks |
| [Architecture](.planning/codebase/ARCHITECTURE.md) | System design and data flow |
| [grepai Reference](docs/GREPAI.md) | **Semantic code search tool** |
| [Serena Reference](docs/SERENA.md) | **Semantic code editing toolkit** |

## Important Constraints

1. **Static Export** - No SSR, API routes, server actions, or middleware
2. **URL State** - All calculators sync state to URL for shareability
3. **Zustand Pattern** - Use `createCalculatorStore` factory for all calculators
4. **i18n** - All user-facing text must use `useTranslations()`
5. **Strict TypeScript** - No `any` types allowed

## Architecture: State Management

All calculators use Zustand with URL sync middleware:

```typescript
const useStore = createCalculatorStore<Input, Result>({
  name: "calculator-name",
  initialValues: { /* ... */ },
  calculate: (values) => calculateFunction(values),
  validate: (values) => ({ /* errors */ }),
  syncUrl: true,  // Default: sync state to URL
  debounceMs: 150 // URL update debounce
});
```

**Critical Details:**

- Each store gets isolated debounce timer (closure-based)
- URL params parsed on initial load
- State changes update URL via `history.replaceState` (not `pushState`)
- Only `values` synced to URL (not `result` or `errors`)

## Linting & Formatting

```bash
npm run check:fix  # Auto-fix Biome issues
npm run format     # Format code
```

Common issues: unused imports, missing return types, `let` instead of `const`

## Git Hooks

**Husky + lint-staged:**

- Pre-commit hook runs `biome check --write` on staged files
- Auto-fixes formatting and linting issues
- Commits fail if unfixable errors exist

## CI/CD (GitHub Actions)

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `static.yml` | Push to `main` | Build and deploy to GitHub Pages |
| `security.yml` | Push, PR, schedule | Security audits (npm audit, CodeQL) |
| `release.yml` | Tag (`v*`) | Create release with offline package ZIP |

## Testing

**⚠️ No test framework currently configured.**

Validation via TypeScript type checking and Biome linting only.

## Tool Selection (Quick Reference)

| Task | Tool | Why |
|------|------|-----|
| Explore unfamiliar code | **grepai** | Semantic search |
| Find specific symbol | **Serena** `find_symbol` | Precise lookup |
| Find all symbol uses | **Serena** `find_referencing_symbols` | Impact analysis |
| Rename symbol everywhere | **Serena** `rename_symbol` | LSP-aware |
| Replace function body | **Serena** `replace_symbol_body` | Symbol-level |
| Fix typo (1-2 lines) | **Edit** | Simple text |
| Find files by pattern | **Glob** | File paths |
| Find exact text | **Grep** | Exact match |

**Full guides:** [docs/GREPAI.md](docs/GREPAI.md) | [docs/SERENA.md](docs/SERENA.md)

## Project Skills

Auto-discovered from `.claude/skills/`. Invoke with `/skill-name`.

| Skill | Purpose |
|-------|---------|
| `/new-calculator` | Scaffold all files for a new calculator (3 created + 5 modified) |
| `/validate-calculator` | Check a calculator has all required pieces wired correctly |
| `/add-translations` | Add translation keys across all 4 locale files |
| `/check-i18n` | Audit i18n completeness, find missing/orphaned keys |

## Common Workflows

**Adding a Calculator (use `/new-calculator` skill):**

1. `/new-calculator` - scaffolds converter, component, page, registry, translations
2. Implement calculation logic in the converter file
3. Customize component UI for the specific calculator
4. Run `/validate-calculator {name}` to verify completeness
5. Run `/check-i18n` to ensure translations are complete

**Refactoring a Function:**

1. Find it: `grepai_search("percentage calculation")`
2. Get structure: `get_symbols_overview(relative_path="...")`
3. Check impact: `find_referencing_symbols(name_path="...")`
4. Modify: `replace_symbol_body(...)`
