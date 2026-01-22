# Internationalization (i18n) Guide

Converty supports 4 Swiss languages: **English (en)**, **French (fr)**, **German (de)**, **Italian (it)**.

## Key Files

| Path | Purpose |
|------|---------|
| `src/i18n/config.ts` | Locale definitions and formats |
| `src/i18n/request.ts` | Server-side i18n setup |
| `src/i18n/navigation.ts` | Localized Link, redirect, usePathname |
| `src/messages/en.json` | English translations (source of truth) |
| `src/messages/fr.json` | French translations |
| `src/messages/de.json` | German translations |
| `src/messages/it.json` | Italian translations |

## URL Structure

All pages are prefixed with locale:

```
/en/finance/mortgage
/fr/finance/mortgage
/de/finance/mortgage
/it/finance/mortgage
```

---

## Adding Translations

### Step 1: Add to English first

Edit `src/messages/en.json`:

```json
{
  "converters": {
    "my-calculator": {
      "name": "My Calculator",
      "description": "Calculate something useful",
      "metaDescription": "SEO description for search engines"
    }
  }
}
```

### Step 2: Copy to other locales

Copy the same structure to `fr.json`, `de.json`, `it.json` and translate.

### Naming Rules

**Translation keys must use kebab-case** to match registry IDs:

```json
// Good
"compound-interest": { ... }

// Bad
"compoundInterest": { ... }
```

**Do NOT include "Calculator" in the `name` field:**

| Locale | Incorrect | Correct |
|--------|-----------|---------|
| EN | "BMI Calculator" | "BMI" |
| FR | "Calculateur de IMC" | "IMC" |
| DE | "BMI-Rechner" | "BMI" |
| IT | "Calcolatore di IMC" | "IMC" |

---

## Using Translations in Code

### Server Components (pages)

```typescript
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function MyPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);  // REQUIRED

  const t = await getTranslations("namespace");

  return <div>{t("key")}</div>;
}
```

### Client Components (calculators)

```typescript
"use client";

import { useTranslations, useFormatter } from "next-intl";

export function MyCalculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  // Format numbers with locale
  const formatted = format.number(1234.56);

  // Format currency
  const price = format.number(99.99, {
    style: "currency",
    currency: "CHF"
  });

  return <div>{t("label")}</div>;
}
```

---

## Static Generation

All pages **must** export `generateStaticParams()`:

```typescript
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

This generates pages for all 4 locales at build time.

---

## Translation File Structure

```json
{
  "common": {
    "siteName": "Converty",
    "search": "Search",
    "backTo": "Back to {category}"
  },
  "categories": {
    "finance": {
      "name": "Finance",
      "description": "Financial calculators"
    }
  },
  "converters": {
    "mortgage": {
      "name": "Mortgage",
      "description": "Calculate monthly payments",
      "metaDescription": "SEO description"
    }
  },
  "calculator": {
    "labels": {
      "amount": "Amount",
      "rate": "Interest Rate"
    },
    "results": {
      "monthly": "Monthly Payment"
    }
  }
}
```

---

## Checklist

- [ ] English translations added first
- [ ] All 4 locale files updated
- [ ] Keys use kebab-case
- [ ] No "Calculator" in names
- [ ] `generateStaticParams()` exported
- [ ] `setRequestLocale()` called in pages
