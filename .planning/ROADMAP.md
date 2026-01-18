# Roadmap: Converty

## Overview

Converty evolves through focused milestones. v1.0 established a solid infrastructure foundation with zero technical debt. v2.0 expands the calculator suite with comprehensive network tools (featuring a visual subnet calculator), adds global search for instant calculator discovery, and achieves 100% translation coverage across all 4 locales.

## Milestones

- ✅ **v1.0 Infrastructure Upgrade** - Phases 1-8 (shipped 2026-01-18)
- 🚧 **v2.0 Network Tools & User Experience** - Phases 9-16 (in progress)

## Phases

<details>
<summary>✅ v1.0 Infrastructure Upgrade (Phases 1-8) - SHIPPED 2026-01-18</summary>

**Milestone Goal:** Solid, maintainable foundation with zero technical debt in state management and type safety

### Phase 1: Foundation & Planning
**Status:** Complete (2026-01-17)
**Plans:** 4 plans

### Phase 2: Zustand Migration - Category 1
**Status:** Complete (2026-01-17)
**Plans:** 4 plans

### Phase 3: Zustand Migration - Category 2
**Status:** Complete (2026-01-17)
**Plans:** 3 plans

### Phase 4: Zustand Migration - Category 3
**Status:** Complete (2026-01-17)
**Plans:** 3 plans

### Phase 5: TypeScript Strict Mode & Cleanup
**Status:** Complete (2026-01-17)
**Plans:** 2 plans

### Phase 6: Progressive Web App
**Status:** Complete (2026-01-18)
**Plans:** 1 plan

### Phase 7: Documentation
**Status:** Complete (2026-01-18)
**Plans:** 1 plan

### Phase 8: Final Verification & Launch
**Status:** Complete (2026-01-18)
**Plans:** 1 plan

**v1.0 Stats:**
- 19 plans executed
- 103 commits
- 131 files modified
- 32/32 requirements satisfied (100%)
- 2 days from start to ship

</details>

### 🚧 v2.0 Network Tools & User Experience (In Progress)

**Milestone Goal:** Comprehensive network calculator suite, global search functionality, and complete translation coverage

#### Phase 9: Visual Subnet Calculator Foundation
**Goal:** Basic subnet calculator with IPv4/IPv6 support and flexible input formats
**Depends on:** Nothing (first phase of v2.0)
**Requirements:** NET-01, NET-02, NET-06, NET-07
**Success Criteria** (what must be TRUE):
  1. User can input IPv4 address with CIDR notation and see calculation
  2. User can input IPv6 address with CIDR notation and see calculation
  3. User can input subnet mask notation (e.g., 255.255.255.0) and see calculation
  4. Calculator state persists to URL for sharing
**Plans:** TBD

Plans:
- [ ] TBD

#### Phase 10: Visual Subnet Calculator - Visualization
**Goal:** Rich visual feedback for subnet calculations with diagrams and binary representation
**Depends on:** Phase 9
**Requirements:** NET-03, NET-04, NET-05
**Success Criteria** (what must be TRUE):
  1. Network diagram displays showing network/host portions and IP ranges
  2. Binary representation shows IP address and subnet mask with highlighted bits
  3. Breakdown table displays network address, broadcast, usable range, and total hosts
  4. All visualizations update in real-time as inputs change
**Plans:** TBD

Plans:
- [ ] TBD

#### Phase 11: Visual Subnet Calculator - Advanced Features
**Goal:** Advanced network manipulation with subnetting and supernetting capabilities
**Depends on:** Phase 10
**Requirements:** NET-08, NET-09
**Success Criteria** (what must be TRUE):
  1. User can divide network into smaller subnets with visual feedback
  2. User can combine multiple networks into larger CIDR blocks (supernetting)
  3. Results show before/after network configurations
**Plans:** TBD

Plans:
- [ ] TBD

#### Phase 12: IP Address & CIDR Calculators
**Goal:** Complementary network analysis tools for IP classification and CIDR range operations
**Depends on:** Phase 11
**Requirements:** NET-10, NET-11, NET-12, NET-13, NET-14
**Success Criteria** (what must be TRUE):
  1. IP Address Calculator detects class (A, B, C, D, E) and public/private status
  2. IP Address Calculator validates IP format and range
  3. CIDR Range Calculator shows IP range from CIDR notation
  4. CIDR Range Calculator checks if specific IP is in range
**Plans:** TBD

Plans:
- [ ] TBD

#### Phase 13: Network Speed/Latency Calculator
**Goal:** Network performance calculations for speed and latency analysis
**Depends on:** Phase 12
**Requirements:** NET-15, NET-16
**Success Criteria** (what must be TRUE):
  1. User can convert between ping time units (ms, μs, etc.)
  2. User can calculate network throughput from bandwidth and time
**Plans:** TBD

Plans:
- [ ] TBD

#### Phase 14: Global Search
**Goal:** Fast calculator discovery across entire 200+ calculator suite
**Depends on:** Phase 13
**Requirements:** SRCH-01, SRCH-02, SRCH-03, SRCH-04
**Success Criteria** (what must be TRUE):
  1. Search box accessible from all pages (global header)
  2. Results update in real-time as user types
  3. Search matches calculator names and descriptions
  4. Clicking result navigates to calculator page
**Plans:** TBD

Plans:
- [ ] TBD

#### Phase 15: Translation Audit
**Goal:** Identify and extract all hardcoded strings to translation files
**Depends on:** Phase 14
**Requirements:** I18N-01, I18N-02
**Success Criteria** (what must be TRUE):
  1. All 200+ calculators audited for hardcoded English strings
  2. Complete list of hardcoded strings documented
  3. All identified strings moved to en.json translation file
  4. Zero hardcoded strings remain in calculator components
**Plans:** TBD

Plans:
- [ ] TBD

#### Phase 16: Translation Implementation
**Goal:** 100% translation coverage across all 4 locales (en, fr, de, it)
**Depends on:** Phase 15
**Requirements:** I18N-03, I18N-04, I18N-05, I18N-06, I18N-07, I18N-08, I18N-09
**Success Criteria** (what must be TRUE):
  1. All strings translated to French, German, and Italian
  2. All calculators verified working in all 4 locales (en, fr, de, it)
  3. No missing translation keys in any locale
  4. Locale switcher works correctly on all calculator pages
**Plans:** TBD

Plans:
- [ ] TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Planning | v1.0 | 4/4 | Complete | 2026-01-17 |
| 2. Zustand Migration - Category 1 | v1.0 | 4/4 | Complete | 2026-01-17 |
| 3. Zustand Migration - Category 2 | v1.0 | 3/3 | Complete | 2026-01-17 |
| 4. Zustand Migration - Category 3 | v1.0 | 3/3 | Complete | 2026-01-17 |
| 5. TypeScript Strict Mode & Cleanup | v1.0 | 2/2 | Complete | 2026-01-17 |
| 6. Progressive Web App | v1.0 | 1/1 | Complete | 2026-01-18 |
| 7. Documentation | v1.0 | 1/1 | Complete | 2026-01-18 |
| 8. Final Verification & Launch | v1.0 | 1/1 | Complete | 2026-01-18 |
| 9. Visual Subnet Calculator Foundation | v2.0 | 0/TBD | Not started | - |
| 10. Visual Subnet Calculator - Visualization | v2.0 | 0/TBD | Not started | - |
| 11. Visual Subnet Calculator - Advanced Features | v2.0 | 0/TBD | Not started | - |
| 12. IP Address & CIDR Calculators | v2.0 | 0/TBD | Not started | - |
| 13. Network Speed/Latency Calculator | v2.0 | 0/TBD | Not started | - |
| 14. Global Search | v2.0 | 0/TBD | Not started | - |
| 15. Translation Audit | v2.0 | 0/TBD | Not started | - |
| 16. Translation Implementation | v2.0 | 0/TBD | Not started | - |
