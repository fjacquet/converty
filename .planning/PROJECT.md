# Converty Infrastructure Upgrade

## What This Is

A comprehensive infrastructure improvement phase for Converty, a calculator platform with 200+ tools. This phase eliminates technical debt in state management, establishes strict type safety, upgrades critical dependencies, adds PWA support, and creates complete documentation for contributors.

## Core Value

A solid, maintainable foundation with zero technical debt in state management and type safety, enabling confident future development.

## Requirements

### Validated

<!-- Existing capabilities from the codebase -->

- ✓ 200+ calculators across 11 categories (Math, Finance, Health, Photo, Video, Web, Data, DateTime, Physics, Music, Color) — existing
- ✓ Next.js 16 App Router with static export to GitHub Pages — existing
- ✓ Internationalization support (4 locales: en, fr, de, it) — existing
- ✓ URL state persistence for shareable calculator links — existing
- ✓ Client-side calculations (no server dependencies) — existing
- ✓ Biome linting and ESLint configuration — existing
- ✓ Tailwind CSS with theme support (light/dark mode) — existing
- ✓ Radix UI component primitives — existing

### Active

<!-- Current scope - infrastructure improvements -->

#### State Management
- [ ] **STATE-01**: All 74 calculators migrated from useConverter to Zustand stores
- [ ] **STATE-02**: useConverter hook removed entirely from codebase
- [ ] **STATE-03**: Consolidated URL sync middleware (single implementation)
- [ ] **STATE-04**: Per-store debounce timers (fix global timer bug)
- [ ] **STATE-05**: Functional approach - pure functions, no shared mutable state

#### Type Safety
- [ ] **TYPE-01**: Enable noExplicitAny in Biome configuration
- [ ] **TYPE-02**: Fix all explicit any types in useConverter hook
- [ ] **TYPE-03**: Fix all explicit any types in calculator stores
- [ ] **TYPE-04**: Fix all explicit any types in URL state parsing
- [ ] **TYPE-05**: Strict TypeScript checks passing with zero any types
- [ ] **TYPE-06**: Type-safe URL parameter parsing with validation

#### Dependencies
- [ ] **DEP-01**: Upgrade jsPDF from v4.0.0 to latest stable version
- [ ] **DEP-02**: Verify PDF export functionality after upgrade
- [ ] **DEP-03**: Update jsPDF usage to match new API (if breaking changes)

#### Progressive Web App
- [ ] **PWA-01**: Service worker for offline calculator functionality
- [ ] **PWA-02**: Web manifest for install prompt
- [ ] **PWA-03**: Mobile-optimized responsive design (verify existing)
- [ ] **PWA-04**: Offline fallback UI when network unavailable

#### Documentation
- [ ] **DOC-01**: CHANGELOG.md following Keep a Changelog format
- [ ] **DOC-02**: Backfill recent changes (linting fixes, codebase mapping)
- [ ] **DOC-03**: CONTRIBUTING.md with development workflow
- [ ] **DOC-04**: Development setup guide (prerequisites, commands)
- [ ] **DOC-05**: Architecture Decision Records (ADRs) for key decisions
- [ ] **DOC-06**: Document Zustand store pattern for future calculators

#### Code Quality
- [ ] **QUAL-01**: Zero Biome lint errors
- [ ] **QUAL-02**: Zero ESLint errors
- [ ] **QUAL-03**: Zero format errors (Biome formatter)
- [ ] **QUAL-04**: Zero security warnings (npm audit)
- [ ] **QUAL-05**: All code follows KISS principle (simple, readable)
- [ ] **QUAL-06**: All code follows DRY principle (no duplication)
- [ ] **QUAL-07**: Functional programming patterns (pure functions, immutability)

### Out of Scope

- Adding new calculators to the collection — deferring calculator expansion to next phase
- UI/UX redesigns or visual updates — existing design works, focus on infrastructure
- Analytics or telemetry integration — privacy-focused, defer to future milestone
- Major performance optimizations (code splitting, lazy loading, virtualization) — beyond critical debounce fix, defer to performance phase
- Error boundaries for calculators — good idea but not critical for infrastructure phase
- Test framework setup — important but separate phase
- Accessibility (a11y) rule fixes — important but separate phase

## Context

### Current State

The Converty codebase has grown to 200+ calculators with some technical debt accumulated:

**State Management:**
- 74 calculators still use legacy useConverter hook
- Dual patterns create inconsistency and maintenance burden
- Global debounce timer causes conflicts when multiple calculators on same page
- URL sync logic duplicated between useConverter and Zustand stores

**Type Safety:**
- noExplicitAny disabled in Biome configuration
- Multiple any types in state management code
- URL state parsing uses unsafe type coercion
- Reduced type safety increases runtime error risk

**Dependencies:**
- jsPDF v4.0.0 from 2018 (6+ years old, potential security issues)
- Current stable is v2.x series (major version rollback indicates breaking changes)

**Documentation:**
- No CHANGELOG to track project evolution
- No contributing guidelines for new developers
- Architecture decisions not documented
- Development setup requires reverse-engineering from code

### Technical Environment

- Next.js 16.1.1 with App Router and static export
- React 19.2.3 (cutting edge)
- TypeScript 5.9.3 with strict mode
- Zustand 5.0.10 for state management
- Biome 2.3.11 for linting/formatting
- Deployed to GitHub Pages (static hosting)

### Known Issues

From `.planning/codebase/CONCERNS.md`:
- Shared global debounce timeout variable
- URL sync behavioral inconsistency between old/new calculators
- Type safety weaknesses with disabled linting rules
- Outdated jsPDF dependency with potential vulnerabilities
- Missing critical documentation for contributors

## Constraints

- **Static Export**: Must maintain `output: "export"` in Next.js config - no server-side features
- **GitHub Pages**: Deployment must remain static file hosting compatible
- **Existing Functionality**: All 200+ calculators must continue working exactly as before
- **i18n**: Must preserve internationalization across all 4 locales (en, fr, de, it)
- **URL Sharing**: Must maintain shareable calculator links with state in URL
- **Zero Downtime**: Changes deployed incrementally, no breaking changes to users
- **Functional Principles**: KISS (Keep It Simple, Stupid), DRY (Don't Repeat Yourself), functional programming

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Big bang migration (all 74 calculators at once) | Eliminates dual patterns faster, prevents partial migration drag | — Pending |
| Remove useConverter entirely (no backward compatibility) | Clean break, no legacy maintenance burden, forces best practices | — Pending |
| Per-store debounce timers (not global) | Fixes concurrent calculator bug, proper encapsulation | — Pending |
| Consolidated URL sync middleware | DRY principle, single source of truth, consistent behavior | — Pending |
| Functional programming approach | Pure functions, no shared mutable state, easier testing | — Pending |
| Keep a Changelog format | Industry standard, user-friendly, clear conventions | — Pending |
| PWA with service worker | Offline calculator access, mobile install, better UX | — Pending |
| Strict TypeScript (zero any types) | Type safety prevents runtime errors, better developer experience | — Pending |

---
*Last updated: 2026-01-17 after initialization*
