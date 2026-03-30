# Why Quantum Breaks RSA

An interactive educational dashboard that visualizes how quantum computing threatens classical RSA encryption and why post-quantum cryptography (PQC) is the path forward.

**Live demo**: side-by-side comparison of Shor's algorithm factoring RSA keys vs. lattice-based ML-KEM resisting quantum attacks.

## Features

- **Shor's Algorithm Simulation** — Step-by-step animated walkthrough of quantum integer factorization. Pick a semiprime (15, 21, 35, 77, 91, 143), watch the quantum circuit execute Hadamard gates, oracle queries, inverse QFT, and measurement stages.
- **Qubit Slider** — Drag to scale a hypothetical quantum computer from 0 to 10,000 logical qubits. See which RSA key sizes (1024, 2048, 4096) break at each threshold.
- **Post-Quantum Cryptography Panel** — Explains ML-KEM (FIPS 203, formerly CRYSTALS-Kyber) and shows why lattice problems remain hard even for quantum computers.
- **Lattice Visualization** — Animated 2D lattice grid demonstrating the search space that quantum computers cannot efficiently collapse.
- **Quantum Circuit Diagram** — SVG rendering of a 4-qubit circuit with gate-by-gate animation and screen-reader accessible labels.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animation | [Framer Motion 12](https://motion.dev/) |
| Language | TypeScript 5 |
| Fonts | Geist Sans & Geist Mono |

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, pnpm, or bun

### Install & Run

```bash
# Clone the repository
git clone https://github.com/your-username/why-quantum-breaks-rsa.git
cd why-quantum-breaks-rsa

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata and fonts
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── ShorPanel.tsx       # Shor's algorithm simulation UI
│   ├── PQCPanel.tsx        # Post-quantum cryptography panel
│   ├── QubitSlider.tsx     # Qubit count slider with RSA breakpoints
│   ├── QuantumCircuit.tsx  # SVG quantum circuit diagram
│   ├── LatticeVisualization.tsx  # Animated lattice grid
│   └── ErrorBoundary.tsx   # React error boundary
└── lib/
    ├── shor.ts             # Shor's algorithm implementation
    └── constants.ts        # Design tokens, presets, gate definitions
```

## How It Works

The dashboard presents a split-screen comparison:

**Left panel (red)** — Classical RSA is vulnerable. The Shor simulation demonstrates how a quantum computer finds the period of modular exponentiation, then uses that period to extract prime factors. The implementation walks through each algorithmic step: pick a random base, check GCD, find the period via simulated quantum Fourier transform, and compute factors.

**Right panel (green)** — Post-quantum cryptography is safe. ML-KEM (Module Lattice-based Key Encapsulation) relies on the hardness of structured lattice problems (Module Learning With Errors), which no known quantum algorithm can solve efficiently. The panel shows security margins and the lattice visualization illustrates the intractable search space.

**Qubit slider** — Connects both panels. As you increase logical qubits, RSA keys fall one by one (1024-bit at ~2,000 qubits, 2048-bit at ~4,000, 4096-bit at ~8,000), while lattice-based schemes remain unaffected.

## Accessibility

- WCAG AA compliant with proper color contrast
- Full keyboard navigation with visible focus indicators
- ARIA labels on interactive elements and data visualizations
- Skip-to-content link
- `prefers-reduced-motion` support for animations
- Semantic HTML structure

## Academic References

The qubit estimates and cryptographic claims are based on published research:

- Gidney, C. & Ekera, M. (2021). *How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits.* Quantum, 5, 433.
- NIST. (2024). *FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM).*
- Shor, P. (1994). *Algorithms for quantum computation: discrete logarithms and factoring.* Proceedings 35th Annual Symposium on Foundations of Computer Science.

## License

This project is licensed under the [MIT License](LICENSE).
