# External Integrations

**Analysis Date:** 2026-01-17

## APIs & External Services

**None detected**

This is a fully client-side application with no external API integrations. All calculations are performed in the browser using pure functions in `src/lib/converters/`.

## Data Storage

**Databases:**

- None - No database connectivity

**File Storage:**

- Local filesystem only (static export to `out/` directory)
- No cloud storage integration

**Client-Side Storage:**

- URL query parameters - State persistence via Zustand URL sync middleware
  - Implementation: `src/stores/calculator-store.ts`
  - Debounced URL updates (150ms default)
  - Enables shareable calculator links
- No localStorage, sessionStorage, or IndexedDB usage detected

**Caching:**

- Browser HTTP caching only (configured in `nginx.conf`)
  - Static assets: 1 year cache
  - Other assets: 30 days
  - HTML: no cache

## Authentication & Identity

**Auth Provider:**

- None - No authentication system

**User Management:**

- Not applicable - Public static site with no user accounts

## Monitoring & Observability

**Error Tracking:**

- None - No error tracking service (e.g., Sentry)

**Analytics:**

- None - No analytics integration detected

**Logs:**

- nginx access logs (stdout) when containerized
- nginx error logs (stderr) when containerized
- No centralized logging service

**Performance Monitoring:**

- None - No APM or RUM tools

## CI/CD & Deployment

**Hosting:**

- GitHub Pages (primary)

  - Static hosting at `https://[username].github.io/converty/`
  - Deployment from `out/` directory
  - Workflow: `.github/workflows/static.yml`

- Alternative: Docker container with nginx
  - Image: nginx:alpine
  - Port: 8080 (non-root)
  - Healthcheck: HTTP GET on `/`
  - Multi-stage build reduces image size

**CI Pipeline:**

- GitHub Actions

  - Build workflow: `.github/workflows/static.yml`

    - Runs on: `maincd` branch push
    - Node.js 20
    - Steps: install → type-check → lint → build → deploy

  - Security workflow: `.github/workflows/security.yml`
    - Runs on: push, PR, weekly schedule (Monday 00:00 UTC)
    - npm audit (moderate level)
    - CodeQL analysis (JavaScript/TypeScript)
    - Trivy container scan
    - Trivy filesystem scan (vuln, secret, misconfig)
    - Biome security linting
    - Dependency review (PRs only)

**Build Tools:**

- GitHub Actions (ubuntu-latest runners)
- Make (local development via `Makefile`)

**Secrets Management:**

- Not applicable - No secrets required
- No .env files in use

## Environment Configuration

**Required env vars:**

- None - Application requires no environment variables

**Secrets location:**

- Not applicable - No secrets, API keys, or credentials needed

**Runtime configuration:**

- Configuration is build-time only via `next.config.ts`
- `NODE_ENV` determines static export behavior (production only)
- `NEXT_TELEMETRY_DISABLED=1` in Docker build

## Webhooks & Callbacks

**Incoming:**

- None - No webhook endpoints

**Outgoing:**

- None - No webhook calls to external services

## Development Tools

**Code Quality:**

- Biome 2.3.11 - Linting and formatting
- ESLint 9.39.2 - Additional linting
- TypeScript 5.9.3 - Type checking

**Security Scanning:**

- CodeQL (JavaScript/TypeScript security analysis)
- Trivy (container and filesystem vulnerability scanning)
- npm audit (dependency security audit)

**Deployment Targets:**

- GitHub Pages (configured)
- Vercel (Makefile support, not configured)
- Netlify (Makefile support, not configured)
- Docker registries (via `make docker-push`)

## Third-Party Dependencies

**All external dependencies are npm packages:**

See `package.json` for complete list. Critical runtime dependencies:

- UI: Radix UI primitives, Lucide icons
- State: Zustand
- i18n: next-intl
- Styling: Tailwind CSS
- Charts: Recharts
- PDF: jsPDF
- Utilities: clsx, class-variance-authority, tailwind-merge

**Dependency Security:**

- Monitored via GitHub Dependabot (if enabled)
- npm audit in security workflow
- Dependency review action on pull requests
- License restrictions: GPL-3.0, AGPL-3.0 denied

## Network Requirements

**Development:**

- No external network calls required
- Local development server: `localhost:3000`
- Allowed dev origins: `172.16.86.102` (configured in `next.config.ts`)

**Production:**

- Static assets served via CDN (GitHub Pages or nginx)
- All resources bundled at build time
- No runtime API calls

---

_Integration audit: 2026-01-17_
