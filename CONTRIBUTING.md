# Contributing to Converty

Thank you for your interest in contributing to Converty! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding a New Calculator](#adding-a-new-calculator)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

Be respectful and inclusive. We welcome contributors of all backgrounds and experience levels.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/converty.git
   cd converty
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

This starts the Next.js development server with Turbopack at http://localhost:3000.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run type-check` | Run TypeScript compiler check |
| `npm run format` | Format code with Biome |
| `npm run lint` | Lint code with Biome |

### Before Committing

Always run these checks before committing:

```bash
npm run type-check
npm run lint
npm run build
```

## Adding a New Calculator

### Step 1: Create the Calculation Logic

Create a new file in `src/lib/converters/{category}/{name}.ts`:

```typescript
/**
 * Calculator Name
 *
 * Brief description of what this calculator does.
 */

export interface MyCalculatorInput {
  value1: number;
  value2: number;
  // ... other inputs
}

export interface MyCalculatorResult {
  output1: number;
  output2: string;
  // ... other outputs
}

/**
 * Calculate something useful
 */
export function calculateSomething(input: MyCalculatorInput): MyCalculatorResult | null {
  const { value1, value2 } = input;

  // Validate inputs
  if (value1 <= 0 || value2 <= 0) {
    return null;
  }

  // Perform calculations
  const output1 = value1 * value2;
  const output2 = `Result: ${output1}`;

  return {
    output1,
    output2,
  };
}

// Export any constants that might be useful
export const PRESETS = [
  { name: "Option 1", value: 1 },
  { name: "Option 2", value: 2 },
];
```

### Step 2: Export from Category Index

Add to `src/lib/converters/{category}/index.ts`:

```typescript
export * from "./my-calculator";
```

### Step 3: Create the Page

Create `src/app/{category}/{name}/page.tsx`:

```typescript
import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { MyCalculator } from "./my-calculator";

export const metadata: Metadata = {
  title: "My Calculator | Category",
  description: "Description for SEO",
  keywords: ["keyword1", "keyword2", "keyword3"],
};

export default function MyCalculatorPage() {
  const category = getCategoryBySlug("category")!;

  return (
    <ConverterLayout
      title="My Calculator"
      description="Brief description shown on the page"
      category={category}
      infoContent={
        <>
          <h3>How It Works</h3>
          <p>Explanation of the calculator...</p>

          <h3>Formula</h3>
          <p><code>result = value1 × value2</code></p>
        </>
      }
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <MyCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
```

### Step 4: Create the Component

Create `src/app/{category}/{name}/my-calculator.tsx`:

```typescript
"use client";

import { useState } from "react";
import { calculateSomething, PRESETS } from "@/lib/converters/{category}/my-calculator";

export function MyCalculator() {
  const [value1, setValue1] = useState("10");
  const [value2, setValue2] = useState("5");

  const result = calculateSomething({
    value1: parseFloat(value1) || 0,
    value2: parseFloat(value2) || 0,
  });

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Value 1</label>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Value 2</label>
          <select
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            className="w-full h-10 px-3 rounded-md border bg-background"
          >
            {PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Output 1</p>
            <p className="text-2xl font-bold">{result.output1}</p>
          </div>
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Output 2</p>
            <p className="text-xl font-bold">{result.output2}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 5: Register the Calculator

Add to `src/lib/registry/converters.ts`:

```typescript
import { CategoryIcon } from "lucide-react";

// In the converterRegistry object:
"my-calculator": {
  id: "my-calculator",
  slug: "my-calculator",
  name: "My Calculator",
  description: "Brief description for the menu",
  category: "category",
  keywords: ["keyword1", "keyword2"],
  icon: CategoryIcon,
  featured: false,
},
```

### Step 6: Document the Calculator

Add documentation to `docs/CALCULATORS.md` explaining:
- What the calculator does
- The formulas used
- Any reference values or presets

## Code Style

We use [Biome](https://biomejs.dev/) for linting and formatting.

### Key Guidelines

1. **TypeScript**: Use strict types, avoid `any`
2. **Components**: Use functional components with hooks
3. **Naming**:
   - Files: `kebab-case.ts`
   - Components: `PascalCase`
   - Functions: `camelCase`
   - Constants: `SCREAMING_SNAKE_CASE`
4. **Imports**: Use absolute imports with `@/` prefix
5. **Comments**: Add JSDoc comments for exported functions

### Formatting

```bash
# Format all files
npm run format

# Check for issues
npm run lint
```

## Testing

### Manual Testing Checklist

Before submitting, verify:

- [ ] Calculator produces correct results for known values
- [ ] Edge cases are handled (zero, negative, very large numbers)
- [ ] UI is responsive on mobile and desktop
- [ ] Dark mode works correctly
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)

### Verifying Calculations

For photography calculators, verify against:
- [PhotoPills](https://www.photopills.com/calculators)
- [DOFMaster](http://www.dofmaster.com/dofjs.html)

For other calculations, cite your reference sources.

## Submitting Changes

### Commit Messages

Use clear, descriptive commit messages:

```
Add [calculator name] calculator

- Add calculation logic in src/lib/converters/...
- Create page and component
- Register in converter registry
- Add documentation

Co-Authored-By: Your Name <your@email.com>
```

### Pull Request Process

1. Ensure all checks pass locally
2. Push your branch to your fork
3. Create a Pull Request to the `main` branch
4. Fill out the PR template with:
   - Description of changes
   - Screenshots (for UI changes)
   - Testing performed
5. Wait for review and address any feedback

### What Makes a Good PR

- **Focused**: One feature or fix per PR
- **Tested**: Verified to work correctly
- **Documented**: Includes documentation updates
- **Clean**: No unrelated changes or debug code

## Questions?

If you have questions, feel free to:
- Open an issue for discussion
- Check existing issues and PRs for context

Thank you for contributing!
