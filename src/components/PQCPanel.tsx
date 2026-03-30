"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getPQCStatus } from "@/lib/shor";
import LatticeVisualization from "./LatticeVisualization";

// Grover speedup: only sqrt improvement — constant values hoisted to module scope
const classicalOps = BigInt(2) ** BigInt(128);
const quantumOps = BigInt(2) ** BigInt(64);

function formatBigInt(n: bigint) {
  const str = n.toString();
  const exp = str.length - 1;
  return { mantissa: `${str[0]}.${str.slice(1, 3)}`, exp };
}

const classicalFmt = formatBigInt(classicalOps);
const quantumFmt = formatBigInt(quantumOps);

interface PQCPanelProps {
  qubitCount: number;
  animationSpeedMs?: number;
}

export default function PQCPanel({ qubitCount, animationSpeedMs }: PQCPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const pqcAlgorithms = getPQCStatus();

  return (
    <section aria-labelledby="pqc-panel-heading" className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-accent-green" aria-hidden="true" />
        <h2 id="pqc-panel-heading" className="text-lg font-bold text-accent-green">Post-Quantum (ML-KEM)</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/20">
          SECURE
        </span>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed">
        ML-KEM (formerly CRYSTALS-Kyber), standardized in{" "}
        <span className="text-accent-blue cursor-help border-b border-dotted border-accent-blue/40" title="NIST FIPS 203 (2024) — Module-Lattice-Based Key-Encapsulation Mechanism Standard. Defines ML-KEM-512, ML-KEM-768, and ML-KEM-1024 at security levels 1, 3, and 5 respectively.">
          NIST FIPS 203
        </span>
        , is based on the{" "}
        <span className="text-accent-purple cursor-help border-b border-dotted border-accent-purple/40" title="Module Learning With Errors (MLWE): A lattice-based hardness assumption. The goal is to distinguish noisy inner products over polynomial rings from uniformly random samples. No efficient quantum algorithm is known for this problem.">
          MLWE
        </span>{" "}
        lattice problem. Even quantum computers with Grover&apos;s algorithm only achieve a √n
        speedup — not enough to break it.
      </p>

      {/* Lattice Visualization */}
      <LatticeVisualization qubitCount={qubitCount} animationSpeedMs={animationSpeedMs} />

      {/* Why Lattice is Hard */}
      <section className="rounded-lg bg-surface-deep border border-panel-border p-4" aria-labelledby="lattice-hard-heading">
        <h3 id="lattice-hard-heading" className="text-[10px] md:text-xs text-gray-500 font-mono mb-3">WHY QUANTUM CAN&apos;T BREAK LATTICE</h3>

        <div className="space-y-3">
          <article className="flex items-start gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-accent-purple/10 flex items-center justify-center shrink-0" aria-hidden="true">
              <span className="text-accent-purple text-sm">√</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs md:text-sm text-white">Grover&apos;s Algorithm: Only √n speedup</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Unlike Shor&apos;s exponential speedup for factoring, Grover&apos;s search only provides
                a quadratic advantage. 2<sup>128</sup> → 2<sup>64</sup> operations.
              </p>
            </div>
          </article>

          <article className="flex items-start gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-accent-blue/10 flex items-center justify-center shrink-0" aria-hidden="true">
              <span className="text-accent-blue text-sm">∞</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs md:text-sm text-white">No known quantum algorithm for{" "}
                <span className="cursor-help border-b border-dotted border-accent-blue/40" title="Shortest Vector Problem (SVP): Given a lattice basis, find the shortest non-zero vector. In high dimensions (≥500), this is believed to be intractable even for quantum computers. ML-KEM's security reduces to a variant of this problem.">SVP</span>
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                The Shortest Vector Problem in high-dimensional lattices has no efficient
                quantum algorithm — unlike integer factoring.
              </p>
            </div>
          </article>

          <article className="flex items-start gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-accent-yellow/10 flex items-center justify-center shrink-0" aria-hidden="true">
              <span className="text-accent-yellow text-sm">⊕</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs md:text-sm text-white">Noise hides the secret</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                <span className="cursor-help border-b border-dotted border-accent-yellow/40" title="Learning With Errors (LWE): A computational problem where secret information is hidden by adding small random noise to linear equations over a finite field. Regev (2005) proved its hardness reduces to worst-case lattice problems.">LWE</span>{" "}
                adds Gaussian noise to lattice computations. Even with quantum superposition,
                the noise prevents extracting the secret key.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Grover comparison */}
      <section className="rounded-lg bg-surface-deep border border-panel-border p-4" aria-labelledby="grover-comparison-heading">
        <h3 id="grover-comparison-heading" className="text-[10px] md:text-xs text-gray-500 font-mono mb-3">
          GROVER&apos;S SPEEDUP COMPARISON
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Classical brute force</span>
            <span className="text-xs font-mono text-white">
              2<sup>128</sup> ≈ {classicalFmt.mantissa}×10<sup>{classicalFmt.exp}</sup>
            </span>
          </div>
          <div className="w-full h-2 bg-surface-dark rounded-full overflow-hidden" role="img" aria-label="Classical brute force: full bar representing 2 to the power of 128 operations">
            <div className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full w-full" />
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">Grover&apos;s quantum search</span>
            <span className="text-xs font-mono text-white">
              2<sup>64</sup> ≈ {quantumFmt.mantissa}×10<sup>{quantumFmt.exp}</sup>
            </span>
          </div>
          <div className="w-full h-2 bg-surface-dark rounded-full overflow-hidden" role="img" aria-label="Grover quantum search: half bar representing 2 to the power of 64 operations">
            <div className="h-full bg-gradient-to-r from-accent-red to-accent-yellow rounded-full w-1/2" />
          </div>
          <p className="text-[10px] text-gray-600 mt-1">
            Still 1.8×10<sup>19</sup> operations — completely infeasible even for quantum computers
          </p>
        </div>
      </section>

      {/* PQC Algorithm Status */}
      <section className="rounded-lg bg-surface-deep border border-panel-border p-4" aria-labelledby="mlkem-levels-heading">
        <h3 id="mlkem-levels-heading" className="text-[10px] md:text-xs text-gray-500 font-mono mb-3">ML-KEM SECURITY LEVELS</h3>
        <ul className="space-y-2" role="list">
          {pqcAlgorithms.map((algo) => (
            <motion.li
              key={algo.algorithm}
              className="flex items-center justify-between rounded px-3 py-2 bg-accent-green/5 border border-accent-green/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : undefined}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-accent-green shrink-0" aria-hidden="true" />
                <span className="text-xs md:text-sm font-mono text-white truncate">{algo.algorithm}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <span className="text-[10px] text-gray-500 cursor-help hidden sm:inline" title={algo.nistRef}>
                  Level {algo.securityLevel}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-accent-green/10 text-accent-green font-mono">
                  SAFE
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Status */}
      <motion.div
        className="rounded-lg bg-accent-green/10 border border-accent-green/30 p-3 glow-green"
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0.8, 1, 0.8] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 3, repeat: Infinity }}
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <span className="text-accent-green font-mono text-sm font-bold">
            ML-KEM remains secure at {qubitCount.toLocaleString()} qubits
          </span>
          <p className="text-xs text-gray-400 mt-1">
            No quantum algorithm can efficiently solve the lattice problem
          </p>
          <p className="text-[10px] text-gray-600 mt-1">
            Ref: NIST FIPS 203 (2024) · Grover (1996) · Regev (2005)
          </p>
        </div>
      </motion.div>
    </section>
  );
}
