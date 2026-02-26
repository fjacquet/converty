# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-23)

**Core value:** A professional calculator platform with 169 tools — clean TypeScript, full i18n (4 locales), PWA-capable, static deployment.
**Current focus:** Planning v7.0 — run `/gsd:new-milestone` to start

## Current Position

Phase: 41 — Full Converter Test Coverage (in progress)
Plan: 01 complete (1/10)
Status: v7.0 Phase 41 in progress. Plan 01 done: global 75% coverage threshold, cpu-types.ts excluded, Test CI gate in static.yml.
Last activity: 2026-02-26 — Phase 41-01 complete: global coverage threshold, CI test gate

Progress: [█░░░░░░░░░] Phase 41: 1/10 plans complete

## Performance Metrics

**v1.0 Milestone:**

- Total plans completed: 19
- Total phases: 8
- Average duration: 4.6 min/plan
- Total commits: 103
- Files modified: 131
- Lines added: 23,496
- Lines removed: 874
- Timeline: 2 days (2026-01-17 → 2026-01-18)

**By Phase:**

| Phase                      | Plans | Total    | Avg/Plan |
| -------------------------- | ----- | -------- | -------- |
| 01-type-safety-foundation  | 4/4   | 7.5 min  | 1.9 min  |
| 02-url-sync-infrastructure | 1/1   | 4 min    | 4 min    |
| 03-state-migration         | 2/2   | 26.8 min | 13.4 min |
| 04-progressive-web-app     | 4/4   | 12.3 min | 3.1 min  |
| 05-documentation           | 3/3   | 7.3 min  | 2.4 min  |
| 06-dependency-upgrade      | 1/1   | 2 min    | 2 min    |
| 07-code-quality-validation | 2/2   | 23.4 min | 11.7 min |
| 08-developer-experience    | 2/2   | 5 min    | 2.5 min  |

**v2.0 Milestone:**

| Phase                           | Plans | Total  | Avg/Plan |
| ------------------------------- | ----- | ------ | -------- |
| 09-visual-subnet-foundation     | 3/3   | 27 min | 9 min    |
| 10-visual-subnet-visualization  | 2/2   | 51 min | 25.5 min |
| 11-visual-subnet-advanced       | 3/3   | 8 min  | 2.7 min  |
| 12-ip-cidr-calculators          | 2/2   | 20 min | 10 min   |
| 13-network-speed-latency        | 2/2   | 14 min | 7 min    |
| 14-global-search                | 2/2   | 13 min | 6.5 min  |
| 15-translation-audit            | 2/2   | 5 min  | 2.5 min  |
| 16-translation-implementation   | 6/6   | 18 min | 3 min    |

**v3.0 Milestone (complete):**

| Phase                           | Plans | Total  | Avg/Plan |
| ------------------------------- | ----- | ------ | -------- |
| 17-crypto-blockchain-foundation | 4/4   | 32 min | 8 min    |
| 18-real-estate-foundation       | 4/4   | 28 min | 7 min    |
| 19-cooking-nutrition-foundation | 4/4   | 35 min | 8.75 min |
| 20-automotive-calculators       | 4/4   | 30 min | 7.5 min  |
| 21-code-splitting               | 4/4   | 15 min | 3.75 min |
| 24-export-functionality         | 3/3   | 18 min | 6 min    |

**v4.0 Milestone (complete):**

| Phase                                    | Plans | Total    | Avg/Plan |
| ---------------------------------------- | ----- | -------- | -------- |
| 25-security-hardening                     | 2/2   | ~8 min   | ~4 min   |
| 26-infrastructure-category-foundation     | 3/3   | ~12 min  | ~4 min   |
| 27-vm-storage-calculator                  | 3/3   | ~11 min  | ~3.7 min |
| 28-k8s-capacity-calculator                | 3/3   | ~11 min  | ~3.7 min |
| 29-vmware-server-licensing                | 3/3   | ~15 min  | ~5 min   |
| 30-virtualization-cost-and-export         | 3/3   | ~18 min  | ~6 min   |

**Total v4.0:** 6 phases, 17 plans, ~75 minutes (~4.4 min/plan), 58 commits, 106 files, +15,840/-224 lines

**v5.0 Milestone (complete):**

| Phase                                    | Plans | Total   | Avg/Plan |
| ---------------------------------------- | ----- | ------- | -------- |
| 31-engineering-structural-calculators     | 4/4   | 1 wave  | —        |
| 32-engineering-materials-hydraulics       | 3/3   | 1 wave  | —        |
| 33-chemistry-core-calculators            | 4/4   | 1 wave  | —        |
| 34-chemistry-advanced-calculators        | 3/3   | 1 wave  | —        |
| 35-hyperv-multiplatform-calculators      | 5/5   | 1 wave  | —        |
| 36-cross-platform-comparison             | 4/4   | 1 wave  | —        |

**Total v5.0:** 6 phases, 6 commits, 126 files, +33,317/-19,485 lines

**v6.0 Milestone (in progress):**

| Phase                        | Plans | Total | Avg/Plan |
| ---------------------------- | ----- | ----- | -------- |
| 37-cpu-database-foundation   | 1/2   | ~2 min | ~2 min   |
| 38-cpu-comparison-calculator | 3/3   | ~8.3 min | ~2.8 min |
| 39-server-refresh-calculator | 3/3   | ~9.5 min | ~3.2 min  |
| Phase 40-vitest-foundation P02 | 2 | 2 tasks | 3 files |

## Accumulated Context

### Decisions

Recent decisions affecting current work:
- See PROJECT.md Key Decisions table for full log (250+ entries from v1.0-v5.0)
- v6.0 start: CPU data sourced from public SPEC.org submissions, curated as build-time JSON (static export constraint)
- v6.0 start: Both calculators land in Infrastructure category under new "CPU" subcategory
- v6.0 start: Staleness warning pattern (90-day threshold, dataAsOf field) following v4.0 licensing calculator precedent
- 37-01: CpuGeneration union type with "current" and "previous" to simplify server refresh comparisons
- 37-01: ARM/Ampere entries use vendor "arm" (not "ampere") to keep vendor enum minimal
- 37-01: 17 CPU entries across Intel Xeon, AMD EPYC, and ARM/Ampere families
- [Phase 37]: Used Cpu icon from lucide-react for cpu-comparison-calculator, Server icon for server-refresh-calculator
- [Phase 37]: CPU subcategory appended after cost in infrastructure subcategories; both registry entries under subcategory: cpu
- [Phase 38-01]: sizingRatioVsFirst: cpu[0].peak/cpuN.peak means N units of cpuN needed to match cpu[0] performance
- [Phase 38-01]: calculateCpuComparison returns null (not throw) for <2 valid CPU IDs, consistent with project pattern
- [Phase 38-02]: Used dynamic import with CalculatorSkeleton matching hyperv-consolidation pattern; vendor/generation changes reset cpuIds to avoid stale selections
- [Phase 38-03]: i18n translations were fully complete from 38-02; Task 1 was verified rather than re-implemented
- [Phase 38-03]: Component uses vendorFilter/generationFilter/staleDataWarning/specOrgLink keys — actual 38-02 implementation takes precedence over plan spec variant names
- [Phase 39-01]: Used getServerRefreshCpus() (not re-exporting getFilteredCpus) to avoid naming conflicts and serve a single unfiltered CPU list for server refresh calculator
- [Phase 39-01]: serversPerRack and racksNeeded are null (not 0) when powerBudgetW <= 0 for clean UI conditional rendering
- [Phase 39-01]: Chassis constraint applied as switch block at calculation time; effectiveSockets is the resolved value used for all fleet math
- [Phase 39-02]: formatDelta helper with reverseColor=true for TDP row (more power = red = worse, negative TDP delta = green = better)
- [Phase 39-02]: IIFE pattern in JSX for delta table rows to scope delta/text/className variables without extracting to named functions
- [Phase 39-02]: CalculatorSkeleton inputCount=8 matching 8 fields in the store initialValues
- [Phase 39-03]: No code changes needed — 39-02 delivered complete implementation; plan 03 was pure verification confirming 45 keys in all 4 locales, zero TypeScript errors, zero MISSING_MESSAGE warnings
- [Phase 40-02]: Subnet-calculator uses ipaddr.js which throws for invalid IPs — tests use toThrow() not null assertions
- [Phase 40-02]: BigInt assertions use n-suffix literals (254n not 254) for all subnet host count assertions
- [Phase 40-02]: BMI bmi field is pre-rounded in source — toBeCloseTo(22.9, 1) used instead of strict toBe for floating-point
- [Phase 40-03]: Bug fix: compound-interest.ts inner compound loop used integer iteration causing full-period rate applied 12x/year for annual — fixed with fractional exponentiation `(1+r)^(n/12)`
- [Phase 40-03]: No mocking for periodic-table.json — vite-tsconfig-paths resolves real JSON; tests validate alias resolution works end-to-end
- [Phase 40-03]: toBeCloseTo precision: 0 decimal places for large financial sums, 2 decimal places for chemistry molar mass precision
- [Phase 40-04]: Global 75% threshold fails when coverage.include covers all 100+ converters but only 5 have tests — use per-file glob thresholds: thresholds['src/lib/converters/path/file.ts'] = {lines:75,...}
- [Phase 40-04]: TypeScript target updated from ES2017 to ES2020 — BigInt n-suffix literals (254n, 65534n) in subnet-calculator tests require ES2020; tsconfig.tsbuildinfo must be cleared after target change
- [Phase 40-04]: All 5 priority converter files exceed 75% threshold: bb-credit (100%/83%/100%/100%), subnet (92%/75%/100%/92%), bmi (81%/76%/100%/82%), compound-interest (97%/85%/100%/97%), molecular-weight (97%/87%/100%/97%)
- [Phase 41-01]: Global 75% threshold replaces 5 per-file blocks — intentionally deferred enforcement until Wave 4 (plan 41-10) via npm run test:coverage
- [Phase 41-01]: cpu-types.ts excluded from coverage — interfaces/unions only, not caught by **/types.ts glob due to filename
- [Phase 41-01]: CI uses npm run test:run not npm test — interactive watch mode would hang pipeline indefinitely

### Decisions (Phase 40-01)

- `environment: 'node'` (not jsdom) for converter tests — ~200ms faster per file
- `globals: true` — describe/it/expect available without imports in every test file
- `tsconfigPaths()` before `react()` in plugins array — order matters for alias resolution
- `coverage.include: ['src/lib/converters/**/*.ts']` — scoped to pure functions, excludes React layer
- 75% thresholds for lines/functions/branches/statements — pragmatic starting point

### Pending Todos

- Create `feature/framework-migration` branch before starting Phase 40 (deferred — proceeding on maincd)

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-26
Stopped at: Completed 41-01-PLAN.md — global 75% coverage threshold, cpu-types.ts excluded, Test CI gate in static.yml
Resume file: None

**Milestones Completed:**

1. ✅ v1.0 Infrastructure Upgrade shipped (2026-01-18)
2. ✅ v2.0 Network Tools & User Experience shipped (2026-01-22)
3. ✅ v3.0 Calculator Expansion & Performance shipped (2026-01-25)
4. ✅ v4.0 Security & Infrastructure shipped (2026-01-25)
5. ✅ v5.0 Calculator Expansion shipped (2026-01-29)
6. ✅ v6.0 CPU Performance & Server Refresh shipped (2026-02-23)

**v6.0 CPU Performance & Server Refresh (COMPLETE):**
- ✅ Phase 37 (CPU Database Foundation) — Done
- ✅ Phase 38 (CPU Comparison Calculator) — Done
- ✅ Phase 39 (Server Refresh Calculator) — Done
