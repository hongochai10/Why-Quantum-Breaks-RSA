# Issue Tracker — Why Quantum Breaks RSA

> Last updated: 2026-03-29 (Audit #3 — TEC-626)

## Active Issues

### In Progress

| ID | Title | Owner | Priority | Dependencies |
|----|-------|-------|----------|-------------|
| TEC-566 | Harden CSP: remove unsafe-inline | Security Engineer | P1 | None |
| TEC-559 | SLH-DSA: Interactive signing path | Sr. Frontend Engineer | P1 | None |
| TEC-545 | Cross-browser E2E tests (Firefox + WebKit) | QA Engineer | P2 | CI pipeline |

### To Do — High Priority

| ID | Title | Owner | Priority | Dependencies |
|----|-------|-------|----------|-------------|
| TEC-568 | Fix empty catch blocks, add error logging | Sr. Frontend Engineer | P1 | None |
| TEC-567 | Replace Math.random() with crypto.getRandomValues() | Sr. Frontend Engineer | P1 | None |
| TEC-562 | Replace Math.random() across all modules | Sr. Frontend Engineer | P1 | None |
| TEC-511 | Fix QuantumCircuit animation step bug | Unassigned | P1 | None |

### To Do — Medium Priority

| ID | Title | Owner | Priority | Dependencies |
|----|-------|-------|----------|-------------|
| TEC-514 | Performance optimizations — memoize BigInt | Unassigned | P2 | None |
| TEC-512 | Add integration tests for cross-panel state | Unassigned | P2 | None |
| TEC-570 | Complete interactive quiz system | Sr. Frontend Engineer | P2 | Stations |
| TEC-569 | Keyboard navigation for timeline | Sr. Frontend Engineer | P2 | Timeline |
| TEC-561 | Quantum threat timeline visualization | Sr. Frontend Engineer | P2 | None |
| TEC-560 | Performance benchmarks page | Sr. Frontend Engineer | P2 | None |
| TEC-513 | Mobile UX — qubit slider touch | Unassigned | P2 | None |
| TEC-516 | Verify CI/CD pipeline end-to-end | Unassigned | P2 | None |
| TEC-457 | Cross-browser range input styling | Unassigned | P2 | None |

### To Do — Low Priority

| ID | Title | Owner | Priority | Dependencies |
|----|-------|-------|----------|-------------|
| TEC-461 | Mobile and tablet layout optimization | Unassigned | P3 | None |
| TEC-515 | Accessibility enhancements — aria-description | Unassigned | P3 | None |
| TEC-546 | PWA offline E2E tests | QA Engineer | P3 | E2E framework |
| TEC-547 | Visual regression tests all 6 stations | QA Engineer | P3 | E2E framework |

## Recently Completed

| ID | Title | Fix Commit | Completed |
|----|-------|-----------|-----------|
| TEC-602 | Fix memory leak in LatticeVisualization | `3148d5b` | 2026-03-29 |
| TEC-603 | Fix ShorPanel unmount state updates | `e07a9ec` | 2026-03-29 |
| TEC-604 | Extract hardcoded colors to COLORS constant | `7f10740` | 2026-03-29 |
| TEC-605 | Fix test setup: remove global error suppression | `3bd65e5` | 2026-03-29 |

## Stale (Closed)

| ID | Title | Reason |
|----|-------|--------|
| TEC-458 | Add prefers-reduced-motion support | Already implemented (commit 2da5c49) |
| TEC-460 | Add unit tests for Shor algorithm library | Tests exist, 96.77% coverage |
| TEC-456 | Add ARIA labels & accessibility | Extensive ARIA labels already present |
| TEC-459 | Add input validation error messages | Validation already implemented |
