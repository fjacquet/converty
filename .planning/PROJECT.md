# Converty Infrastructure Upgrade

## What This Is

A comprehensive infrastructure improvement phase for Converty, a calculator platform with 200+ tools. This phase eliminates technical debt in state management, establishes strict type safety, upgrades critical dependencies, adds PWA support, and creates complete documentation for contributors.

**Status:** ✅ v1.0 Infrastructure Upgrade shipped 2026-01-18

## Core Value

A solid, maintainable foundation with zero technical debt in state management and type safety, enabling confident future development.

## Requirements

### Validated

<!-- v1.0 Infrastructure Upgrade (shipped 2026-01-18) -->

**State Management:**

- ✓ All 200+ calculators migrated from useConverter to Zustand stores — v1.0
- ✓ useConverter hook removed entirely from codebase — v1.0
- ✓ Consolidated URL sync middleware (single implementation) — v1.0
- ✓ Per-store debounce timers (fix global timer bug) — v1.0
- ✓ Functional approach - pure functions, no shared mutable state — v1.0

**Type Safety:**

- ✓ Enable noExplicitAny in Biome configuration — v1.0
- ✓ Fix all explicit any types in useConverter hook — v1.0
- ✓ Fix all explicit any types in calculator stores — v1.0
- ✓ Fix all explicit any types in URL state parsing — v1.0
- ✓ Strict TypeScript checks passing with zero any types — v1.0
- ✓ Type-safe URL parameter parsing with validation — v1.0

**Dependencies:**

- ✓ jsPDF verified current (v4.0.0 is latest as of Jan 2025) — v1.0
- ✓ PDF export functionality verified working — v1.0
- ✓ jsPDF usage follows current API best practices — v1.0

**Progressive Web App:**

- ✓ Service worker for offline calculator functionality — v1.0
- ✓ Web manifest for install prompt — v1.0
- ✓ Mobile-optimized responsive design verified — v1.0
- ✓ Offline fallback UI when network unavailable — v1.0

**Documentation:**

- ✓ CHANGELOG.md following Keep a Changelog format — v1.0
- ✓ Backfill recent changes (linting fixes, codebase mapping) — v1.0
- ✓ CONTRIBUTING.md with development workflow — v1.0
- ✓ Development setup guide (prerequisites, commands) — v1.0
- ✓ Architecture Decision Records (ADRs) for key decisions — v1.0
- ✓ Document Zustand store pattern for future calculators — v1.0

**Code Quality:**

- ✓ Zero Biome lint errors — v1.0
- ✓ Zero ESLint errors — v1.0
- ✓ Zero format errors (Biome formatter) — v1.0
- ✓ Zero security warnings (npm audit --production) — v1.0
- ✓ All code follows KISS principle (simple, readable) — v1.0
- ✓ All code follows DRY principle (no duplication) — v1.0
- ✓ Functional programming patterns (pure functions, immutability) — v1.0

**Developer Experience:**

- ✓ Container security false positives suppressed (.trivyignore) — v1.0
- ✓ URL parameter utilities consolidated (getUrlParams extracted) — v1.0
- ✓ Pre-commit hooks (Husky v9 + lint-staged v16) — v1.0

<!-- v2.0 Network Tools & User Experience (shipped 2026-01-22) -->

**Network Calculators:**

- ✓ Visual Subnet Calculator (IPv4/IPv6) with comprehensive visualization — v2.0
- ✓ Network diagram, binary representation, breakdown table — v2.0
- ✓ CIDR notation and subnet mask input support — v2.0
- ✓ Subnetting and supernetting capabilities — v2.0
- ✓ IP Address Calculator (class detection, public/private check) — v2.0
- ✓ CIDR Range Calculator (IP range calculation, IP-in-range check) — v2.0
- ✓ Network Speed/Latency Calculator (ping time conversions, throughput) — v2.0

**Search Functionality:**

- ✓ Global search across all calculators (Cmd+K) — v2.0
- ✓ Fuzzy search with Fuse.js, real-time results — v2.0
- ✓ Pre-built search indexes per locale — v2.0

**Translation Compliance:**

- ✓ All 156 registered calculators fully internationalized — v2.0
- ✓ Zero hardcoded English strings in calculator components — v2.0
- ✓ 100% translation coverage across all 4 locales (en, fr, de, it) — v2.0
- ✓ All calculators verified working in all 4 locales — v2.0

<!-- Existing capabilities from the codebase -->

- ✓ 200+ calculators across 11 categories (Math, Finance, Health, Photo, Video, Web, Data, DateTime, Physics, Music, Color) — existing
- ✓ Next.js 16 App Router with static export to GitHub Pages — existing
- ✓ Internationalization support (4 locales: en, fr, de, it) — existing
- ✓ URL state persistence for shareable calculator links — existing
- ✓ Client-side calculations (no server dependencies) — existing
- ✓ Biome linting and ESLint configuration — existing
- ✓ Tailwind CSS with theme support (light/dark mode) — existing
- ✓ Radix UI component primitives — existing

## Current Milestone: v3.0 Calculator Expansion & Performance (Planning)

**Goal:** Expand calculator coverage with 4 new categories, optimize performance with code splitting/lazy loading, and enhance UX with favorites, history, and export.

**Status:** Planning phase — Requirements defined, roadmap created

### Active

<!-- v3.0 Planning Phase -->

**Confirmed Features:**

**Calculator Expansion (16 core calculators across 4 new categories):**
- Crypto/Blockchain: Hash calculations, wallet conversions, exchange rates, mining profitability (4 calculators)
- Real Estate: Mortgage, property valuation, ROI, amortization (4 calculators)
- Cooking/Nutrition: Recipe scaling, nutrition facts, unit conversions, food cost (4 calculators)
- Automotive: Fuel efficiency, tire sizing, maintenance, vehicle payments (4 calculators)

**Performance Optimization:**
- Code splitting & lazy loading by calculator category
- Initial bundle size reduction
- Virtualized search/browse for 200+ calculators
- FCP improvement through lazy loading

**User Experience:**
- Favorites/bookmarking system with localStorage persistence
- Calculation history with restore functionality
- Export results as PDF and CSV
- Count badge for favorites in navigation

**Planned phases:** 17-24 (8 phases)

**Requirements:** 34 total (100% mapped to phases)
- CRYPT-01 through CRYPT-04 (Crypto/Blockchain)
- REAL-01 through REAL-04 (Real Estate)
- COOK-01 through COOK-04 (Cooking/Nutrition)
- AUTO-01 through AUTO-04 (Automotive)
- PERF-01 through PERF-04 (Performance)
- FAV-01 through FAV-05 (Favorites)
- HIST-01 through HIST-05 (History)
- EXP-01 through EXP-04 (Export)

### Out of Scope for v3.0

- Server-side rendering — static export constraint maintained
- User accounts/authentication — localStorage sufficient for v3.0
- Real-time collaboration — high complexity, deferred to v4.0+
- Analytics/telemetry — privacy-focused, deferred to v5.0+
- Native mobile apps — web app sufficient for v3.0
- Advanced PWA features beyond v2.0 — keep current implementation
- Test framework setup — important but separate milestone
- Accessibility (a11y) comprehensive audit — important but separate milestone
- Major UI/UX redesigns — existing design works well
- Multi-language calculator logic — English for calculations, UI i18n maintained

## Context

### Current State (as of v2.0 - 2026-01-22)

**Shipped v2.0 Network Tools & User Experience:**

Codebase: ~89,000 LOC TypeScript (+29,789 lines from v2.0)
Tech stack: Next.js 16, React 19, TypeScript 5, Zustand 5, Biome 2.3, Fuse.js
Deployment: GitHub Pages (static export)
Calculators: 156 registered (4 new network calculators added)

**State Management:**

- All 200+ calculators use Zustand stores with `createCalculatorStore` factory
- URL sync middleware consolidated in `src/lib/middleware/url-sync.ts`
- Per-store debounce timers via closure pattern (eliminates global timer bug)
- Legacy `useConverter` and `useUrlState` hooks removed

**Type Safety:**

- TypeScript strict mode enabled with all strict flags
- Biome `noExplicitAny` enforced at error level
- Zero `any` types in hooks, stores, or URL parsing
- Type-safe URL parameter parsing helpers (parseNumberParam, parseStringParam, parseBooleanParam)

**Progressive Web App:**

- Service worker with Workbox caching strategies
- PWA manifest with icons for all platforms (192x192, 512x512, maskable, apple-touch-icon)
- Offline functionality verified working
- Install prompt with iOS/Android platform detection

**Documentation:**

- CHANGELOG.md following Keep a Changelog format with backfilled changes
- CONTRIBUTING.md with development setup, coding standards, and calculator pattern
- 4 ADRs documenting key decisions (Zustand migration, PWA, TypeScript strict, jsPDF)
- Setup guide tested on fresh machine

**Code Quality:**

- Zero Biome lint errors
- Zero ESLint errors
- Zero format violations
- Zero npm audit vulnerabilities (production dependencies)
- Pre-commit hooks (Husky v9 + lint-staged v16) enforce quality gates
- Container security false positives documented in .trivyignore

**Dependencies:**

- jsPDF v4.0.0 verified current (latest as of Jan 2025)
- Next.js 16.1.1 with App Router
- React 19.2.3
- Zustand 5.0.10

**Milestone Stats:**

- 8 phases completed
- 19 plans executed
- 103 commits
- 131 files modified
- +23,496 lines added, -874 lines removed
- 2 days from start to ship (2026-01-17 → 2026-01-18)
- 32/32 requirements satisfied (100%)

### Known Issues / Tech Debt

**From v1.0 completion:**

- Phase 8 human verification items pending (low priority):
  - Pre-commit hook performance timing (infrastructure verified, target <5s)
  - Quality gate enforcement with broken code (infrastructure verified)
- Next.js 16 removed `next lint` command (architectural change discovered)
  - Future opportunity: Consider ESLint removal, Biome-only migration
  - Current: Keep dual-linter setup for React hooks rules

**Technical Environment:**

- Next.js 16.1.1 with App Router and static export
- React 19.2.3 (cutting edge)
- TypeScript 5.9.3 with strict mode
- Zustand 5.0.10 for state management
- Biome 2.3.11 for linting/formatting
- Husky 9.1.7 for Git hooks
- lint-staged 16.2.7 for staged file checks
- Deployed to GitHub Pages (static hosting)

## Constraints

- **Static Export**: Must maintain `output: "export"` in Next.js config - no server-side features
- **GitHub Pages**: Deployment must remain static file hosting compatible
- **Existing Functionality**: All 200+ calculators must continue working exactly as before
- **i18n**: Must preserve internationalization across all 4 locales (en, fr, de, it)
- **URL Sharing**: Must maintain shareable calculator links with state in URL
- **Zero Downtime**: Changes deployed incrementally, no breaking changes to users
- **Functional Principles**: KISS (Keep It Simple, Stupid), DRY (Don't Repeat Yourself), functional programming

## Key Decisions

| Decision                                                 | Rationale                                                        | Outcome                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| Big bang migration (all 200+ calculators at once)        | Eliminates dual patterns faster, prevents partial migration drag | ✓ Good - All calculators migrated successfully              |
| Remove useConverter entirely (no backward compatibility) | Clean break, no legacy maintenance burden, forces best practices | ✓ Good - Legacy hooks deleted, zero duplication             |
| Per-store debounce timers (not global)                   | Fixes concurrent calculator bug, proper encapsulation            | ✓ Good - Closure pattern eliminates timer conflicts         |
| Consolidated URL sync middleware                         | DRY principle, single source of truth, consistent behavior       | ✓ Good - Middleware created, zero URL sync duplication      |
| Functional programming approach                          | Pure functions, no shared mutable state, easier testing          | ✓ Good - Code review confirmed pure functions, immutability |
| Keep a Changelog format                                  | Industry standard, user-friendly, clear conventions              | ✓ Good - CHANGELOG.md created following standard            |
| PWA with service worker                                  | Offline calculator access, mobile install, better UX             | ✓ Good - PWA working with Workbox caching                   |
| Strict TypeScript (zero any types)                       | Type safety prevents runtime errors, better developer experience | ✓ Good - Strict mode enabled, zero any types                |
| Number.isNaN() instead of isNaN()                        | Avoid type coercion, strict NaN validation                       | ✓ Good - Prevents false positives from string coercion      |
| Boolean parsing limited to "true" and "1"                | Explicit over implicit, avoid ambiguity                          | ✓ Good - Clear semantics, no "yes"/"on" edge cases          |
| jsPDF verification instead of upgrade                    | Already current (v4.0.0 latest), documentation error             | ✓ Good - Corrected ADR, verified working                    |
| Container security false positive suppression            | Static site, no Docker usage, Dockerfile never executed          | ✓ Good - Documented with 6-month review cycle               |
| Pre-commit hooks with Husky v9 + lint-staged             | Automated quality gates, fast feedback                           | ✓ Good - Hook infrastructure verified, <5s target           |
| Phase numbering continues across milestones              | Clear history, no confusion with phase resets                    | ✓ Good - Next milestone starts at Phase 9                   |

---

_Last updated: 2026-01-24 after v3.0 milestone initialization_
