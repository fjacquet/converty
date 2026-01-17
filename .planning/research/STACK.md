# Stack Research: Infrastructure Upgrade

**Research Date:** 2026-01-17
**Focus:** Technologies for PWA, state management, type safety, and documentation

## PWA Implementation

### Recommended: Manual Service Worker (No Dependencies)

**Status:** ✓ Recommended
**Confidence:** High

**Choice:** Custom service worker implementation using Workbox strategies

**Rationale:**

- `next-pwa` package is deprecated ([shadowwalker/next-pwa](https://github.com/shadowwalker/next-pwa))
- Next.js 16 uses Turbopack by default, but Serwist requires Webpack
- Manual implementation with no extra packages provides full control ([Next.js PWA offline capability](https://adropincalm.com/blog/nextjs-offline-service-worker/))
- Compatible with static export (`output: 'export'`)
- Service worker placed in public folder, enabled in production only

**Implementation:**

```typescript
// public/service-worker.ts
// Custom service worker with Workbox runtime strategies
// - CacheFirst for static assets
// - NetworkFirst for calculators (offline fallback)
// - No precaching (not needed for static export)
```

**What NOT to use:**

- ❌ `next-pwa` - Deprecated package
- ❌ `Serwist` - Requires Webpack, conflicts with Turbopack
- ❌ Server-based PWA solutions - Not compatible with static export

**References:**

- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Build Next.js 16 PWA with offline support - LogRocket](https://blog.logrocket.com/nextjs-16-pwa-offline-support)
- [Next.js PWA in 10 Minutes](https://www.buildwithmatija.com/blog/turn-nextjs-16-app-into-pwa)

### Web App Manifest

**Package:** None (manual manifest.json)
**Confidence:** High

**Requirements:**

```json
{
  "name": "Converty",
  "short_name": "Converty",
  "description": "200+ calculators and converters",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Constraints:**

- HTTPS required (localhost exception for dev)
- Must register service worker with fetch event
- Static export compatible

---

## State Management

### Zustand v5.0.10 (Current)

**Status:** ✓ Already installed
**Confidence:** High

**Middleware Stack:**

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Recommended pattern: persist + immer combined
const useStore = create(
  persist(
    immer((set) => ({
      // state and actions with direct mutations
    })),
    { name: "calculator-storage" }
  )
);
```

**URL Persistence Pattern:**

- Custom middleware for URL parameter sync
- Per-store debounce timer (fix global timer bug)
- Functional approach - no shared mutable state

**Implementation:**

```typescript
// src/lib/middleware/url-sync.ts
export const urlSync = <T>(config) => (set, get, api) => {
  let debounceTimer: NodeJS.Timeout | null = null; // Per-store instance

  // Subscribe to state changes
  api.subscribe((state) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Update URL params
    }, 500); // Increased from 150ms
  });

  return config(set, get, api);
};
```

**What to migrate:**

- 74 calculators from `useConverter` hook to Zustand stores
- Consolidate URL sync logic (currently duplicated)
- Remove global debounce timer

**References:**

- [Zustand Middleware Documentation](https://github.com/pmndrs/zustand/blob/main/docs/middlewares/persist.md)
- [Zustand URL Persistence Example](https://github.com/pmndrs/zustand/blob/main/docs/middlewares/persist.md#custom-storage)

---

## Type Safety

### TypeScript 5.9.3 Strict Mode

**Current:** noExplicitAny disabled
**Target:** Full strict mode enabled
**Confidence:** High

**Migration Strategy:**

```json
// tsconfig.json - Enable incrementally
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**Approach:**

1. Enable `noImplicitAny` first (catches most issues)
2. Fix type errors file-by-file
3. Enable other strict flags incrementally
4. Use TypeScript 6.0 defaults (strict on by default)

**Key Areas Needing Fixes:**

- URL state parsing (type coercion from strings)
- Calculator store generics
- useConverter hook (has eslint-disable comments)
- Event handlers with proper types

**Tools:**

- VS Code built-in TypeScript diagnostics
- `npx tsc --noEmit` for full type checking
- Biome linter with noExplicitAny enabled

**References:**

- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [TypeScript Strict Option Guide](https://betterstack.com/community/guides/scaling-nodejs/typescript-strict-option/)
- [Incremental Migration Guide](https://kevinwil.de/incremental-migration/)
- [Migrating to Strict Mode](https://alanharper.com.au/posts/2021-02-15-migrating-typescript-strict)

---

## PDF Generation

### jsPDF Latest (v2.5.2)

**Current:** v4.0.0 (2018 - 6 years old!)
**Target:** v2.5.2 (latest stable)
**Confidence:** Medium (breaking changes expected)

**Migration Notes:**

- Major version rollback (v4 → v2) indicates significant API changes
- Need to update `src/lib/utils/pdf-export.ts`
- Test PDF generation thoroughly after upgrade

**API Changes:**

- Version 2.x has different API than v4.0.0
- Check compatibility mode: `doc.compatAPI()` for backward compatibility
- Advanced API mode: `doc.advancedAPI()` for new features

**Implementation:**

```typescript
// Upgrade command
npm install jspdf@latest

// Test PDF export for all affected calculators
// Update API calls if needed
```

**What to verify:**

- DoF table PDF export still works
- Chart PDF exports still work
- Font rendering unchanged
- File size reasonable

**References:**

- [jsPDF GitHub](https://github.com/parallax/jspdf)
- [jsPDF Documentation](https://github.com/parallax/jspdf/blob/master/docs/jsPDF.html)

---

## Documentation Tooling

### CHANGELOG Generation

**Recommended:** `git-cliff` + Keep a Changelog format
**Confidence:** High

**Stack:**

```bash
# Install git-cliff (Rust-based, fast)
npm install --save-dev git-cliff

# Or use conventional-changelog (Node-based)
npm install --save-dev conventional-changelog-cli
```

**Format:** [Keep a Changelog](https://keepachangelog.com/) standard

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Feature description

### Changed

- Change description

### Fixed

- Bug fix description

## [1.0.0] - 2026-01-17

...
```

**Automation:**

- GitHub Action for automatic changelog generation
- Conventional Commits integration
- Backfill recent changes manually first

**References:**

- [git-cliff](https://git-cliff.org/)
- [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Automate CHANGELOGs](https://dev.to/devsatasurion/automate-changelogs-to-ease-your-release-282)

### Contributing Guidelines

**Template:** GitHub's CONTRIBUTING.md standard
**Confidence:** High

```markdown
# Contributing to Converty

## Development Setup

## Coding Standards

## Calculator Pattern

## Pull Request Process

## Code Review Guidelines
```

### Architecture Decision Records (ADRs)

**Format:** Markdown ADRs in `.planning/decisions/`
**Template:** [MADR](https://adr.github.io/madr/)

```markdown
# ADR-001: Migrate to Zustand State Management

## Status

Accepted

## Context

74 calculators use legacy useConverter hook with global debounce timer bug.

## Decision

Migrate all calculators to Zustand stores with per-store debounce.

## Consequences

- Consolidated state management pattern
- Fixes concurrent calculator bug
- Removes technical debt
```

---

## Linting & Formatting

### Biome v2.3.11 (Current)

**Status:** ✓ Already configured
**Updates needed:**

```json
// biome.json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error" // Enable strict type checking
      },
      "a11y": {
        "useKeyWithClickEvents": "warn", // Enable a11y (future)
        "useButtonType": "warn"
      }
    }
  }
}
```

---

## Summary

| Technology        | Current  | Target        | Migration Complexity |
| ----------------- | -------- | ------------- | -------------------- |
| PWA               | None     | Custom SW     | Medium               |
| Zustand           | 5.0.10   | 5.0.10 (keep) | Low                  |
| TypeScript Strict | Disabled | Enabled       | High                 |
| jsPDF             | 4.0.0    | 2.5.2         | Medium               |
| Changelog         | None     | git-cliff     | Low                  |
| Documentation     | Minimal  | Complete      | Medium               |

**Critical Path:**

1. TypeScript strict mode (blocks everything else)
2. State management migration (touches all calculators)
3. PWA implementation (new feature)
4. Documentation (parallel to development)
5. jsPDF upgrade (isolated change)

**Estimated Effort:**

- TypeScript: 40 hours (74 calculators + shared code)
- State migration: 30 hours (consolidate + migrate)
- PWA: 10 hours (service worker + manifest)
- Documentation: 15 hours (CHANGELOG + CONTRIBUTING + ADRs)
- jsPDF: 5 hours (upgrade + test)
- **Total: ~100 hours**
