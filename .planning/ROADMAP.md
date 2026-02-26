# Roadmap: Converty

## Milestones

- ✅ **v1.0 Infrastructure Upgrade** — Phases 1–8 (shipped 2026-01-18)
- ✅ **v2.0 Network Tools & User Experience** — Phases 9–16 (shipped 2026-01-22)
- ✅ **v3.0 Calculator Expansion & Performance** — Phases 17–24 (shipped 2026-01-25)
- ✅ **v4.0 Security & Infrastructure** — Phases 25–30 (shipped 2026-01-25)
- ✅ **v5.0 Calculator Expansion** — Phases 31–36 (shipped 2026-01-29)
- ✅ **v6.0 CPU Performance & Server Refresh** — Phases 37–39 (shipped 2026-02-23)

## Phases

<details>
<summary>✅ v1.0 Infrastructure Upgrade (Phases 1–8) — SHIPPED 2026-01-18</summary>

See `.planning/milestones/v1.0-ROADMAP.md` for full details.

- [x] Phase 1: Type Safety Foundation — completed 2026-01-17
- [x] Phase 2: URL Sync Infrastructure — completed 2026-01-17
- [x] Phase 3: State Migration — completed 2026-01-17
- [x] Phase 4: Progressive Web App — completed 2026-01-18
- [x] Phase 5: Documentation — completed 2026-01-18
- [x] Phase 6: Dependency Upgrade — completed 2026-01-18
- [x] Phase 7: Code Quality Validation — completed 2026-01-18
- [x] Phase 8: Developer Experience — completed 2026-01-18

</details>

<details>
<summary>✅ v2.0 Network Tools & User Experience (Phases 9–16) — SHIPPED 2026-01-22</summary>

See `.planning/milestones/v2.0-ROADMAP.md` for full details.

- [x] Phase 9: Visual Subnet Foundation — completed 2026-01-22
- [x] Phase 10: Visual Subnet Visualization — completed 2026-01-22
- [x] Phase 11: Visual Subnet Advanced — completed 2026-01-22
- [x] Phase 12: IP/CIDR Calculators — completed 2026-01-22
- [x] Phase 13: Network Speed/Latency — completed 2026-01-22
- [x] Phase 14: Global Search — completed 2026-01-22
- [x] Phase 15: Translation Audit — completed 2026-01-22
- [x] Phase 16: Translation Implementation — completed 2026-01-22

</details>

<details>
<summary>✅ v3.0 Calculator Expansion & Performance (Phases 17–24) — SHIPPED 2026-01-25</summary>

See `.planning/milestones/v3.0-ROADMAP.md` for full details.

- [x] Phase 17: Crypto/Blockchain Foundation — completed 2026-01-25
- [x] Phase 18: Real Estate Foundation — completed 2026-01-25
- [x] Phase 19: Cooking/Nutrition Foundation — completed 2026-01-25
- [x] Phase 20: Automotive Calculators — completed 2026-01-25
- [x] Phase 21: Code Splitting & Lazy Loading — completed 2026-01-25
- [x] Phase 24: Export Functionality — completed 2026-01-25

</details>

<details>
<summary>✅ v4.0 Security & Infrastructure (Phases 25–30) — SHIPPED 2026-01-25</summary>

See `.planning/milestones/v4.0-ROADMAP.md` for full details.

- [x] Phase 25: Security Hardening — completed 2026-01-25
- [x] Phase 26: Infrastructure Category Foundation — completed 2026-01-25
- [x] Phase 27: VM Storage Calculator — completed 2026-01-25
- [x] Phase 28: K8s Capacity Calculator — completed 2026-01-25
- [x] Phase 29: VMware Server Licensing — completed 2026-01-25
- [x] Phase 30: Virtualization Cost & Export — completed 2026-01-25

</details>

<details>
<summary>✅ v5.0 Calculator Expansion (Phases 31–36) — SHIPPED 2026-01-29</summary>

See `.planning/milestones/v5.0-ROADMAP.md` for full details.

- [x] Phase 31: Engineering Structural Calculators — completed 2026-01-29
- [x] Phase 32: Engineering Materials & Hydraulics — completed 2026-01-29
- [x] Phase 33: Chemistry Core Calculators — completed 2026-01-29
- [x] Phase 34: Chemistry Advanced Calculators — completed 2026-01-29
- [x] Phase 35: Hyper-V Multiplatform Calculators — completed 2026-01-29
- [x] Phase 36: Hypervisor Comparison — completed 2026-01-29

</details>

<details>
<summary>✅ v6.0 CPU Performance & Server Refresh (Phases 37–39) — SHIPPED 2026-02-23</summary>

See `.planning/milestones/v6.0-ROADMAP.md` for full details.

- [x] Phase 37: CPU Database Foundation (2/2 plans) — completed 2026-02-23
- [x] Phase 38: CPU Comparison Calculator (3/3 plans) — completed 2026-02-23
- [x] Phase 39: Server Refresh Calculator (3/3 plans) — completed 2026-02-23

</details>

---

## 🚧 v7.0 Framework Migration (Phases 40–48) — IN PROGRESS

**Branch:** `feature/framework-migration`
**Goal:** Adopt Raidy's proven building blocks — Vitest testing, Zod validation, react-error-boundary, Sonner toasts, DOMPurify, LZ-String URL compression, discriminated union result types, and i18n namespace restructure. All without replacing Next.js.

- [ ] Phase 40: Vitest Foundation — **4 plans** — install Vitest, configure for Next.js, test 5 priority converters
  - [ ] 40-01-PLAN.md — Install deps + vitest.config.ts + test-setup.ts + package.json scripts (Wave 1)
  - [ ] 40-02-PLAN.md — Tests: BB Credit, Subnet, BMI converters (Wave 2, parallel)
  - [ ] 40-03-PLAN.md — Tests: Compound Interest, Molecular Weight converters (Wave 2, parallel)
  - [ ] 40-04-PLAN.md — Coverage gate: verify ≥75% on all 5 files, fix gaps, TypeScript + Biome clean (Wave 3)
- [ ] Phase 41: Full Converter Test Coverage — unit tests for all 169 converters, 75% threshold in CI
- [ ] Phase 42: Error Boundaries & Toasts — react-error-boundary, Sonner, DOMPurify
- [ ] Phase 43: Zod Input Validation — schemas for all calculator inputs, Zod URL parsing
- [ ] Phase 44: LZ-String URL Compression — compress state in URL, backward compat
- [ ] Phase 45: Discriminated Union Result Types — `CalculationResult<T>`, update all converters
- [ ] Phase 46: i18n Namespace Restructure — nested translation objects, no library change
- [ ] Phase 47: ADRs & CI Hardening — ADRs 011–015, CI test gate, updated docs
- [ ] Phase 48: Branch Integration & Release v7.0 — merge, regression, tag, GitHub Release

See `.planning/REQUIREMENTS.md` and `.planning/GAP-ANALYSIS.md` for full details.

---

*Next action: `/gsd:execute-phase 40` to start Vitest Foundation*
