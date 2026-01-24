# Requirements: Converty v3.0

**Defined:** 2026-01-24
**Core Value:** A solid, maintainable foundation with zero technical debt in state management and type safety, enabling confident future development.

## v1 Requirements

Requirements for v3.0 Calculator Expansion & Performance milestone. Each maps to roadmap phases.

### Calculator Expansion — Crypto/Blockchain

- [x] **CRYPT-01**: User can calculate hash values (MD5, SHA-1, SHA-256, SHA-512) ✓
- [x] **CRYPT-02**: User can convert between wallet formats (addresses, private keys) ✓
- [x] **CRYPT-03**: User can calculate cryptocurrency exchange rates and conversions ✓
- [x] **CRYPT-04**: User can calculate mining profitability and rewards ✓

### Calculator Expansion — Real Estate

- [x] **REAL-01**: User can calculate mortgage payments (principal, interest, term) ✓
- [x] **REAL-02**: User can calculate property valuation and ROI ✓
- [x] **REAL-03**: User can calculate rent-to-value ratio and investment metrics ✓
- [x] **REAL-04**: User can calculate loan amortization schedules ✓

### Calculator Expansion — Cooking/Nutrition

- [x] **COOK-01**: User can scale recipes based on servings ✓
- [x] **COOK-02**: User can calculate nutrition facts (calories, macros, micros) ✓
- [x] **COOK-03**: User can convert between cooking units (metric-first: ml, grams, litres; also support common conversions) ✓
- [x] **COOK-04**: User can calculate food cost per serving ✓

### Calculator Expansion — Automotive

- [ ] **AUTO-01**: User can calculate fuel efficiency (L/100km as primary; conversion to km/L available)
- [ ] **AUTO-02**: User can calculate tire sizing (metric specifications: width/aspect ratio/diameter)
- [ ] **AUTO-03**: User can calculate vehicle maintenance intervals (km-based)
- [ ] **AUTO-04**: User can calculate loan/lease payments for vehicles (CHF/EUR)

### Performance Optimization

- [ ] **PERF-01**: Calculator components are code-split and lazy-loaded by category
- [ ] **PERF-02**: Initial bundle size reduced (defer non-critical categories)
- [ ] **PERF-03**: Search results load instantly (virtualized list for 200+ calculators)
- [ ] **PERF-04**: First Contentful Paint (FCP) improved through lazy loading

### User Experience — Favorites

- [ ] **FAV-01**: User can bookmark favorite calculators from calculator page
- [ ] **FAV-02**: User can view all bookmarked calculators in dedicated section
- [ ] **FAV-03**: User can remove calculators from favorites
- [ ] **FAV-04**: Favorites persist across browser sessions (localStorage)
- [ ] **FAV-05**: Favorites display count badge in navigation

### User Experience — Calculation History

- [ ] **HIST-01**: User can view recent calculations with inputs and results
- [ ] **HIST-02**: User can restore previous calculations (re-populate inputs)
- [ ] **HIST-03**: User can clear calculation history
- [ ] **HIST-04**: History persists across browser sessions (localStorage)
- [ ] **HIST-05**: History displays with timestamp for each entry

### User Experience — Export

- [ ] **EXP-01**: User can export calculation results as PDF
- [ ] **EXP-02**: User can export calculation results as CSV
- [ ] **EXP-03**: Exported files include calculator name, inputs, and results
- [ ] **EXP-04**: Export is accessible from calculator results

## v2 Requirements

Deferred to future releases. Tracked but not in current roadmap.

### Advanced Analytics

- **ANLYT-01**: User can view calculation usage statistics
- **ANLYT-02**: User can track calculation frequency over time
- **ANLYT-03**: Anonymized usage metrics visible to admins

### Mobile App

- **MOBL-01**: Native iOS app with calculator sync
- **MOBL-02**: Native Android app with calculator sync
- **MOBL-03**: Offline calculator support on mobile

### Collaboration

- **COLLAB-01**: User can share calculation sessions with others
- **COLLAB-02**: Users can collaborate on calculations in real-time
- **COLLAB-03**: Shared calculation links with access controls

### Advanced Performance

- **PERF2-01**: Server-side rendering for SEO optimization
- **PERF2-02**: Edge caching for global distribution
- **PERF2-03**: GraphQL API for flexible data fetching

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time collaboration | High complexity, not core to calculator value, deferred to v4.0+ |
| Server-side rendering | Static export constraint, stays client-side only |
| Analytics/telemetry | Privacy-focused ethos, defer to v5.0+ |
| Native mobile apps | Web app sufficient for v3.0, mobile later |
| API integration (external) | Calculators remain pure client-side, no backend needed |
| User accounts/authentication | Unnecessary for calculator usage, localStorage sufficient |
| Multi-language calculator definitions | English for calculations, i18n UI remains for v3.0 |
| Dark mode switching improvements | Already working via Tailwind, not priority |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CRYPT-01 | Phase 17 | Complete |
| CRYPT-02 | Phase 17 | Complete |
| CRYPT-03 | Phase 17 | Complete |
| CRYPT-04 | Phase 17 | Complete |
| REAL-01 | Phase 18 | Complete |
| REAL-02 | Phase 18 | Complete |
| REAL-03 | Phase 18 | Complete |
| REAL-04 | Phase 18 | Complete |
| COOK-01 | Phase 19 | Complete |
| COOK-02 | Phase 19 | Complete |
| COOK-03 | Phase 19 | Complete |
| COOK-04 | Phase 19 | Complete |
| AUTO-01 | Phase 20 | Pending |
| AUTO-02 | Phase 20 | Pending |
| AUTO-03 | Phase 20 | Pending |
| AUTO-04 | Phase 20 | Pending |
| PERF-01 | Phase 21 | Pending |
| PERF-02 | Phase 21 | Pending |
| PERF-03 | Phase 21 | Pending |
| PERF-04 | Phase 21 | Pending |
| FAV-01 | Phase 22 | Pending |
| FAV-02 | Phase 22 | Pending |
| FAV-03 | Phase 22 | Pending |
| FAV-04 | Phase 22 | Pending |
| FAV-05 | Phase 22 | Pending |
| HIST-01 | Phase 23 | Pending |
| HIST-02 | Phase 23 | Pending |
| HIST-03 | Phase 23 | Pending |
| HIST-04 | Phase 23 | Pending |
| HIST-05 | Phase 23 | Pending |
| EXP-01 | Phase 24 | Pending |
| EXP-02 | Phase 24 | Pending |
| EXP-03 | Phase 24 | Pending |
| EXP-04 | Phase 24 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0 ✓

---

*Requirements defined: 2026-01-24*
*Last updated: 2026-01-24 after Phase 18 completion (12/34 requirements satisfied)*
