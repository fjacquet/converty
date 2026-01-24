# Roadmap: Converty v3.0

**Milestone:** v3.0 Calculator Expansion & Performance
**Defined:** 2026-01-24
**Total Phases:** 14 (Phases 17-30)
**Requirements Mapped:** 34/34 (100%)

## Phase Overview

| Phase | Name | Goal | Requirements | Success Criteria |
|-------|------|------|--------------|------------------|
| 17 | Crypto/Blockchain Foundation | Create hash and crypto-currency calculators | CRYPT-01, CRYPT-02, CRYPT-03, CRYPT-04 | 4 new calculators, all locales supported |
| 18 | Real Estate Foundation | Build mortgage and property calculators | REAL-01, REAL-02, REAL-03, REAL-04 | 4 new calculators, financial accuracy verified |
| 19 | Cooking/Nutrition Foundation | Implement recipe and nutrition calculators | COOK-01, COOK-02, COOK-03, COOK-04 | 4 new calculators, unit conversions accurate |
| 20 | Automotive Calculators | Add fuel efficiency and vehicle calculators | AUTO-01, AUTO-02, AUTO-03, AUTO-04 | 4 new calculators, spec data accurate |
| 21 | Code Splitting & Lazy Loading | Implement category-based code splitting | PERF-01, PERF-02, PERF-03, PERF-04 | Bundle size reduced, FCP improved |
| 22 | Favorites Feature | Add calculator bookmarking system | FAV-01, FAV-02, FAV-03, FAV-04, FAV-05 | Bookmarks persist, badge displays count |
| 23 | Calculation History | Implement history tracking and restore | HIST-01, HIST-02, HIST-03, HIST-04, HIST-05 | History persists, timestamps display |
| 24 | Export Functionality | Add PDF and CSV export capability | EXP-01, EXP-02, EXP-03, EXP-04 | Exports accurate, accessible from calculators |

---

## Phase Details

### Phase 17: Crypto/Blockchain Foundation

**Goal:** Create hash calculator, wallet converter, exchange rate calculator, and mining profitability calculator.

**Requirements:** CRYPT-01, CRYPT-02, CRYPT-03, CRYPT-04

**Success Criteria:**
- [ ] MD5, SHA-1, SHA-256, SHA-512 hash functions working
- [ ] Wallet address format conversion functioning
- [ ] Crypto exchange rates accurate — **CHF/EUR primary currencies**; conversion features available
- [ ] Mining profitability calculations correct — values in **CHF/EUR, kWh, difficulty units**
- [ ] All 4 calculators localized to en/fr/de/it
- [ ] All 4 calculators in Calculator registry
- [ ] URL state persistence working for all 4

**Included in v3.0 Requirements:** CRYPT-01, CRYPT-02, CRYPT-03, CRYPT-04

---

### Phase 18: Real Estate Foundation

**Goal:** Create mortgage calculator, property valuation calculator, rent-to-value ratio calculator, and loan amortization calculator (CHF/EUR).

**Requirements:** REAL-01, REAL-02, REAL-03, REAL-04

**Success Criteria:**
- [ ] Mortgage payment calculations accurate — values in **CHF/EUR**
- [ ] Property valuation algorithms correct — market-aligned for Swiss/European context
- [ ] Rent-to-value ratio and investment metrics accurate — appropriate for European property market
- [ ] Loan amortization schedules generating correctly
- [ ] All 4 calculators localized to en/fr/de/it
- [ ] All 4 calculators in Calculator registry
- [ ] Financial accuracy verified against known formulas

**Included in v3.0 Requirements:** REAL-01, REAL-02, REAL-03, REAL-04

---

### Phase 19: Cooking/Nutrition Foundation

**Goal:** Create recipe scaler, nutrition calculator, cooking unit converter, and food cost calculator (metric-first).

**Requirements:** COOK-01, COOK-02, COOK-03, COOK-04

**Success Criteria:**
- [ ] Recipe scaling calculations working (servings multiplier)
- [ ] Nutrition facts calculations accurate (calories, macros, micros)
- [ ] Cooking unit conversions accurate — **metric primary** (ml, grams, litres); conversions to cups/tbsp available
- [ ] Food cost per serving calculations accurate
- [ ] All 4 calculators localized to en/fr/de/it
- [ ] All 4 calculators in Calculator registry
- [ ] Unit conversions tested against standard equivalents

**Included in v3.0 Requirements:** COOK-01, COOK-02, COOK-03, COOK-04

---

### Phase 20: Automotive Calculators

**Goal:** Create fuel efficiency calculator, tire sizing calculator, maintenance intervals calculator, and vehicle loan/lease calculator (metric-first).

**Requirements:** AUTO-01, AUTO-02, AUTO-03, AUTO-04

**Success Criteria:**
- [ ] Fuel efficiency calculations accurate — **L/100km primary**; conversion to km/L available
- [ ] Tire sizing specifications accurate — **metric notation** (e.g., 205/55R16); explain ratio/aspect systems
- [ ] Maintenance intervals accurate — **km-based** (instead of miles)
- [ ] Vehicle loan/lease payments in **CHF/EUR** with proper currency handling
- [ ] All 4 calculators localized to en/fr/de/it
- [ ] All 4 calculators in Calculator registry
- [ ] Spec data verified against European/Swiss standards

**Included in v3.0 Requirements:** AUTO-01, AUTO-02, AUTO-03, AUTO-04

---

### Phase 21: Code Splitting & Lazy Loading

**Goal:** Implement category-based code splitting to reduce initial bundle size and improve performance.

**Requirements:** PERF-01, PERF-02, PERF-03, PERF-04

**Success Criteria:**
- [ ] Calculator components code-split by category
- [ ] Lazy loading implemented per category
- [ ] Initial bundle size reduced (measure before/after)
- [ ] Categories load on demand
- [ ] Search/browse list virtualized for 200+ calculators
- [ ] First Contentful Paint (FCP) improved
- [ ] No impact on static export capability
- [ ] URL state persistence still working with lazy-loaded components

**Included in v3.0 Requirements:** PERF-01, PERF-02, PERF-03, PERF-04

---

### Phase 22: Favorites Feature

**Goal:** Implement calculator bookmarking system with localStorage persistence.

**Requirements:** FAV-01, FAV-02, FAV-03, FAV-04, FAV-05

**Success Criteria:**
- [ ] Users can bookmark calculators from calculator page
- [ ] Bookmarked calculators viewable in dedicated "Favorites" section
- [ ] Bookmark removal working
- [ ] Favorites persist across browser sessions (localStorage)
- [ ] Badge displays count of bookmarked calculators
- [ ] Bookmarks accessible from navigation
- [ ] Clear, intuitive UI for bookmark actions

**Included in v3.0 Requirements:** FAV-01, FAV-02, FAV-03, FAV-04, FAV-05

---

### Phase 23: Calculation History

**Goal:** Implement calculation history tracking with restore capability.

**Requirements:** HIST-01, HIST-02, HIST-03, HIST-04, HIST-05

**Success Criteria:**
- [ ] Recent calculations displayed with inputs and results
- [ ] Users can restore previous calculations (repopulate inputs)
- [ ] History clear function working
- [ ] History persists across browser sessions (localStorage)
- [ ] Timestamps display for each history entry
- [ ] History accessible from all calculator pages
- [ ] No performance impact from history tracking

**Included in v3.0 Requirements:** HIST-01, HIST-02, HIST-03, HIST-04, HIST-05

---

### Phase 24: Export Functionality

**Goal:** Implement PDF and CSV export for calculation results.

**Requirements:** EXP-01, EXP-02, EXP-03, EXP-04

**Success Criteria:**
- [ ] PDF export functionality working (using existing jsPDF)
- [ ] CSV export functionality working
- [ ] Exported files include calculator name, inputs, and results
- [ ] Export accessible from calculator results section
- [ ] File naming descriptive and timestamped
- [ ] Export formatting clean and readable
- [ ] Works across all calculator categories

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
- Phase 22: Favorites
- Phase 23: Calculation History
- Phase 24: Export

**Total Calculators:** ~50-75 additional across 4 new categories (estimate)
**Total Requirements:** 34 mapped to 8 phases

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

Phase 22-24: UX Enhancements (can run after Phase 21)
    ├─ Phase 22: Favorites
    ├─ Phase 23: History
    └─ Phase 24: Export
```

### Parallelization Opportunities

- Phases 17-20 (calculator development) can run in parallel
- Phases 22-24 (UX enhancements) can run in parallel after Phase 21
- Performance optimization (Phase 21) should complete before heavy load testing

### Integration Points

- All calculators must use `createCalculatorStore` factory (established v1.0)
- All calculators must be registered in Calculator registry
- All calculators must support i18n (en, fr, de, it)
- All calculators must support URL state persistence
- Performance optimization requires completed calculators to measure impact
- Favorites/History/Export operate on existing calculator infrastructure

---

## Success Criteria for v3.0 Complete

✅ When all phases complete:

- [ ] 16 new calculators across 4 categories (Crypto, Real Estate, Cooking, Automotive)
- [ ] ~50-75 total new calculators (estimate based on category depth)
- [ ] Code splitting implemented for all categories
- [ ] Bundle size reduced significantly
- [ ] FCP improved through lazy loading
- [ ] Favorites feature working with persistence
- [ ] Calculation history working with persistence
- [ ] Export (PDF/CSV) working for all calculators
- [ ] All new calculators localized to en/fr/de/it
- [ ] Zero Biome lint errors
- [ ] Zero TypeScript errors
- [ ] All 200+ existing calculators still working exactly as before
- [ ] Static export preserved (no server-side features)
- [ ] URL state persistence maintained

---

_Roadmap created: 2026-01-24 for v3.0 milestone_
