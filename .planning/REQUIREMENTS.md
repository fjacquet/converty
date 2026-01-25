# v4.0 Requirements

**Version:** 4.0 - Security & Infrastructure
**Created:** 2026-01-25
**Status:** Active

---

## Milestone Goal

Eliminate all security vulnerabilities and expand calculator offerings into enterprise infrastructure/virtualization domain.

---

## Requirements

### Security & Code Quality (SEC)

**SEC-01: CodeQL High Severity Fixes**

- Status: Pending
- User can use application without remote property injection vulnerabilities
- **Acceptance:**
  - url-params.ts uses parameter whitelist or Map-based storage
  - No dynamic property access from untrusted URL input
  - CodeQL scan shows 0 High severity issues
  - All existing calculators continue to work with URL state

**SEC-02: Container Vulnerability Documentation**

- Status: Pending
- User understands why libpng Trivy alerts don't affect production
- **Acceptance:**
  - `.trivyignore` updated with libpng CVE-2024-44191 suppression
  - Documentation explains: static export = no Docker in production
  - 6-month review date documented (July 2026)

**SEC-03: Code Quality Cleanup**

- Status: Pending
- User sees clean codebase with zero unused code
- **Acceptance:**
  - All unused imports removed (12 files affected)
  - All unused variables removed (Warning + Note severity)
  - Biome lint passes with 0 warnings
  - Pre-commit hooks prevent re-introduction

---

### Infrastructure Calculators (INFRA)

**INFRA-01: VM Storage Calculator**

- Status: Pending
- User can calculate vSphere ESX cluster storage capacity requirements
- **Acceptance:**
  - Input: VM count, disk size per VM, RAM per VM, snapshot %, thin provisioning %
  - Calculate: Total provisioned, swap space, snapshot space, total required
  - Output: Storage capacity with RAID overhead
  - Supports both thick and thin provisioning models
  - All 4 locales translated (en, fr, de, it)

**INFRA-02: Kubernetes Capacity Calculator**

- Status: Complete ✅
- User can calculate Kubernetes cluster node requirements
- **Acceptance:**
  - Input: Pod count, CPU per pod (millicores), memory per pod (Mi) ✅
  - Input: Node specs (CPU cores, RAM GB) ✅
  - Input: System reserved %, target utilization % ✅
  - Calculate: Nodes needed (by CPU and memory constraints) ✅
  - Output: Recommended node count, utilization breakdown ✅
  - Warning if utilization > 80% ✅
  - All 4 locales translated ✅
- **Phase:** 28-k8s-capacity-calculator
- **Verification:** .planning/phases/28-k8s-capacity-calculator/28-VERIFICATION.md

**INFRA-03: Server Virtualization Calculator**

- Status: Pending
- User can calculate ESX host count for VM workload
- **Acceptance:**
  - Input: VM count, vCPU per VM, RAM per VM
  - Input: Host specs (cores, RAM)
  - Input: vCPU-to-core ratio, target utilization %
  - Input: High availability (N+1) toggle
  - Calculate: Hosts needed (by CPU and memory)
  - Output: Total hosts with HA consideration
  - Display vCPU consolidation ratio
  - All 4 locales translated

**INFRA-04: VMware Licensing Calculator**

- Status: Pending
- User can calculate VMware VCF/VVF licensing costs
- **Acceptance:**
  - Input: Host count, CPU per host, cores per CPU
  - Input: Product type (VCF, VVF, vSphere EP, vSphere Std)
  - Input: Term (1, 3, or 5 years)
  - Calculate: Total cores licensed (min 16/CPU enforced)
  - Calculate: Annual cost, total cost
  - Display: vSAN storage entitlement (1 TiB/core for VCF, 0.25 TiB for VVF)
  - Pricing based on 2026 list prices: VCF $350/core/year, VVF $135/core/year
  - All 4 locales translated

**INFRA-05: Virtualization Cost Calculator**

- Status: Pending
- User can estimate total cost of ownership for virtualization infrastructure
- **Acceptance:**
  - Input: Hardware costs (servers, storage, network)
  - Input: Software costs (VMware licensing, OS, backup)
  - Input: Operational costs (power $/kWh, cooling PUE, datacenter $/RU, labor)
  - Input: Term years
  - Calculate: CAPEX (one-time hardware)
  - Calculate: OPEX annual (power, software, datacenter, labor)
  - Calculate: Total Cost of Ownership (TCO)
  - Calculate: Cost per VM over term
  - Output: Cost breakdown by category
  - All 4 locales translated

---

### User Experience (UX)

**UX-01: Infrastructure Category**

- Status: Pending
- User can discover infrastructure calculators in dedicated category
- **Acceptance:**
  - New "Infrastructure" category added to registry
  - Category icon and description
  - All 5 calculators registered under infrastructure
  - Category appears in navigation
  - Search includes infrastructure calculators
  - All 4 locales have category translations

**UX-02: Code Splitting for Infrastructure**

- Status: Pending
- User experiences fast load times (infrastructure calculators lazy-loaded)
- **Acceptance:**
  - Infrastructure calculators use dynamic imports
  - Separate chunks created for each calculator
  - Initial bundle size not increased
  - Search results load instantly

**UX-03: Export Support**

- Status: Pending
- User can export infrastructure calculator results as PDF/CSV
- **Acceptance:**
  - PDF export includes all inputs and results
  - CSV export has proper headers and formatting
  - UTF-8 BOM for Excel compatibility
  - Injection prevention for CSV formulas
  - Export buttons accessible from results
  - All 4 locales supported in exports

---

## Traceability Matrix

| Requirement | Priority | Phase | Status |
|-------------|----------|-------|--------|
| SEC-01 | High | TBD | Pending |
| SEC-02 | Medium | TBD | Pending |
| SEC-03 | Medium | TBD | Pending |
| INFRA-01 | High | TBD | Pending |
| INFRA-02 | High | 28 | Complete |
| INFRA-03 | High | TBD | Pending |
| INFRA-04 | High | TBD | Pending |
| INFRA-05 | Medium | TBD | Pending |
| UX-01 | High | 26 | Complete |
| UX-02 | Medium | 26 | Complete |
| UX-03 | Medium | TBD | Pending |

**Total Requirements:** 11
**High Priority:** 7
**Medium Priority:** 4

---

## Success Criteria

**Security:**

- [ ] Zero CodeQL High severity alerts
- [ ] Zero unused imports/variables
- [ ] All security vulnerabilities documented or fixed

**Functionality:**

- [ ] All 5 infrastructure calculators working
- [ ] All calculations match industry reference tools
- [ ] URL state persistence works for all calculators

**Quality:**

- [ ] 100% translation coverage (4 locales)
- [ ] Zero Biome lint errors
- [ ] Zero TypeScript errors
- [ ] PDF/CSV export working for all new calculators

**Performance:**

- [ ] Infrastructure category lazy-loaded
- [ ] Initial bundle size unchanged
- [ ] Search performance maintained

---

## Out of Scope for v4.0

- API integrations for live VMware pricing
- Multi-cloud cost comparison (AWS, Azure, GCP)
- Historical cost tracking
- Team collaboration features
- Advanced capacity forecasting (trend analysis)
- Integration with vCenter/Kubernetes APIs
- Real-time cluster monitoring

---

## Dependencies

**Internal:**

- Existing export utilities (PDF/CSV from v3.0)
- Calculator store factory pattern
- URL sync middleware
- Translation infrastructure

**External:**

- None (all calculations client-side)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| VMware pricing changes | Medium | Use 2026 list prices, add disclaimer |
| Complex virtualization formulas | Medium | Reference industry calculators, add help text |
| Security fix breaks URL state | High | Comprehensive testing before deployment |
| Translation workload | Low | Follow established patterns |

---

_Last updated: 2026-01-25_
