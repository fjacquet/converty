# Requirements: Converty v2.0 Network Tools & User Experience

**Defined:** 2026-01-18
**Core Value:** A solid, maintainable foundation with zero technical debt in state management and type safety, enabling confident future development.

## v2.0 Requirements

Requirements for v2.0 release. Each maps to roadmap phases.

### Network Calculators

- [ ] **NET-01**: Visual Subnet Calculator supports IPv4 addresses
- [ ] **NET-02**: Visual Subnet Calculator supports IPv6 addresses
- [ ] **NET-03**: Visual Subnet Calculator displays network diagram showing network/host portions and IP ranges
- [ ] **NET-04**: Visual Subnet Calculator displays binary representation of IP address and subnet mask with highlighted bits
- [ ] **NET-05**: Visual Subnet Calculator displays breakdown table (network address, broadcast address, usable range, total hosts)
- [ ] **NET-06**: Visual Subnet Calculator accepts CIDR notation input (e.g., 192.168.1.0/24, 2001:db8::/32)
- [ ] **NET-07**: Visual Subnet Calculator accepts subnet mask input (e.g., 255.255.255.0)
- [ ] **NET-08**: Visual Subnet Calculator can divide network into smaller subnets (subnetting)
- [ ] **NET-09**: Visual Subnet Calculator can combine multiple networks into larger CIDR block (supernetting)
- [ ] **NET-10**: IP Address Calculator detects IP class (A, B, C, D, E)
- [ ] **NET-11**: IP Address Calculator identifies public vs private IP addresses
- [ ] **NET-12**: IP Address Calculator validates IP address format and range
- [ ] **NET-13**: CIDR Range Calculator calculates IP range from CIDR notation
- [ ] **NET-14**: CIDR Range Calculator checks if specific IP address is within CIDR range
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
| (To be populated by create-roadmap) | | |

**Coverage:**
- v2.0 requirements: 29 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 29 ⚠️

---
*Requirements defined: 2026-01-18*
*Last updated: 2026-01-18 after initial definition*
