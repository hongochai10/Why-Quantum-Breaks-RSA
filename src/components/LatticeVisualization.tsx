"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface LatticeVisualizationProps {
  qubitCount: number;
}

export default function LatticeVisualization({ qubitCount }: LatticeVisualizationProps) {
  const gridSize = 8;

  const points = useMemo(() => {
    const pts: { x: number; y: number; isTarget: boolean }[] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Skew the grid to look like a lattice
        const baseX = 40 + i * 50 + j * 15;
        const baseY = 20 + j * 45 - i * 5;
        pts.push({
          x: baseX,
          y: baseY,
          isTarget: i === 3 && j === 4,
        });
      }
    }
    return pts;
  }, []);

  // The quantum "search" tries random points but never finds the closest vector
  const searchAttempts = useMemo(() => {
    const attempts: { x: number; y: number }[] = [];
    const seed = qubitCount;
    for (let k = 0; k < Math.min(6, Math.floor(qubitCount / 500) + 2); k++) {
      const idx = ((seed * (k + 1) * 7) % points.length);
      if (!points[idx].isTarget) {
        attempts.push(points[idx]);
      }
    }
    return attempts;
  }, [qubitCount, points]);

  return (
    <div className="relative w-full h-48 rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-4 overflow-hidden">
      <div className="absolute top-2 left-3 text-[10px] text-gray-500 font-mono" aria-hidden="true">
        LATTICE PROBLEM (SVP)
      </div>

      <svg viewBox="0 0 500 140" className="w-full h-full" role="img" aria-label={`Lattice visualization showing the Shortest Vector Problem. A grid of ${gridSize}×${gridSize} points with the closest vector highlighted. ${searchAttempts.length} quantum search attempts shown, all missing the target — demonstrating that Grover's algorithm only provides square root speedup.`}>
        {/* Grid lines */}
        {Array.from({ length: gridSize }).map((_, i) =>
          Array.from({ length: gridSize }).map((_, j) => {
            const idx = i * gridSize + j;
            const pt = points[idx];
            // Connect to neighbors
            return (
              <g key={`${i}-${j}`}>
                {j < gridSize - 1 && (
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={points[idx + 1].x}
                    y2={points[idx + 1].y}
                    stroke="#1a1a30"
                    strokeWidth="0.5"
                  />
                )}
                {i < gridSize - 1 && (
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={points[idx + gridSize].x}
                    y2={points[idx + gridSize].y}
                    stroke="#1a1a30"
                    strokeWidth="0.5"
                  />
                )}
              </g>
            );
          })
        )}

        {/* Lattice points */}
        {points.map((pt, idx) => (
          <motion.circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={pt.isTarget ? 5 : 2}
            fill={pt.isTarget ? "#00e88f" : "#2a2a50"}
            animate={
              pt.isTarget
                ? {
                    r: [5, 7, 5],
                    opacity: [1, 0.6, 1],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}

        {/* Target label */}
        {points
          .filter((p) => p.isTarget)
          .map((pt, i) => (
            <text
              key={i}
              x={pt.x + 10}
              y={pt.y - 8}
              fill="#00e88f"
              fontSize="8"
              fontFamily="monospace"
            >
              closest vector
            </text>
          ))}

        {/* Quantum search attempts (all miss) */}
        {searchAttempts.map((pt, idx) => (
          <g key={`search-${idx}`}>
            <motion.circle
              cx={pt.x}
              cy={pt.y}
              r="8"
              fill="none"
              stroke="#ff4d6a"
              strokeWidth="1"
              strokeDasharray="3 2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0.3], scale: [0, 1.2, 1] }}
              transition={{ delay: idx * 0.3, duration: 0.8 }}
            />
            <motion.text
              x={pt.x}
              y={pt.y - 12}
              textAnchor="middle"
              fill="#ff4d6a"
              fontSize="7"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5] }}
              transition={{ delay: idx * 0.3 + 0.2, duration: 0.6 }}
            >
              ✗
            </motion.text>
          </g>
        ))}

        {/* Legend */}
        <text x="380" y="130" fill="#555" fontSize="8" fontFamily="monospace">
          Grover: √n speedup only
        </text>
      </svg>
    </div>
  );
}
