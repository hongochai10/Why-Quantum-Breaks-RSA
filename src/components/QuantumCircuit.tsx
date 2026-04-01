"use client";

import { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COLORS, CIRCUIT_LAYOUT, QUANTUM_GATES, QUBIT_COUNT } from "@/lib/constants";
import { useDictionary } from "./DictionaryProvider";
import { interpolate } from "@/lib/i18n";

interface QuantumCircuitProps {
  active: boolean;
  step: number;
}

function QuantumCircuitInner({ active, step }: QuantumCircuitProps) {
  const shouldReduceMotion = useReducedMotion();
  const { dict } = useDictionary();
  const t = dict.quantumCircuit;

  const qubitLines = useMemo(
    () => Array.from({ length: QUBIT_COUNT }, (_, i) => CIRCUIT_LAYOUT.qubitLineYStart + i * CIRCUIT_LAYOUT.qubitLineSpacing),
    []
  );

  return (
    <div className="relative w-full h-36 md:h-48 rounded-lg bg-surface-deep border border-panel-border p-4 overflow-hidden">
      <div className="absolute top-2 left-3 text-[10px] text-gray-500 font-mono" aria-hidden="true">
        {t.label}
      </div>

      <svg viewBox="0 0 500 140" preserveAspectRatio="xMidYMid meet" className="w-full h-full" role="img" aria-labelledby="quantum-circuit-title quantum-circuit-desc">
        <title id="quantum-circuit-title">{interpolate(t.title, { qubits: QUBIT_COUNT, gates: QUANTUM_GATES.length })}</title>
        <desc id="quantum-circuit-desc">{`${t.desc}${active ? interpolate(t.executing, { step: step + 1, total: QUANTUM_GATES.length }) : ""}`}</desc>
        {qubitLines.map((y, i) => (
          <g key={i}>
            <line x1={CIRCUIT_LAYOUT.qubitLineX1} y1={y} x2={CIRCUIT_LAYOUT.qubitLineX2} y2={y} stroke={COLORS.borderDark} strokeWidth="1" />
            <text x={CIRCUIT_LAYOUT.qubitLabelX} y={y + CIRCUIT_LAYOUT.qubitLabelYOffset} fill="#666" fontSize="10" fontFamily="monospace">
              |0⟩
            </text>
          </g>
        ))}

        {QUANTUM_GATES.map((gate, gIdx) => {
          const x = CIRCUIT_LAYOUT.gateXStart + gIdx * CIRCUIT_LAYOUT.gateSpacing;
          const isActive = active && step >= gIdx;
          const isCurrentStep = active && step === gIdx;

          return (
            <g key={gIdx}>
              {qubitLines.map((y, qIdx) => (
                <g key={qIdx}>
                  <motion.rect
                    x={x - CIRCUIT_LAYOUT.gateWidth / 2}
                    y={y - CIRCUIT_LAYOUT.gateHeight / 2}
                    width={CIRCUIT_LAYOUT.gateWidth}
                    height={CIRCUIT_LAYOUT.gateHeight}
                    rx={CIRCUIT_LAYOUT.gateCornerRadius}
                    fill={isActive ? gate.color : COLORS.surfaceDark}
                    stroke={isActive ? gate.color : COLORS.borderDark}
                    strokeWidth="1"
                    initial={{ opacity: 0.3, scale: 1 }}
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      scale: isCurrentStep && !shouldReduceMotion ? 1.05 : 1,
                    }}
                    transition={shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.5,
                          scale: {
                            duration: 0.4,
                            repeat: isCurrentStep ? Infinity : 0,
                            repeatType: "reverse" as const,
                          },
                        }
                    }
                  />
                  <text
                    x={x}
                    y={y + CIRCUIT_LAYOUT.gateLabelYOffset}
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
              <text
                x={x}
                y={CIRCUIT_LAYOUT.qubitLineYStart + QUBIT_COUNT * CIRCUIT_LAYOUT.qubitLineSpacing + CIRCUIT_LAYOUT.gateDescYPadding}
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

        {active &&
          qubitLines.map((y, i) => {
            const prevX = step > 0
              ? CIRCUIT_LAYOUT.gateXStart + (step - 1) * CIRCUIT_LAYOUT.gateSpacing
              : CIRCUIT_LAYOUT.qubitLineX1;
            const currX = CIRCUIT_LAYOUT.gateXStart + step * CIRCUIT_LAYOUT.gateSpacing;
            return (
              <motion.circle
                key={`${i}-${step}`}
                r={CIRCUIT_LAYOUT.flowCircleRadius}
                fill={COLORS.blue}
                initial={{ cx: prevX, cy: y, opacity: 1 }}
                animate={shouldReduceMotion
                  ? { cx: currX, opacity: 1 }
                  : {
                      cx: [prevX, currX],
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
            );
          })}
      </svg>
    </div>
  );
}

const QuantumCircuit = memo(QuantumCircuitInner);
export default QuantumCircuit;
