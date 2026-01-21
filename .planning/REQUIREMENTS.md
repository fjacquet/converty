# Requirements: Converty v2.0 Network Tools & User Experience

**Defined:** 2026-01-18
**Core Value:** A solid, maintainable foundation with zero technical debt in state management and type safety, enabling confident future development.

## v2.0 Requirements

Requirements for v2.0 release. Each maps to roadmap phases.

### Network Calculators

- [x] **NET-01**: Visual Subnet Calculator supports IPv4 addresses
- [x] **NET-02**: Visual Subnet Calculator supports IPv6 addresses
- [x] **NET-03**: Visual Subnet Calculator displays network diagram showing network/host portions and IP ranges
- [x] **NET-04**: Visual Subnet Calculator displays binary representation of IP address and subnet mask with highlighted bits
- [x] **NET-05**: Visual Subnet Calculator displays breakdown table (network address, broadcast address, usable range, total hosts)
- [x] **NET-06**: Visual Subnet Calculator accepts CIDR notation input (e.g., 192.168.1.0/24, 2001:db8::/32)
- [x] **NET-07**: Visual Subnet Calculator accepts subnet mask input (e.g., 255.255.255.0)
- [x] **NET-08**: Visual Subnet Calculator can divide network into smaller subnets (subnetting)
- [x] **NET-09**: Visual Subnet Calculator can combine multiple networks into larger CIDR block (supernetting)
- [x] **NET-10**: IP Address Calculator detects IP class (A, B, C, D, E)
- [x] **NET-11**: IP Address Calculator identifies public vs private IP addresses
- [x] **NET-12**: IP Address Calculator validates IP address format and range
- [x] **NET-13**: CIDR Range Calculator calculates IP range from CIDR notation
- [x] **NET-14**: CIDR Range Calculator checks if specific IP address is within CIDR range
- [ ] **NET-15**: Network Speed/Latency Calculator converts ping time units
- [ ] **NET-16**: Network Speed/Latency Calculator calculates network throughput

### Search Functionality

- [ ] **SRCH-01**: User can search calculators by name
- [ ] **SRCH-02**: User can search calculators by description
- [ ] **SRCH-03**: Search results update in real-time as user types
- [ ] **SRCH-04**: Search is accessible from all pages (global search)

### Translation Compliance

- [ ] **I18N-01**: All hardcoded English strings identified across 200+ calculators
- [ ] **I18N-02**: Hardcoded strings moved to English translation file (en.json)
- [ ] **I18N-03**: Strings translated to French (fr.json)
- [ ] **I18N-04**: Strings translated to German (de.json)
- [ ] **I18N-05**: Strings translated to Italian (it.json)
- [ ] **I18N-06**: All calculators verified working in English locale
- [ ] **I18N-07**: All calculators verified working in French locale
- [ ] **I18N-08**: All calculators verified working in German locale
- [ ] **I18N-09**: All calculators verified working in Italian locale

## v3.0+ Requirements

Deferred to future releases. Tracked but not in v2.0 roadmap.

### Search Enhancement

- **SRCH-05**: Search by category filtering
- **SRCH-06**: Search by keywords/tags

### User Experience

- **UX-01**: User can bookmark favorite calculators
- **UX-02**: User can view recent calculation history
- **UX-03**: User can export calculation results

### Network Tools

- **NET-17**: MAC Address Calculator and formatter
- **NET-18**: Bandwidth Calculator (Mbps/Gbps conversions, transfer times)
- **NET-19**: Port Number Reference tool

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Advanced search filters (date range, calculator type, etc.) | Basic search sufficient for v2.0, defer to v3.0+ |
| Calculator favorites persistence across devices | Requires backend/auth, defer to future milestone |
| Real-time collaboration on calculations | Massive complexity, not core value |
| Network diagnostic tools (ping, traceroute, DNS lookup) | Requires backend services, static site constraint |
| VPN/Security calculators | Defer to dedicated security tools category |

## Traceability

Which phases cover which requirements. Updated by create-roadmap.

| Requirement | Phase | Status |
|-------------|-------|--------|
| NET-01 | Phase 9 | Complete |
| NET-02 | Phase 9 | Complete |
| NET-03 | Phase 10 | Complete |
| NET-04 | Phase 10 | Complete |
| NET-05 | Phase 10 | Complete |
| NET-06 | Phase 9 | Complete |
| NET-07 | Phase 9 | Complete |
| NET-08 | Phase 11 | Complete |
| NET-09 | Phase 11 | Complete |
| NET-10 | Phase 12 | Complete |
| NET-11 | Phase 12 | Complete |
| NET-12 | Phase 12 | Complete |
| NET-13 | Phase 12 | Complete |
| NET-14 | Phase 12 | Complete |
| NET-15 | Phase 13 | Pending |
| NET-16 | Phase 13 | Pending |
| SRCH-01 | Phase 14 | Pending |
| SRCH-02 | Phase 14 | Pending |
| SRCH-03 | Phase 14 | Pending |
| SRCH-04 | Phase 14 | Pending |
| I18N-01 | Phase 15 | Pending |
| I18N-02 | Phase 15 | Pending |
| I18N-03 | Phase 16 | Pending |
| I18N-04 | Phase 16 | Pending |
| I18N-05 | Phase 16 | Pending |
| I18N-06 | Phase 16 | Pending |
| I18N-07 | Phase 16 | Pending |
| I18N-08 | Phase 16 | Pending |
| I18N-09 | Phase 16 | Pending |

**Coverage:**
- v2.0 requirements: 29 total
- Mapped to phases: 29
- Complete: 14 (NET-01 through NET-14)
- Pending: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-18*
*Last updated: 2026-01-21 after Phase 12 completion*
