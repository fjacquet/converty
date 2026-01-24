# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-24)

**Core value:** A solid, maintainable foundation with zero technical debt in state management and type safety, enabling confident future development.
**Current focus:** v3.0 Calculator Expansion & Performance

## Current Position

Phase: 19 - Cooking/Nutrition Foundation (In Progress)
Plan: 19-03 Recipe Scaler (Complete)
Status: Phase 19 advancing - recipe scaler with non-linear scaling rules operational
Last activity: 2026-01-24 — Recipe Scaler completed with intelligent scaling for salt (67-75%), spices (75%), leavening (87.5%)

Progress: █████████░ 60% (v3.0 — 2 of 8 phases in progress, 3 of 4 plans in Phase 19 complete)

**Next Steps:**
1. Continue Phase 19 (Recipe Scaling, Nutrition Calculator)
2. Or begin Phase 18 (Real Estate Foundation) as defined in v3.0 roadmap

## Performance Metrics

**v1.0 Milestone:**

- Total plans completed: 19
- Total phases: 8
- Average duration: 4.6 min/plan
- Total commits: 103
- Files modified: 131
- Lines added: 23,496
- Lines removed: 874
- Timeline: 2 days (2026-01-17 → 2026-01-18)

**By Phase:**

| Phase                      | Plans | Total    | Avg/Plan |
| -------------------------- | ----- | -------- | -------- |
| 01-type-safety-foundation  | 4/4   | 7.5 min  | 1.9 min  |
| 02-url-sync-infrastructure | 1/1   | 4 min    | 4 min    |
| 03-state-migration         | 2/2   | 26.8 min | 13.4 min |
| 04-progressive-web-app     | 4/4   | 12.3 min | 3.1 min  |
| 05-documentation           | 3/3   | 7.3 min  | 2.4 min  |
| 06-dependency-upgrade      | 1/1   | 2 min    | 2 min    |
| 07-code-quality-validation | 2/2   | 23.4 min | 11.7 min |
| 08-developer-experience    | 2/2   | 5 min    | 2.5 min  |

**v2.0 Milestone:**

| Phase                           | Plans | Total  | Avg/Plan |
| ------------------------------- | ----- | ------ | -------- |
| 09-visual-subnet-foundation     | 3/3   | 27 min | 9 min    |
| 10-visual-subnet-visualization  | 2/2   | 51 min | 25.5 min |
| 11-visual-subnet-advanced       | 3/3   | 8 min  | 2.7 min  |
| 12-ip-cidr-calculators          | 2/2   | 20 min | 10 min   |
| 13-network-speed-latency        | 2/2   | 14 min | 7 min    |
| 14-global-search                | 2/2   | 13 min | 6.5 min  |
| 15-translation-audit            | 2/2   | 5 min  | 2.5 min  |
| 16-translation-implementation   | 6/6   | 18 min | 3 min    |

**v3.0 Milestone (in progress):**

| Phase                           | Plans | Total  | Avg/Plan |
| ------------------------------- | ----- | ------ | -------- |
| 17-crypto-blockchain-foundation | 4/4   | 32 min | 8 min    |
| 19-cooking-nutrition-foundation | 2/4   | 20 min | 10 min   |

## Accumulated Context

### Decisions

| Decision                                                       | Phase | Rationale                                                                                         |
| -------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| Use Number.isNaN() instead of global isNaN()                   | 01-01 | Strict check without type coercion prevents false positives                                       |
| Boolean parsing accepts only "true" and "1"                    | 01-01 | Explicit is better than implicit - avoid ambiguity                                                |
| Empty string triggers fallback (same as null)                  | 01-01 | Empty string in URL typically means "not provided"                                                |
| Enabled noExplicitAny at error level (not warning)             | 01-02 | Strict enforcement makes type safety violations blocking                                          |
| Document strict mode flags inline in tsconfig.json             | 01-02 | Helps future developers understand configuration without external docs                            |
| Use 'unknown' as generic default type for better type safety   | 01-03 | Requires explicit type narrowing, prevents accidental unsafe operations                           |
| Centralize URL parsing through helper functions                | 01-03 | Consistency across codebase, single source of truth for parsing logic                             |
| Defer global debounce timer fix to Phase 2                     | 01-03 | Global timer is a known issue (STATE-04) but fixing now would expand scope                        |
| Use closure pattern over WeakMap for timer isolation           | 02-01 | Simpler mental model, more explicit, easier to debug                                              |
| Use replaceState instead of pushState for URL sync             | 02-01 | Avoids flooding browser history with every keystroke                                              |
| Add selectState option to middleware                           | 02-01 | Enables syncing nested state (e.g., only values from CalculatorState)                             |
| Verify functional approach before deleting legacy hooks        | 03-01 | Ensure STATE-05 requirements met (pure functions, immutability)                                   |
| Manual immutable patterns used instead of Immer middleware     | 03-01 | Spread operators provide equivalent immutability with less overhead                               |
| Use Next.js App Router manifest.ts over static manifest.json   | 04-01 | Type safety via MetadataRoute.Manifest, aligns with Next.js 16 best practices                     |
| Automate icon generation instead of manual creation            | 04-01 | Ensures correct dimensions, proper maskable safe zones, reproducibility                           |
| Create placeholder gradient icon design                        | 04-01 | Functional PWA immediately, replaceable with branded assets later                                 |
| Add force-static export declaration to manifest                | 04-01 | Required for Next.js static export mode (output: "export")                                        |
| Use Workbox CDN via importScripts instead of bundling          | 04-02 | Standard Workbox v7 pattern, avoids bundling issues, easier updates                               |
| NetworkFirst strategy for HTML/documents                       | 04-02 | Fresh content when online, 7-day cache fallback for offline                                       |
| CacheFirst strategy for static assets                          | 04-02 | Next.js content-hashed assets are immutable, aggressive caching optimal                           |
| StaleWhileRevalidate for fonts                                 | 04-02 | Instant rendering with background updates, balanced freshness                                     |
| Manual service worker instead of generated (for now)           | 04-02 | Runtime caching only, build integration with precaching deferred to Plan 03                       |
| Production-only SW registration                                | 04-03 | Service worker caching breaks hot reload in development                                           |
| Separate client component for SW registration                  | 04-03 | Clean server/client boundary for browser APIs                                                     |
| generateSW instead of injectManifest                           | 04-03 | Simpler approach for static exports, creates complete SW file                                     |
| Post-build script integration for SW generation                | 04-03 | Workbox needs static files to exist before generating precache manifest                           |
| Platform detection for install prompt                          | 04-03 | iOS needs manual instructions, Android/Desktop support programmatic prompt                        |
| Root scope (/) for service worker                              | 04-03 | Covers all locale routes (/en/, /fr/, /de/, /it/)                                                 |
| Combined PWA UI in SWRegistration component                    | 04-03 | Groups related PWA concerns (registration, offline, install) together                             |
| Use Keep a Changelog 1.1.0 format for project history          | 05-01 | Standardized, human-readable, supports Semantic Versioning                                        |
| Backfill v1.0.0 from git log and STATE.md summaries            | 05-01 | Git history provides factual data, STATE.md provides context                                      |
| Date v1.0.0 as 2026-01-17                                      | 05-01 | Marks completion of infrastructure upgrade milestone (Phases 1-4)                                 |
| Use specific changelog entries with file paths                 | 05-01 | Helps developers understand what changed and where to look                                        |
| Document Zustand as standard (not useState)                    | 05-03 | Aligns with Phase 3 migration, guides new contributors to current best practice                   |
| Use Biome commands (check/check:fix) in contributor guide      | 05-03 | Project uses Biome for linting, not ESLint - documentation should match reality                   |
| jsPDF v4.0.0 is latest version (no upgrade needed)             | 06-01 | Version progression v1→v2→v3→v4 (v4 is NEWER than v2), released Jan 2025                          |
| ADR 0004 superseded due to incorrect version information       | 06-01 | Original ADR incorrectly claimed v4.0.0 was outdated, corrected with research                     |
| Phase 6 scope is verification (not upgrade)                    | 06-01 | jsPDF already current, focus on verifying implementation works correctly                          |
| PDF export uses correct v4.0.0 API patterns                    | 06-01 | Named import, built-in types, standard methods, no deprecated API calls                           |
| Allow explicit any in url-sync.ts via Biome override           | 07-01 | Zustand setState requires type erasure in middleware, configuration cleaner than per-line ignores |
| Use Node.js protocol imports (node:fs, node:path)              | 07-01 | Biome style rule for explicit protocol, aligns with modern Node.js best practices                 |
| Document code review as observations, not blockers             | 07-01 | Quality is continuous improvement, not binary pass/fail - guide future work                       |
| Container vulnerability in Dockerfile is false positive        | 07-02 | Static site (output: "export"), no Docker usage in production, npm audit clean                    |
| URL params consolidation is enhancement, not blocker           | 07-02 | 6-line duplication vs ~3,000 eliminated, low priority DRY improvement                             |
| Pre-commit hooks are valid Phase 8 enhancement                 | 07-02 | Developer experience improvement (Husky + lint-staged), not Phase 7 requirement                   |
| Document Trivy false positives with expiration dates           | 08-01 | .trivyignore explicitly documents false positives with 6-month expiration for re-evaluation       |
| Consolidate getUrlParams() into shared utility module          | 08-01 | DRY principle - eliminates 12-line duplication, single source of truth for URL extraction         |
| Use Husky v9 modern API (core.hooksPath) over deprecated v4-v8 | 08-02 | Husky v9 uses core.hooksPath and husky init instead of deprecated install command                 |
| Run Biome only on staged files for fast pre-commit feedback    | 08-02 | Checking only staged files keeps pre-commit under 3 seconds, prevents bottleneck                  |
| Configure automatic hook setup via prepare script              | 08-02 | New team members get hooks automatically on npm install, ensures consistent quality               |
| Phase numbering continues across milestones                    | v1.0  | Clear history, no confusion with phase resets - v2.0 starts at Phase 9                            |
| Use ipaddr.js for IP address manipulation                      | 09-01 | Battle-tested (55M+ weekly downloads), lightweight (1.9K), handles IPv4/IPv6 edge cases           |
| Network as separate category from data                         | 09-01 | Network tools have distinct audience, allows future growth with dedicated subcategories           |
| Feature subnet calculator on homepage                          | 09-01 | First network calculator, showcases new category, high-value tool for IT professionals            |
| BigInt for host count calculations                             | 09-02 | IPv6 subnets can exceed Number.MAX_SAFE_INTEGER (2^53), requires BigInt for accuracy              |
| Null for IPv6 broadcast and subnet mask                        | 09-02 | IPv6 has no broadcast (uses multicast) and no subnet mask notation (CIDR only)                    |
| RFC 3021 compliance for /31 subnets                            | 09-02 | /31 point-to-point links have 2 usable addresses with no network/broadcast reservation            |
| IPv6 no network/broadcast reservation                          | 09-02 | IPv6 doesn't reserve addresses except /128 single host, differs from IPv4 standard formula        |
| Throw errors from parsing functions                            | 09-02 | Pure functions can throw, caller (Zustand store) catches and sets error state                     |
| Use calculator.network namespace for network-specific labels   | 09-03 | Network-specific labels belong in category namespace, not generic calculator.labels               |
| Auto-calculate on input change (no manual button)              | 09-03 | Immediate feedback improves UX, triggered on CIDR completion or both fields filled                |
| Display N/A for IPv6 broadcast/subnet mask                     | 09-03 | IPv6 has no broadcast (uses multicast) and no subnet mask notation (CIDR only)                    |
| BigInt formatting with locale fallback                         | 09-03 | Use locale formatter for safe integers, toString() for large IPv6 subnets with warning            |
| Use inline SVG for network diagram                             | 10-01 | Maximum control over styling and responsiveness without external dependencies                     |
| Proportional CIDR visualization                                | 10-01 | Network/host portions displayed proportionally based on prefix length for visual clarity          |
| Color-coded binary bits (blue=network, green=host)             | 10-01 | Consistent color scheme across visualizations for immediate understanding                          |
| Accept array index as key for stable bit positions             | 10-01 | Bit positions are stable and semantically meaningful, never reordered                             |
| Strip CIDR notation before IP parsing in visualizations        | 10-02 | Binary representation may receive network address with CIDR notation, must extract clean IP       |
| Use concise "cidr" key for table labels                        | 10-02 | Component labels need brevity, "CIDR" is universal abbreviation understood internationally        |
| Use BigInt() constructor instead of literal syntax             | 11-01 | BigInt literals (24n) not available in project's TypeScript target, use BigInt(24) for compatibility |
| Auto-sort networks in aggregateNetworks()                      | 11-01 | Networks can be provided in any order, function sorts numerically for user convenience           |
| Return success/error object for supernetting                   | 11-01 | aggregateNetworks() returns {success, error} instead of throwing, enables graceful error handling |
| Use CalculatorMode union type for mode switching               | 11-02 | Clean type safety with "basic" \| "subnetting" \| "supernetting", enables conditional UI rendering |
| DivisionCount limited to powers of 2                           | 11-02 | Union type enforces valid divisions at compile time, matches algorithm requirements                |
| Parse multiple network inputs with flexible delimiters         | 11-02 | Split by newlines, commas, or semicolons for user-friendly multi-network input                     |
| Use mode tabs for interface switching                          | 11-03 | Clean separation of basic subnet info vs advanced operations (subnetting/supernetting)             |
| Reuse BreakdownTable for comparison display                    | 11-03 | Consistent network information formatting across all modes, no duplication of table logic          |
| Support flexible network input delimiters                      | 11-03 | User-friendly multi-network entry for supernetting, accepts newlines/commas/semicolons             |
| Use ipaddr.js range() for public/private classification        | 12-01 | Built-in range detection maps cleanly to public/private/special categories without manual RFC ranges |
| Return null for IPv6 ipClass (no class system)                 | 12-01 | IPv6 has no classful addressing, null maintains type safety and allows "N/A" display              |
| Display status as string in ResultGrid, colored details separate| 12-01 | ResultGrid accepts only string/number, separation enables clean grid data + visual enhancements    |
| Reuse calculateSubnet() for CIDR range calculations            | 12-02 | DRY principle, existing function handles IPv4/IPv6 edge cases, reduces code by ~100 lines         |
| Use ipaddr.js match() for IP-in-range checking                 | 12-02 | Built-in method is well-tested and handles IPv4/IPv6 correctly without manual bit manipulation    |
| Auto-trigger IP check when both inputs present                 | 12-02 | Better UX than manual button, provides immediate feedback following auto-calculation pattern       |
| Visual indicators with color-coded cards for range membership  | 12-02 | Green check/red X more intuitive than text for binary in/out result                               |
| Reuse BANDWIDTH_UNITS and FILE_SIZE_UNITS from data converters | 13-02 | DRY principle - units already defined, no duplication needed for throughput calculator             |
| Default to MB and seconds for throughput calculator             | 13-02 | Most common units for file transfers, provides sensible starting point                             |
| Show comparison to closest reference speed with ratio          | 13-02 | Provides context for throughput results, helps users understand if speed is good/bad/expected      |
| Use nanoseconds as base unit for latency conversions            | 13-01 | Maximum precision across full range, prevents floating-point errors in microsecond/nanosecond      |
| Default latency unit to milliseconds (ms)                       | 13-01 | Most common for network ping measurements, aligns with user expectations                           |
| Include educational context in latency converter                | 13-01 | Categories and use cases help users understand latency implications beyond raw numbers             |
| Smart value formatting based on magnitude                       | 13-01 | Scientific notation for extremes, locale formatting for large, fixed decimals for medium           |
| Fuse.js for client-side fuzzy search                            | 14-01 | ~5KB gzipped, excellent fuzzy matching, 18M+ weekly downloads, works with static export            |
| Pre-built search indexes per locale                             | 14-01 | Build-time JSON generation, lazy-load on first search, reduces runtime computation                 |
| cmdk for Command palette UI                                     | 14-02 | Already installed in project, industry-standard pattern (Linear, Raycast, Vercel)                  |
| Cmd+K keyboard shortcut for search                              | 14-02 | Standard UX pattern for search, familiar to developers and power users                             |
| Verify existing i18n before making changes                       | 15-01 | Audit revealed prior sessions completed most externalization, minimal changes needed               |
| Return translation keys from converters (not display strings)    | 15-02 | Consistent pattern: converters return keys like `stageKey`, UI translates with useTranslations()   |
| Use crypto-js for MD5, WebCrypto for SHA algorithms              | 17-01 | MD5 not available in WebCrypto, crypto-js provides compatibility for legacy algorithm              |
| Card with destructive border for warnings without Alert          | 17-01 | Alert component not available in project, Card with styling provides equivalent warning UX         |
| Auto-calculate hash on text/algorithm change                     | 17-01 | Better UX than manual button, async calculation handled with loading states                        |
| Use wallet-address-validator library for crypto addresses        | 17-02 | 2KB gzipped, supports 30+ currencies including BTC/ETH/LTC, battle-tested validation logic         |
| Detect private key patterns with security warnings               | 17-02 | Prevent accidental exposure - WIF (5/K/L prefix) and hex (64 chars) pattern detection              |
| Provide format descriptions for educational value                | 17-02 | Help users understand address types (P2PKH Legacy vs P2WPKH Native SegWit vs P2TR Taproot)         |
| Security notices use blue Card styling (non-destructive)         | 17-02 | Distinguish informational security context from critical warnings (destructive red border)          |
| Build-time crypto price fetch instead of runtime                 | 17-03 | Static export prevents runtime APIs, build-time fetch with fallback ensures always-working calculator |
| Use CoinGecko free API for cryptocurrency prices                 | 17-03 | Reliable, no API key needed, supports all required crypto/fiat pairs (BTC/ETH/LTC/XRP/DOGE/ADA)     |
| Show staleness warning when price data older than 24 hours       | 17-03 | Transparency about price reliability, encourages site rebuild for fresh data                         |
| Build-time mining data fetch with fallback                       | 17-04 | Static export prevents runtime APIs, build-time fetch ensures always-working calculator             |
| GH/s to TH/s conversion for network hash rate                    | 17-04 | Blockchain.info API returns GH/s, not H/s - correct conversion is divide by 1000                    |
| Miner presets for quick configuration                            | 17-04 | Common ASIC miners (Antminer S19 series, Whatsminer M30S++) simplify user experience                |
| Optional hardware cost for ROI calculation                       | 17-04 | Not all users care about ROI - make it optional, calculate only when provided                       |
| Swiss electricity cost as default (0.27 CHF/kWh)                 | 17-04 | Swiss/European context for v3.0, aligns with project focus                                          |
| Metric units primary (ml, g) with imperial support              | 19-01 | European/Swiss context, metric is standard - imperial available for convenience                     |
| US standard cup (240ml) not UK cup (284ml)                       | 19-01 | US recipes more common internationally, clear standard for conversions                              |
| Density table required for volume/weight conversions             | 19-01 | Different ingredients have different densities (1 cup flour ≠ 1 cup water in weight)                |
| Fractional display for imperial units                            | 19-01 | Cooking recipes typically use fractions (1/4 cup) not decimals (0.25 cup) for better UX            |
| CHF/EUR/USD currency support only (Swiss/European context)       | 19-02 | Aligns with v3.0 focus on Swiss and European users, additional currencies can be added later       |
| Non-linear scaling for salt at 67-75% rate                       | 19-03 | Taste perception doesn't scale linearly; doubling recipe doesn't need double salt                  |
| Spices and extracts scale at 75% rate                            | 19-03 | Volatile compounds concentrate; over-scaling produces overwhelming flavor                          |
| Leavening agents scale at 87.5% rate                             | 19-03 | Chemical reaction efficiency changes; over-leavening causes collapse                               |
| Liquids scale down at 70%, normally up                           | 19-03 | Evaporation rate doesn't change with quantity; large batches need less proportional liquid         |
| Unit compatibility checking enforced for food cost               | 19-02 | Prevents invalid calculations (price per kg with amount in ml), provides clear error messages      |
| Ingredients array not synced to URL (too complex)                | 19-02 | Multiple ingredients with nested fields create unwieldy URLs, only basic fields synced             |

### Milestone Evolution

- **v2.0 Network Tools & User Experience** (2026-01-22): Comprehensive network calculator suite with global search and 100% translation coverage. 8 phases, 22 plans, 55 commits, 217 files modified. All 29 requirements satisfied (100% coverage). Network category with visual subnet calculator, IP address calculator, CIDR range calculator, and network speed/latency tools. Global search with Cmd+K shortcut. All 156 registered calculators internationalized for en/fr/de/it.

- **v1.0 Infrastructure Upgrade** (2026-01-18): Comprehensive infrastructure upgrade with strict TypeScript, Zustand state management, PWA support, and complete documentation. 8 phases, 19 plans, 103 commits, 131 files modified. All 32 requirements satisfied (100% coverage).

### Phase 8 Enhancements Deferred to v2.0

- ⬜ Consider Biome-only migration if Next.js supports removing ESLint (architectural decision)

## Session Continuity

Last session: 2026-01-24T11:31:00Z
Stopped at: Completed 19-03-PLAN.md (Recipe Scaler)
Resume file: None

**Next Steps:**

1. ✅ v1.0 Infrastructure Upgrade shipped (2026-01-18)
2. ✅ v2.0 Network Tools & User Experience shipped (2026-01-22)
3. ▶ v3.0 Calculator Expansion & Performance (in progress)
   - ✅ Phase 17-01 Hash Calculator (Complete)
   - ✅ Phase 17-02 Wallet Validator (Complete)
   - ✅ Phase 17-03 Exchange Rate Calculator (Complete)
   - ✅ Phase 17-04 Mining Profitability Calculator (Complete)
   - ✅ Phase 17 Complete (4/4 plans)
   - ✅ Phase 19-01 Cooking Unit Converter (Complete)
   - ✅ Phase 19-02 Food Cost Calculator (Complete)
   - ✅ Phase 19-03 Recipe Scaler (Complete)
   - Next: Phase 19-04 (Nutrition Calculator) or Phase 18 (Real Estate Foundation)
