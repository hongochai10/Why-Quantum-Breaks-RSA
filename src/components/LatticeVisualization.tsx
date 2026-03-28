"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { ANIMATION, LATTICE_GRID_SIZE } from "@/lib/constants";

interface LatticeVisualizationProps {
  qubitCount: number;
  animationSpeedMs?: number;
}

export default function LatticeVisualization({ qubitCount, animationSpeedMs = ANIMATION.speeds[ANIMATION.defaultSpeedIndex].value }: LatticeVisualizationProps) {
  const gridSize = LATTICE_GRID_SIZE;

  const points = useMemo(() => {
    const pts: { x: number; y: number; isTarget: boolean }[] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
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
  }, [gridSize]);

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

  // Animate search attempts one at a time
  const [visibleAttempts, setVisibleAttempts] = useState(0);

  useEffect(() => {
    setVisibleAttempts(0);
    if (searchAttempts.length === 0) return;

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleAttempts(current);
      if (current >= searchAttempts.length) {
        clearInterval(interval);
      }
    }, animationSpeedMs);

    return () => clearInterval(interval);
  }, [searchAttempts, animationSpeedMs]);

  // Memoize static grid lines
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = i * gridSize + j;
        const pt = points[idx];
        if (j < gridSize - 1) {
          lines.push({ x1: pt.x, y1: pt.y, x2: points[idx + 1].x, y2: points[idx + 1].y });
        }
        if (i < gridSize - 1) {
          lines.push({ x1: pt.x, y1: pt.y, x2: points[idx + gridSize].x, y2: points[idx + gridSize].y });
        }
      }
    }
    return lines;
  }, [gridSize, points]);

  return (
    <div className="relative w-full h-36 md:h-48 rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-4 overflow-hidden">
      <div className="absolute top-2 left-3 text-[10px] text-gray-500 font-mono" aria-hidden="true">
        LATTICE PROBLEM (SVP)
      </div>

      <svg viewBox="0 0 500 140" preserveAspectRatio="xMidYMid meet" className="w-full h-full" role="img" aria-label={`Lattice visualization showing the Shortest Vector Problem. A grid of ${gridSize}×${gridSize} points with the closest vector highlighted. ${searchAttempts.length} quantum search attempts shown, all missing the target — demonstrating that Grover's algorithm only provides square root speedup.`}>
        {/* Grid lines */}
        {gridLines.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#1a1a30"
            strokeWidth="0.5"
          />
        ))}

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

        {/* Quantum search attempts — revealed sequentially */}
        {searchAttempts.slice(0, visibleAttempts).map((pt, idx) => (
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
              transition={{ duration: 0.8 }}
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
              transition={{ duration: 0.6 }}
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
