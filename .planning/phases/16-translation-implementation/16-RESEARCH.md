# Phase 16: Translation Implementation - Research

**Researched:** 2026-01-22
**Domain:** Internationalization (i18n) with next-intl
**Confidence:** HIGH

## Summary

Translation implementation for the Converty project is largely complete. Research reveals that all 4 locale files (en, fr, de, it) are already in sync with 2540 translation keys each. The project has robust tooling for translation validation including `@lingual/i18n-check` and a custom `scripts/check-i18n.js` script. Analysis shows no placeholder text or untranslated English content in non-English locales.

The primary work for this phase involves:
1. Adding 2 missing translation keys (`calculator.finance.currencies` and `calculator.finance.states`)
2. Verifying all 168 pages render correctly in all 4 locales
3. Testing the locale switcher functionality across all calculator pages

**Primary recommendation:** Run a full build (`npm run build`) which generates all static pages for all locales, then spot-check critical calculator pages in each locale to verify correct rendering.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | 4.7.0 | i18n for Next.js | Official recommended library for App Router, excellent TypeScript support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @lingual/i18n-check | 0.8.19 | Translation validation | CI/CD integration, missing key detection |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom check script | Only i18n-check | Custom script provides source code scanning; use both |
| Manual verification | Automated testing | Use build verification as primary check |

**Already installed - no new dependencies needed.**

## Architecture Patterns

### Translation File Structure
```
src/messages/
├── en.json        # 2540 keys - Source of truth
├── fr.json        # 2540 keys - French translations
├── de.json        # 2540 keys - German translations
└── it.json        # 2540 keys - Italian translations
```

### Translation Key Organization
```json
{
  "common": { /* Site-wide strings */ },
  "categories": { /* Category names and descriptions */ },
  "subcategories": { /* Subcategory labels */ },
  "converters": { /* Calculator metadata: name, description, metaDescription */ },
  "calculator": {
    "labels": { /* Input field labels */ },
    "results": { /* Output labels */ },
    "options": { /* Select/radio options */ },
    "errors": { /* Error messages */ },
    "health": { /* Health category specific */ },
    "finance": { /* Finance category specific */ },
    "math": { /* Math category specific */ },
    /* ... other category-specific sections */
  }
}
```

### Pattern 1: Calculator Component Translation Usage
**What:** Client components use `useTranslations()` with namespaced keys
**When to use:** All calculator components

```typescript
// Source: Project codebase pattern
"use client";
import { useTranslations } from "next-intl";

export function MyCalculator() {
  const t = useTranslations("calculator.labels");
  const tResults = useTranslations("calculator.results");

  return (
    <InputField
      label={t("weightSimple")}
      placeholder={t("enterWeight")}
    />
  );
}
```

### Pattern 2: Page Component Translation Usage
**What:** Server components use `getTranslations()` with `setRequestLocale()`
**When to use:** All page.tsx files

```typescript
// Source: Project codebase pattern
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);  // CRITICAL for static generation

  const t = await getTranslations("converters.my-calculator");
  return <h1>{t("name")}</h1>;
}
```

### Pattern 3: Static Params Generation
**What:** All pages export `generateStaticParams()` to generate pages for all locales
**When to use:** Every page.tsx file

```typescript
// Source: Project codebase pattern
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

### Anti-Patterns to Avoid
- **Hardcoded strings in components:** Always use translation keys
- **Missing setRequestLocale():** Causes hydration errors in SSG
- **Translation key mismatches:** Keys must be kebab-case matching registry IDs

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Missing key detection | Manual comparison | `scripts/check-i18n.js` or `i18n-check` | Automated, CI-ready |
| Locale sync checking | Manual file diffing | `i18n-check --source en --locales src/messages` | Handles nested keys |
| Translation extraction | Manual key hunting | `i18n-check -u src -f next-intl --unused` | Finds undefined/unused keys |
| Page rendering verification | Manual browser testing | `npm run build` (static generation) | Build fails if translations missing |

**Key insight:** The build process (`npm run build`) is the ultimate validator - it generates all 168 pages for all 4 locales and will fail if any translation key is missing.

## Common Pitfalls

### Pitfall 1: Missing setRequestLocale() Call
**What goes wrong:** Hydration mismatch errors, wrong locale on initial render
**Why it happens:** Static generation requires explicit locale setting
**How to avoid:** Always call `setRequestLocale(locale)` as first line in page components
**Warning signs:** Console errors about hydration, text flashing/changing on load

### Pitfall 2: Translation Key Casing Mismatch
**What goes wrong:** `t("compoundInterest")` returns key itself, not translation
**Why it happens:** Registry uses kebab-case (`compound-interest`), code uses camelCase
**How to avoid:** Always use kebab-case for converter IDs and translation keys
**Warning signs:** Raw translation keys appearing in UI

### Pitfall 3: Untranslated Content in Non-English Locales
**What goes wrong:** English text appears when viewing French/German/Italian pages
**Why it happens:** Keys exist but values weren't actually translated
**How to avoid:** Run translation analysis script to detect identical EN/target values
**Warning signs:** Build passes but visual inspection shows English

### Pitfall 4: Locale Switcher Not Preserving Path
**What goes wrong:** Switching language redirects to homepage instead of same page
**Why it happens:** Using standard Next.js Link instead of next-intl navigation
**How to avoid:** Use `useRouter` and `usePathname` from `@/i18n/navigation`
**Warning signs:** Users report losing their place when changing language

## Code Examples

Verified patterns from the project codebase:

### Validation Commands
```bash
# Check translation sync across locales
node scripts/check-i18n.js --sync

# Check for missing keys used in source code
node scripts/check-i18n.js

# Check with i18n-check (more comprehensive)
npx @lingual/i18n-check --source en --locales src/messages -f next-intl

# Check for unused/undefined keys
npx @lingual/i18n-check --source en --locales src/messages -f next-intl -u src
```

### Language Switcher Component
```typescript
// Source: src/components/layout/language-switcher.tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };
  // ... render select component
}
```

### Adding a New Translation Key
```json
// 1. Add to en.json first
{
  "calculator": {
    "finance": {
      "newLabel": "New Label Text"
    }
  }
}

// 2. Copy to fr.json, de.json, it.json and translate
// 3. Run validation: node scripts/check-i18n.js --sync
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual JSON diffing | i18n-check CLI | 2024 | Automated CI validation |
| react-intl | next-intl | Next.js 13+ | Better App Router support |
| Per-page translations | Centralized JSON | Project start | Easier maintenance |

**Current Status:**
- All 4 locales have 2540 keys in sync
- No placeholder or untranslated content detected
- 2 minor missing keys to add: `calculator.finance.currencies`, `calculator.finance.states`

## Open Questions

Things that couldn't be fully resolved:

1. **End-to-end locale testing**
   - What we know: Build validates page generation; locale switcher exists
   - What's unclear: Whether all calculators function correctly in all locales (input/output)
   - Recommendation: Add spot-check verification for representative calculators per category

2. **ICU Message Format Usage**
   - What we know: Some translations use interpolation (e.g., `{ip}`, `{count}`)
   - What's unclear: Whether all interpolated values work correctly across locales
   - Recommendation: Verify calculators with dynamic messages in all locales

## Sources

### Primary (HIGH confidence)
- Project codebase analysis - `/src/messages/*.json`, `/src/i18n/`, `/scripts/check-i18n.js`
- Official next-intl documentation - https://next-intl.dev/docs/workflows/messages

### Secondary (MEDIUM confidence)
- [next-intl GitHub](https://github.com/amannn/next-intl) - Library patterns
- [i18n-check documentation](https://lingual.dev/i18n-check/) - Validation tool
- [Lingual blog on next-intl validation](https://lingual.dev/blog/validating-your-nextjs-internationalization/)

### Tertiary (LOW confidence)
- WebSearch results for i18n testing patterns in Next.js

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified from package.json and working implementation
- Architecture: HIGH - Extracted from actual codebase patterns
- Pitfalls: MEDIUM - Based on common i18n issues and project-specific patterns

**Research date:** 2026-01-22
**Valid until:** 60 days (translation infrastructure is stable)

---

## Current Translation Status

### Translation File Analysis
| Locale | Keys | Status |
|--------|------|--------|
| en.json | 2540 | Source of truth |
| fr.json | 2540 | Complete sync |
| de.json | 2540 | Complete sync |
| it.json | 2540 | Complete sync |

### Validation Results
```
i18n-check --source en --locales src/messages -f next-intl
Result: No missing keys found!

scripts/check-i18n.js --sync
Result: All locales are in sync!

scripts/check-i18n.js (source code scan)
Result: 2 missing keys (in all locales):
- calculator.finance.currencies
- calculator.finance.states
```

### Missing Keys to Add
These keys are referenced in source code but don't exist in any translation file:

| Key | Used In | Action |
|-----|---------|--------|
| `calculator.finance.currencies` | Finance calculators | Add to all 4 locale files |
| `calculator.finance.states` | Finance calculators | Add to all 4 locale files |

### Verification Checklist
- [x] Translation files exist for all 4 locales
- [x] All files have same key count (2540)
- [x] No untranslated English content in non-English files
- [x] No placeholder text (TODO, FIXME, etc.)
- [ ] 2 missing keys need to be added
- [ ] Build verification across all locales
- [ ] Manual spot-check of locale switcher functionality
