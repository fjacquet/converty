# External Integrations

**Analysis Date:** 2026-01-16

## APIs & External Services

**Reverse Geocoding (Optional):**

- OpenStreetMap Nominatim API
  - Used in: `src/app/[locale]/photo/golden-hour/golden-hour-guide.tsx`
  - Purpose: Convert coordinates to location names
  - Endpoint: `https://nominatim.openstreetmap.org/reverse`
  - Auth: None required (public API)
  - Usage: Optional enhancement for golden hour calculator
  - Graceful degradation: Falls back silently if unavailable

**Currency Exchange:**

- None - Static exchange rates
  - Location: `src/lib/converters/finance/currency.ts`
  - Note: Uses hardcoded rates, no external API

## Data Storage

**Databases:**

- None - All data is client-side only

**File Storage:**

- Local filesystem only (development)
- Static export directory (`./out`) for production

**Caching:**

- Browser localStorage (implicit via URL state)
- No server-side caching

**State Persistence:**

- URL parameters for calculator state
  - Implementation: `src/stores/calculator-store.ts`
  - Debounced sync (150ms default)
  - Enables shareable calculator links

## Authentication & Identity

**Auth Provider:**

- None - Public application with no authentication
- All calculators accessible without login

## Monitoring & Observability

**Error Tracking:**

- None configured

**Analytics:**

- None configured (static site)

**Logs:**

- Browser console only (development)
- No production logging

**Telemetry:**

- Next.js telemetry disabled in Docker (`NEXT_TELEMETRY_DISABLED=1`)

## CI/CD & Deployment

**Primary Hosting:**

- GitHub Pages
  - URL: `https://{username}.github.io/converty`
  - Static files served from `./out` directory

**Alternative Hosting:**

- Docker with nginx
  - Dockerfile: `Dockerfile`
  - nginx config: `nginx.conf`
  - Port: 80

**CI Pipeline:**

- GitHub Actions

**Deployment Workflow:** `.github/workflows/static.yml`

- Trigger: Push to `maincd` branch
- Steps:
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies (`npm ci`)
  4. Type check (`npm run type-check`)
  5. Lint (`npx biome check src/`)
  6. Build (`npm run build`)
  7. Upload to GitHub Pages

**Security Workflow:** `.github/workflows/security.yml`

- Triggers: Push to main/maincd, PRs, weekly schedule
- Jobs:
  1. NPM Audit - Dependency vulnerability scan
  2. CodeQL - Static analysis for JS/TS
  3. Trivy Container - Docker image scanning
  4. Trivy Filesystem - IaC and secrets scanning
  5. Dependency Review - PR dependency changes
  6. Biome Security - Security-focused linting

## Environment Configuration

**Required env vars:**

- None required for core functionality

**Optional env vars:**

- `NODE_ENV` - Controls basePath in Next.js config

**Secrets location:**

- No secrets required
- All functionality is client-side

## Webhooks & Callbacks

**Incoming:**

- None

**Outgoing:**

- None

## Browser APIs

**Geolocation API:**

- Used in: `src/app/[locale]/photo/golden-hour/golden-hour-guide.tsx`
- Purpose: Get user's location for sun position calculations
- Permission: Requested on user action
- Fallback: Manual coordinate entry

**History API:**

- Used in: `src/stores/calculator-store.ts`
- Purpose: URL state synchronization
- Method: `window.history.replaceState()`

**LocalStorage:**

- Not directly used (state stored in URL)

## Third-Party Services Summary

| Service                 | Purpose           | Required         | Auth                     |
| ----------------------- | ----------------- | ---------------- | ------------------------ |
| GitHub Pages            | Hosting           | Yes (production) | None                     |
| GitHub Actions          | CI/CD             | Yes              | GitHub token (automatic) |
| OpenStreetMap Nominatim | Reverse geocoding | No               | None                     |

## Integration Architecture

```
+-------------------+     +------------------+
|   Browser         |     |   GitHub Pages   |
|   (Client)        |<--->|   (Static Host)  |
+-------------------+     +------------------+
         |
         | Optional
         v
+-------------------+
| OpenStreetMap     |
| Nominatim API     |
| (Reverse Geocode) |
+-------------------+
```

## Key Characteristics

1. **Fully Static**: No backend server, database, or authentication
2. **Self-Contained**: All calculations run in the browser
3. **No API Keys**: No external service authentication required
4. **Offline Capable**: Core functionality works offline (except geocoding)
5. **Privacy First**: No user data sent to servers (except optional geocoding)

---

_Integration audit: 2026-01-16_
