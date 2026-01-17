# Codebase Concerns

**Analysis Date:** 2026-01-17

## Tech Debt

**State Management Migration (In Progress):**

- Issue: Project is migrating from `useConverter` hook to Zustand stores, leaving dual patterns in codebase
- Files: `src/hooks/use-converter.ts`, `src/stores/calculator-store.ts`, 74 calculator components still using `useConverter`
- Impact: Code inconsistency, increased maintenance burden, confusion for new features
- Fix approach: Complete migration to Zustand for all calculators, deprecate useConverter, update documentation

**URL Sync Logic Duplication:**

- Issue: URL persistence implemented separately in `useConverter` and `createCalculatorStore` with different debouncing strategies
- Files: `src/hooks/use-converter.ts` (lines 46-57), `src/hooks/use-url-state.ts`, `src/stores/calculator-store.ts` (lines 45-83)
- Impact: Behavioral inconsistency between old/new calculators, maintenance overhead
- Fix approach: Extract single URL sync middleware, reuse across both patterns during migration

**Type Safety Weaknesses:**

- Issue: `noExplicitAny` disabled in Biome config, `eslint-disable` comments for `any` types in useConverter
- Files: `biome.json` (line 92), `src/hooks/use-converter.ts` (lines 12, 21)
- Impact: Reduced type safety, potential runtime errors from untyped data
- Fix approach: Enable `noExplicitAny` warning, gradually type all `any` usages with generics

**Shared Global Debounce Timer:**

- Issue: Single `debounceTimeout` variable shared across all Zustand calculator stores
- Files: `src/stores/calculator-store.ts` (line 46)
- Impact: Concurrent calculator usage on same page causes timer conflicts, URL updates interfere
- Fix approach: Move debounce timer into store instance closure or use WeakMap keyed by store

**Accessibility Rules Disabled:**

- Issue: Biome a11y rules explicitly disabled
- Files: `biome.json` (lines 32-34)
- Impact: Accessibility issues may go undetected, excluding users with disabilities
- Fix approach: Enable a11y linting, audit existing components, fix violations

## Known Bugs

**Date Locale Dependency:**

- Symptoms: Date parsing may fail or return incorrect results for non-ISO formats
- Files: All datetime converters in `src/lib/converters/datetime/`, especially `src/lib/converters/datetime/time.ts` (line 22)
- Trigger: User inputs date in locale-specific format
- Workaround: Document ISO format requirement, add format hints in UI

**Basic Calculator Expression Parsing Edge Cases:**

- Symptoms: Complex expressions with nested parentheses or implicit multiplication may parse incorrectly
- Files: `src/lib/converters/math/basic-calculator.ts` (lines 27-60, 295-320)
- Trigger: Edge case expressions like `2(3+4)(5)` or `--5`
- Workaround: Manual tokenization has limitations, consider expression parser library

## Security Considerations

**Outdated jsPDF Dependency:**

- Risk: Using jsPDF v4.0.0 from 2018, current stable is v2.x series (major version rollback indicates breaking changes)
- Files: `package.json` (line 39), `src/lib/utils/pdf-export.ts`
- Current mitigation: PDF export is optional feature, runs client-side only
- Recommendations: Audit jsPDF for known CVEs, update to latest stable version, test PDF generation thoroughly

**Expression Evaluation Without Sandboxing:**

- Risk: Basic calculator evaluates user expressions, potential for malicious input
- Files: `src/lib/converters/math/basic-calculator.ts` (evaluatePostfix function)
- Current mitigation: Custom tokenizer/parser, no direct `eval()` usage
- Recommendations: Add expression complexity limits, input length caps, sanitize token list

**Static Export Exposes All Code:**

- Risk: All calculation logic visible in browser, proprietary algorithms exposed
- Files: All files in `src/lib/converters/`
- Current mitigation: None needed for open-source project
- Recommendations: Document licensing clearly if proprietary calculators added

**No CSRF Protection:**

- Risk: Forms have no CSRF tokens
- Files: N/A (static site with no server-side actions)
- Current mitigation: Static export means no server endpoints to exploit
- Recommendations: None needed for current architecture

## Performance Bottlenecks

**Large Calculator Components:**

- Problem: Some calculator files exceed 300 lines with complex logic
- Files: `src/lib/converters/math/basic-calculator.ts` (348 lines), `src/lib/converters/photo/sun-position.ts` (559 lines)
- Cause: Complex mathematical algorithms, step-by-step calculation logging
- Improvement path: Extract sub-algorithms to helper functions, lazy-load heavy calculators

**No Code Splitting for Calculators:**

- Problem: All calculator logic may bundle together
- Files: Registry imports all converters: `src/lib/registry/converters.ts` (lines 3-14)
- Cause: Static imports of all category converter registries
- Improvement path: Dynamic imports for calculator logic, load on-demand by route

**Recharts Bundle Size:**

- Problem: Recharts is heavy dependency (~400KB), used only in few calculators
- Files: `package.json` (line 46), used in chart-display.tsx
- Cause: Full charting library for simple visualizations
- Improvement path: Consider lightweight alternative (Chart.js, custom SVG), or code-split Recharts

**URL Updates on Every Keystroke:**

- Problem: URL history updated on each input change (debounced 150ms)
- Files: `src/stores/calculator-store.ts` (line 68), `src/hooks/use-url-state.ts` (line 24)
- Cause: Shareable links feature requires URL sync
- Improvement path: Increase debounce to 500ms, or sync only on blur/calculate

## Fragile Areas

**URL State Parsing:**

- Files: `src/stores/calculator-store.ts` (lines 112-130), `src/hooks/use-url-state.ts` (lines 29-41)
- Why fragile: Type coercion from URL strings to numbers using heuristic `Number()` check, assumes URL params match state shape
- Safe modification: Always validate/sanitize URL params before merging with state, add schema validation with Zod
- Test coverage: None (no tests found)

**Next.js Router API Usage:**

- Files: `src/hooks/use-url-state.ts` (lines 3, 24)
- Why fragile: Relies on Next.js 16 App Router API (`useRouter`, `useSearchParams`, `usePathname`) which is still evolving
- Safe modification: Isolate router logic in single hook/utility, test across Next.js version updates
- Test coverage: None

**Date Calculations Across Timezones:**

- Files: `src/lib/converters/datetime/*.ts`, `src/lib/converters/health/pregnancy-due-date.ts`
- Why fragile: Date objects use local timezone, calculations may differ based on user location
- Safe modification: Explicitly use UTC for calculations, convert to local only for display
- Test coverage: None

**Translation Key Consistency:**

- Files: `src/messages/*.json` (4 locale files), `src/lib/registry/*-converters.ts`
- Why fragile: Translation keys must match registry IDs (kebab-case), no automated validation
- Safe modification: Add build-time validation script to check key consistency across locales
- Test coverage: Manual only (documented in `src/messages/CLAUDE.md`)

## Scaling Limits

**Client-Side Calculation Only:**

- Current capacity: Handles all calculations locally, no server needed
- Limit: Complex calculations (large matrices, long simulations) may freeze browser
- Scaling path: Add Web Workers for heavy calculations, show progress indicators

**Static Site Generation for 200+ Calculators:**

- Current capacity: Builds all calculator pages at build time
- Limit: Build time grows linearly with calculator count, currently planning 200+ tools
- Scaling path: Consider ISR (Incremental Static Regeneration) or on-demand rendering if build exceeds 5 minutes

**Single Locale Bundle:**

- Current capacity: All 4 locale files bundled together (~100KB total)
- Limit: Adding more locales increases initial bundle size
- Scaling path: Code-split locale files, load only active locale

**No Pagination for Calculator Lists:**

- Current capacity: Category pages render all calculators in category
- Limit: Finance (72 planned), Math (42 planned) will have long lists
- Scaling path: Implement virtual scrolling or pagination, group by subcategory with expand/collapse

## Dependencies at Risk

**jsPDF v4.0.0:**

- Risk: 6+ years old, abandoned major version (current is v2.x)
- Impact: PDF export feature may have security vulnerabilities, compatibility issues
- Migration plan: Upgrade to `jspdf@latest`, rewrite PDF export to match new API (breaking changes expected)

**React 19 & Next.js 16:**

- Risk: Cutting-edge versions, may have undiscovered bugs or API changes
- Impact: Breaking changes in future patch releases, ecosystem compatibility issues
- Migration plan: Pin exact versions, monitor release notes, budget time for upgrade testing

**No Lockfile Strategy:**

- Risk: `package-lock.json` exists but may allow minor/patch updates
- Impact: Builds may become non-deterministic across environments
- Migration plan: Use `npm ci` in CI/CD, commit lockfile, review dependency updates manually

## Missing Critical Features

**Error Boundaries:**

- Problem: No React error boundaries around calculator components
- Blocks: Calculator crash takes down entire page, poor user experience
- Priority: High

**Test Coverage:**

- Problem: Zero test files found, no test framework configured
- Blocks: Confident refactoring, regression detection, code quality validation
- Priority: Critical
- Files needed: `*.test.ts` in `src/lib/converters/`, test runner config (Jest/Vitest)

**Input Validation Feedback:**

- Problem: Many calculators return `null` for invalid input without specific error messages
- Blocks: User doesn't know what's wrong with their input
- Priority: Medium
- Pattern: Calculators should return error details, not just null

**Progressive Web App Support:**

- Problem: No service worker, no offline functionality, no install prompt
- Blocks: Offline usage, mobile home screen installation
- Priority: Low

**Analytics/Telemetry:**

- Problem: No usage tracking, error monitoring, or performance metrics
- Blocks: Understanding which calculators are popular, identifying errors in production
- Priority: Medium
- Consideration: Privacy-focused analytics (Plausible, Fathom) to respect static-site ethos

## Test Coverage Gaps

**All Calculation Logic:**

- What's not tested: Every calculator in `src/lib/converters/**/*.ts` (100+ files)
- Files: All pure calculation functions
- Risk: Mathematical errors, edge case bugs, regression during refactoring
- Priority: Critical

**State Management:**

- What's not tested: `useConverter` hook, `createCalculatorStore` factory, URL sync middleware
- Files: `src/hooks/use-converter.ts`, `src/stores/calculator-store.ts`
- Risk: State corruption, URL sync failures, race conditions
- Priority: High

**Translation Completeness:**

- What's not tested: All locale files have same keys, no missing translations
- Files: `src/messages/en.json`, `src/messages/fr.json`, `src/messages/de.json`, `src/messages/it.json`
- Risk: Runtime errors from missing keys, incomplete translations
- Priority: Medium

**Component Integration:**

- What's not tested: Calculator components render correctly, handle user input, display results
- Files: All `*-calculator.tsx` files in `src/app/[locale]/**`
- Risk: UI bugs, broken layouts, accessibility issues
- Priority: High

**Build-Time Validation:**

- What's not tested: Registry IDs match translation keys, all calculators have pages, static export succeeds
- Risk: Build failures in production, broken links, missing pages
- Priority: High

---

_Concerns audit: 2026-01-17_
