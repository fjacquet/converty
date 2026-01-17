# Requirements: Infrastructure Upgrade

**Version:** v1 (Infrastructure Phase)
**Last Updated:** 2026-01-17

## Overview

This document defines requirements for the infrastructure upgrade phase of Converty. Requirements are scoped to eliminate technical debt, establish type safety, add PWA support, and create complete documentation.

All requirements are **user-centric** (testable, specific, atomic) and mapped to phases in the roadmap via traceability section.

---

## v1 Requirements

### State Management

**Goal:** Consolidate state management pattern, eliminate dual implementation, fix debounce bug

- [ ] **STATE-01**: All 117 calculators migrated from useConverter to Zustand stores

  - _Success criteria:_ Every calculator component imports from `src/stores/`, zero imports from `src/hooks/use-converter.ts`

- [ ] **STATE-02**: useConverter hook removed entirely from codebase

  - _Success criteria:_ Files `src/hooks/use-converter.ts` and `src/hooks/use-url-state.ts` deleted, git history only

- [ ] **STATE-03**: Consolidated URL sync middleware (single implementation)

  - _Success criteria:_ File `src/lib/middleware/url-sync.ts` exists, all calculators use it, no duplicated URL sync logic

- [ ] **STATE-04**: Per-store debounce timers (fix global timer bug)

  - _Success criteria:_ Each Zustand store has own debounce timer via closure, no global debounce variables, concurrent calculators work correctly

- [ ] **STATE-05**: Functional approach - pure functions, no shared mutable state
  - _Success criteria:_ All calculation functions pure (no side effects), state updates immutable (Immer middleware), no global variables modified

### Type Safety

**Goal:** Enable strict TypeScript checking, eliminate any types, validate URL parameters

- [ ] **TYPE-01**: Enable noExplicitAny in Biome configuration

  - _Success criteria:_ `biome.json` has `"noExplicitAny": "error"`, Biome lint passes with zero warnings

- [ ] **TYPE-02**: Fix all explicit any types in useConverter hook

  - _Success criteria:_ `src/hooks/use-converter.ts` and `src/hooks/use-url-state.ts` have zero `any` types (or deleted entirely per STATE-02)

- [ ] **TYPE-03**: Fix all explicit any types in calculator stores

  - _Success criteria:_ All files in `src/stores/` have zero `any` types, proper generic types for Zustand stores

- [ ] **TYPE-04**: Fix all explicit any types in URL state parsing

  - _Success criteria:_ URL parameter parsing uses validated functions with fallbacks, no unsafe `Number(param)` coercion

- [ ] **TYPE-05**: Strict TypeScript checks passing with zero any types

  - _Success criteria:_ `npx tsc --noEmit` passes, `tsconfig.json` has `"strict": true` and all strict flags enabled, zero compiler errors

- [ ] **TYPE-06**: Type-safe URL parameter parsing with validation
  - _Success criteria:_ Helper functions like `parseNumberParam(value, fallback)` exist and are used consistently, no runtime errors from malformed URLs

### Dependencies

**Goal:** Upgrade outdated jsPDF, ensure deterministic builds, verify security

- [ ] **DEP-01**: Upgrade jsPDF from v4.0.0 to latest stable version

  - _Success criteria:_ `package.json` shows `jspdf@^2.5.2` or later, `npm list jspdf` confirms version

- [ ] **DEP-02**: Verify PDF export functionality after upgrade

  - _Success criteria:_ All calculators with PDF export tested (DoF table, charts), PDFs generate correctly, font rendering unchanged, file size reasonable

- [ ] **DEP-03**: Update jsPDF usage to match new API (if breaking changes)
  - _Success criteria:_ Code uses current jsPDF API (or compat mode if needed), no deprecated method calls, TypeScript types resolve correctly

### Progressive Web App

**Goal:** Enable offline calculator access, mobile install, improve mobile UX

- [ ] **PWA-01**: Service worker for offline calculator functionality

  - _Success criteria:_ File `public/service-worker.js` exists, registered in production, calculators work offline after first visit, network tab shows cache hits

- [ ] **PWA-02**: Web manifest for install prompt

  - _Success criteria:_ File `public/manifest.json` exists, linked in layout, install prompt appears on mobile, app installable to home screen

- [ ] **PWA-03**: Mobile-optimized responsive design (verify existing)

  - _Success criteria:_ All calculators tested on mobile viewport (375px width), inputs/buttons touch-friendly, no horizontal scroll, text readable

- [ ] **PWA-04**: Offline fallback UI when network unavailable
  - _Success criteria:_ Network disconnect shows appropriate UI, calculator functionality preserved offline, clear indication of offline status

### Documentation

**Goal:** Complete contributor documentation for development workflow and architecture

- [ ] **DOC-01**: CHANGELOG.md following Keep a Changelog format

  - _Success criteria:_ File `CHANGELOG.md` exists in root, follows Keep a Changelog standard, sections: Added/Changed/Fixed/Removed, Semantic Versioning linked

- [ ] **DOC-02**: Backfill recent changes (linting fixes, codebase mapping)

  - _Success criteria:_ CHANGELOG includes recent commits: duration converter, i18n fixes, registry split, 60-calculator migration, with dates and descriptions

- [ ] **DOC-03**: CONTRIBUTING.md with development workflow

  - _Success criteria:_ File `CONTRIBUTING.md` exists, sections: Development Setup, Coding Standards, Calculator Pattern (Zustand example), PR Process, Code Review Guidelines

- [ ] **DOC-04**: Development setup guide (prerequisites, commands)

  - _Success criteria:_ CONTRIBUTING.md or README has: Node.js version, npm install, npm run dev, build commands, type-check, lint commands - tested on fresh machine

- [ ] **DOC-05**: Architecture Decision Records (ADRs) for key decisions

  - _Success criteria:_ Directory `.planning/decisions/` exists with ADRs: 001-zustand-migration.md, 002-pwa-service-worker.md, 003-typescript-strict.md, 004-jspdf-upgrade.md - MADR format with Context/Decision/Alternatives/Consequences

- [ ] **DOC-06**: Document Zustand store pattern for future calculators
  - _Success criteria:_ CONTRIBUTING.md has "Adding a Calculator" section with: Zustand store creation, URL sync middleware usage, component pattern, working example code, links to real implementations

### Code Quality

**Goal:** Zero lint/format/security errors, follow KISS/DRY/functional principles

- [ ] **QUAL-01**: Zero Biome lint errors

  - _Success criteria:_ `npm run lint` passes with zero errors, zero warnings

- [ ] **QUAL-02**: Zero ESLint errors

  - _Success criteria:_ No ESLint errors if running alongside Biome (or Biome only if ESLint removed)

- [ ] **QUAL-03**: Zero format errors (Biome formatter)

  - _Success criteria:_ `npm run format` makes no changes (already formatted), consistent code style throughout

- [ ] **QUAL-04**: Zero security warnings (npm audit)

  - _Success criteria:_ `npm audit --production` shows zero vulnerabilities, any false positives documented in ADR

- [ ] **QUAL-05**: All code follows KISS principle (simple, readable)

  - _Success criteria:_ Code review confirms: no over-engineering, no premature abstraction, simple solutions preferred, readable without extensive comments

- [ ] **QUAL-06**: All code follows DRY principle (no duplication)

  - _Success criteria:_ Code review confirms: no duplicated logic, shared functions extracted, URL sync consolidated (not duplicated), reusable components used

- [ ] **QUAL-07**: Functional programming patterns (pure functions, immutability)
  - _Success criteria:_ Code review confirms: calculation functions pure (no side effects), state updates immutable (Immer), no shared mutable state, no global variables modified

---

## v2 Requirements (Deferred)

### Performance Optimization

- **PERF-01**: Code splitting by calculator category

  - _Reason deferred:_ Beyond critical debounce fix, defer to separate performance phase

- **PERF-02**: Lazy loading of calculator components

  - _Reason deferred:_ Not critical for infrastructure phase

- **PERF-03**: Virtualization for large result tables
  - _Reason deferred:_ Address only if performance becomes issue

### Testing Infrastructure

- **TEST-01**: Vitest test framework setup

  - _Reason deferred:_ Separate testing phase

- **TEST-02**: Unit tests for calculator logic

  - _Reason deferred:_ Separate testing phase

- **TEST-03**: Integration tests for state management
  - _Reason deferred:_ Separate testing phase

### Accessibility

- **A11Y-01**: Enable Biome a11y linting rules

  - _Reason deferred:_ Separate accessibility phase

- **A11Y-02**: Keyboard navigation for all calculators

  - _Reason deferred:_ Separate accessibility phase

- **A11Y-03**: Screen reader support
  - _Reason deferred:_ Separate accessibility phase

### Enhanced PWA Features

- **PWA-05**: Calculation history (saved locally)

  - _Reason deferred:_ Not critical for infrastructure phase

- **PWA-06**: Share results via social media/messaging

  - _Reason deferred:_ URL state already enables sharing

- **PWA-07**: Background sync for offline calculations
  - _Reason deferred:_ No server-side component for sync

### Runtime Type Validation

- **TYPE-07**: Zod schemas for calculator inputs

  - _Reason deferred:_ TypeScript compile-time checks sufficient for now

- **TYPE-08**: Runtime validation for URL parameters
  - _Reason deferred:_ Validated parsing functions sufficient (TYPE-06)

### Automated Tooling

- **TOOL-01**: Dependabot or Renovate for dependency updates

  - _Reason deferred:_ Manual review preferred for now

- **TOOL-02**: GitHub Actions for automated CHANGELOG generation

  - _Reason deferred:_ Manual backfill first, automate later

- **TOOL-03**: Zustand DevTools integration
  - _Reason deferred:_ Nice for development but not critical

---

## Out of Scope

Explicitly excluded from infrastructure upgrade:

### New Features

- **Adding new calculators to the collection** — deferring calculator expansion to next phase (focus on infrastructure first)
- **Calculation history** — not critical for infrastructure phase
- **Share results to social media** — URL state already enables sharing via links
- **Real-time collaboration** — massive complexity, not core value
- **Analytics/telemetry integration** — privacy-focused, defer to future milestone

### UI/UX Changes

- **UI/UX redesigns or visual updates** — existing design works, focus on infrastructure
- **Component library migration** — Radix UI working well
- **Design system overhaul** — not needed
- **Accessibility overhaul** — important but separate phase

### Architecture Changes

- **Server-Side Rendering (SSR)** — static export constraint, architecture decision
- **External API calls** — calculators are pure client-side by design
- **Database integration** — static site architecture
- **Backend services** — static export constraint

### Performance (Beyond Critical Fix)

- **Code splitting** — defer to performance phase
- **Lazy loading** — defer to performance phase
- **Virtualization** — defer to performance phase
- **Bundle size optimization** — not critical now
- **Image optimization** — separate phase

### Quality Assurance

- **Test framework setup** — important but separate phase
- **End-to-end testing** — separate testing phase
- **Visual regression testing** — separate phase

---

## Traceability

**Requirements → Phases Mapping**

| Requirement ID | Phase   | Plan(s) | Status   |
| -------------- | ------- | ------- | -------- |
| TYPE-01        | Phase 1 | 01-02   | Complete |
| TYPE-02        | Phase 1 | 01-03   | Complete |
| TYPE-03        | Phase 1 | 01-03   | Complete |
| TYPE-04        | Phase 1 | 01-03   | Complete |
| TYPE-05        | Phase 1 | 01-02   | Complete |
| TYPE-06        | Phase 1 | 01-01   | Complete |
| STATE-03       | Phase 2 | 02-01   | Complete |
| STATE-04       | Phase 2 | 02-01   | Complete |
| STATE-01       | Phase 3 | 03-01   | Complete |
| STATE-02       | Phase 3 | 03-01   | Complete |
| STATE-05       | Phase 3 | 03-01   | Complete |
| PWA-01         | Phase 4 | 04-02   | Complete |
| PWA-02         | Phase 4 | 04-01   | Complete |
| PWA-03         | Phase 4 | 04-04   | Complete |
| PWA-04         | Phase 4 | 04-02   | Complete |
| DOC-01         | Phase 5 | 05-01   | Complete |
| DOC-02         | Phase 5 | 05-01   | Complete |
| DOC-03         | Phase 5 | 05-03   | Complete |
| DOC-04         | Phase 5 | 05-03   | Complete |
| DOC-05         | Phase 5 | 05-02   | Complete |
| DOC-06         | Phase 5 | 05-03   | Complete |
| DEP-01         | Phase 6 | TBD     | Pending |
| DEP-02         | Phase 6 | TBD     | Pending |
| DEP-03         | Phase 6 | TBD     | Pending |
| QUAL-01        | Phase 7 | TBD     | Pending |
| QUAL-02        | Phase 7 | TBD     | Pending |
| QUAL-03        | Phase 7 | TBD     | Pending |
| QUAL-04        | Phase 7 | TBD     | Pending |
| QUAL-05        | Phase 7 | TBD     | Pending |
| QUAL-06        | Phase 7 | TBD     | Pending |
| QUAL-07        | Phase 7 | TBD     | Pending |

**Coverage:** 32/32 v1 requirements mapped (100%)

---

## Success Criteria

**Infrastructure upgrade is complete when:**

✅ All v1 requirements checked (32 requirements)
✅ All 117 calculators using Zustand stores
✅ useConverter hook deleted from codebase
✅ URL sync middleware consolidated
✅ Per-store debounce timers (global timer bug fixed)
✅ TypeScript strict mode enabled with zero any types
✅ Zero Biome lint errors
✅ Zero security warnings (`npm audit --production`)
✅ PWA service worker registered and working offline
✅ Web manifest for install prompt
✅ CHANGELOG.md with backfilled changes
✅ CONTRIBUTING.md with calculator pattern
✅ Development setup guide tested on fresh machine
✅ ADRs for key decisions (migration, PWA, TypeScript, jsPDF)
✅ jsPDF upgraded with PDF export verified
✅ All 200+ calculators working exactly as before
✅ Static export preserved (no server-side features)

---

_Requirements approved: 2026-01-17_
_Roadmap created: 2026-01-17_
