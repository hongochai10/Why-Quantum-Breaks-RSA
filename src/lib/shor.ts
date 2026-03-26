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

  // Pick random a
  const a = n === 15 ? 7 : n === 21 ? 2 : n === 35 ? 2 : 2 + Math.floor(Math.random() * (n - 3));

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

// RSA key sizes and estimated qubits needed to break them
export interface RSABreakpoint {
  keyBits: number;
  label: string;
  qubitsNeeded: number;
  status: "broken" | "safe";
}

export function getRSABreakpoints(qubitCount: number): RSABreakpoint[] {
  // Rough estimates based on research:
  // ~2n+3 logical qubits needed to factor an n-bit number (Shor's)
  // But with error correction overhead, multiply by ~1000-3000x
  // For this visualization we use simplified thresholds
  const breakpoints: RSABreakpoint[] = [
    { keyBits: 512, label: "RSA-512", qubitsNeeded: 1100, status: "safe" },
    { keyBits: 1024, label: "RSA-1024", qubitsNeeded: 2100, status: "safe" },
    { keyBits: 2048, label: "RSA-2048", qubitsNeeded: 4100, status: "safe" },
    { keyBits: 3072, label: "RSA-3072", qubitsNeeded: 6200, status: "safe" },
    { keyBits: 4096, label: "RSA-4096", qubitsNeeded: 8200, status: "safe" },
  ];

  return breakpoints.map((bp) => ({
    ...bp,
    status: qubitCount >= bp.qubitsNeeded ? "broken" : "safe",
  }));
}

// ML-KEM security levels remain safe regardless of qubit count
// because Grover's only provides sqrt speedup
export interface PQCStatus {
  algorithm: string;
  securityLevel: number;
  classicalBits: number;
  quantumBits: number;
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
      status: "safe",
      reason: "Grover reduces to 2^64 — still computationally infeasible",
    },
    {
      algorithm: "ML-KEM-768",
      securityLevel: 3,
      classicalBits: 192,
      quantumBits: 96,
      status: "safe",
      reason: "Grover reduces to 2^96 — far beyond any foreseeable quantum computer",
    },
    {
      algorithm: "ML-KEM-1024",
      securityLevel: 5,
      classicalBits: 256,
      quantumBits: 128,
      status: "safe",
      reason: "Grover reduces to 2^128 — equivalent to AES-128 brute force",
    },
  ];
}
