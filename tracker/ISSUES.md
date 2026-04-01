# Issue Tracker — Why Quantum Breaks RSA

> Last updated: 2026-04-01 (Audit #12 — TEC-1010)

## Active Issues

### Blocked

| ID | Title | Owner | Priority | Blocker |
|----|-------|-------|----------|---------|
| TEC-545 | Cross-browser E2E tests (Firefox + WebKit) | QA Engineer | P2 | E2E framework setup |

### To Do — High Priority

| ID | Title | Owner | Priority | Dependencies |
|----|-------|-------|----------|-------------|
| TEC-516 | Verify CI/CD pipeline end-to-end | DevOps Engineer | P1 | None |

### To Do — Medium Priority

| ID | Title | Owner | Priority | Dependencies |
|----|-------|-------|----------|-------------|
| TEC-770 | Add error recovery + cleanup verification tests | QA Engineer | P2 | None |
| TEC-514 | Performance optimizations — memoize BigInt | Unassigned | P2 | None |
| TEC-513 | Mobile UX — qubit slider touch | Unassigned | P2 | None |
| TEC-570 | Complete interactive quiz system | Sr. Frontend Engineer | P2 | Stations |
| TEC-569 | Keyboard navigation for timeline | Sr. Frontend Engineer | P2 | Timeline |
| TEC-561 | Quantum threat timeline visualization | Sr. Frontend Engineer | P2 | None |
| TEC-560 | Performance benchmarks page | Sr. Frontend Engineer | P2 | None |

### To Do — Low Priority

| ID | Title | Owner | Priority | Dependencies |
|----|-------|-------|----------|-------------|
| TEC-771 | Fix disabled button WCAG contrast + npm prune | Sr. Frontend Engineer | P3 | None |
| TEC-461 | Mobile and tablet layout optimization | Unassigned | P3 | None |
| TEC-515 | Accessibility enhancements — aria-description | Unassigned | P3 | None |
| TEC-546 | PWA offline E2E tests | QA Engineer | P3 | E2E framework |
| TEC-547 | Visual regression tests all 6 stations | QA Engineer | P3 | E2E framework |

## Recently Completed

| ID | Title | Fix Commit | Completed |
|----|-------|-----------|-----------|
| TEC-769 | Add aria-atomic + memo() | `676ac37` | 2026-03-31 |
| TEC-511 | Fix QuantumCircuit animation step bug | `f354c55`, `4574a4b` | 2026-03-31 |
| TEC-512 | Integration tests for cross-panel state | `0bb516b` | 2026-03-31 |
| TEC-457 | Cross-browser range input styling (Firefox) | `2cf8186` | 2026-03-31 |
| TEC-566 | Harden CSP: remove unsafe-inline | — | 2026-03-30 |
| TEC-764 | Remove unsafe-eval from CSP | — | 2026-03-30 |
| TEC-559 | SLH-DSA interactive signing path | — | 2026-03-30 |
| TEC-567 | Replace Math.random() with crypto | — | 2026-03-30 |
| TEC-562 | Replace Math.random() across all modules | — | 2026-03-30 |
| TEC-568 | Fix empty catch blocks | — | 2026-03-30 |
| TEC-757 | Extract remaining hardcoded hex colors | `94b1da1` | 2026-03-30 |
| TEC-758 | Extract SVG magic numbers to constants | `daa14c1` | 2026-03-30 |
| TEC-759 | Improve branch coverage PQCPanel/LatticeVisualization | `ad24182` | 2026-03-30 |
| TEC-760 | Memoize PQCPanel BigInt | `b4053cb` | 2026-03-30 |
| TEC-761 | Add MIT LICENSE file | `97c4014` | 2026-03-30 |
| TEC-679 | Add npm test step to CI pipeline | `b3bf513` | 2026-03-29 |
| TEC-680 | Add SVG title/desc for accessibility | `5ce273d` | 2026-03-29 |
| TEC-681 | Replace hardcoded gate count magic number | `cdd6206` | 2026-03-29 |
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
