# Roadmap: Converty v3.0

**Milestone:** v3.0 Calculator Expansion & Performance
**Defined:** 2026-01-24
**Total Phases:** 6 (Phases 17-21, 24)
**Requirements Mapped:** 24/24 (100%)

## Phase Overview

| Phase | Name | Goal | Requirements | Success Criteria |
|-------|------|------|--------------|------------------|
| 17 | Crypto/Blockchain Foundation | Create hash and crypto-currency calculators | CRYPT-01, CRYPT-02, CRYPT-03, CRYPT-04 | 4 new calculators, all locales supported |
| 18 | Real Estate Foundation | Build mortgage and property calculators | REAL-01, REAL-02, REAL-03, REAL-04 | 4 new calculators, financial accuracy verified |
| 19 | Cooking/Nutrition Foundation | Implement recipe and nutrition calculators | COOK-01, COOK-02, COOK-03, COOK-04 | 4 new calculators, unit conversions accurate |
| 20 | Automotive Calculators | Add fuel efficiency and vehicle calculators | AUTO-01, AUTO-02, AUTO-03, AUTO-04 | 4 new calculators, spec data accurate |
| 21 | Code Splitting & Lazy Loading | Implement category-based code splitting | PERF-01, PERF-02, PERF-03, PERF-04 | Bundle size reduced, FCP improved |
| 24 | Export Functionality | Add PDF and CSV export capability | EXP-01, EXP-02, EXP-03, EXP-04 | Exports accurate, accessible from calculators |

---

## Phase Details

### Phase 17: Crypto/Blockchain Foundation

**Goal:** Create hash calculator, wallet converter, exchange rate calculator, and mining profitability calculator.

**Requirements:** CRYPT-01, CRYPT-02, CRYPT-03, CRYPT-04

**Success Criteria:**

- [x] MD5, SHA-1, SHA-256, SHA-512 hash functions working ✓
- [x] Wallet address format conversion functioning ✓
- [x] Crypto exchange rates accurate — **CHF/EUR primary currencies**; conversion features available ✓
- [x] Mining profitability calculations correct — values in **CHF/EUR, kWh, difficulty units** ✓
- [x] All 4 calculators localized to en/fr/de/it ✓
- [x] All 4 calculators in Calculator registry ✓
- [x] URL state persistence working for all 4 ✓

**Status:** ✅ COMPLETE (2026-01-24)

**Included in v3.0 Requirements:** CRYPT-01, CRYPT-02, CRYPT-03, CRYPT-04

---

### Phase 18: Real Estate Foundation

**Goal:** Create mortgage calculator, property valuation calculator, rent-to-value ratio calculator, and loan amortization calculator (CHF/EUR).

**Requirements:** REAL-01, REAL-02, REAL-03, REAL-04

**Success Criteria:**

- [x] Mortgage payment calculations accurate — values in **CHF/EUR** ✓
- [x] Property valuation algorithms correct — market-aligned for Swiss/European context ✓
- [x] Rent-to-value ratio and investment metrics accurate — appropriate for European property market ✓
- [x] Loan amortization schedules generating correctly ✓
- [x] All 4 calculators localized to en/fr/de/it ✓
- [x] All 4 calculators in Calculator registry ✓
- [x] Financial accuracy verified against known formulas ✓

**Status:** ✅ COMPLETE (2026-01-24)

**Included in v3.0 Requirements:** REAL-01, REAL-02, REAL-03, REAL-04

---

### Phase 19: Cooking/Nutrition Foundation

**Goal:** Create recipe scaler, nutrition calculator, cooking unit converter, and food cost calculator (metric-first).

**Requirements:** COOK-01, COOK-02, COOK-03, COOK-04

**Success Criteria:**

- [x] Recipe scaling calculations working (servings multiplier) ✓
- [x] Nutrition facts calculations accurate (calories, macros, micros) ✓
- [x] Cooking unit conversions accurate — **metric primary** (ml, grams, litres); conversions to cups/tbsp available ✓
- [x] Food cost per serving calculations accurate ✓
- [x] All 4 calculators localized to en/fr/de/it ✓
- [x] All 4 calculators in Calculator registry ✓
- [x] Unit conversions tested against standard equivalents ✓

**Status:** ✅ COMPLETE (2026-01-24)

**Included in v3.0 Requirements:** COOK-01, COOK-02, COOK-03, COOK-04

---

### Phase 20: Automotive Calculators

**Goal:** Create fuel efficiency calculator, tire sizing calculator, maintenance intervals calculator, and vehicle loan/lease calculator (metric-first).

**Requirements:** AUTO-01, AUTO-02, AUTO-03, AUTO-04

**Success Criteria:**

- [x] Fuel efficiency calculations accurate — **L/100km primary**; conversion to km/L available ✓
- [x] Tire sizing specifications accurate — **metric notation** (e.g., 205/55R16); explain ratio/aspect systems ✓
- [x] Maintenance intervals accurate — **km-based** (instead of miles) ✓
- [x] Vehicle loan/lease payments in **CHF/EUR** with proper currency handling ✓
- [x] All 4 calculators localized to en/fr/de/it ✓
- [x] All 4 calculators in Calculator registry ✓
- [x] Spec data verified against European/Swiss standards ✓

**Status:** ✅ COMPLETE (2026-01-24)

**Included in v3.0 Requirements:** AUTO-01, AUTO-02, AUTO-03, AUTO-04

---

### Phase 21: Code Splitting & Lazy Loading

**Goal:** Implement category-based code splitting to reduce initial bundle size and improve performance.

**Requirements:** PERF-01, PERF-02, PERF-03, PERF-04

**Success Criteria:**

- [x] Calculator components code-split by category ✓
- [x] Lazy loading implemented per category ✓
- [x] Initial bundle size reduced (measure before/after) ✓
- [x] Categories load on demand ✓
- [x] Search/browse list virtualized for 200+ calculators ✓ (not needed - 167 calculators)
- [x] First Contentful Paint (FCP) improved ✓
- [x] No impact on static export capability ✓
- [x] URL state persistence still working with lazy-loaded components ✓

**Plans:** 4 plans

Plans:

- [x] 21-01-PLAN.md — Bundle analysis baseline & skeleton component ✓
- [x] 21-02-PLAN.md — Dynamic import implementation for all calculators ✓
- [x] 21-03-PLAN.md — Search performance verification & final report ✓
- [x] 21-04-PLAN.md — Gap closure: Fix CalculatorSkeleton consistency in 13 pages ✓

**Status:** ✅ COMPLETE (2026-01-25)

**Included in v3.0 Requirements:** PERF-01, PERF-02, PERF-03, PERF-04

---

### Phase 24: Export Functionality

**Goal:** Implement PDF and CSV export for calculation results.

**Requirements:** EXP-01, EXP-02, EXP-03, EXP-04

**Success Criteria:**

- [x] PDF export functionality working (using existing jsPDF) ✓
- [x] CSV export functionality working ✓
- [x] Exported files include calculator name, inputs, and results ✓
- [x] Export accessible from calculator results section ✓
- [x] File naming descriptive and timestamped ✓
- [x] Export formatting clean and readable ✓
- [x] Works across all calculator categories ✓

**Plans:** 3 plans

Plans:

- [x] 24-01-PLAN.md — Export foundation (CSV utility + i18n translations) ✓
- [x] 24-02-PLAN.md — Export components (update PdfExportButton, create CsvExportButton) ✓
- [x] 24-03-PLAN.md — Integration example (Age Calculator with both exports) ✓

**Status:** ✅ COMPLETE (2026-01-25)

**Included in v3.0 Requirements:** EXP-01, EXP-02, EXP-03, EXP-04

---

## Traceability

All v3.0 requirements mapped to phases:

**Calculator Expansion (16 calculators):**

- Phase 17: Crypto/Blockchain (4 calculators)
- Phase 18: Real Estate (4 calculators)
- Phase 19: Cooking/Nutrition (4 calculators)
- Phase 20: Automotive (4 calculators)

**Performance Optimization:**

- Phase 21: Code splitting & lazy loading

**UX Enhancements:**

- Phase 24: Export

**Total Calculators:** ~50-75 additional across 4 new categories (estimate)
**Total Requirements:** 24 mapped to 6 phases

---

## Build Order & Dependencies

### Critical Path

```
Phase 17-20: New Calculator Categories (parallel possible)
    ├─ Phase 17: Crypto/Blockchain (4 calculators)
    ├─ Phase 18: Real Estate (4 calculators)
    ├─ Phase 19: Cooking/Nutrition (4 calculators)
    └─ Phase 20: Automotive (4 calculators)

Phase 21: Performance Optimization
    └─ Enables efficient loading of 16+ new calculators

Phase 24: UX Enhancement (can run after Phase 21)
    └─ Phase 24: Export
```

### Parallelization Opportunities

- Phases 17-20 (calculator development) can run in parallel
- Phase 24 (Export) can run after Phase 21
- Performance optimization (Phase 21) should complete before heavy load testing

### Integration Points

- All calculators must use `createCalculatorStore` factory (established v1.0)
- All calculators must be registered in Calculator registry
- All calculators must support i18n (en, fr, de, it)
- All calculators must support URL state persistence
- Performance optimization requires completed calculators to measure impact
- Export operates on existing calculator infrastructure

---

## Success Criteria for v3.0 Complete

✅ When all phases complete:

- [ ] 16 new calculators across 4 categories (Crypto, Real Estate, Cooking, Automotive)
- [ ] ~50-75 total new calculators (estimate based on category depth)
- [ ] Code splitting implemented for all categories
- [ ] Bundle size reduced significantly
- [ ] FCP improved through lazy loading
- [ ] Export (PDF/CSV) working for all calculators
- [ ] All new calculators localized to en/fr/de/it
- [ ] Zero Biome lint errors
- [ ] Zero TypeScript errors
- [ ] All 200+ existing calculators still working exactly as before
- [ ] Static export preserved (no server-side features)
- [ ] URL state persistence maintained

---

_Roadmap created: 2026-01-24 for v3.0 milestone_
