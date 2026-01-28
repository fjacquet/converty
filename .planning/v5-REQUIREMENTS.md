# v5.0 Calculator Expansion: Requirements

**Milestone:** v5.0 Calculator Expansion
**Status:** Requirements Definition
**Date:** 2026-01-27
**Research Complete:** Engineering/Chemistry (4 files), Hyper-V/Virtualization (4 files)

## Executive Summary

v5.0 expands Converty from 172 calculators to **190+ calculators** by adding three new domains:

1. **Engineering & CAD** (6 calculators) - Structural analysis, materials, hydraulics
2. **Chemistry & Science** (6 calculators) - Stoichiometry, molarity, molecular weight
3. **Hyper-V & Virtualization Platform** (6 calculators) - Multi-hypervisor support beyond VMware

**Bundle Impact:** ~90-110 KB total (+18-22% increase)

- Engineering/Chemistry: ~75-95 KB (mathjs, convert, molecular-formula, recharts reused)
- Hyper-V/Virtualization: ~15 KB (JSON data only, no new dependencies)

**Architectural Changes:** NONE - All calculators use existing v1.0-v4.0 patterns

**Risk Level:** MEDIUM

- Engineering/Chemistry: Formula accuracy, reference data versioning, unit conversion disasters
- Hyper-V: Licensing complexity (Windows Server core minimums), pricing staleness, HA overhead misunderstandings

---

## Core Value Proposition

**For Engineering Professionals:**

- Fast validation calculations without opening desktop CAD software (AutoCAD, SAP2000)
- Code-compliant formulas with citations (ACI 318, AISC 360, Eurocode)
- Mobile-friendly for field/site work
- PDF exports for project documentation and regulatory approval

**For Chemistry Professionals:**

- Lab-ready calculations (molarity, dilution, stoichiometry) on mobile devices
- Chemical formula parsing (Ca(OH)2, H2SO4) eliminates manual element entry
- Reproducible URLs for lab notebooks and methods sections
- IUPAC-compliant atomic weights (2024 standard)

**For IT Infrastructure Professionals:**

- Independent multi-platform comparison (VMware vs Hyper-V vs Proxmox vs XCP-ng)
- Post-Broadcom VMware migration planning (licensing cost comparison)
- Windows Server Datacenter vs Standard break-even analysis
- TCO comparison with migration and training costs

**Market Positioning:**

- Existing tools are vendor-specific (WintelGuy for VMware, Microsoft calculators)
- Most engineering calculators are desktop software (expensive, overkill for simple calculations)
- Chemistry calculators rarely parse formulas (require manual element entry)
- Converty's cross-domain platform advantage: One site for all professional calculations

---

## Requirements by Domain

### Domain 1: Engineering & CAD Calculators

**Category:** New `engineering` category
**Subcategories:** structural, materials, hydraulics
**Bundle Impact:** ~60-80 KB (mathjs 20-30KB tree-shaken, convert 3-5KB, recharts reused)
**Calculators:** 6 (MVP scope)

#### 1.1 Beam Deflection Calculator

**Path:** `/engineering/beam-deflection`
**Priority:** HIGH (most requested engineering calculation)

**User can:**

- Calculate maximum deflection (δ) for simply supported, cantilever, and fixed-fixed beams
- Apply point loads, uniform distributed loads (UDL), or combined loading
- Select material from database (steel, aluminum, wood, concrete) → auto-fills Young's modulus
- Select standard beam section (I-beam, channel, rectangular, circular) → auto-fills moment of inertia
- View shear force and bending moment diagrams (SVG visualization)
- See step-by-step calculation with formula references
- Export as PDF with diagrams for project documentation

**Inputs:**

- Beam length (m, mm, ft, in)
- Load type: Point load, UDL, combined
- Load magnitude (kN, lbf, kg)
- Load position(s)
- Material selection (dropdown: ASTM A36 steel, Aluminum 6061-T6, Douglas Fir, Concrete C30)
- Cross-section: Standard section library or custom dimensions

**Outputs:**

- Maximum deflection (m, mm, in) with position
- Maximum bending stress (MPa, psi)
- Shear force diagram (SVG)
- Bending moment diagram (SVG)
- Safety factor (based on yield strength)
- Support reactions

**Formula:** δ = (5wL⁴)/(384EI) for UDL, δ = (PL³)/(48EI) for centered point load
**Reference:** Beer & Johnston, Mechanics of Materials, 8th Edition

**Complexity:** MEDIUM (standard formulas, SVG diagrams)
**Risk:** Formula errors, unit consistency

---

#### 1.2 Moment of Inertia Calculator

**Path:** `/engineering/moment-of-inertia`
**Priority:** MEDIUM (supports beam deflection calculations)

**User can:**

- Calculate moment of inertia (Ix, Iy) for standard sections
- Calculate section modulus (Zx, Zy)
- Select from standard sections library (W-shapes, C-channels, angles, tubes)
- Define composite shapes (multiple rectangles, circles, I-sections)
- Apply parallel axis theorem automatically for offset shapes
- View cross-section visualization (SVG)

**Standard Sections Supported:**

- I-beams (W-shapes: W310×38, W360×51, etc.)
- C-channels (C200×17, C250×23, etc.)
- Rectangular hollow sections (RHS)
- Circular hollow sections (CHS)
- Solid rectangles and circles
- Custom composite shapes

**Formula:** I = Σ(Ic + Ad²) where Ic = centroidal inertia, A = area, d = offset
**Reference:** AISC Steel Construction Manual, 15th Edition

**Complexity:** MEDIUM (parallel axis theorem, composite shapes)
**Risk:** Calculation errors for complex composites

---

#### 1.3 Stress-Strain Calculator

**Path:** `/engineering/stress-strain`
**Priority:** MEDIUM

**User can:**

- Calculate stress (σ = F/A), strain (ε = ΔL/L), and Young's modulus (E = σ/ε)
- Convert between stress units (MPa, GPa, psi, ksi)
- Select material to auto-fill properties
- Calculate safety factor based on yield strength
- Determine if material is in elastic or plastic region
- View stress-strain curve for selected material

**Applications:**

- Tensile testing analysis
- Compression member design
- Material selection for known loads

**Formula:** σ = F/A, ε = ΔL/L, E = σ/ε
**Reference:** Hibbeler, Mechanics of Materials, 10th Edition

**Complexity:** LOW (algebraic equations)
**Risk:** Unit conversion errors

---

#### 1.4 Column Buckling Calculator

**Path:** `/engineering/column-buckling`
**Priority:** MEDIUM

**User can:**

- Calculate critical buckling load (Euler's formula)
- Determine effective length factor (K) for various end conditions
- Check slenderness ratio (KL/r)
- Verify against design codes (AISC, Eurocode 3)
- Calculate axial load capacity
- See if column is short (crushing) or long (buckling)

**End Conditions:**

- Fixed-fixed (K=0.5)
- Fixed-pinned (K=0.7)
- Pinned-pinned (K=1.0)
- Fixed-free (K=2.0)

**Formula:** Pcr = (π²EI)/(KL)²
**Reference:** AISC 360-16, Chapter E (Compression Members)

**Complexity:** MEDIUM (effective length factors, code compliance)
**Risk:** Misunderstanding effective length, code interpretation

---

#### 1.5 Pipe Flow & Pressure Drop Calculator

**Path:** `/engineering/pipe-flow`
**Priority:** MEDIUM

**User can:**

- Calculate pressure drop using Darcy-Weisbach equation
- Determine Reynolds number (laminar vs turbulent)
- Calculate friction factor (Moody diagram, Colebrook-White equation)
- Select pipe material (steel, PVC, copper) → auto-fills roughness
- Select fluid (water, air, oil) → auto-fills density and viscosity
- View flow velocity and head loss

**Inputs:**

- Pipe diameter (mm, in)
- Pipe length (m, ft)
- Flow rate (L/s, GPM, m³/h)
- Fluid type
- Pipe material (affects roughness)

**Outputs:**

- Pressure drop (kPa, psi, bar)
- Reynolds number
- Friction factor
- Flow velocity (m/s, ft/s)
- Head loss (m, ft)

**Formula:** ΔP = f × (L/D) × (ρv²/2), f from Colebrook-White or Swamee-Jain
**Reference:** Engineering ToolBox, Darcy-Weisbach Equation

**Complexity:** MEDIUM (iterative friction factor calculation for turbulent flow)
**Risk:** Reynolds number edge cases, roughness data accuracy

---

#### 1.6 Unit Converter (Engineering Units)

**Path:** `/engineering/unit-converter`
**Priority:** HIGH (high usage, low complexity)

**User can:**

- Convert between engineering units with high precision (12 digits)
- Handle SI ↔ Imperial conversions
- Convert force (N, kN, lbf, kip)
- Convert pressure (Pa, MPa, psi, bar, atm)
- Convert length (m, mm, ft, in)
- Convert area (m², mm², ft², in²)
- Convert moment of inertia (mm⁴, in⁴)
- Convert section modulus (mm³, in³)
- Square/cube factors automatically for area/volume

**NIST-Sourced Conversion Factors:**

- 1 inch = 25.4 mm (exact, by definition)
- 1 lbf = 4.4482216152605 N (NIST SP 811)
- 1 psi = 6894.757293168 Pa (derived)

**Complexity:** LOW (multiplication by factors)
**Risk:** Unit conversion disasters (Mars Climate Orbiter: $327M loss)

---

### Domain 2: Chemistry & Science Calculators

**Category:** New `chemistry` category
**Subcategories:** general, stoichiometry, solutions
**Bundle Impact:** ~15-20 KB (molecular-formula 2-5KB, periodic table JSON ~15KB compressed)
**Calculators:** 6 (MVP scope)

#### 2.1 Molecular Weight Calculator

**Path:** `/chemistry/molecular-weight`
**Priority:** HIGH (fundamental chemistry calculation)

**User can:**

- Enter chemical formula (H2O, Ca(OH)2, Fe2(SO4)3, Mg3(PO4)2·8H2O)
- Get molar mass calculated from IUPAC 2024 atomic weights
- See elemental composition breakdown (mass %, atom count)
- View total atom count
- See step-by-step calculation showing each element contribution

**Formula Parsing:**

- Supports: Parentheses, brackets, hydration (·), subscripts
- Examples: H2O, NaCl, Ca(OH)2, Fe2(SO4)3, CuSO4·5H2O
- Invalid: unbalanced parentheses, unknown elements

**Reference Data:**

- IUPAC Standard Atomic Weights 2024
- Atomic masses accurate to 4-6 decimal places
- Data version displayed: "Using IUPAC 2024 atomic weights"

**Complexity:** HIGH (formula parsing with nested parentheses)
**Risk:** Parser bugs, outdated atomic weights

---

#### 2.2 Molarity & Concentration Calculator

**Path:** `/chemistry/molarity`
**Priority:** HIGH (daily lab use)

**User can:**

- Calculate molarity (M = moles / L)
- Calculate mass needed for solution preparation
- Convert between concentration units (M, mM, µM, %, ppm, mg/mL)
- Enter chemical formula → auto-calculates molar mass
- Get solution preparation instructions: "Weigh X g, dissolve in Y mL, dilute to Z mL"

**Formula:** M = n/V = m/(M_w × V)
Where: M = molarity, n = moles, V = volume (L), m = mass (g), M_w = molar mass (g/mol)

**Unit Conversions:**

- Molarity (M, mM, µM, nM)
- Mass concentration (g/L, mg/mL, µg/mL)
- Percent (%, w/v, v/v)
- Parts per million/billion (ppm, ppb)

**Complexity:** MEDIUM (unit conversions, formula parsing)
**Risk:** Unit confusion, molar mass errors

---

#### 2.3 Dilution Calculator (M1V1=M2V2)

**Path:** `/chemistry/dilution`
**Priority:** HIGH (most common lab calculation)

**User can:**

- Calculate dilution volumes using M₁V₁ = M₂V₂
- Solve for any variable (M1, V1, M2, V2)
- Get step-by-step instructions: "Add X mL stock to Y mL diluent"
- Handle serial dilutions (multi-step)
- Convert between concentration units

**Formula:** M₁V₁ = M₂V₂
Where: M₁ = stock concentration, V₁ = stock volume, M₂ = final concentration, V₂ = final volume

**Safety Warning:** Display "Always add acid to water, never water to acid" for acid dilutions

**Complexity:** LOW (algebraic rearrangement)
**Risk:** Unit mixing (mL vs L), safety warnings for acids

---

#### 2.4 Stoichiometry Calculator

**Path:** `/chemistry/stoichiometry`
**Priority:** MEDIUM

**User can:**

- Enter balanced chemical equation
- Input available reactant amounts (mass or moles)
- Calculate limiting reactant
- Calculate theoretical yield for all products
- Calculate excess reactant remaining
- See mole ratios from balanced equation
- Get step-by-step stoichiometry calculations

**Example:**

- Equation: 2 H₂ + O₂ → 2 H₂O
- Input: 5 g H₂, 10 g O₂
- Output: O₂ is limiting, theoretical yield: 11.25 g H₂O, 3.75 g H₂ excess

**Formula:** mole ratio from coefficients, mass = moles × molar mass

**Complexity:** MEDIUM (mole ratios, limiting reagent logic)
**Risk:** Unbalanced equations, molar mass errors

---

#### 2.5 pH Calculator

**Path:** `/chemistry/ph-calculator`
**Priority:** MEDIUM

**User can:**

- Calculate pH from [H⁺] concentration
- Calculate [H⁺] from pH
- Calculate pOH, [OH⁻]
- Handle strong acids and bases
- Calculate pH of buffer solutions (Henderson-Hasselbalch)
- Select from common acids/bases (HCl, NaOH, H₂SO₄, NH₃)

**Formula:**

- pH = -log₁₀[H⁺]
- pOH = -log₁₀[OH⁻]
- pH + pOH = 14 (at 25°C)
- Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])

**Complexity:** MEDIUM (logarithms, buffer calculations)
**Risk:** pKa values accuracy, temperature dependence not modeled

---

#### 2.6 Periodic Table Reference

**Path:** `/chemistry/periodic-table`
**Priority:** MEDIUM (reference tool, integrates with other calculators)

**User can:**

- View interactive periodic table (118 elements)
- Click element to see details: atomic number, mass, symbol, electron configuration
- Search by name, symbol, or atomic number
- Filter by category (metal, nonmetal, noble gas, etc.)
- See IUPAC 2024 atomic weights with precision
- Use as picker for molecular weight calculator

**Data:**

- All 118 elements
- Atomic number, symbol, name (translated to en/fr/de/it)
- Atomic mass (IUPAC 2024 standard)
- Electron configuration
- Element category

**Complexity:** LOW (display component, no calculations)
**Risk:** Translation consistency, data accuracy

---

### Domain 3: Hyper-V & Virtualization Platform Calculators

**Category:** Extend existing `infrastructure` category
**Subcategories:** capacity, licensing, cost
**Bundle Impact:** ~15 KB (JSON data only, no new dependencies)
**Calculators:** 6 (3 extended + 3 new)

#### 3.1 VM Storage Calculator (EXTENDED)

**Path:** `/infrastructure/vm-storage-calculator` (existing, extend)
**Priority:** HIGH (extend v4.0 calculator)

**Extend with:**

- Platform selector: VMware (existing), Hyper-V, Proxmox, XCP-ng
- Platform-specific disk formats: VMDK (VMware), VHDX (Hyper-V), qcow2 (Proxmox), VDI (XCP-ng)
- Platform-specific snapshot overhead: VMware 15%, Hyper-V 20%, Proxmox 10-15%
- Storage replication options: Hyper-V Replica (2×), Ceph replication (Proxmox, 2× or 3×)

**Backward Compatibility:** Default platform = VMware (existing behavior preserved)

**Complexity:** LOW (extend existing calculator with platform selector)
**Risk:** Platform-specific assumptions documented

---

#### 3.2 Server Virtualization Calculator (EXTENDED)

**Path:** `/infrastructure/server-virtualization-calculator` (existing, extend)
**Priority:** HIGH (extend v4.0 calculator)

**Extend with:**

- Platform selector with overhead factors:
  - VMware ESXi: 10-15% overhead (existing)
  - Hyper-V: 5-10% overhead (more efficient with Windows VMs)
  - Proxmox/KVM: 5-8% overhead
  - XCP-ng/Xen: 8-12% overhead
- Workload type selector (Windows, Linux, Mixed) affects overhead
- Platform-specific HA models

**Backward Compatibility:** Default platform = VMware (existing)

**Complexity:** LOW (add platform selector, adjust overhead)
**Risk:** Overhead assumptions documented

---

#### 3.3 Virtualization Cost Calculator (EXTENDED)

**Path:** `/infrastructure/virtualization-cost` (existing, extend to comparison mode)
**Priority:** HIGH (extend v4.0 TCO calculator)

**Extend with:**

- Comparison mode: Show VMware, Hyper-V, Proxmox, XCP-ng side-by-side
- Platform-specific licensing costs (with date stamps)
- Migration cost estimates (VMware → alternative)
- Training cost field (default estimates per platform)
- Support cost models (% of license vs per-host vs per-CPU)
- TCO chart showing 3-year or 5-year breakdown

**Output:**

- Side-by-side cost comparison table
- Bar chart: Hardware, Licensing, Support, Training, Migration
- Break-even analysis: "Hyper-V breaks even in Year 2"

**Complexity:** MEDIUM (extend existing, add comparison UI)
**Risk:** Pricing data staleness (require quarterly updates)

---

#### 3.4 Hyper-V Consolidation Calculator (NEW)

**Path:** `/infrastructure/hyperv-consolidation`
**Priority:** HIGH (new calculator, critical for Hyper-V planning)

**User can:**

- Input workload: # VMs, vCPU/VM, RAM/VM, storage/VM
- Select HA level (N+1, N+2, none)
- Enable/disable Hyper-V Replica (affects storage 2×)
- Specify host specs (cores, RAM, storage)
- Get host count recommendation
- Get Windows Server Datacenter licensing cost
- See capacity breakdown and utilization warnings

**Outputs:**

- Total resources needed (vCPU, RAM, storage)
- Required hosts (with HA factored in)
- Licensing: Windows Server Datacenter core licenses needed
- Cost estimate (Windows licensing)
- Warnings if utilization >80%

**Complexity:** MEDIUM (HA calculations, licensing logic)
**Risk:** Windows Server core licensing minimums (16 cores/server), HA formula correctness

---

#### 3.5 Windows Server Licensing Calculator (NEW)

**Path:** `/infrastructure/windows-licensing`
**Priority:** HIGH (critical for cost planning)

**User can:**

- Input: # servers, cores per server, processors per server
- Get Datacenter vs Standard recommendation
- See break-even point (Datacenter cheaper at 13+ VMs per host)
- Calculate core licenses needed (minimum 16 per server, 8 per processor)
- Get total cost estimate (2-core license packs)

**Licensing Rules:**

- Minimum 16 cores per server
- Minimum 8 cores per processor
- Licenses sold in 2-core packs
- Standard: 2 VM instances per license
- Datacenter: Unlimited VMs per license

**Outputs:**

- Core licenses needed (respecting minimums)
- License packs needed (2-core packs)
- Datacenter vs Standard cost comparison
- Recommendation with break-even analysis
- Cost estimate (with date stamp)

**Complexity:** MEDIUM (licensing rules have many edge cases)
**Risk:** Core minimums misunderstood, Datacenter/Standard break-even

---

#### 3.6 Hypervisor Comparison Calculator (NEW)

**Path:** `/infrastructure/hypervisor-comparison`
**Priority:** MEDIUM (decision support tool)

**User can:**

- Input workload requirements once
- See sizing for VMware, Hyper-V, Proxmox, XCP-ng side-by-side
- Compare features: live migration, HA, distributed storage, backup integration
- Compare costs: Hardware (same), Licensing (vastly different), Support, Training
- See TCO over 3 or 5 years
- Export comparison as PDF for management

**Comparison Dimensions:**

- Sizing: Host count, resource requirements
- Features: Availability, limitations, notes
- Costs: Breakdown by category (hardware, licensing, support, training, migration)
- TCO Chart: Stacked bar chart showing costs over time

**Complexity:** HIGH (multi-platform logic, feature matrix, cost comparison UI)
**Risk:** Feature equivalence nuances, pricing staleness, bias perception

---

## Reference Data Requirements

### Engineering Domain

**File:** `src/data/engineering/materials.json` (~8 KB compressed)

**Content:**

- Material ID, name, category
- Density (kg/m³)
- Young's modulus (GPa)
- Yield strength (MPa)
- Tensile strength (MPa)
- Poisson's ratio
- Data source (ASTM standard, version)

**Materials (200-500 entries):**

- Structural steel: A36, A572 Gr50, A992
- Aluminum: 6061-T6, 7075-T6
- Wood: Douglas Fir, Southern Pine
- Concrete: C20, C30, C40

**File:** `src/data/engineering/beam-sections.json` (~10 KB compressed)

**Content:**

- Section designation (W310×38, C200×17)
- Section type (I-beam, channel, rectangular, circular)
- Dimensions (depth, width, flange thickness, web thickness)
- Properties (Ix, Iy, Zx, Zy, area)
- Weight (kg/m)
- Data source (AISC Steel Construction Manual)

**Sections (500-1000 entries):**

- W-shapes (wide flange I-beams)
- C-channels
- Angles (L-shapes)
- Rectangular/circular hollow sections

---

### Chemistry Domain

**File:** `src/data/chemistry/periodic-table.json` (~15 KB compressed)

**Content:**

- Atomic number
- Element symbol (universal, never translate)
- Element name key (translation key: "elements.hydrogen")
- Atomic mass (IUPAC 2024)
- Electron configuration
- Element category (metal, nonmetal, noble gas, etc.)
- Data source: IUPAC CIAAW 2024

**Data Version:** 2024
**Update Frequency:** Annual (IUPAC releases updates)

**File:** `src/data/chemistry/common-compounds.json` (~5 KB compressed)

**Content:**

- Common name
- Chemical formula
- Molar mass
- Common uses/notes

**Examples:**

- Water: H2O, 18.015 g/mol
- Sodium chloride: NaCl, 58.443 g/mol
- Sulfuric acid: H2SO4, 98.079 g/mol
- Calcium carbonate: CaCO3, 100.087 g/mol

---

### Hyper-V & Virtualization Domain

**File:** `src/data/infrastructure/hypervisor-overhead.json` (~3 KB)

**Content:**

- Platform ID
- Overhead by workload type (Windows, Linux, Mixed)
- Version (e.g., "Hyper-V 2025", "ESXi 8.0")
- Updated date
- Data source URL

**Example:**

```json
{
  "hyper-v": {
    "overhead": { "windows": 0.08, "linux": 0.10, "mixed": 0.09 },
    "version": "Hyper-V 2025",
    "updated": "2026-01-27",
    "source": "Microsoft TechNet"
  }
}
```

**File:** `src/data/infrastructure/licensing-costs.json` (~5 KB)

**Content:**

- Platform ID
- License type (perpetual, subscription)
- Cost per unit (core, host, CPU)
- Minimums (cores per server, etc.)
- Updated date (CRITICAL for staleness warnings)
- Source URL

**Example:**

```json
{
  "windows-datacenter": {
    "perCoreLicense": 6155,
    "minCoresPerServer": 16,
    "packSize": 2,
    "updated": "2026-01-27",
    "sourceUrl": "https://www.microsoft.com/en-us/windows-server/pricing"
  }
}
```

**File:** `src/data/infrastructure/hypervisor-features.json` (~7 KB)

**Content:**

- Feature name
- Availability by platform (yes/no/limited)
- Notes (limitations, requirements)
- Version assumptions

**Features:**

- Live migration
- HA clustering
- Distributed storage
- Container support
- Backup integration
- GPU passthrough
- Nested virtualization

---

## Non-Functional Requirements

### Performance

**Bundle Size Targets:**

- Engineering calculator: <150 KB per calculator page
- Chemistry calculator: <100 KB per calculator page
- Hyper-V calculator: <80 KB per calculator page
- Total site increase: <110 KB (acceptable for v5.0)

**Load Time:**

- First Contentful Paint: <2s (existing v4.0 standard)
- Calculator interaction: <100ms (instant feedback)
- PDF export generation: <3s

**Code Splitting:**

- Engineering calculators lazy-loaded as separate chunks
- Chemistry calculators lazy-loaded as separate chunks
- Reference data loaded on-demand (not in main bundle)

### Accuracy & Precision

**Engineering Calculations:**

- 10-12 digit precision internally
- Display appropriate significant figures (3-4 for most engineering)
- All formulas verified against textbook examples
- Unit conversions use NIST exact values

**Chemistry Calculations:**

- IUPAC 2024 atomic weights (4-6 decimal places)
- Significant figures tracked through calculation chain
- pH values: 2 decimal places
- Molar mass: 3 decimal places

**Hyper-V/Virtualization:**

- Cost calculations: 2 decimal places
- Resource calculations: Integer values (whole cores, GB RAM)
- Percentages: 1 decimal place

### Data Quality

**Reference Data:**

- All data sources documented with URLs
- Version/date stamps for all data files
- Annual review process for updates
- Warnings if data >6 months old

**Licensing Pricing:**

- "Pricing as of [date]" displayed prominently
- Link to vendor pricing pages
- Quarterly review reminder
- Warning if data >6 months old

### Internationalization

**Supported Locales:** en, fr, de, it (existing v1.0-v4.0)

**Translation Rules:**

- Chemical formulas NEVER translate: H₂O, NaCl (universal)
- Mathematical symbols NEVER translate: σ, δ, π, ∫, Σ
- SI unit symbols NEVER translate: m, kg, mol, Pa, N
- Unit names translate: "meters" → "mètres" → "Meter" → "metri"
- Element names translate: "Hydrogen" → "Hydrogène" → "Wasserstoff" → "Idrogeno"
- Descriptions translate: "Maximum deflection" → "Flèche maximale"

**Number Formatting:**

- Use `Intl.NumberFormat` for locale-aware display
- en-US: 1,234.56
- fr-FR: 1 234,56
- de-DE: 1.234,56
- it-IT: 1.234,56

### Validation & Error Handling

**Input Validation:**

- Range checks with helpful error messages: "vCPU must be 1-128"
- Sanity checks with warnings: "pH >14 is unusual. Verify inputs."
- Physical limits enforced: Temperature >0 K, Safety factor >1.0

**Error Tiers:**

- **Error:** Invalid input, cannot calculate (red, blocks calculation)
- **Warning:** Unusual but valid (yellow, calculation proceeds)
- **Info:** Helpful context (blue, informational)

**Example Validations:**

- Engineering: Beam load >0, material selected, section selected
- Chemistry: Formula valid syntax, concentration >0, volume >0
- Hyper-V: VM count >0, host specs realistic, licensing minimums respected

### Export & Documentation

**PDF Export (existing v3.0 component):**

- Include calculator name and description
- Show all inputs with units
- Show all outputs with units
- Include formula documentation (optional section)
- Include assumptions: platform version, data version, date
- Footer: "Generated by Converty on [date] | Verify assumptions before use"

**CSV Export (existing v3.0 component):**

- Header row with clear labels
- All numeric values as numbers (not formatted strings)
- Platform/version info in metadata rows

**URL State:**

- All inputs synced to URL (existing v1.0 middleware)
- Data version included for reproducibility
- Shareable URLs for collaboration

---

## Quality Gates

Before shipping v5.0:

**Functionality:**

- [ ] All 18 calculators pass unit tests (90%+ coverage)
- [ ] All formulas verified against published references
- [ ] Edge cases tested (zero, negative, extreme values)
- [ ] Domain expert review completed (engineering + chemistry)

**Performance:**

- [ ] Bundle size <110 KB increase (measured)
- [ ] Load time <2s for calculator pages
- [ ] No calculation >100ms (measured)

**Data Quality:**

- [ ] All reference data sourced from standards (IUPAC, ASTM, AISC)
- [ ] Version numbers and dates documented
- [ ] Source URLs verified working
- [ ] Quarterly review process established

**User Experience:**

- [ ] Mobile usable (tested iPhone SE, iPad)
- [ ] Input validation prevents errors
- [ ] Formula documentation present
- [ ] Export includes assumptions

**Internationalization:**

- [ ] 100% translation coverage (en, fr, de, it)
- [ ] Number formatting tested all locales
- [ ] Formula notation consistent across locales
- [ ] Element names translated correctly

**Documentation:**

- [ ] CHANGELOG.md updated with v5.0 features
- [ ] Calculator guide updated for new categories
- [ ] ADR created for reference data management
- [ ] Pitfall documentation in codebase

---

## Out of Scope for v5.0

**Engineering Calculators:**

- Finite Element Analysis (FEA) - Requires iterative solving, desktop software domain
- 3D visualization - Adds WebGL complexity, limited practical value
- Multi-member frame analysis - Too complex for web calculators
- Database-heavy features - Custom material libraries, saved projects

**Chemistry Calculators:**

- Equation balancing - High complexity, limited value (users balance manually)
- 3D molecular visualization - Requires WebGL, specialized tools handle better
- Reaction prediction - ML models, extensive databases, unreliable
- Spectroscopy analysis - Signal processing, not calculator domain

**Hyper-V & Virtualization:**

- Live performance monitoring - Requires backend, agents, not static site
- Automated VM placement - Orchestration tool domain, not planning calculator
- Full management interfaces - Replace vendor tools (out of scope)
- Workload prediction ML - Requires historical data, ML models

**General:**

- User accounts/authentication - Static export constraint
- Calculation history database - Use URL state, localStorage sufficient
- Real-time collaboration - High complexity, deferred to v6.0+
- Mobile native apps - Web app sufficient for v5.0

---

## Success Metrics

**Adoption:**

- Engineering calculators: 500+ monthly users by Month 3
- Chemistry calculators: 300+ monthly users by Month 3
- Hyper-V calculators: 400+ monthly users by Month 3 (high demand post-Broadcom)

**Engagement:**

- Average time on calculator pages: 3-5 minutes
- PDF export usage: 20%+ of calculations
- URL sharing: 15%+ of calculations

**Quality:**

- Calculation error reports: <5 per month
- Data accuracy issues: <2 per quarter
- Formula disputes: <1 per quarter

**Technical:**

- Bundle size increase: <22% (target: 18%)
- Load time maintained: <2s First Contentful Paint
- Zero TypeScript errors (strict mode)
- Zero security vulnerabilities (npm audit --production)

---

## Dependencies

**New npm Dependencies:**

1. **mathjs** (~209 KB full, tree-shake to 20-30 KB)
   - Purpose: Engineering calculations (beam deflection, matrices for inertia)
   - Tree-shakeable: Import only needed functions
   - License: Apache-2.0

2. **convert** (~3-5 KB)
   - Purpose: Unit conversions with NIST precision
   - License: MIT

3. **molecular-formula** (~2-5 KB)
   - Purpose: Chemical formula parsing (Ca(OH)2 → elements + counts)
   - License: MIT
   - Alternative: Build custom parser (more control)

**Reused Dependencies:**

- **recharts** (already in bundle from v3.0) - TCO charts, cost comparisons
- **jsPDF** (already in bundle from v3.0) - PDF export
- **Zustand** (existing) - State management
- **Next.js/React** (existing) - Framework

**Total New Dependencies:** 3 libraries, ~35-40 KB compressed impact

---

## Timeline Estimate

**Phase 31:** Engineering Structural (beam, inertia, stress-strain) - 5 days
**Phase 32:** Engineering Materials/Hydraulics (column, pipe flow, units) - 4 days
**Phase 33:** Chemistry Core (molecular weight, molarity, dilution) - 4 days
**Phase 34:** Chemistry Advanced (stoichiometry, pH, periodic table) - 4 days
**Phase 35:** Hyper-V & Multi-Platform (consolidation, licensing, extend existing) - 5 days
**Phase 36:** Cross-Platform & Verification (comparison calculator, testing, docs) - 4 days

**Total Estimated:** 26 days (5.2 weeks)
**Buffer:** +20% (5 days) for unexpected complexity
**Total with Buffer:** 31 days (~6 weeks)

---

## Rollout Plan

**v5.0.0-alpha (Weeks 1-2):**

- Engineering calculators (6)
- Internal testing
- Engineering domain expert review

**v5.0.0-beta (Weeks 3-4):**

- Chemistry calculators (6)
- Internal testing
- Chemistry domain expert review

**v5.0.0-rc (Weeks 5-6):**

- Hyper-V & Virtualization calculators (6)
- Full integration testing
- Mobile testing
- i18n verification
- Performance testing

**v5.0.0 (Week 6):**

- Production release
- CHANGELOG.md update
- Social media announcement
- Monitor for issues (1-week stabilization period)

---

**Total Calculators:** 172 → 190 (+18 calculators)
**Total Categories:** 16 → 18 (+2 categories: Engineering, Chemistry)
**Bundle Impact:** +90-110 KB (~18-22% increase)
**Risk Level:** MEDIUM (formula accuracy, data quality, licensing complexity)
**Timeline:** 6 weeks with buffer

---

_Requirements finalized: 2026-01-27_
_Ready for roadmap creation: Yes_
