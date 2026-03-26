"use client";

import { motion } from "framer-motion";
import { getPQCStatus } from "@/lib/shor";
import LatticeVisualization from "./LatticeVisualization";

interface PQCPanelProps {
  qubitCount: number;
}

export default function PQCPanel({ qubitCount }: PQCPanelProps) {
  const pqcAlgorithms = getPQCStatus();

  // Grover speedup: only sqrt improvement
  const classicalOps = BigInt(2) ** BigInt(128);
  const quantumOps = BigInt(2) ** BigInt(64);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#00e88f]" />
        <h2 className="text-lg font-bold text-[#00e88f]">Post-Quantum (ML-KEM)</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#00e88f]/10 text-[#00e88f] border border-[#00e88f]/20">
          SECURE
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        ML-KEM (formerly CRYSTALS-Kyber) is based on the Module Learning With Errors (MLWE)
        lattice problem. Even quantum computers with Grover&apos;s algorithm only achieve a √n
        speedup — not enough to break it.
      </p>

      {/* Lattice Visualization */}
      <LatticeVisualization qubitCount={qubitCount} />

      {/* Why Lattice is Hard */}
      <div className="rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-4">
        <div className="text-xs text-gray-500 font-mono mb-3">WHY QUANTUM CAN&apos;T BREAK LATTICE</div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#a855f7]/10 flex items-center justify-center shrink-0">
              <span className="text-[#a855f7] text-sm">√</span>
            </div>
            <div>
              <div className="text-sm text-white">Grover&apos;s Algorithm: Only √n speedup</div>
              <p className="text-xs text-gray-500 mt-0.5">
                Unlike Shor&apos;s exponential speedup for factoring, Grover&apos;s search only provides
                a quadratic advantage. 2<sup>128</sup> → 2<sup>64</sup> operations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#4d9fff]/10 flex items-center justify-center shrink-0">
              <span className="text-[#4d9fff] text-sm">∞</span>
            </div>
            <div>
              <div className="text-sm text-white">No known quantum algorithm for SVP</div>
              <p className="text-xs text-gray-500 mt-0.5">
                The Shortest Vector Problem in high-dimensional lattices has no efficient
                quantum algorithm — unlike integer factoring.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#fbbf24]/10 flex items-center justify-center shrink-0">
              <span className="text-[#fbbf24] text-sm">⊕</span>
            </div>
            <div>
              <div className="text-sm text-white">Noise hides the secret</div>
              <p className="text-xs text-gray-500 mt-0.5">
                LWE adds Gaussian noise to lattice computations. Even with quantum superposition,
                the noise prevents extracting the secret key.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grover comparison */}
      <div className="rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-4">
        <div className="text-xs text-gray-500 font-mono mb-3">
          GROVER&apos;S SPEEDUP COMPARISON
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Classical brute force</span>
            <span className="text-xs font-mono text-white">
              2<sup>128</sup> ≈ {classicalOps.toString().slice(0, 4)}×10<sup>38</sup>
            </span>
          </div>
          <div className="w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#4d9fff] to-[#a855f7] rounded-full w-full" />
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">Grover&apos;s quantum search</span>
            <span className="text-xs font-mono text-white">
              2<sup>64</sup> ≈ {quantumOps.toString().slice(0, 4)}×10<sup>19</sup>
            </span>
          </div>
          <div className="w-full h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#ff4d6a] to-[#fbbf24] rounded-full w-1/2" />
          </div>
          <p className="text-[10px] text-gray-600 mt-1">
            Still 1.8×10<sup>19</sup> operations — completely infeasible even for quantum computers
          </p>
        </div>
      </div>

      {/* PQC Algorithm Status */}
      <div className="rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-4">
        <div className="text-xs text-gray-500 font-mono mb-3">ML-KEM SECURITY LEVELS</div>
        <div className="space-y-2">
          {pqcAlgorithms.map((algo) => (
            <motion.div
              key={algo.algorithm}
              className="flex items-center justify-between rounded px-3 py-2 bg-[#00e88f]/5 border border-[#00e88f]/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00e88f]" />
                <span className="text-sm font-mono text-white">{algo.algorithm}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-500">
                  Level {algo.securityLevel}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#00e88f]/10 text-[#00e88f] font-mono">
                  SAFE
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status */}
      <motion.div
        className="rounded-lg bg-[#00e88f]/10 border border-[#00e88f]/30 p-3 glow-green"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-center">
          <span className="text-[#00e88f] font-mono text-sm font-bold">
            ML-KEM remains secure at {qubitCount.toLocaleString()} qubits
          </span>
          <p className="text-xs text-gray-400 mt-1">
            No quantum algorithm can efficiently solve the lattice problem
          </p>
        </div>
      </motion.div>
    </div>
  );
}
