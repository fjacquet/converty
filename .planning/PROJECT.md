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

<!-- Existing capabilities from the codebase -->

- ✓ 200+ calculators across 11 categories (Math, Finance, Health, Photo, Video, Web, Data, DateTime, Physics, Music, Color) — existing
- ✓ Next.js 16 App Router with static export to GitHub Pages — existing
- ✓ Internationalization support (4 locales: en, fr, de, it) — existing
- ✓ URL state persistence for shareable calculator links — existing
- ✓ Client-side calculations (no server dependencies) — existing
- ✓ Biome linting and ESLint configuration — existing
- ✓ Tailwind CSS with theme support (light/dark mode) — existing
- ✓ Radix UI component primitives — existing

## Current Milestone: v2.0 Network Tools & User Experience

**Goal:** Expand calculator suite with comprehensive network tools, add global search functionality, and achieve 100% translation coverage across all calculators.

**Target features:**

- Network calculator suite (4 new calculators with visual subnet calculator as flagship)
- Global search functionality across 200+ calculators
- Translation audit and compliance (eliminate hardcoded English strings)

### Active

<!-- v2.0 Network Tools & User Experience -->

**Network Calculators:**

- [ ] Visual Subnet Calculator (IPv4/IPv6) with comprehensive visualization — v2.0
  - [ ] Network diagram showing IP ranges and subnet structure
  - [ ] Binary representation of IP and subnet mask
  - [ ] Breakdown table (network address, broadcast, usable range, total hosts)
  - [ ] CIDR notation input (/24, /64)
  - [ ] Subnet mask input (255.255.255.0)
  - [ ] Subnetting calculator (divide network into smaller subnets)
  - [ ] Supernetting/aggregation (combine multiple networks)
- [ ] IP Address Calculator — v2.0
  - [ ] IP class detection (A, B, C, D, E)
  - [ ] Public/private IP check
  - [ ] IP range validation
- [ ] CIDR Range Calculator — v2.0
  - [ ] Calculate IP ranges from CIDR notation
  - [ ] Check if IP address is in CIDR range
- [ ] Network Speed/Latency Calculator — v2.0
  - [ ] Ping time conversions
  - [ ] Throughput calculations

**Search Functionality:**

- [ ] Global search across all calculators — v2.0
  - [ ] Search by calculator name
  - [ ] Search by category
  - [ ] Search by keywords
  - [ ] Real-time search results

**Translation Compliance:**

- [ ] Audit all 200+ calculators for hardcoded English strings — v2.0
- [ ] Move hardcoded strings to translation files (en, fr, de, it) — v2.0
- [ ] Verify 100% translation coverage across all locales — v2.0
- [ ] Test all calculators in all 4 locales — v2.0

### Out of Scope

- Adding new calculators to the collection — deferring calculator expansion to next phase
- UI/UX redesigns or visual updates — existing design works well
- Analytics or telemetry integration — privacy-focused, defer to future milestone
- Major performance optimizations (code splitting, lazy loading, virtualization) — defer to performance phase
- Error boundaries for calculators — good idea but not critical
- Test framework setup — important but separate phase
- Accessibility (a11y) rule fixes — important but separate phase
- Real-time collaboration features — massive complexity, not core value

## Context

### Current State (as of v1.0 - 2026-01-18)

**Shipped v1.0 Infrastructure Upgrade:**

Codebase: 59,381 LOC TypeScript
Tech stack: Next.js 16, React 19, TypeScript 5, Zustand 5, Biome 2.3
Deployment: GitHub Pages (static export)

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

_Last updated: 2026-01-18 after v2.0 milestone initialization_
