# Converty - Claude Configuration

This file provides Claude (AI assistant) with project context and conventions for the Converty calculator project.

## Project Overview

Converty is a comprehensive collection of 200+ calculators and converters built with Next.js 16, React 19, and TypeScript 5. The project uses static site generation (SSG) for deployment to GitHub Pages.

**Documentation**: See [.planning/codebase/ARCHITECTURE.md](.planning/codebase/ARCHITECTURE.md) for detailed system design.

## Quick Start Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Build & Test
npm run build        # Build static export
npm run lint         # Run Biome linter
npm run lint:fix     # Fix lint issues

# Type checking
npx tsc --noEmit     # Check TypeScript types
```

## Key Files & Directories

| Path | Purpose |
|------|---------|
| `src/app/[locale]/` | Next.js pages with locale routing |
| `src/components/converter/` | Reusable calculator components |
| `src/lib/converters/` | Calculation logic (pure functions) |
| `src/lib/registry/` | Category & calculator metadata |
| `src/stores/` | Zustand state management |
| `src/hooks/` | Shared React hooks |
| `src/i18n/` | Internationalization configuration |
| `src/messages/` | Translation files (en, fr, de, it) |
| `.planning/codebase/ARCHITECTURE.md` | System architecture documentation |

## Adding a New Calculator

1. **Create calculation logic** in `src/lib/converters/[category]/[name].ts`
   - Export input/output interfaces
   - Export pure calculation function
   - No React dependencies

2. **Register in** `src/lib/registry/converters.ts`
   - Add metadata: id (kebab-case), slug, category, subcategory (optional), keywords, icon
   - Note: `name` and `description` come from translations, not the registry

3. **Add translations** to all 4 locale files in `src/messages/`
   - Add to `converters` section with kebab-case key matching registry id
   - Include: `name`, `description`, `metaDescription`
   - Add any calculator-specific labels to `calculator` section

4. **Create calculator component** in `src/app/[locale]/[category]/[name]/[name]-calculator.tsx`
   - Use Zustand store pattern (see ARCHITECTURE.md)
   - Use `useTranslations()` for labels
   - Use `useFormatter()` for numbers/currency
   - Compose with InputField, OutputDisplay, ResultGrid

5. **Create page** in `src/app/[locale]/[category]/[name]/page.tsx`
   - Export `generateStaticParams()` for all locales
   - Use `getTranslations()` for metadata
   - Call `setRequestLocale(locale)` in page component
   - Wrap in ConverterLayout

## Code Conventions

### TypeScript

- Strict mode enabled
- Use interfaces for object shapes
- Export types alongside implementations

### State Management

- **Use Zustand** for all calculator state via `createCalculatorStore` factory
- URL sync middleware for shareable links (automatic state persistence)
- See `.planning/codebase/ARCHITECTURE.md` for state management patterns

### Components

- Use existing UI components from `src/components/ui/`
- Use converter components from `src/components/converter/`
- Follow established patterns before creating new components

### Styling

- Tailwind CSS with CSS variables for theming
- Use `cn()` utility for conditional classes
- Mobile-first responsive design

### Naming

- Files: kebab-case (`age-calculator.tsx`)
- Components: PascalCase (`AgeCalculator`)
- Functions: camelCase (`calculateAge`)
- Types/Interfaces: PascalCase (`AgeResult`)

## Categories

Current categories (156 calculators registered, 100% i18n coverage):

| Category | Slug | Status | Count |
|----------|------|--------|-------|
| Date & Time | `datetime` | Complete | 8 exist |
| Finance | `finance` | Complete | 24 exist |
| Health | `health` | Complete | 28 exist |
| Math | `math` | Complete | 38 exist |
| Network | `network` | Complete | 5 exist |
| Photo | `photo` | Complete | 22 exist |
| Video | `video` | Complete | 9 exist |
| Web | `web` | Complete | 10 exist |
| Data | `data` | Complete | 3 exist |
| Physics | `physics` | Partial | 1 exists |
| Music | `music` | Partial | 1 exists |
| Color | `color` | Partial | 1 exists |

## Internationalization (i18n)

The project supports 4 Swiss languages: **English (en)**, **French (fr)**, **German (de)**, **Italian (it)**.

### Key Files

| Path | Purpose |
|------|---------|
| `src/i18n/config.ts` | Locale definitions and formats |
| `src/i18n/request.ts` | Server-side i18n setup |
| `src/i18n/navigation.ts` | Localized Link, redirect, usePathname |
| `src/messages/en.json` | English translations (source of truth) |
| `src/messages/fr.json` | French translations |
| `src/messages/de.json` | German translations |
| `src/messages/it.json` | Italian translations |

### URL Structure

All pages are prefixed with locale: `/en/finance/mortgage`, `/fr/finance/mortgage`, etc.

### Adding Translations

1. Add strings to `src/messages/en.json` first (use kebab-case keys)
2. Copy to `fr.json`, `de.json`, `it.json` and translate
3. **IMPORTANT**: Translation keys must use kebab-case to match registry IDs (e.g., `"compound-interest"`, not `"compoundInterest"`)
4. **IMPORTANT**: Do NOT include "Calculator" in the `name` field. Use concise names like "BMI", "Mortgage", "Compound Interest" instead of "BMI Calculator", "Mortgage Calculator", etc. This applies to all locales:
   - EN: No " Calculator" suffix
   - FR: No "Calculateur de/d' " prefix
   - DE: No "-Rechner" suffix
   - IT: No "Calcolatore di " prefix

### Using Translations in Code

**Server Components (pages):**

```typescript
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function MyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("namespace");
  return <div>{t("key")}</div>;
}
```

**Client Components (calculators):**

```typescript
"use client";
import { useTranslations, useFormatter } from "next-intl";

export function MyCalculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  // Format numbers/currency with locale
  const formatted = format.number(1234.56, { style: "currency", currency: "CHF" });

  return <div>{t("label")}</div>;
}
```

### Static Generation

All pages must export `generateStaticParams()` to generate pages for all locales:

```typescript
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

### Translation File Structure

```json
{
  "common": { "siteName": "Converty", ... },
  "categories": { "finance": { "name": "Finance", "description": "..." } },
  "converters": {
    "mortgage": {
      "name": "Mortgage",
      "description": "Calculate monthly payments",
      "metaDescription": "SEO description"
    }
  },
  "calculator": { "labels": { ... }, "sections": { ... } }
}
```

## Important Notes

1. **Static Export**: This is a static site (`output: "export"` in next.config). No server-side features.

2. **URL State**: Calculators sync state to URL parameters for shareability. Always test this works.

3. **Subcategories**: Large categories (Finance, Math) use subcategories for organization. See `categories.ts`.

4. **No External APIs**: All calculations run client-side. No API calls needed.

5. **Accessibility**: Use proper labels, ARIA attributes. Radix UI primitives help with this.

## When to Update ARCHITECTURE.md

Update `.planning/codebase/ARCHITECTURE.md` when:

- Adding new categories
- Creating new shared components
- Changing state management patterns
- Adding new dependencies
- Modifying the calculator architecture pattern

## Linting

The project uses Biome for linting and formatting. Run `npm run lint:fix` before committing.

Common issues:

- Unused imports (remove them)
- Missing return types (add explicit types)
- Prefer `const` over `let`
