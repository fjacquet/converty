# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Network category page 404 error - missing `src/app/[locale]/network/page.tsx` now created
- Broken documentation references in CLAUDE.md and CONTRIBUTING.md
- Outdated calculator counts and categories in README.md (60 → 156 calculators, 9 → 12 categories)

## [2.0.0] - 2026-01-22

### Added

- Network calculator suite with comprehensive visualization
  - Visual Subnet Calculator with IPv4/IPv6 support
    - Network diagram showing IP ranges and subnet structure
    - Binary representation with color-coded bits (blue=network, green=host)
    - Breakdown table (network address, broadcast, usable range, total hosts)
    - CIDR notation input (/24, /64) and subnet mask input (255.255.255.0)
    - Subnetting: divide network into smaller subnets
    - Supernetting: combine multiple networks into larger CIDR blocks
    - BigInt support for IPv6 host calculations
    - RFC 3021 compliance for /31 point-to-point subnets
  - IP Address Calculator (`src/app/[locale]/network/ip-address/`)
    - IP class detection (A, B, C, D, E)
    - Public/private IP classification
    - IP format and range validation
  - CIDR Range Calculator (`src/app/[locale]/network/cidr-range/`)
    - Calculate IP ranges from CIDR notation
    - Check if specific IP is within CIDR range
    - Visual indicators with color-coded cards
  - Network Speed/Latency Calculator
    - Latency converter with nanosecond precision
    - Throughput calculator (data size/time to bandwidth)
    - Smart value formatting based on magnitude
- Global search functionality accessible from all pages
  - Cmd+K (Mac) / Ctrl+K (Windows) keyboard shortcut
  - Fuzzy search with Fuse.js (~5KB gzipped)
  - Pre-built search indexes per locale (build-time JSON generation)
  - Real-time results with useDeferredValue
  - cmdk for Command palette UI
  - Weighted fuzzy matching (name 0.4, keywords 0.3, description 0.2, category 0.1)
  - GlobalSearch component (`src/components/search/global-search.tsx`)
- Network category in calculator registry (`src/lib/registry/network-converters.ts`)
  - Subnet/IP subcategories for organization
  - ipaddr.js dependency for IP address manipulation (55M+ weekly downloads)
- Dialog component (`src/components/ui/dialog.tsx`) using @radix-ui/react-dialog
- 300+ translation keys across all 4 locales (en, fr, de, it)
  - Photo calculator namespaces (dof, optics, nd-filter, macro, timelapse, astro)
  - Video calculator namespace
  - Network calculator namespace
  - Search UI translations

### Changed

- Simplified calculator names by removing "Calculator" suffix/prefix across all locales
  - English: Removed " Calculator" suffix (133 instances)
  - French: Removed "Calculateur de/d'/du " and "Calculatrice de " prefixes
  - German: Removed "-Rechner", "rechner", " Rechner" suffixes (112 instances)
  - Italian: Removed "Calcolatore di/Calcolatore " and "Calcolatrice di " prefixes (135 instances)
  - Improves readability and reduces visual fatigue when browsing calculator list
- Search button added to header (sm+ screens)
- Build script now includes prebuild step for search index generation

### Fixed

- All 156 registered calculators now fully internationalized
  - Zero hardcoded English strings in calculator components
  - All calculators verified working in EN, FR, DE, IT locales
  - Photo calculators: advanced-dof, dof-table, hyperfocal, circle-of-confusion, diffraction, focal-equivalent, macro-dof, macro-diffraction, nd-filter, spot-stars, star-trails, time-lapse
  - Video calculators: common-bitrates, frame-rate (fixed namespace from calculator.photo.video to calculator.video)
  - Missing translation keys in fr.json and de.json for calculator.video namespace

## [1.0.0] - 2026-01-18

### Added

- Progressive Web App support with offline capability
  - PWA manifest with icons (192x192, 512x512, maskable, apple-touch-icon)
  - Service worker with Workbox caching strategies
  - NetworkFirst strategy for HTML/documents (7-day cache fallback)
  - CacheFirst strategy for static assets
  - StaleWhileRevalidate strategy for fonts
  - Production-only service worker registration
  - Offline detection UI with banner providing real-time feedback
  - Install prompt component with iOS/Android platform detection
  - Build integration generating precache manifest (838 files)
- Zustand-based state management with URL synchronization
  - `createCalculatorStore` factory for type-safe calculator state
  - URL sync middleware with per-store debounce timers (150ms default)
  - Closure-based timer isolation preventing conflicts between calculators
  - Support for nested state selection via `selectState` option
- Type-safe URL parameter parsing helpers (`src/lib/utils/url-params.ts`)
  - `parseStringParam` with fallback support
  - `parseNumberParam` with Number.isNaN() strict validation
  - `parseBooleanParam` accepting only "true" and "1"
  - Empty string triggers fallback (same as null)
- Biome noExplicitAny enforcement at error level
- TypeScript strict mode with comprehensive flags documented inline
- Translation keys for all calculator results and labels
  - `calculator.results.result` key for 117 calculators
  - Zodiac sign translations in age calculator (all 4 locales)
  - Health calculator translations (sleep, body type, ovulation, pregnancy, period)
  - Finance calculator translations (salary, quadratic)
  - Utilities translations (time, bitrate, SEO analyzer)
- Pre-commit automation for code quality enforcement
  - Husky v9.1.7 for Git hooks management with modern API
  - lint-staged v16.2.7 for running Biome checks on staged files only
  - `.lintstagedrc.json` configuration for auto-fix on commit
  - Automatic hook setup on `npm install` via prepare script
  - Fast feedback loop (under 5 seconds for typical commits)
- Container security scan suppression for false positives
  - `.trivyignore` documenting AVD-DS-0002 and AVD-DS-0017 findings
  - Dockerfile in node_modules never executed (static site deployment)
  - 6-month review cycle with expiration dates
- Consolidated URL parameter utilities (`getUrlParams` function)
  - Extracted to `src/lib/utils/url-params.ts` shared module
  - Eliminated duplication across calculator-store.ts and url-sync.ts
  - Server-side rendering safe (returns empty object when window undefined)

### Changed

- Migrated all 117 calculators from `useConverter` hook to Zustand stores
- Replaced useState pattern with Zustand `createCalculatorStore` factory
- Enabled TypeScript strict mode across entire codebase
  - `noImplicitAny: true`
  - `strictNullChecks: true`
  - `strictFunctionTypes: true`
  - `strictBindCallApply: true`
  - `strictPropertyInitialization: true`
  - `noImplicitThis: true`
  - `alwaysStrict: true`
- URL sync now uses `replaceState` instead of `pushState` (avoids flooding browser history)
- Service worker registration moved to client component (`src/app/[locale]/sw-registration.tsx`)
- PWA manifest migrated from static `manifest.json` to Next.js App Router `manifest.ts` for type safety

### Fixed

- TypeScript strict mode violations in state management layer
  - Zero compilation errors in hooks, stores, URL parsing
  - Zero explicit `any` types in state management
- URL parameter parsing edge cases
  - Empty string handling (now triggers fallback)
  - NaN detection using strict `Number.isNaN()` instead of global `isNaN()`
  - Boolean parsing ambiguity (now requires explicit "true" or "1")
- Global debounce timer conflicts between multiple calculator instances
  - Replaced with per-store closure-based timers
  - Each store now has isolated timer preventing interference
- Missing translation keys affecting 5+ calculators
  - Age calculator zodiac signs (now properly localized in en, fr, de, it)
  - Sleep calculator sleep quality levels
  - Body type calculator categories
  - Heart rate calculator zone names and descriptions
  - BMI calculator category labels
  - Body fat calculator category labels
  - BAC calculator status and effects
  - Calories burned activity names
- Hard-coded English labels in health calculators (now fully internationalized)
- Service worker scope issues with locale routes (now uses root scope `/`)

### Removed

- Legacy `useConverter` hook (`src/hooks/use-converter.ts` - 2.3 KB)
  - Replaced by Zustand `createCalculatorStore` factory
  - Breaking change: calculators must migrate to new pattern
- Legacy `useUrlState` hook (`src/hooks/use-url-state.ts` - 1.8 KB)
  - Replaced by URL sync middleware
  - URL synchronization now automatic via middleware
- Duplicate URL sync logic across calculator stores (49 lines removed from `calculator-store.ts`)
- Explicit `any` types in state management layer
  - Replaced with proper TypeScript types or `unknown` with type guards
- Duplicate `getUrlParams` functions across calculator-store.ts and url-sync.ts
  - 12 lines of code duplication eliminated
  - Consolidated to single source of truth in url-params.ts

### Security

- Container security false positives suppressed (AVD-DS-0002, AVD-DS-0017)
  - Trivy findings for Dockerfile in @surma/rollup-plugin-off-main-thread (node_modules)
  - Documented in .trivyignore with rationale and review dates
  - No impact: Dockerfile never executed (static site, no Docker usage)
- jsPDF security verified (v4.0.0 is current as of January 2025)

### Deprecated

- None

[unreleased]: https://github.com/fjacquet/converty/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/fjacquet/converty/releases/tag/v1.0.0
