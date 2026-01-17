# Upgrade jsPDF to Latest Stable Version

- **Status:** proposed
- **Date:** 2026-01-17 (ADR created, upgrade planned for Phase 6)
- **Deciders:** Project team

## Context and Problem Statement

Converty currently uses jsPDF v4.0.0 for client-side PDF generation (allowing users to export calculator results as PDF). This version has significant issues:

- **Released in 2018** - 6+ years old with no security patches
- **Version number confusion** - v4.0.0 is older than v2.5.2 (latest stable), indicating major version rollback after breaking changes
- **Potential security vulnerabilities** - Outdated dependency with unknown CVEs
- **Missing modern features** - No TypeScript types, older API patterns
- **Maintenance risk** - Library could have breaking changes when upgrading

Should we upgrade to the latest stable jsPDF version (v2.5.2+) to address security concerns and gain modern features?

## Decision Drivers

- **Security patches** - 6-year-old library likely has unpatched vulnerabilities
- **TypeScript support** - Modern jsPDF includes official TypeScript definitions
- **API improvements** - Latest version has better API and bug fixes
- **Future maintenance** - Staying current reduces technical debt
- **Breaking changes expected** - Version rollback (v4 → v2) indicates API changes
- **PDF export verification** - Must ensure calculator PDF exports still work correctly

## Considered Options

1. **Upgrade to jspdf@latest (v2.5.2+)** - Full upgrade to current stable version
2. **Upgrade to jspdf@2.x with compatibility mode** - Use compatibility layer if available
3. **Stay on jspdf@4.0.0** - Accept security/maintenance risks
4. **Replace with alternative PDF library** - Switch to pdfmake, react-pdf, or other solution

## Decision Outcome

Chosen option: **"Upgrade to jspdf@latest (v2.5.2+)"** (pending implementation in Phase 6)

This ADR documents the PLANNED decision. Actual upgrade will occur in Phase 6 with comprehensive testing of PDF export functionality across all calculators that support it.

### Expected Consequences

**Positive (Expected):**

- **Security patches** - Latest version includes 6+ years of security fixes
- **TypeScript support** - Official type definitions improve IDE experience
- **Modern API** - Cleaner API patterns, better documentation
- **Bug fixes** - Accumulated bug fixes from years of development
- **Smaller bundle** - Modern version likely has better tree-shaking
- **Community support** - Active development, easier to find solutions

**Negative (Expected):**

- **Breaking changes** - API changes will require updating all PDF export code
- **Testing effort** - Must verify PDF generation across all calculators
- **Font rendering changes** - Font handling may differ between versions
- **Layout differences** - PDF output might render slightly differently
- **Migration time** - Estimated 5 hours for upgrade + testing

**Neutral:**

- **Version number confusion** - Must document why v2.5.2 is newer than v4.0.0
- **Compatibility checks** - Need to verify browser support unchanged

## Pros and Cons of the Options

### Upgrade to jspdf@latest (v2.5.2+)

- **Good:** Addresses security concerns (6 years of patches)
- **Good:** Official TypeScript support improves type safety
- **Good:** Modern API patterns, better documentation
- **Good:** Active community support for issues
- **Good:** Smaller bundle size with tree-shaking
- **Bad:** Breaking changes require code updates
- **Bad:** Testing effort to verify PDF exports
- **Bad:** Potential layout/rendering differences
- **Neutral:** Version rollback (v4 → v2) is confusing but documented in jsPDF releases

### Upgrade to jspdf@2.x with compatibility mode

- **Good:** Potentially easier migration if compat mode exists
- **Bad:** Research shows no official compatibility layer
- **Bad:** Would still require code changes
- **Bad:** Compat mode often has performance penalty
- **Neutral:** May not be available in jsPDF ecosystem

### Stay on jspdf@4.0.0

- **Good:** No migration effort required
- **Good:** PDF exports continue working as-is
- **Bad:** Security vulnerabilities remain unpatched
- **Bad:** No TypeScript support (relies on @types/jspdf)
- **Bad:** Missing 6 years of bug fixes
- **Bad:** Technical debt accumulates
- **Bad:** Eventually forced to upgrade (library could break in future browsers)

### Replace with alternative PDF library

**pdfmake:**

- **Good:** Declarative PDF definition, good for reports
- **Good:** Active maintenance, modern codebase
- **Bad:** Different API paradigm (would require complete rewrite)
- **Bad:** Larger bundle size than jsPDF

**react-pdf:**

- **Good:** React-friendly, JSX-based PDF generation
- **Good:** Modern API, TypeScript support
- **Bad:** Server-side rendering focus (we need client-side)
- **Bad:** Complete rewrite required

**Verdict:** Upgrading jsPDF is lower risk than switching libraries entirely

## Links

- **Phase 6 Plans:** TBD (jsPDF upgrade planned)
- **Current package.json:** Line 40 shows `"jspdf": "^4.0.0"`
- **REQUIREMENTS.md:** Lines 68-79 (DEP-01, DEP-03 requirements)
- **CONCERNS.md:** Lines 60-65 (jsPDF security concerns)
- **PITFALLS.md:** Lines 326-364 (Pitfall 9: jsPDF API breaking changes)

## Implementation Plan (Phase 6)

### Step 1: Research Breaking Changes

- Review [jsPDF releases](https://github.com/parallax/jsPDF/releases) for v2.x changelog
- Identify API changes affecting Converty's PDF export code
- Note version numbering: v4.0.0 (2018) → v2.5.2 (current) indicates major API overhaul

### Step 2: Upgrade Dependency

```bash
npm install jspdf@latest
npm list jspdf  # Verify v2.5.2 or later
```

### Step 3: Update PDF Export Code

**Expected API changes (from research):**

**Old API (v4.0.0):**

```typescript
import jsPDF from 'jspdf';
const doc = new jsPDF();
```

**New API (v2.5.2):**

```typescript
import { jsPDF } from 'jspdf';  // Named import
const doc = new jsPDF();
```

**Other potential changes:**

- Font handling API may differ
- `addPage()` parameters might change
- `text()` method signature updates
- Image embedding API changes

### Step 4: Identify PDF Export Usage

Search codebase for jsPDF usage:

```bash
grep -r "jsPDF" src/
grep -r "\.pdf" src/components/
```

### Step 5: Update All PDF Export Functions

- Update imports to use named import: `import { jsPDF } from 'jspdf'`
- Update API calls to match v2.5.2 patterns
- Test each calculator's PDF export functionality
- Verify font rendering unchanged
- Compare PDF output before/after upgrade

### Step 6: Verification

**Build verification:**

- TypeScript compilation passes (new types)
- Biome lint passes
- Production build succeeds

**Functional verification:**

- Generate PDF from each calculator that supports export
- Verify layout matches previous version
- Test PDF downloads correctly
- Verify PDF opens in various viewers (Chrome, Firefox, Adobe Reader)
- Test on mobile devices (iOS, Android)

**Performance verification:**

- Check bundle size change
- Verify PDF generation speed unchanged
- Monitor memory usage during PDF generation

### Step 7: Document Changes

- Update CONTRIBUTING.md if PDF export patterns changed
- Add migration notes to CHANGELOG.md
- Document any API differences in code comments

## Risk Assessment

**High Risk:**

- Breaking changes in font handling (could break PDF layout)
- Different text positioning (could misalign calculator results)

**Medium Risk:**

- API method signature changes (will surface in TypeScript errors)
- Bundle size increase (though v2.x likely smaller with tree-shaking)

**Low Risk:**

- Import statement changes (straightforward find-replace)
- TypeScript type errors (helpful for finding issues)

**Mitigation:**

- Comprehensive testing before deployment
- Keep v4.0.0 backup branch for comparison
- Test PDFs in multiple viewers
- Gradual rollout if possible (though static site makes this difficult)

## Open Questions

**Answered during Phase 6 implementation:**

1. What specific API changes exist between v4.0.0 and v2.5.2?
2. Does Converty's PDF usage rely on any deprecated methods?
3. Are there any browser compatibility changes?
4. What is the bundle size impact?
5. Do any calculators use advanced jsPDF features (images, fonts)?

## Success Criteria (Phase 6)

- [ ] `npm list jspdf` shows v2.5.2 or later
- [ ] All PDF export code uses new API (named import, updated methods)
- [ ] TypeScript compilation passes with no jsPDF-related errors
- [ ] PDF exports verified working on all calculators
- [ ] Visual regression: PDF output matches previous version
- [ ] Bundle size measured and acceptable
- [ ] CHANGELOG.md documents the upgrade

## Notes

**Version numbering explanation:**

The jsPDF project went through a major rewrite after v1.x. Version 4.0.0 was released in 2018 as part of an experimental branch that was later abandoned. The project returned to v2.x versioning for the stable release. This means v2.5.2 (2024) is newer than v4.0.0 (2018).

**Related requirements:**

- DEP-01: Upgrade jsPDF from v4.0.0 to latest stable
- DEP-03: Update jsPDF usage to match new API
- DOC-02: Create ADR documenting jsPDF decision
