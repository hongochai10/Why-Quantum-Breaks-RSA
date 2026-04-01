# Development Plan — Why Quantum Breaks RSA

> Last updated: 2026-04-01 (Audit #12 — TEC-1010)

## Current State
- **Framework**: Next.js 16.2.1 + React 19 + TypeScript 5 + Tailwind CSS 4
- **Test Coverage**: 95.94% statements, 87.6% branches, 100% functions, 98.31% lines
- **Deployment**: Vercel (CI/CD via GitHub Actions)
- **Status**: Production-ready, actively maintained
- **Tests**: 163/163 passing
- **Health Score**: 9.0/10

## Milestone 1: Security & Stability (P0/P1) ✅
**Target**: 2026-03-31 | **Progress**: 100% (10/10 done) | **Completed On Time** ✅

| Task | Owner | Status |
|------|-------|--------|
| Fix memory leak in LatticeVisualization (TEC-602) | Sr. Frontend Engineer | ✅ Done (`3148d5b`) |
| Fix ShorPanel unmount state updates (TEC-603) | Sr. Frontend Engineer | ✅ Done (`e07a9ec`) |
| Extract hardcoded colors to constants (TEC-604) | Sr. Frontend Engineer | ✅ Done (`7f10740`) |
| Fix test setup error suppression (TEC-605) | QA Engineer | ✅ Done (`3bd65e5`) |
| Add npm test step to CI pipeline (TEC-679) | DevOps Engineer | ✅ Done (`b3bf513`) |
| Add SVG title/desc for accessibility (TEC-680) | Sr. Frontend Engineer | ✅ Done (`5ce273d`) |
| Replace hardcoded gate count (TEC-681) | Sr. Frontend Engineer | ✅ Done (`cdd6206`) |
| Harden CSP (TEC-566) | Security Engineer | ✅ Done |
| Replace Math.random() with crypto (TEC-567, TEC-562) | Sr. Frontend Engineer | ✅ Done |
| Fix empty catch blocks (TEC-568) | Sr. Frontend Engineer | ✅ Done |

## Milestone 2: Code Quality & Refactoring (P2)
**Target**: 2026-04-04 | **Progress**: 89% (8/9 done)

| Task | Owner | Status |
|------|-------|--------|
| Extract remaining hardcoded hex colors (TEC-757) | Sr. Frontend Engineer | ✅ Done (`94b1da1`) |
| Extract SVG magic numbers to constants (TEC-758) | Sr. Frontend Engineer | ✅ Done (`daa14c1`) |
| Improve branch coverage to 85%+ (TEC-759) | QA Engineer | ✅ Done (`ad24182`) |
| Memoize PQCPanel BigInt (TEC-760) | Sr. Frontend Engineer | ✅ Done (`b4053cb`) |
| Add MIT LICENSE file (TEC-761) | Sr. Frontend Engineer | ✅ Done (`97c4014`) |
| Add aria-atomic + memo() (TEC-769) | Sr. Frontend Engineer | ✅ Done (`676ac37`) |
| Fix QuantumCircuit animation bug (TEC-511) | Sr. Frontend Engineer | ✅ Done (`f354c55`, `4574a4b`) |
| Error recovery + cleanup tests (TEC-770) | QA Engineer | ⬜ To Do |
| WCAG button contrast + npm prune (TEC-771) | Sr. Frontend Engineer | ⬜ To Do (P3) |

## Milestone 3: Feature Completion (P1/P2)
**Target**: 2026-04-07 | **Progress**: 20% (1/5 done)

| Task | Owner | Status |
|------|-------|--------|
| SLH-DSA interactive signing (TEC-559) | Sr. Frontend Engineer | ✅ Done |
| Interactive quiz system (TEC-570) | Sr. Frontend Engineer | ⬜ To Do |
| Quantum threat timeline (TEC-561) | Sr. Frontend Engineer | ⬜ To Do |
| Performance benchmarks page (TEC-560) | Sr. Frontend Engineer | ⬜ To Do |
| Keyboard navigation timeline (TEC-569) | Sr. Frontend Engineer | ⬜ To Do |

## Milestone 4: Quality & Testing (P2)
**Target**: 2026-04-14 | **Progress**: 25% (1/4 done)

| Task | Owner | Status |
|------|-------|--------|
| Integration tests cross-panel (TEC-512) | QA Engineer | ✅ Done (`0bb516b`) |
| Cross-browser E2E tests (TEC-545) | QA Engineer | 🚫 Blocked |
| Performance optimizations (TEC-514) | Unassigned | ⬜ To Do |
| CI/CD pipeline verification (TEC-516) | Unassigned | ⬜ To Do |

## Milestone 5: Polish & UX (P2/P3)
**Target**: 2026-04-21 | **Progress**: 25% (1/4 done)

| Task | Owner | Status |
|------|-------|--------|
| Cross-browser range input (TEC-457) | Sr. Frontend Engineer | ✅ Done (`2cf8186`) |
| Mobile UX improvements (TEC-513) | Unassigned | ⬜ To Do |
| Mobile/tablet layout (TEC-461) | Unassigned | ⬜ To Do |
| Accessibility enhancements (TEC-515) | Unassigned | ⬜ To Do |

## Technical Notes
- Next.js 16 has breaking changes — check `node_modules/next/dist/docs/` before modifying
- Framer Motion animations respect `prefers-reduced-motion`
- Vitest with jsdom for testing; animation intervals hard to test (LatticeVisualization)
- COLORS constants now centralized in `src/lib/constants.ts` and Tailwind theme
- Branch coverage target: 85%+ — **achieved** (87.06%) ✅
- Function coverage: 100% ✅
