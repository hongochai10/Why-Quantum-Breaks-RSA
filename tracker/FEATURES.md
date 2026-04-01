# Features — Why Quantum Breaks RSA

> Last updated: 2026-04-01 (Audit #12 — TEC-1010)

## Implemented Features

| Feature | Description | Status |
|---------|-------------|--------|
| Shor's Algorithm Simulator | Step-by-step factorization with play/pause/speed controls | ✅ Done |
| Qubit Slider | 100–10,000 qubit range showing RSA key breakpoints | ✅ Done |
| PQC Panel (ML-KEM) | Post-quantum cryptography education with security levels | ✅ Done |
| Quantum Circuit Diagram | SVG 4-qubit circuit with gate-by-gate animation | ✅ Done |
| Lattice Visualization | 8×8 grid with animated search attempts | ✅ Done |
| Error Boundary | Graceful error handling with retry | ✅ Done |
| Accessibility (WCAG AA) | Skip-to-content, ARIA labels, reduced-motion, keyboard nav | ✅ Done |
| Security Headers | HSTS, CSP (hardened), X-Frame-Options, Referrer-Policy | ✅ Done |
| CI/CD Pipeline | Lint + Type-check + Test + Build + Vercel Deploy | ✅ Done |
| SEO | robots.txt, sitemap.xml, OG meta tags | ✅ Done |
| SVG Accessibility | title/desc elements in QuantumCircuit and LatticeVisualization | ✅ Done |
| CI Test Gating | npm test step added to CI pipeline | ✅ Done |
| SLH-DSA Signing Path | Interactive hash-based signing visualization | ✅ Done |
| CSP Hardened | Removed unsafe-inline and unsafe-eval from CSP | ✅ Done |
| Crypto-safe RNG | Math.random() replaced with crypto.getRandomValues() | ✅ Done |

## Proposed Features

| Feature | Description | Business Value | Priority | Effort |
|---------|-------------|---------------|----------|--------|
| Interactive Quiz System (TEC-570) | Quizzes for all crypto stations | High — engagement + retention | P2 | Medium |
| Quantum Threat Timeline (TEC-561) | Visual "why PQC matters" narrative | High — storytelling | P2 | Medium |
| Performance Benchmarks (TEC-560) | Algorithm timing comparisons | Medium — technical depth | P2 | Medium |
| Mobile Touch UX (TEC-513) | Touch-optimized qubit slider | Medium — mobile users | P2 | Low |
| PWA Offline Mode | Service worker for offline education | Medium — reach | P3 | High |
