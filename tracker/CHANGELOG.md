# Changelog — Why Quantum Breaks RSA

## 2026-03-29 — Bug Fixes & Code Quality (Milestone 1 Partial)
- `3148d5b` fix: use ref-based interval cleanup in LatticeVisualization (TEC-602 ✅)
- `e07a9ec` fix: prevent state updates on unmounted ShorPanel component (TEC-603 ✅)
- `7f10740` refactor: extract hardcoded hex colors to shared COLORS constants and Tailwind theme tokens (TEC-604 ✅)
- `3bd65e5` fix: remove global unhandled rejection suppression from test setup (TEC-605 ✅)

## 2026-03-29 — CEO Audit #3 (TEC-626)
- Verified all 4 Audit #2 fixes — 124/124 tests pass, 0 TypeScript errors
- Updated tracker files to reflect completed work
- Remaining Milestone 1: TEC-566 (CSP), TEC-567/562 (Math.random), TEC-568 (catch blocks), TEC-511 (animation)

## 2026-03-29 — CEO Deep Audit (TEC-595)
- Deep code quality audit: found 2 HIGH severity runtime bugs (memory leak, unmount state)
- Created 4 new subtasks: TEC-602, TEC-603, TEC-604, TEC-605
- Updated plan document with full improvement/feature matrix
- QA validation: 124/124 tests pass, build success, 0 TypeScript errors
- Updated all tracker files with new findings and priority adjustments

## 2026-03-29 — CEO Audit (TEC-555)
- Created `tracker/` directory with standardized tracking files
- Completed full codebase audit — no critical blockers found
- Identified 4 stale issues for cleanup (TEC-456, TEC-458, TEC-459, TEC-460)
- Created improvement & feature matrix with prioritized roadmap
- Established 4-milestone development plan
- QA validation of core user flows

## 2026-03-29 — Recent Development
- `8a9c387` fix: add turbopack.root to resolve workspace root warning
- `1723d94` feat: add quantum-themed favicon and app icons
- `fbb4520` test: increase ShorPanel test coverage to 91%+ statements, 80%+ branches
- `2da5c49` feat: add prefers-reduced-motion support for Framer Motion animations
- `78dc80e` fix: remove unused rerender variable in ErrorBoundary test

## 2026-03-28 — Foundation
- Initial project setup with Next.js 16 + React 19 + TypeScript 5
- Core components: ShorPanel, PQCPanel, QubitSlider, QuantumCircuit, LatticeVisualization
- Test suite with 124 tests, 94% statement coverage
- CI/CD pipeline with GitHub Actions + Vercel
- WCAG AA accessibility implementation
- Security headers configuration
