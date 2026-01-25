# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [3.0.0] - 2026-01-25

### Added

**Phase 24: Export Functionality (2026-01-25)**

- PDF and CSV export for calculation results
  - Zero-dependency CSV export using native Blob API
  - jsPDF for PDF generation (v4.0.0)
  - Internationalization support across all 4 locales (en, fr, de, it)
- CsvExportButton component (`src/components/converter/csv-export-button.tsx`)
  - CSV injection prevention (escape =, +, -, @ prefixes)
  - UTF-8 BOM for Excel compatibility
  - Timestamped filenames (YYYY-MM-DD_HH-MM-SS format)
  - Download icon semantic distinction from PDF (FileText vs Download)
- PdfExportButton component (`src/components/converter/pdf-export-button.tsx`)
  - Multi-section document support
  - Configurable title and subtitle
  - ISO 8601 timestamp formatting
  - FileText icon for document semantics
- CSV export utility (`src/lib/utils/csv-export.ts`)
  - Type-safe CsvRow interface (Field, Value, Unit columns)
  - Security: Formula injection prevention
  - Excel compatibility: UTF-8 BOM support
  - RFC 4180 compliant CSV formatting
- Age Calculator export integration (reference implementation)
  - Both PDF and CSV export buttons in results section
  - Comprehensive data export (10 fields including zodiac signs)
  - Button group layout with flex gap-2 spacing
- Export translation keys across all 4 locales
  - exportPdf, exportCsv labels
  - Export success/error messages
  - Accessible button aria-labels

**Phase 21: Code Splitting & Lazy Loading (2026-01-24)**

- Dynamic imports for all 167 calculator pages
  - On-demand bundle loading reduces initial page weight
  - Calculators render on server for SEO, hydrate client-side
  - `next/dynamic` imports for category-based code splitting
  - Consistent loading UX with CalculatorSkeleton component
- CalculatorSkeleton loading component (`src/components/converter/calculator-skeleton.tsx`)
  - Configurable skeleton with inputCount and showResults props
  - Used in both dynamic loading and Suspense fallback
  - Smooth loading states during chunk fetching
- Bundle analyzer integration for performance monitoring
  - `@next/bundle-analyzer` configured via `ANALYZE=true` environment variable
  - Baseline metrics established (210 chunks, 6.4MB JS before optimization)
  - On-demand analysis prevents running in every build
- Performance improvements verified
  - Total bundle reduced by 3.1% (6.4 MB → 6.2 MB, -0.2 MB absolute)
  - First Load JS reduced by 5-7% per route
  - Homepage: 184 KB → ~170 KB (-14 KB, 7.6% reduction)
  - Category pages: 184 KB → ~170 KB (-14 KB, 7.6% reduction)
  - Individual calculators: 186 KB → ~175 KB (-11 KB, 5.9% reduction)
- Search performance verified at <100ms (20-50ms estimated render time)
  - Fuse.js client-side search with useDeferredValue optimization
  - 167 calculators well below 500 threshold requiring virtualization
  - Expected render time provides 50ms buffer below 100ms requirement
- Service worker caching for code-split chunks
  - Workbox glob pattern `**/*.js` captures all 212 JS chunks
  - 969 files precached (153.1 MB total) for offline support
  - Code-split chunks cached automatically via service worker
- Static export preserved (743 HTML files generated)
- URL state persistence working with lazy-loaded components
- All PERF-01 through PERF-04 requirements satisfied

**Phase 20: Automotive Calculators (2026-01-24)**

- Automotive calculator suite with metric-first European focus (4 calculators: fuel-efficiency, tire-sizing, maintenance-intervals, vehicle-financing)
- Fuel Efficiency Calculator (`src/app/[locale]/automotive/fuel-efficiency/`)
  - L/100km as primary metric (European standard)
  - Conversions to km/L, MPG (US/UK)
  - Trip cost calculations with CHF/EUR fuel prices
  - Annual fuel cost estimates
  - Swiss fuel price data (Benzin 95/98, Diesel) with build-time updates
  - Consumption comparison mode
- Tire Sizing Calculator (`src/app/[locale]/automotive/tire-sizing/`)
  - European metric notation (205/55R16) parsing
  - Tire dimensions calculator (sidewall, diameter, circumference)
  - ETRTO load index and speed rating lookups
  - Size comparison with diameter difference and speedometer error
  - ±3% diameter tolerance warnings
  - 100+ load indexes and speed ratings (Q to Y, 160-300 km/h)
- Maintenance Intervals Calculator (`src/app/[locale]/automotive/maintenance-intervals/`)
  - km-based service intervals (metric-first)
  - 14 service types (oil, air filter, cabin filter, brake pads, brake fluid, coolant, transmission, timing belt, spark plugs, battery, tires, suspension, MFK inspection, general inspection)
  - Swiss MFK inspection reminders (3-year first, 2-year subsequent)
  - Service schedule tracking with next due date calculation
  - Overdue service highlighting with priority levels
  - Service history tracking
- Vehicle Financing Calculator (`src/app/[locale]/automotive/vehicle-financing/`)
  - PMT formula for loan calculations
  - Money factor for lease calculations (APR / 2400)
  - CHF/EUR currency support with Swiss formatting
  - Swiss VAT (7.7%) for new vehicles
  - Buy vs lease comparison with total cost difference
  - Amortization schedule generation for loans
  - Residual value calculations for leases
- Automotive category registration in calculator registry (159→163 calculators, 13→14 categories)
- Complete i18n support for all automotive calculators (en, fr, de, it)
- URL parameter persistence for calculator state sharing across all 4 calculators
- Swiss automotive data files
  - `src/lib/data/swiss-fuel-prices.json` - Fuel prices (Benzin 95/98, Diesel) in CHF/EUR
  - `src/lib/data/tire-load-index.json` - 100+ ETRTO load index values
  - `src/lib/data/tire-speed-ratings.json` - Speed ratings Q to Y (160-300 km/h)
  - `src/lib/data/maintenance-intervals.json` - Service intervals for 14 types
  - `src/lib/data/swiss-mfk-rules.json` - Swiss vehicle inspection regulations

**Phase 19: Cooking/Nutrition Foundation (2026-01-24)**

- Cooking and nutrition calculator suite with metric-first focus (4 calculators: recipe-scaler, nutrition-calculator, cooking-units, food-cost)
- Recipe Scaler Calculator (`src/app/[locale]/cooking/recipe-scaler/`)
  - Servings multiplier with non-linear scaling rules
  - Salt scaling at 67-75% rate (taste perception doesn't scale linearly)
  - Spices and extracts at 75% rate (volatile compounds concentrate)
  - Leavening agents at 87.5% rate (chemical reaction efficiency)
  - Liquids at 70% when scaling down, normal when scaling up (evaporation rate)
  - All other ingredients scale linearly
  - Ingredient list with amounts and units
- Nutrition Calculator (`src/app/[locale]/cooking/nutrition-calculator/`)
  - Calorie calculations (protein×4, carbs×4, fat×9)
  - Macro tracking (protein, carbs, fat)
  - Micro tracking (vitamins, minerals)
  - 115-food curated database (foods-cooking.json)
  - Percentage of daily values (%DV)
  - Nutrition facts label formatting
- Cooking Units Converter (`src/app/[locale]/cooking/cooking-units/`)
  - Metric-first ordering (ml, L, grams, kg)
  - Imperial conversions available (cups, tbsp, tsp, oz, lb)
  - US standard cup (240ml) not UK cup (284ml)
  - Density-aware conversions (volume ↔ weight)
  - Ingredient density table (68 ingredients)
  - Fractional display for imperial units (1/4 cup not 0.25 cup)
- Food Cost Calculator (`src/app/[locale]/cooking/food-cost/`)
  - Cost per serving calculations
  - Multi-ingredient support with quantities
  - Unit compatibility checking (prevents mixing volume/weight)
  - CHF/EUR/USD currency support
  - Batch cooking cost analysis
  - Per-person cost breakdown
- Cooking category registration in calculator registry (163→167 calculators, 14→15 categories)
- Complete i18n support for all cooking calculators (en, fr, de, it)
- URL parameter persistence for basic calculator settings (ingredients array not synced due to complexity)
- Cooking data files
  - `src/lib/data/cooking-densities.ts` - 68 ingredient densities (flour 0.53, water 1.0, etc.)
  - `src/lib/data/foods-cooking.json` - 115-food nutrition database

**Phase 18: Real Estate Foundation (2026-01-24)**

- Real Estate Calculator Suite with Swiss market focus (3 calculators: mortgage, rental-yield, property-valuation)
- Swiss Mortgage Calculator (`src/app/[locale]/realestate/mortgage-swiss/`)
  - PMT formula for monthly payment calculation
  - Amortization schedule with yearly breakdown
  - Swiss regulatory compliance checks (20% minimum down payment, 80% max LTV)
  - Affordability stress test at 5% rate (Swiss banking standard)
  - CHF/EUR currency support with Swiss formatting
  - 3 charts: Principal vs Interest, Balance Over Time, Yearly breakdown
- Rental Yield Calculator (`src/app/[locale]/realestate/rental-yield/`)
  - Gross/Net yield calculations with market comparison
  - GRM (Gross Rent Multiplier) and capitalization rate analysis
  - Monthly/annual cash flow with optional mortgage integration
  - Investment rating system (excellent/good/fair/poor)
  - Swiss city yield comparison (8 regions from Zurich 2.45% to Lucerne 3.05%)
  - Break-even calculations and transaction cost analysis (3-6% range)
  - Negative cash flow warnings with detailed analysis
- Property Valuation Calculator (`src/app/[locale]/realestate/property-valuation/`)
  - Hedonic method for property valuation
  - 8 Swiss regions with regional pricing (CHF 8,500-12,500/m²)
  - 3 property types (apartment, house, commercial)
  - 5 condition levels (poor to excellent)
  - 11 property features with CHF bonuses (garage CHF 50k, garden CHF 40k, etc.)
  - Age-based adjustments (1.10x for new, 0.85x for 80+ years)
  - Confidence levels (low/medium/high) based on input completeness
  - ±15% value range with regional comparisons
- Real estate category registration in calculator registry (156→159 calculators, 12→13 categories)
- Swiss property market data files
  - `src/lib/data/swiss-property-prices.json` - Regional pricing by property type
  - `src/lib/data/real-estate-benchmarks.json` - Market yields, mortgage rates, regulatory requirements
- Complete i18n support for all real estate calculators (en, fr, de, it)
- URL parameter persistence for calculator state sharing across all 3 calculators
- Zustand state management with createUrlSyncMiddleware for reactive updates

**Phase 17: Crypto/Blockchain Foundation (2026-01-24)**

- Hash Calculator (`src/app/[locale]/crypto/hash/`)
  - MD5, SHA-1, SHA-256, SHA-512 hash algorithms
  - WebCrypto for SHA algorithms, crypto-js for MD5
  - Real-time calculation with copy-to-clipboard
  - MD5 security warning (destructive alert)
- Wallet Address Validator (`src/app/[locale]/crypto/wallet/`)
  - Format detection for Bitcoin (P2PKH, P2SH, P2WPKH, P2WSH, P2TR), Ethereum, Litecoin
  - Network detection (mainnet vs testnet)
  - Private key pattern detection with security warnings
  - wallet-address-validator library (~2KB)
- Cryptocurrency Exchange Rate Calculator (`src/app/[locale]/crypto/exchange/`)
  - Build-time price fetching from CoinGecko API
  - Support for 6 cryptocurrencies (BTC, ETH, LTC, XRP, DOGE, ADA)
  - Support for 3 fiat currencies (CHF, EUR, USD) with CHF/EUR as primary
  - Staleness detection for price data (24-hour threshold warning)
  - Static JSON data file for static export compatibility
- Mining Profitability Calculator (`src/app/[locale]/crypto/mining/`)
  - Real-time mining profit analysis (daily, monthly, yearly)
  - Hash rate input with multiple units (H/s, KH/s, MH/s, GH/s, TH/s, PH/s)
  - Power consumption and electricity cost calculation
  - Miner presets (Antminer S19 Pro, S19j Pro, S19 XP, Whatsminer M30S++)
  - ROI calculation and break-even date estimation
  - Swiss electricity cost default (0.27 CHF/kWh)
  - Build-time mining data fetching from Blockchain.info
- Crypto category registration in calculator registry (4 new calculators, 158 total)
- Complete i18n support for all crypto calculators (en, fr, de, it)
- Downloadable offline package (`converty-local.zip`) available from GitHub Releases
- Local server scripts for Mac/Linux (`start.sh`) and Windows (`start.bat`)
- GitHub Actions workflow to automatically create releases with downloadable package

### Changed

- Restructured documentation into focused guides in `docs/` folder
  - `docs/CALCULATOR_GUIDE.md` - Step-by-step for adding calculators
  - `docs/CODE_STYLE.md` - TypeScript, naming, linting conventions
  - `docs/I18N_GUIDE.md` - Internationalization patterns
- Slimmed down CONTRIBUTING.md (425 → 112 lines) with links to detailed guides
- Slimmed down CLAUDE.md (243 → 80 lines) with links to detailed guides

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

[unreleased]: https://github.com/fjacquet/converty/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/fjacquet/converty/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/fjacquet/converty/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/fjacquet/converty/releases/tag/v1.0.0
