# Development Plan — Why Quantum Breaks RSA

> Last updated: 2026-03-29 (Audit #3 — TEC-626)

## Current State
- **Framework**: Next.js 16.2.1 + React 19 + TypeScript 5 + Tailwind CSS 4
- **Test Coverage**: 93.28% statements, 78.87% branches
- **Deployment**: Vercel (CI/CD via GitHub Actions)
- **Status**: Production-ready, actively maintained
- **Tests**: 124/124 passing

## Milestone 1: Security & Stability (P0/P1)
**Target**: Week of 2026-03-31

| Task | Owner | Status |
|------|-------|--------|
| Fix memory leak in LatticeVisualization (TEC-602) | Sr. Frontend Engineer | ✅ Done (`3148d5b`) |
| Fix ShorPanel unmount state updates (TEC-603) | Sr. Frontend Engineer | ✅ Done (`e07a9ec`) |
| Extract hardcoded colors to constants (TEC-604) | Sr. Frontend Engineer | ✅ Done (`7f10740`) |
| Fix test setup error suppression (TEC-605) | QA Engineer | ✅ Done (`3bd65e5`) |
| Harden CSP (TEC-566) | Security Engineer | In Progress |
| Replace Math.random() with crypto (TEC-567, TEC-562) | Sr. Frontend Engineer | To Do |
| Fix empty catch blocks (TEC-568) | Sr. Frontend Engineer | To Do |
| Fix QuantumCircuit animation bug (TEC-511) | Unassigned | To Do |

## Milestone 2: Feature Completion (P1/P2)
**Target**: Week of 2026-04-07

| Task | Owner | Status |
|------|-------|--------|
| SLH-DSA interactive signing (TEC-559) | Sr. Frontend Engineer | In Progress |
| Interactive quiz system (TEC-570) | Sr. Frontend Engineer | To Do |
| Quantum threat timeline (TEC-561) | Sr. Frontend Engineer | To Do |
| Performance benchmarks page (TEC-560) | Sr. Frontend Engineer | To Do |
| Keyboard navigation timeline (TEC-569) | Sr. Frontend Engineer | To Do |

## Milestone 3: Quality & Testing (P2)
**Target**: Week of 2026-04-14

| Task | Owner | Status |
|------|-------|--------|
| Cross-browser E2E tests (TEC-545) | QA Engineer | In Progress |
| Integration tests cross-panel (TEC-512) | Unassigned | To Do |
| Performance optimizations (TEC-514) | Unassigned | To Do |
| CI/CD pipeline verification (TEC-516) | Unassigned | To Do |

## Milestone 4: Polish & UX (P2/P3)
**Target**: Week of 2026-04-21

| Task | Owner | Status |
|------|-------|--------|
| Mobile UX improvements (TEC-513) | Unassigned | To Do |
| Cross-browser range input (TEC-457) | Unassigned | To Do |
| Mobile/tablet layout (TEC-461) | Unassigned | To Do |
| Accessibility enhancements (TEC-515) | Unassigned | To Do |

## Technical Notes
- Next.js 16 has breaking changes — check `node_modules/next/dist/docs/` before modifying
- Framer Motion animations respect `prefers-reduced-motion`
- Vitest with jsdom for testing; animation intervals hard to test (LatticeVisualization)
- COLORS constants now centralized in `src/lib/constants.ts` and Tailwind theme
