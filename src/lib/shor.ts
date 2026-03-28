// Simplified Shor's algorithm simulation for educational purposes

export interface ShorStep {
  label: string;
  description: string;
  detail: string;
}

export interface ShorResult {
  n: number;
  a: number;
  period: number | null;
  factor1: number | null;
  factor2: number | null;
  steps: ShorStep[];
  success: boolean;
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

function findPeriod(a: number, n: number): number | null {
  for (let r = 1; r <= n; r++) {
    if (modPow(a, r, n) === 1) return r;
  }
  return null;
}

export function runShor(n: number): ShorResult {
  const steps: ShorStep[] = [];

  steps.push({
    label: "Input",
    description: `Factor N = ${n}`,
    detail: `We want to find the prime factors of ${n} using quantum period-finding.`,
  });

  // Check trivial cases
  if (n % 2 === 0) {
    steps.push({
      label: "Trivial",
      description: `${n} is even`,
      detail: `N is divisible by 2. Factors: 2 × ${n / 2}`,
    });
    return { n, a: 2, period: null, factor1: 2, factor2: n / 2, steps, success: true };
  }

  // Pick random a coprime to n (Shor's algorithm requirement)
  // Avoid hardcoded values — instead, randomly select and verify gcd(a,n)=1
  let a = 2 + Math.floor(Math.random() * (n - 3));
  // Retry if a shares a factor with n (up to a few tries for small n)
  for (let attempt = 0; attempt < 10 && gcd(a, n) > 1; attempt++) {
    a = 2 + Math.floor(Math.random() * (n - 3));
  }

  steps.push({
    label: "Choose a",
    description: `Random a = ${a}`,
    detail: `Pick a random number a = ${a} where 1 < a < ${n}. Check if gcd(${a}, ${n}) > 1.`,
  });

  const g = gcd(a, n);
  if (g > 1) {
    steps.push({
      label: "Lucky",
      description: `gcd(${a}, ${n}) = ${g}`,
      detail: `We got lucky! gcd(${a}, ${n}) = ${g}, which is already a factor.`,
    });
    return { n, a, period: null, factor1: g, factor2: n / g, steps, success: true };
  }

  steps.push({
    label: "GCD Check",
    description: `gcd(${a}, ${n}) = 1 ✓`,
    detail: `gcd(${a}, ${n}) = 1, so a and N are coprime. Proceed to quantum period-finding.`,
  });

  // Quantum period finding (simulated classically)
  const period = findPeriod(a, n);

  steps.push({
    label: "Quantum Period Finding",
    description: `QFT finds period r = ${period}`,
    detail: `The quantum computer uses superposition to evaluate f(x) = ${a}^x mod ${n} for all x simultaneously, then applies Quantum Fourier Transform to find the period r = ${period}.`,
  });

  if (!period || period % 2 !== 0) {
    steps.push({
      label: "Failed",
      description: `Period ${period} is odd or not found`,
      detail: `The period r = ${period} is odd. Shor's algorithm requires an even period. Retry with a different 'a'.`,
    });
    return { n, a, period, factor1: null, factor2: null, steps, success: false };
  }

  const halfPeriod = period / 2;
  const guess1 = gcd(Math.abs(modPow(a, halfPeriod, n) - 1), n);
  const guess2 = gcd(modPow(a, halfPeriod, n) + 1, n);

  steps.push({
    label: "Extract Factors",
    description: `gcd(${a}^${halfPeriod} ± 1, ${n})`,
    detail: `With even period r = ${period}, compute gcd(${a}^${halfPeriod} - 1, ${n}) = ${guess1} and gcd(${a}^${halfPeriod} + 1, ${n}) = ${guess2}.`,
  });

  const f1 = guess1 > 1 && guess1 < n ? guess1 : guess2 > 1 && guess2 < n ? guess2 : null;
  const f2 = f1 ? n / f1 : null;

  if (f1 && f2 && f1 > 1 && f2 > 1) {
    steps.push({
      label: "Success!",
      description: `${n} = ${f1} × ${f2}`,
      detail: `Shor's algorithm successfully factored ${n} = ${f1} × ${f2}. A quantum computer with enough qubits can do this for any RSA modulus.`,
    });
    return { n, a, period, factor1: f1, factor2: f2, steps, success: true };
  }

  steps.push({
    label: "Failed",
    description: "Trivial factors found",
    detail: `Got trivial factors (1 or N). Need to retry with a different 'a'.`,
  });
  return { n, a, period, factor1: null, factor2: null, steps, success: false };
}

// RSA key sizes and estimated logical qubits needed to break them
//
// References:
// [1] Beauregard (2003) "Circuit for Shor's algorithm using 2n+3 qubits"
//     — Establishes the 2n+3 logical qubit baseline for Shor's factoring.
// [2] Gidney & Ekerå (2021) "How to factor 2048 bit RSA integers in 8 hours
//     using 20 million noisy qubits" — arXiv:1905.09749v3
//     — Shows ~20M physical qubits (≈3,000–4,000 logical) suffice for RSA-2048
//       with optimized circuits and surface code error correction.
// [3] Roetteler et al. (2017) "Quantum Resource Estimates for Computing Elliptic
//     Curve Discrete Logarithms" — arXiv:1706.06752
//     — Resource estimates for ECC; analogous scaling for RSA factoring.
// [4] Gheorghiu & Mosca (2021) "Benchmarking the quantum cryptanalysis of
//     binary elliptic curves" — provides comparative qubit estimates.
//
// The estimates below use the Beauregard 2n+3 logical qubit model as the
// baseline. Physical qubit requirements are ~1,000–3,000× higher due to
// quantum error correction overhead (surface codes). The Gidney & Ekerå
// optimized approach reduces this significantly but still requires ~20M
// physical qubits for RSA-2048.
export interface RSABreakpoint {
  keyBits: number;
  label: string;
  qubitsNeeded: number;
  citation: string;
  status: "broken" | "safe";
}

export function getRSABreakpoints(qubitCount: number): RSABreakpoint[] {
  // Logical qubit estimates: ~2n+3 per Beauregard (2003) [1]
  // Physical qubit estimates per Gidney & Ekerå (2021) [2] scale roughly
  // linearly from the RSA-2048 baseline of ~20M physical qubits.
  const breakpoints: RSABreakpoint[] = [
    { keyBits: 512, label: "RSA-512", qubitsNeeded: 1027, citation: "2×512+3 logical qubits [Beauregard 2003]", status: "safe" },
    { keyBits: 1024, label: "RSA-1024", qubitsNeeded: 2051, citation: "2×1024+3 logical qubits [Beauregard 2003]", status: "safe" },
    { keyBits: 2048, label: "RSA-2048", qubitsNeeded: 4099, citation: "2×2048+3 logical qubits [Beauregard 2003]; ~20M physical [Gidney & Ekerå 2021]", status: "safe" },
    { keyBits: 3072, label: "RSA-3072", qubitsNeeded: 6147, citation: "2×3072+3 logical qubits [Beauregard 2003]", status: "safe" },
    { keyBits: 4096, label: "RSA-4096", qubitsNeeded: 8195, citation: "2×4096+3 logical qubits [Beauregard 2003]; ~40M physical (extrapolated)", status: "safe" },
  ];

  return breakpoints.map((bp) => ({
    ...bp,
    status: qubitCount >= bp.qubitsNeeded ? "broken" : "safe",
  }));
}

// ML-KEM (NIST FIPS 203) security levels remain safe regardless of qubit count.
//
// References:
// [5] NIST FIPS 203 (2024) "Module-Lattice-Based Key-Encapsulation Mechanism
//     Standard" — https://csrc.nist.gov/pubs/fips/203/final
//     — Standardizes ML-KEM (formerly CRYSTALS-Kyber) at three security levels.
// [6] Grover, L.K. (1996) "A fast quantum mechanical algorithm for database
//     search" — Grover's provides only O(√N) speedup (quadratic, not exponential).
//
// ML-KEM's security rests on the Module Learning With Errors (MLWE) problem,
// a lattice problem for which no efficient quantum algorithm is known.
// Grover's search provides only quadratic speedup against brute-force key
// search, effectively halving the security level in bits (e.g., 128→64).
// This is insufficient to break ML-KEM at any standardized level.
export interface PQCStatus {
  algorithm: string;
  securityLevel: number;
  classicalBits: number;
  quantumBits: number;
  nistRef: string;
  status: "safe";
  reason: string;
}

export function getPQCStatus(): PQCStatus[] {
  return [
    {
      algorithm: "ML-KEM-512",
      securityLevel: 1,
      classicalBits: 128,
      quantumBits: 64,
      nistRef: "NIST FIPS 203, §1.1 — Security Level 1 (≥AES-128)",
      status: "safe",
      reason: "Grover reduces brute-force to 2^64 — still computationally infeasible",
    },
    {
      algorithm: "ML-KEM-768",
      securityLevel: 3,
      classicalBits: 192,
      quantumBits: 96,
      nistRef: "NIST FIPS 203, §1.1 — Security Level 3 (≥AES-192)",
      status: "safe",
      reason: "Grover reduces brute-force to 2^96 — far beyond any foreseeable quantum computer",
    },
    {
      algorithm: "ML-KEM-1024",
      securityLevel: 5,
      classicalBits: 256,
      quantumBits: 128,
      nistRef: "NIST FIPS 203, §1.1 — Security Level 5 (≥AES-256)",
      status: "safe",
      reason: "Grover reduces brute-force to 2^128 — equivalent to AES-128 brute force",
    },
  ];
}
