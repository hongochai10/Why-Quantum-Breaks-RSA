"use client";

import { motion } from "framer-motion";

interface QuantumCircuitProps {
  active: boolean;
  step: number; // 0-4 for animation stages
}

const gates = [
  { label: "H", color: "#4d9fff", desc: "Hadamard" },
  { label: "U_f", color: "#a855f7", desc: "Oracle" },
  { label: "QFT†", color: "#fbbf24", desc: "Inverse QFT" },
  { label: "M", color: "#ff4d6a", desc: "Measure" },
];

export default function QuantumCircuit({ active, step }: QuantumCircuitProps) {
  const qubits = 4;

  return (
    <div className="relative w-full h-36 md:h-48 rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-2 md:p-4 overflow-hidden">
      <div className="absolute top-2 left-3 text-[10px] text-gray-500 font-mono" aria-hidden="true">
        QUANTUM CIRCUIT
      </div>

      <svg viewBox="0 0 500 140" preserveAspectRatio="xMidYMid meet" className="w-full h-full" role="img" aria-label={`Quantum circuit diagram with ${qubits} qubit lines and ${gates.length} gates: Hadamard, Oracle, Inverse QFT, and Measure${active ? `. Currently executing step ${step + 1} of ${gates.length}` : ""}`}>
        {/* Qubit lines */}
        {Array.from({ length: qubits }).map((_, i) => (
          <g key={i}>
            <line
              x1="30"
              y1={20 + i * 32}
              x2="470"
              y2={20 + i * 32}
              stroke="#2a2a40"
              strokeWidth="1"
            />
            <text x="5" y={24 + i * 32} fill="#666" fontSize="10" fontFamily="monospace">
              |0⟩
            </text>
          </g>
        ))}

        {/* Gates */}
        {gates.map((gate, gIdx) => {
          const x = 90 + gIdx * 100;
          const isActive = active && step >= gIdx;
          const isCurrentStep = active && step === gIdx;

          return (
            <g key={gIdx}>
              {Array.from({ length: qubits }).map((_, qIdx) => (
                <g key={qIdx}>
                  <motion.rect
                    x={x - 18}
                    y={20 + qIdx * 32 - 12}
                    width="36"
                    height="24"
                    rx="4"
                    fill={isActive ? gate.color : "#1a1a2e"}
                    stroke={isActive ? gate.color : "#2a2a40"}
                    strokeWidth="1"
                    initial={{ opacity: 0.3 }}
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      scale: isCurrentStep ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      scale: { duration: 0.8, repeat: isCurrentStep ? Infinity : 0 },
                    }}
                  />
                  <text
                    x={x}
                    y={20 + qIdx * 32 + 4}
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
                y={20 + qubits * 32 + 4}
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

        {/* Flowing qubit animation */}
        {active && (
          <>
            {Array.from({ length: qubits }).map((_, i) => (
              <motion.circle
                key={i}
                r="3"
                fill="#4d9fff"
                initial={{ cx: 30, cy: 20 + i * 32 }}
                animate={{
                  cx: [30, 90 + step * 100],
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
              >
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </motion.circle>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
