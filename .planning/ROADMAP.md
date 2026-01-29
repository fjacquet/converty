# v5.0 Calculator Expansion: Roadmap

**Milestone:** v5.0 Calculator Expansion
**Start Phase:** 31 (continues from v4.0 Phase 30)
**Total Phases:** 6 (Phases 31-36)
**Estimated Duration:** 6 weeks (26 days + 5 days buffer)
**Total Calculators:** +18 (172 → 190)

## Milestone Overview

v5.0 adds three new calculator domains to Converty:

1. **Engineering & CAD** - Professional engineering calculations (6 calculators)
2. **Chemistry & Science** - Laboratory and academic chemistry tools (6 calculators)
3. **Hyper-V & Virtualization Platform** - Multi-hypervisor infrastructure planning (6 calculators)

**Architectural Impact:** None - All calculators use existing v1.0-v4.0 patterns
**Bundle Impact:** +90-110 KB (~18-22% increase)
**Risk Level:** MEDIUM (formula accuracy, reference data quality, licensing complexity)

---

## Phase 31: Engineering Structural Calculators

**Duration:** 5 days
**Calculators:** 3 (Beam Deflection, Moment of Inertia, Stress-Strain)
**Bundle Impact:** ~35 KB (material database, SVG components)
**Plans:** 4 plans in 2 waves

### Goals

- Establish engineering calculator pattern
- Create material properties reference data system
- Implement SVG diagram rendering for beam visualization
- Validate calculation formulas against textbook examples

Plans:

- [ ] 31-01-PLAN.md -- Engineering category foundation + reference data (materials, beam sections, translations)
- [ ] 31-02-PLAN.md -- Stress-Strain Calculator (simplest, establishes engineering UI pattern)
- [ ] 31-03-PLAN.md -- Moment of Inertia Calculator (SVG cross-section visualization)
- [ ] 31-04-PLAN.md -- Beam Deflection Calculator (SVG diagrams, material/section integration)

### Deliverables

**Calculators:**

1. Beam Deflection Calculator
   - Simply supported, cantilever, fixed-fixed beams
   - Point loads and uniform distributed loads
   - Shear force and bending moment diagrams (SVG)
   - Material database integration
   - Standard beam section library
   - PDF export with diagrams

2. Moment of Inertia Calculator
   - Standard sections (I-beams, channels, angles)
   - Composite shape builder
   - Parallel axis theorem
   - Cross-section visualization (SVG)

3. Stress-Strain Calculator
   - σ = F/A, ε = ΔL/L, E = σ/ε
   - Material property integration
   - Safety factor calculation
   - Unit conversion (MPa, GPa, psi, ksi)

**Infrastructure:**

- `src/data/engineering/materials.json` (30+ materials)
- `src/data/engineering/beam-sections.json` (50+ sections)
- `src/lib/converters/engineering/` calculation functions
- `src/components/engineering/` UI components
- Material selector component (reusable)
- Beam diagram component (SVG)

**Reference Data:**

- Material properties: ASTM A36, A572, A992 steel; Aluminum 6061-T6, 7075-T6; Wood grades; Concrete C20-C40
- Beam sections: W-shapes, C-channels, angles, rectangular/circular hollow sections
- Data source: AISC Steel Construction Manual 15th Edition

**Testing:**

- Unit tests for all calculation functions
- Formula verification against Beer & Johnston examples
- Edge cases: zero loads, extreme values, negative inputs
- Material database load performance

### Success Criteria

- [ ] All 3 calculators functional and tested
- [ ] SVG diagrams render correctly on desktop and mobile
- [ ] Material database loads in <100ms
- [ ] Calculations match textbook examples (10+ test cases per calculator)
- [ ] PDF export includes diagrams and assumptions
- [ ] Mobile-friendly UI verified (iPhone SE, iPad)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Formula implementation errors | Cross-verify with 2+ textbook sources, domain expert review |
| SVG diagram complexity | Start simple (single load case), iterate |
| Material database size | Tree-shake unused materials, lazy load extended database |
| mathjs bundle size | Import only needed functions, verify tree-shaking works |

---

## Phase 32: Engineering Materials & Hydraulics Calculators

**Duration:** 4 days
**Calculators:** 3 (Column Buckling, Pipe Flow, Unit Converter)
**Bundle Impact:** ~25 KB (convert library, pipe roughness data)

### Goals

- Complete engineering calculator suite
- Implement iterative solving (friction factor for turbulent flow)
- Create comprehensive unit conversion tool with NIST precision
- Validate hydraulic calculations against Engineering ToolBox

### Deliverables

**Calculators:**

1. Column Buckling Calculator
   - Euler's formula: Pcr = (π²EI)/(KL)²
   - Effective length factors (K) for various end conditions
   - Slenderness ratio check
   - AISC 360-16 code compliance
   - Axial load capacity

2. Pipe Flow & Pressure Drop Calculator
   - Darcy-Weisbach equation
   - Reynolds number calculation
   - Friction factor (Colebrook-White iterative, Swamee-Jain approximation)
   - Pipe material roughness database
   - Fluid properties database (water, air, oil)

3. Unit Converter (Engineering Units)
   - Force (N, kN, lbf, kip)
   - Pressure (Pa, MPa, psi, bar, atm)
   - Length (m, mm, ft, in)
   - Area (m², mm², ft², in²)
   - Moment of inertia (mm⁴, in⁴)
   - Section modulus (mm³, in³)
   - NIST-sourced conversion factors (12-digit precision)

**Infrastructure:**

- `src/data/engineering/pipe-materials.json` (roughness values)
- `src/data/engineering/fluids.json` (density, viscosity)
- `src/lib/converters/engineering/iterative-solvers.ts` (Colebrook-White)
- `src/lib/converters/engineering/unit-conversions.ts` (NIST factors)
- Integration with `convert` library

**Testing:**

- Reynolds number edge cases (laminar, transitional, turbulent)
- Friction factor convergence (iterative solver)
- Unit conversion bidirectional: A→B→A = A
- Squared/cubed factors for area/volume units

### Success Criteria

- [ ] Column buckling matches AISC examples
- [ ] Pipe flow matches Engineering ToolBox examples
- [ ] Unit conversions use NIST exact values (1 in = 25.4 mm exact)
- [ ] Friction factor iterates to 0.0001 precision
- [ ] No conversion disasters (Mars Climate Orbiter scenario prevented)
- [ ] Unit converter handles 50+ unit combinations

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Iterative solver doesn't converge | Add max iterations limit, fallback to Swamee-Jain approximation |
| Unit conversion errors | Test extensively, document NIST sources, validate bidirectionally |
| Roughness data accuracy | Source from multiple references, document assumptions |
| Code compliance interpretation | Cite specific AISC sections, add disclaimer |

---

## Phase 33: Chemistry Core Calculators

**Duration:** 4 days
**Calculators:** 3 (Molecular Weight, Molarity, Dilution)
**Bundle Impact:** ~20 KB (molecular-formula library, periodic table JSON)

### Goals

- Establish chemistry calculator pattern
- Implement chemical formula parser (handle Ca(OH)2, Fe2(SO4)3, hydrates)
- Load IUPAC 2024 atomic weights
- Create periodic table reference data system

### Deliverables

**Calculators:**

1. Molecular Weight Calculator
   - Chemical formula parsing: H2O, Ca(OH)2, Fe2(SO4)3, Mg3(PO4)2·8H2O
   - IUPAC 2024 atomic weights
   - Elemental composition breakdown (mass %, atom count)
   - Step-by-step calculation display

2. Molarity & Concentration Calculator
   - M = n/V = m/(M_w × V)
   - Unit conversions (M, mM, µM, %, ppm, mg/mL)
   - Solution preparation instructions
   - Auto-calculate molar mass from formula

3. Dilution Calculator (M1V1=M2V2)
   - Solve for any variable (M1, V1, M2, V2)
   - Step-by-step instructions
   - Safety warnings for acids
   - Serial dilution support (multi-step)

**Infrastructure:**

- `src/data/chemistry/periodic-table.json` (IUPAC 2024, 118 elements)
- `src/lib/converters/chemistry/formula-parser.ts` (handle nested parentheses)
- `src/lib/converters/chemistry/molarity.ts`
- `src/components/chemistry/formula-input.tsx` (validation component)
- Integration with `molecular-formula` library (or custom parser)

**Reference Data:**

- IUPAC 2024 atomic weights (Gd: 157.252, Lu: 174.9668, Zr: 91.2236)
- Element names in 4 locales (en, fr, de, it)
- Common compounds database (H2O, NaCl, H2SO4, etc.)

**Testing:**

- Formula parser edge cases: nested parentheses, hydrates, brackets
- Invalid formulas: unbalanced parentheses, unknown elements
- Molar mass verification against IUPAC tables
- Unit conversion accuracy

### Success Criteria

- [ ] Formula parser handles complex formulas (Fe2(SO4)3, CuSO4·5H2O)
- [ ] Molar masses match IUPAC reference values (4-6 decimal precision)
- [ ] Molarity calculations verified with lab protocols
- [ ] Dilution calculator matches manual calculations
- [ ] Safety warnings display for acids (HCl, H2SO4, HNO3)
- [ ] Element names translated correctly (4 locales)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Formula parser bugs | Extensive unit tests, test with 100+ formulas from literature |
| Outdated atomic weights | Use IUPAC 2024 explicitly, display data version in UI |
| Unit confusion (mL vs L) | Clear labeling, validation warnings |
| Floating-point precision | Round only at display, maintain extra digits internally |

---

## Phase 34: Chemistry Advanced Calculators

**Duration:** 4 days
**Calculators:** 3 (Stoichiometry, pH Calculator, Periodic Table)
**Bundle Impact:** ~15 KB (pH calculation utilities, pKa database)

### Goals

- Complete chemistry calculator suite
- Implement stoichiometry with limiting reagent logic
- Create pH calculator with buffer support (Henderson-Hasselbalch)
- Build interactive periodic table reference

### Deliverables

**Calculators:**

1. Stoichiometry Calculator
   - Balanced equation input
   - Limiting reagent identification
   - Theoretical yield calculation
   - Excess reactant calculation
   - Mole ratio display
   - Step-by-step stoichiometry

2. pH Calculator
   - pH = -log₁₀[H⁺], pOH = -log₁₀[OH⁻]
   - pH + pOH = 14 (at 25°C)
   - Strong acids/bases
   - Buffer solutions (Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]))
   - Common acids/bases dropdown (HCl, NaOH, H₂SO₄, NH₃)

3. Periodic Table Reference
   - Interactive 118-element table
   - Element details: atomic number, mass, symbol, electron config
   - Search/filter by name, symbol, category
   - Click element → auto-fill in molecular weight calculator
   - Translated element names (en, fr, de, it)

**Infrastructure:**

- `src/lib/converters/chemistry/stoichiometry.ts`
- `src/lib/converters/chemistry/ph-calculator.ts`
- `src/data/chemistry/pka-values.json` (common acids/bases)
- `src/components/chemistry/periodic-table.tsx` (interactive component)
- `src/components/chemistry/element-card.tsx` (detail display)

**Testing:**

- Stoichiometry with known reactions (combustion of methane: CH4 + 2O2 → CO2 + 2H2O)
- Limiting reagent edge cases (both reactants in excess, exact stoichiometric ratio)
- pH calculations verified with textbook examples
- Buffer pH calculations with Henderson-Hasselbalch

### Success Criteria

- [ ] Stoichiometry matches textbook examples (10+ test cases)
- [ ] Limiting reagent correctly identified (tested with 20+ scenarios)
- [ ] pH calculations accurate to 2 decimal places
- [ ] Buffer calculator matches lab protocols
- [ ] Periodic table mobile-responsive (grid layout, touch-friendly)
- [ ] Element search <100ms (fuzzy matching)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Unbalanced equation input | Validate equation before stoichiometry, show error if unbalanced |
| pKa values inaccurate | Source from NIST/CRC, document temperature assumptions (25°C) |
| pH > 14 or < 0 edge cases | Validate inputs, warn if unusual but allow calculation |
| Periodic table layout breaks on mobile | Test grid on smallest screens (iPhone SE), use CSS grid |

---

## Phase 35: Hyper-V & Multi-Platform Calculators

**Duration:** 5 days
**Calculators:** 6 (3 extended + 3 new)
**Bundle Impact:** ~15 KB (licensing costs JSON, hypervisor overhead JSON, feature matrix JSON)

### Goals

- Extend existing v4.0 infrastructure calculators with multi-platform support
- Create Hyper-V-specific calculators
- Implement Windows Server licensing logic (core minimums, Datacenter/Standard break-even)
- Build hypervisor comparison tool

### Deliverables

**Extended Calculators:**

1. VM Storage Calculator (extend v4.0)
   - Add platform selector: VMware, Hyper-V, Proxmox, XCP-ng
   - Platform-specific disk formats (VMDK, VHDX, qcow2, VDI)
   - Platform-specific snapshot overhead
   - Replication options (Hyper-V Replica 2×, Ceph 2×/3×)
   - Backward compatible (default: VMware)

2. Server Virtualization Calculator (extend v4.0)
   - Platform selector with overhead factors
   - Workload type (Windows, Linux, Mixed)
   - Platform-specific HA models
   - Backward compatible

3. Virtualization Cost Calculator (extend v4.0)
   - Comparison mode (side-by-side: VMware, Hyper-V, Proxmox, XCP-ng)
   - Migration cost field
   - Training cost field
   - Support cost models (platform-specific)
   - TCO chart (3-year, 5-year)

**New Calculators:**
4. Hyper-V Consolidation Calculator

- Input: # VMs, vCPU/VM, RAM/VM, storage/VM
- HA level (N+1, N+2, none)
- Hyper-V Replica toggle
- Host specs
- Output: Host count, Windows licensing cost, capacity breakdown

1. Windows Server Licensing Calculator
   - Core-based licensing (16 core minimum per server, 8 per processor)
   - Datacenter vs Standard comparison
   - Break-even analysis (Datacenter cheaper at 13+ VMs)
   - 2-core license pack calculation

2. Hypervisor Comparison Calculator
   - Input workload once, see sizing for all platforms
   - Feature comparison matrix
   - Cost breakdown (hardware, licensing, support, training, migration)
   - TCO chart
   - PDF export for management

**Infrastructure:**

- `src/data/infrastructure/hypervisor-overhead.json` (platform-specific overhead)
- `src/data/infrastructure/licensing-costs.json` (with date stamps)
- `src/data/infrastructure/hypervisor-features.json` (feature matrix)
- `src/lib/converters/infrastructure/windows-licensing.ts`
- `src/lib/converters/infrastructure/tco-comparison.ts`
- `src/components/infrastructure/platform-selector.tsx` (reusable)
- `src/components/infrastructure/cost-breakdown-chart.tsx` (recharts)

**Testing:**

- Windows licensing edge cases (8-core server needs 16 licenses, 2-socket × 6-core needs 16)
- HA calculations (N+1, N+2 formulas correct)
- TCO comparison verified with vendor calculators
- Feature matrix accuracy reviewed with community

### Success Criteria

- [ ] Extended calculators backward compatible (VMware URLs still work)
- [ ] Windows licensing respects all minimums (16/server, 8/processor)
- [ ] Datacenter/Standard break-even correct (~13 VMs)
- [ ] TCO comparison shows realistic costs (pricing dated)
- [ ] Feature matrix neutral (no vendor bias detected)
- [ ] Comparison calculator exports professional PDF

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Windows licensing edge cases | Test extensively, cross-verify with Microsoft calculator |
| Pricing data stale | Add date stamps, quarterly review process, warnings if >6 months old |
| HA overhead misunderstood | Document formula clearly, show utilization % warnings |
| Feature matrix perceived as biased | Neutral language, community review, link to official docs |

---

## Phase 36: Cross-Platform Integration & Verification

**Duration:** 4 days
**Calculators:** 0 (verification, testing, documentation)
**Bundle Impact:** 0 KB (polish phase)

### Goals

- Complete integration testing across all 18 new calculators
- Verify mobile UX (iPhone SE, iPad)
- Complete i18n translations (en, fr, de, it)
- Performance testing and optimization
- Documentation updates (CHANGELOG, guides)

### Deliverables

**Testing:**

- [ ] Unit tests: 90%+ coverage for new calculators
- [ ] Integration tests: URL state sync, PDF export, CSV export
- [ ] Formula verification: All calculations match published references
- [ ] Edge case testing: Zero, negative, extreme values
- [ ] Mobile testing: iPhone SE (smallest), iPad (tablet), Android
- [ ] Performance testing: Bundle size, load time, calculation speed
- [ ] i18n testing: All 4 locales (en, fr, de, it)

**Documentation:**

- [ ] CHANGELOG.md updated with v5.0 features
- [ ] CALCULATOR_GUIDE.md updated with new categories
- [ ] ADR created: Reference data management strategy
- [ ] ADR created: Chemical formula parsing approach
- [ ] ADR created: Multi-platform hypervisor support
- [ ] README updated: Total calculator count (190), new categories
- [ ] Pitfall documentation added to codebase

**Performance Optimization:**

- [ ] Bundle size verified: <110 KB increase (target: 90-110 KB)
- [ ] Tree-shaking verified: mathjs <30 KB, convert <5 KB
- [ ] Lazy loading verified: Categories load on-demand
- [ ] Load time verified: <2s First Contentful Paint
- [ ] Calculation speed verified: <100ms all calculators

**i18n Completion:**

- [ ] All calculator names translated
- [ ] All input/output labels translated
- [ ] Element names translated (chemistry)
- [ ] Unit names translated (engineering)
- [ ] Formula documentation translated
- [ ] Number formatting tested (locale-specific decimal separators)

**Quality Assurance:**

- [ ] Domain expert review: Engineering calculations (structural engineer)
- [ ] Domain expert review: Chemistry calculations (chemist)
- [ ] Domain expert review: Licensing logic (IT infrastructure professional)
- [ ] Accessibility testing: Keyboard navigation, screen readers
- [ ] Security audit: npm audit --production (zero vulnerabilities)
- [ ] Code quality: Zero Biome lint errors, zero ESLint errors

### Success Criteria

- [ ] All 18 calculators pass QA review
- [ ] Mobile UX verified on 5+ devices
- [ ] Bundle size <110 KB increase (measured)
- [ ] Load time <2s (measured on throttled 3G)
- [ ] Zero TypeScript errors (strict mode)
- [ ] 100% i18n coverage (all 4 locales)
- [ ] Domain experts approve calculations
- [ ] Documentation complete and accurate

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Performance regression | Rollback plan, feature flags for new calculators |
| Translation quality | Native speaker review for fr/de/it |
| Domain expert availability | Schedule reviews in advance, have backup reviewers |
| Last-minute bugs discovered | 1-week buffer for fixes before release |

---

## Milestone Completion Checklist

Before marking v5.0 as complete:

**Functionality:**

- [ ] All 18 calculators deployed and functional
- [ ] All formulas verified against published references
- [ ] All reference data sourced from standards (IUPAC, ASTM, AISC, NIST)
- [ ] All edge cases tested and handled gracefully

**Performance:**

- [ ] Bundle size increase: <110 KB (target: 90-110 KB)
- [ ] Load time: <2s First Contentful Paint
- [ ] Calculation speed: <100ms all calculators
- [ ] Mobile performance: Smooth on iPhone SE

**Quality:**

- [ ] Unit test coverage: >90% for new calculators
- [ ] Domain expert reviews: Engineering, Chemistry, Infrastructure
- [ ] Zero TypeScript errors (strict mode)
- [ ] Zero Biome/ESLint errors
- [ ] Zero security vulnerabilities (npm audit --production)

**User Experience:**

- [ ] Mobile-responsive: Verified on 5+ devices
- [ ] Input validation prevents errors
- [ ] Formula documentation present
- [ ] Export (PDF/CSV) includes assumptions
- [ ] URL state shareable and reproducible

**Internationalization:**

- [ ] 100% translation coverage (en, fr, de, it)
- [ ] Number formatting locale-aware
- [ ] Formula notation consistent across locales
- [ ] Element names/unit names translated correctly

**Documentation:**

- [ ] CHANGELOG.md updated
- [ ] Calculator guides updated
- [ ] ADRs created (3 ADRs minimum)
- [ ] Pitfall documentation added
- [ ] README updated with new calculator count

**Data Quality:**

- [ ] All pricing data dated (with source URLs)
- [ ] All reference data versioned
- [ ] Quarterly review process established
- [ ] Stale data warnings implemented (>6 months)

---

## Post-Launch Activities

**Week 1 (Stabilization):**

- Monitor error reports and calculation accuracy issues
- Respond to user feedback on new calculators
- Fix critical bugs if discovered
- Track usage metrics (adoption, engagement)

**Week 2-4 (Optimization):**

- Analyze performance metrics
- Optimize slow calculators if needed
- Improve mobile UX based on feedback
- Enhance documentation based on user questions

**Month 2-3 (Growth):**

- Social media promotion of new categories
- Reach out to engineering/chemistry communities
- Gather feature requests for v6.0
- Iterate based on usage data

**Quarterly (Ongoing):**

- Review pricing data (licensing costs)
- Review reference data (IUPAC updates, ASTM standards)
- Review overhead factors (hypervisor versions)
- Update documentation as needed

---

## Success Metrics

**Adoption (Month 3):**

- Engineering calculators: 500+ monthly users
- Chemistry calculators: 300+ monthly users
- Hyper-V calculators: 400+ monthly users
- Total v5.0 users: 1,200+ monthly

**Engagement:**

- Average time on page: 3-5 minutes
- PDF export rate: 20%+ of calculations
- URL sharing rate: 15%+ of calculations
- Return user rate: 30%+

**Quality:**

- Calculation error reports: <5 per month
- Data accuracy issues: <2 per quarter
- Formula disputes: <1 per quarter
- User satisfaction: >4.5/5 (if surveys implemented)

**Technical:**

- Bundle size increase: 90-110 KB (18-22%)
- Load time maintained: <2s First Contentful Paint
- Zero critical bugs post-launch
- Zero security vulnerabilities

---

## Rollback Plan

If critical issues discovered post-launch:

**Severity 1 (Critical - Calculator produces wrong results):**

- Immediate: Disable calculator via feature flag
- Investigate: Identify formula error or data issue
- Fix: Correct calculation, verify with domain expert
- Deploy: Hot-fix within 24 hours
- Verify: Test extensively before re-enabling

**Severity 2 (High - Calculator crashes or performance issue):**

- Immediate: Add warning banner if UX affected
- Investigate: Profile performance, identify bottleneck
- Fix: Optimize or rollback problematic feature
- Deploy: Fix within 48 hours
- Verify: Performance testing before deployment

**Severity 3 (Medium - UI issues, translations):**

- Log: Track issue for next release
- Fix: Include in next minor version (v5.0.1)
- Deploy: Within 1 week

**Full Rollback (Entire v5.0):**

- If multiple critical issues, rollback to v4.0.x
- Disable new categories (engineering, chemistry, hyper-v) via feature flags
- Keep existing v4.0 calculators functional
- Announce maintenance period, estimated fix timeline

---

## Resource Requirements

**Development:**

- 1 full-stack developer (primary)
- 1 frontend developer (UI/UX, mobile)
- Access to domain experts (engineering, chemistry, infrastructure) for review

**Review & QA:**

- 1 structural engineer (5 hours, beam/column calculators)
- 1 chemist (5 hours, molecular weight/stoichiometry calculators)
- 1 IT infrastructure professional (5 hours, Hyper-V/licensing calculators)
- 1 QA tester (10 hours, mobile/cross-browser testing)

**Data & Research:**

- IUPAC atomic weights (free, public domain)
- AISC Steel Manual (existing reference, verify license)
- NIST unit conversion factors (free, public domain)
- Hypervisor pricing research (ongoing, public data)

**Total Estimated Effort:**

- Development: 26 days (156 hours)
- Review: 15 hours
- QA: 10 hours
- **Total: 181 hours (~4.5 developer-weeks)**

---

## Dependencies & Blockers

**External Dependencies:**

- IUPAC 2024 atomic weights (publicly available)
- NIST unit conversion standards (publicly available)
- AISC Steel Manual access (verify licensing for data extraction)
- Vendor pricing data (VMware, Microsoft, Proxmox) - public info

**Internal Dependencies:**

- Zustand store pattern (v1.0) - existing
- URL state middleware (v1.0) - existing
- PDF export component (v3.0) - existing
- recharts library (v3.0) - existing
- i18n infrastructure (v1.0) - existing

**Potential Blockers:**

- Domain expert availability for review (schedule in advance)
- AISC Steel Manual licensing for data extraction (research alternatives if needed)
- mathjs bundle size exceeds target (fallback: custom implementation)
- Formula parsing complexity underestimated (allocate buffer time)

**Mitigation:**

- Domain expert reviews scheduled during Phase 36
- Alternative material property sources researched (MatWeb, Total Materia)
- Bundle size monitored continuously, tree-shaking verified
- 20% time buffer for unexpected complexity

---

## v5.0 Milestone Summary

**Total Duration:** 6 weeks (26 days + 5 days buffer = 31 days)

**Phase Breakdown:**

- Phase 31: Engineering Structural (5 days)
- Phase 32: Engineering Materials/Hydraulics (4 days)
- Phase 33: Chemistry Core (4 days)
- Phase 34: Chemistry Advanced (4 days)
- Phase 35: Hyper-V & Multi-Platform (5 days)
- Phase 36: Verification & Polish (4 days)

**Deliverables:**

- 18 new calculators (6 Engineering, 6 Chemistry, 6 Hyper-V/Virtualization)
- 2 new categories (Engineering, Chemistry)
- 3 extended calculators (VM Storage, Server Virtualization, Virtualization Cost)
- 3 new npm dependencies (mathjs, convert, molecular-formula)
- 8 reference data files (JSON)
- 3 ADRs (Architecture Decision Records)
- Updated documentation (CHANGELOG, guides, README)

**Outcomes:**

- Calculator count: 172 → 190 (+10.5%)
- Category count: 16 → 18
- Bundle size: +90-110 KB (+18-22%)
- Professional domains: 3 (Engineering, Chemistry, IT Infrastructure)

**Risk Level:** MEDIUM

- Formula accuracy (testing + domain expert review)
- Data quality (IUPAC/NIST/AISC sources, versioning)
- Licensing complexity (extensive testing, edge cases)

**Next Milestone:** v6.0 (TBD - user experience enhancements, advanced features, additional domains)

---

_Roadmap created: 2026-01-27_
_Phase 31 planned: 2026-01-27 (4 plans in 2 waves)_
_Ready for execution: Phase 31 starts upon approval_
