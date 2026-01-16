# Codebase Concerns

**Analysis Date:** 2025-01-16

## Tech Debt

**Legacy Hook Migration Incomplete:**

- Issue: Project is transitioning from `useConverter` hook to Zustand stores, but migration is only ~10% complete
- Files: 63 files still use `useConverter` (see `src/hooks/use-converter.ts`)
- New pattern files: Only 13 files use `createCalculatorStore` (primarily `src/app/[locale]/datetime/` and `src/app/[locale]/finance/`)
- Impact: Inconsistent state management patterns across codebase, harder to maintain
- Fix approach: Systematically migrate calculators by category, starting with most-used categories

**Large Monolithic Registry File:**

- Issue: `converters.ts` is 1698 lines containing all 124+ converter definitions
- Files: `src/lib/registry/converters.ts`
- Impact: Slow IDE performance, merge conflicts, hard to navigate
- Fix approach: Split into per-category registry files (e.g., `health-converters.ts`, `finance-converters.ts`) with a combined export

**ESLint Suppressions in Core Hook:**

- Issue: Legacy hook uses `// eslint-disable` comments to work around type safety
- Files: `src/hooks/use-converter.ts` (lines 12, 21, 44)
- Impact: `@typescript-eslint/no-explicit-any` suppressions indicate loose typing; `react-hooks/exhaustive-deps` suppression may cause stale closure bugs
- Fix approach: Refactor to use proper generic types; consider deprecating hook entirely in favor of Zustand

## Known Bugs

**No critical bugs identified during static analysis.**

Potential issues noted:

- `src/stores/calculator-store.ts` line 46: Global mutable `debounceTimeout` variable could cause race conditions if multiple stores update URLs simultaneously
- `src/hooks/use-converter.ts` line 44: Suppressed exhaustive-deps warning may cause stale state in URL sync

## Security Considerations

**External API Calls Without Rate Limiting:**

- Risk: Nominatim API calls in golden-hour calculator could be abused or rate-limited
- Files: `src/app/[locale]/photo/golden-hour/golden-hour-guide.tsx` (lines 61-72)
- Current mitigation: Error is silently caught; geocoding is optional feature
- Recommendations: Add caching for geocoding results; consider using a geocoding service with API key

**No Input Sanitization for URL State:**

- Risk: URL parameters are parsed and used directly in calculations
- Files: `src/stores/calculator-store.ts` (lines 72-83, 113-129)
- Current mitigation: Values are parsed as numbers with `Number()` or kept as strings
- Recommendations: Add explicit validation before using URL-sourced values

**No CSP Headers Configured:**

- Risk: Static export has no Content-Security-Policy headers
- Files: `next.config.ts`
- Current mitigation: None (static site relies on hosting platform)
- Recommendations: Document CSP requirements for deployment; consider inline script hashes

## Performance Bottlenecks

**Registry Loaded Entirely on Every Category Page:**

- Problem: All 124+ converters loaded even when viewing single category
- Files: `src/lib/registry/converters.ts`
- Cause: Single export of entire registry, no lazy loading
- Improvement path: Split registry by category; use dynamic imports for category pages

**Large Calculator Components:**

- Problem: Several calculator components exceed 300+ lines
- Files:
  - `src/app/[locale]/photo/golden-hour/golden-hour-guide.tsx` (544 lines)
  - `src/app/[locale]/finance/mortgage/mortgage-calculator.tsx` (390 lines)
  - `src/lib/converters/math/big-number.ts` (362 lines)
  - `src/app/[locale]/math/area-calculator/area-calculator.tsx` (326 lines)
- Cause: Feature-rich calculators with multiple modes/shapes
- Improvement path: Extract subcomponents; use composition pattern

**Static Character Data Files:**

- Problem: HTML and emoji character maps are large static arrays
- Files:
  - `src/lib/converters/web/html-chars.ts` (712 lines)
  - `src/lib/converters/web/emoji-chars.ts` (708 lines)
- Cause: Inline character data for copy-paste features
- Improvement path: Move to JSON files; lazy load on page visit

## Fragile Areas

**URL State Synchronization:**

- Files: `src/stores/calculator-store.ts`, `src/hooks/use-url-state.ts`
- Why fragile: Two different URL sync implementations exist (hook and Zustand middleware); global debounce timeout shared across all stores
- Safe modification: Test URL persistence thoroughly after any changes; ensure browser back/forward works
- Test coverage: No tests exist

**Translation Key Matching:**

- Files: `src/lib/registry/converters.ts`, `src/messages/*.json`
- Why fragile: Converter `id` must exactly match translation key in all 4 locale files
- Safe modification: Always update all 4 locale files; verify key exists before adding converter
- Test coverage: No automated verification

**Geolocation Features:**

- Files: `src/app/[locale]/photo/golden-hour/golden-hour-guide.tsx`, `src/app/[locale]/photo/sun-position/sun-position-calculator.tsx`
- Why fragile: Depends on browser geolocation API and external geocoding service
- Safe modification: Always provide manual coordinate entry fallback
- Test coverage: None

## Scaling Limits

**Translation File Size:**

- Current capacity: ~1780 lines per locale file, 124+ converters
- Limit: JSON parsing and memory for very large translation files
- Scaling path: Consider splitting translations by category/namespace

**Single Registry Object:**

- Current capacity: 124 converters in one object
- Limit: IDE performance degrades; tree-shaking ineffective
- Scaling path: Split into category-specific registries

## Dependencies at Risk

**No dependencies flagged by npm audit.**

Current dependencies are healthy:

- React 19.2.3 (latest stable)
- Next.js 16.1.1 (latest)
- Zustand 5.0.10 (latest)
- All Radix UI components on latest versions

Watch for:

- `recharts` (3.6.0) - Large bundle size, only used by a few calculators
- `jspdf` (4.0.0) - Only used if PDF export feature exists; consider lazy loading

## Missing Critical Features

**No Test Suite:**

- Problem: Zero test files, no test configuration (jest/vitest)
- Blocks: Confident refactoring, CI/CD quality gates, regression detection
- Impact: High risk when modifying calculation logic

**No Error Boundaries:**

- Problem: No React error boundary implementation found
- Blocks: Graceful error recovery; single calculator error crashes page
- Impact: Poor user experience on calculation errors

**No Accessibility Implementation:**

- Problem: No ARIA attributes or role attributes detected in codebase
- Blocks: Screen reader support, accessibility compliance
- Impact: Excludes users with disabilities

**No Loading States:**

- Problem: Most pages use basic `<Suspense fallback={<div>Loading...</div>}>`
- Blocks: Professional user experience
- Impact: Flash of unstyled content, jarring transitions

## Test Coverage Gaps

**Complete Test Absence:**

- What's not tested: Everything - all 124+ calculators, all components, all hooks
- Files: Entire `src/` directory
- Risk: Calculation bugs go unnoticed; refactoring is high-risk
- Priority: **Critical**

**Recommended Test Strategy:**

1. Unit tests for `src/lib/converters/` (pure functions, easy to test)
2. Integration tests for Zustand stores
3. Component tests for `src/components/converter/`
4. E2E tests for critical calculators (BMI, mortgage, etc.)

**Suggested Test Infrastructure:**

- Vitest for unit/integration (fast, Vite-native)
- React Testing Library for components
- Playwright for E2E (optional, lower priority for static site)

---

_Concerns audit: 2025-01-16_
