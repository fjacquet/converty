# Architecture Decision Records

This directory documents the key architectural decisions made in the Converty project.

Each ADR follows the format:
- **Context** — why this decision was needed
- **Decision** — what was chosen and how it works
- **Consequences** — trade-offs, constraints, and mitigations

---

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](ADR-001-static-export.md) | Static Export via Next.js | Accepted |
| [ADR-002](ADR-002-url-state-sync.md) | URL State Synchronization for Shareable Calculations | Accepted |
| [ADR-003](ADR-003-zustand-state-management.md) | Zustand for Calculator State Management | Accepted |
| [ADR-004](ADR-004-i18n-four-locales.md) | Four-Locale Internationalization (EN / FR / DE / IT) | Accepted |
| [ADR-005](ADR-005-biome-linting.md) | Biome as Single Linting and Formatting Tool | Accepted |
| [ADR-006](ADR-006-pwa-offline-support.md) | Progressive Web App with Workbox Service Worker | Accepted |
| [ADR-007](ADR-007-pure-functions-converters.md) | Pure Functions for All Calculation Logic | Accepted |
| [ADR-008](ADR-008-github-pages-deployment.md) | GitHub Pages Deployment via GitHub Actions | Accepted |
| [ADR-009](ADR-009-no-backend-privacy-first.md) | No Backend — Privacy-First, Client-Side Only | Accepted |
| [ADR-010](ADR-010-no-test-framework.md) | No Automated Test Framework (Current State) | Accepted — Under Review |

---

## Statuses

| Status | Meaning |
|--------|---------|
| **Proposed** | Under discussion, not yet implemented |
| **Accepted** | Decision made and implemented |
| **Deprecated** | Was accepted, now superseded or reversed |
| **Superseded** | Replaced by a newer ADR |
| **Under Review** | Accepted but actively reconsidering |

---

## Adding a New ADR

1. Copy the filename pattern: `ADR-NNN-short-title.md`
2. Use the template:
   ```markdown
   # ADR-NNN: Title

   **Status:** Proposed
   **Date:** YYYY-MM-DD
   **Deciders:** ...

   ## Context
   ## Decision
   ## Consequences
   ```
3. Add an entry to this index
4. Reference from `docs/PRD.md` if architecturally significant
