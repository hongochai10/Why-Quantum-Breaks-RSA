"use client";

import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QUANTUM_GATES, QUBIT_COUNT } from "@/lib/constants";

interface QuantumCircuitProps {
  active: boolean;
  step: number; // 0-3 for animation stages
}

function QuantumCircuitInner({ active, step }: QuantumCircuitProps) {
  const shouldReduceMotion = useReducedMotion();
  // Memoize static qubit line positions
  const qubitLines = useMemo(
    () => Array.from({ length: QUBIT_COUNT }, (_, i) => 20 + i * 32),
    []
  );

  return (
    <div className="relative w-full h-36 md:h-48 rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-4 overflow-hidden">
      <div className="absolute top-2 left-3 text-[10px] text-gray-500 font-mono" aria-hidden="true">
        QUANTUM CIRCUIT
      </div>

      <svg viewBox="0 0 500 140" preserveAspectRatio="xMidYMid meet" className="w-full h-full" role="img" aria-labelledby="quantum-circuit-title quantum-circuit-desc">
        <title id="quantum-circuit-title">{`Quantum circuit diagram with ${QUBIT_COUNT} qubit lines and ${QUANTUM_GATES.length} gates`}</title>
        <desc id="quantum-circuit-desc">{`Hadamard, Oracle, Inverse QFT, and Measure${active ? `. Currently executing step ${step + 1} of ${QUANTUM_GATES.length}` : ""}`}</desc>
        {/* Qubit lines */}
        {qubitLines.map((y, i) => (
          <g key={i}>
            <line x1="30" y1={y} x2="470" y2={y} stroke="#2a2a40" strokeWidth="1" />
            <text x="5" y={y + 4} fill="#666" fontSize="10" fontFamily="monospace">
              |0⟩
            </text>
          </g>
        ))}

        {/* Gates */}
        {QUANTUM_GATES.map((gate, gIdx) => {
          const x = 90 + gIdx * 100;
          const isActive = active && step >= gIdx;
          const isCurrentStep = active && step === gIdx;

          return (
            <g key={gIdx}>
              {qubitLines.map((y, qIdx) => (
                <g key={qIdx}>
                  <motion.rect
                    x={x - 18}
                    y={y - 12}
                    width="36"
                    height="24"
                    rx="4"
                    fill={isActive ? gate.color : "#1a1a2e"}
                    stroke={isActive ? gate.color : "#2a2a40"}
                    strokeWidth="1"
                    initial={{ opacity: 0.3 }}
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      scale: isCurrentStep && !shouldReduceMotion ? [1, 1.05, 1] : 1,
                    }}
                    transition={shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.5,
                          scale: { duration: 0.8, repeat: isCurrentStep ? Infinity : 0 },
                        }
                    }
                  />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fill={isActive ? "#fff" : "#555"}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {gate.label}
                  </text>
                </g>
              ))}
              {/* Gate label */}
              <text
                x={x}
                y={20 + QUBIT_COUNT * 32 + 4}
                textAnchor="middle"
                fill={isActive ? gate.color : "#444"}
                fontSize="8"
                fontFamily="monospace"
              >
                {gate.desc}
              </text>
            </g>
          );
        })}

        {/* Flowing qubit animation — Framer Motion only (no raw SVG animate) */}
        {active &&
          qubitLines.map((y, i) => (
            <motion.circle
              key={i}
              r="3"
              fill="#4d9fff"
              initial={{ cx: 30, cy: y, opacity: 1 }}
              animate={shouldReduceMotion
                ? { cx: 90 + step * 100, opacity: 1 }
                : {
                    cx: [30, 90 + step * 100],
                    opacity: [1, 0.3, 1],
                  }
              }
              transition={shouldReduceMotion
                ? { duration: 0 }
                : {
                    cx: { duration: 0.6, ease: "easeInOut" },
                    opacity: { duration: 1, repeat: Infinity },
                  }
              }
            />
          ))}
      </svg>
    </div>
  );
}

const QuantumCircuit = memo(QuantumCircuitInner);
export default QuantumCircuit;
