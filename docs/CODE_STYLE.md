# Code Style Guide

Converty uses [Biome](https://biomejs.dev/) for linting and formatting.

## Quick Commands

```bash
npm run format     # Auto-format code
npm run check      # Check for lint issues (read-only)
npm run check:fix  # Auto-fix lint issues
npm run type-check # TypeScript compiler check
```

---

## TypeScript

- **Strict mode** enabled (`strict: true` in tsconfig)
- Use **interfaces** for object shapes
- Export types alongside implementations
- **No `any` types** - use proper typing or `unknown`

```typescript
// Good
export interface CalculatorInput {
  value: number;
  unit: string;
}

// Bad
export type CalculatorInput = any;
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `age-calculator.tsx` |
| Components | PascalCase | `AgeCalculator` |
| Functions | camelCase | `calculateAge` |
| Types/Interfaces | PascalCase | `AgeResult` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_AGE_YEARS` |
| CSS classes | kebab-case | `calculator-input` |

---

## Imports

Use absolute imports with `@/` prefix:

```typescript
// Good
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/lib/converters/datetime/age";

// Bad
import { Button } from "../../../components/ui/button";
```

---

## Components

- Use **functional components** with hooks
- Use existing UI components from `src/components/ui/`
- Use converter components from `src/components/converter/`
- Follow established patterns before creating new components

```typescript
"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/converter";

export function MyCalculator() {
  const t = useTranslations("calculator");
  // ...
}
```

---

## Styling

- **Tailwind CSS** with CSS variables for theming
- Use `cn()` utility for conditional classes
- **Mobile-first** responsive design

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary text-primary-foreground"
)} />
```

---

## Common Lint Issues

| Issue | Fix |
|-------|-----|
| Unused imports | Remove them |
| Missing return types | Add explicit types |
| `let` instead of `const` | Use `const` when not reassigning |
| Implicit `any` | Add proper type annotation |
| Console statements | Remove or use proper logging |

---

## Pre-commit Checks

Run before every commit:

```bash
npm run type-check  # Should output: "0 errors"
npm run check       # Should output: no errors
npm run build       # Should complete successfully
```

The project has Husky pre-commit hooks that run these automatically.
