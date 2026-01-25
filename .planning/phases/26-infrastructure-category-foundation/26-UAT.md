---
status: diagnosed
phase: 26-infrastructure-category-foundation
source: 26-01-SUMMARY.md, 26-02-SUMMARY.md
started: 2026-01-25T14:30:00Z
updated: 2026-01-25T14:40:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Infrastructure category visible in navigation

expected: The Infrastructure category appears in the site navigation/category list with a Server icon. Category is positioned alphabetically between Health and Math categories.
result: pass

### 2. Infrastructure category translations (English)

expected: In English locale (/en), category name shows "Infrastructure" with description "Virtualization, Kubernetes, and datacenter tools". Subcategories show: VMware, Kubernetes, Cost Analysis.
result: pass

### 3. Infrastructure category translations (French)

expected: In French locale (/fr), category name shows "Infrastructure" with description "Outils de virtualisation, Kubernetes et centres de données". Subcategories show: VMware, Kubernetes, Analyse des Coûts.
result: pass

### 4. Infrastructure category translations (German)

expected: In German locale (/de), category name shows "Infrastruktur" with description "Virtualisierung, Kubernetes und Rechenzentrum-Tools". Subcategories show: VMware, Kubernetes, Kostenanalyse.
result: pass

### 5. Infrastructure category translations (Italian)

expected: In Italian locale (/it), category name shows "Infrastruttura" with description "Strumenti per virtualizzazione, Kubernetes e data center". Subcategories show: VMware, Kubernetes, Analisi dei Costi.
result: pass

### 6. Infrastructure landing page accessible

expected: Navigating to /en/infrastructure, /fr/infrastructure, /de/infrastructure, and /it/infrastructure shows the infrastructure category page with "Infrastructure calculators coming soon!" or similar empty state message.
result: pass

### 7. Production build generates all locale pages

expected: Running `npm run build` successfully generates infrastructure category pages for all 4 locales without TypeScript errors or build failures.
result: issue
reported: "oups

✓ Collecting page data using 9 workers in 646.0ms
Error: MISSING_MESSAGE: calculator.k8sCapacity.podWorkload (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.podCpuRequest (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.podMemoryRequest (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.podReplicas (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.nodeSpecs (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.nodeMemoryMb (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.systemOverhead (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.systemReservedCpu (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.systemReservedHelp (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.systemReservedMemory (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.daemonSetCpuPerNode (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.daemonSetHelp (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.daemonSetMemoryPerNode (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.targetUtilization (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.targetUtilizationHelp (de)
Error: MISSING_MESSAGE: calculator.k8sCapacity.targetMemoryUtilization (de)
(build completes but with errors)"
severity: major

## Summary

total: 7
passed: 6
issues: 1
pending: 0
skipped: 0

## Gaps

- truth: "Running `npm run build` successfully generates infrastructure category pages for all 4 locales without TypeScript errors or build failures"
  status: failed
  reason: "User reported: Build completes but emits 19 MISSING_MESSAGE errors for calculator.k8sCapacity.* keys in German (de) locale"
  severity: major
  test: 7
  root_cause: "German locale file (src/messages/de.json) contains outdated k8sCapacity translations from before Phase 28 calculator redesign with 36 old keys instead of required 51 keys"
  artifacts:
  - path: "src/messages/de.json"
      issue: "calculator.k8sCapacity section has outdated structure with 28 missing keys and 13 obsolete keys"
  - path: "src/messages/en.json"
      issue: "Reference for correct structure (51 keys)"
  missing:
  - "Replace entire calculator.k8sCapacity section in de.json with German translations of current 51 keys from en.json"
  - "Missing keys: allocatableCpu, allocatableMemory, breakdown, calculationSteps, cpuBreakdown, cpuConstraint, daemonSetCpuPerNode, daemonSetHelp, daemonSetMemoryPerNode, finalMemoryUtilization, memoryBreakdown, memoryConstraint, nodeMemoryMb, nodesNeeded, nodeSpecs, overUtilizationWarning, podCpuRequest, podMemoryRequest, podReplicas, podWorkload, results, systemOverhead, systemReservedCpu, systemReservedHelp, systemReservedMemory, targetMemoryUtilization, targetUtilization, targetUtilizationHelp"
  debug_session: ".planning/debug/missing-k8s-de-translations.md"
