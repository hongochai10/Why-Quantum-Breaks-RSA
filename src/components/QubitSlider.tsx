"use client";

import { motion } from "framer-motion";
import { getRSABreakpoints } from "@/lib/shor";

interface QubitSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function QubitSlider({ value, onChange }: QubitSliderProps) {
  const breakpoints = getRSABreakpoints(value);
  const brokenCount = breakpoints.filter((b) => b.status === "broken").length;

  return (
    <div className="rounded-xl bg-[#12121e] border border-[#1e1e30] p-6">
      {/* Slider Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Qubit Count</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Drag to simulate quantum computer scaling
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-[#a855f7]">
            {value.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500">logical qubits</div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative mb-6">
        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-600 font-mono">100</span>
          <span className="text-[10px] text-gray-600 font-mono">10,000</span>
        </div>
      </div>

      {/* RSA Breakpoints Timeline */}
      <div className="space-y-2">
        <div className="text-xs text-gray-500 font-mono mb-2">
          RSA KEY VULNERABILITY ({brokenCount}/{breakpoints.length} broken)
        </div>

        <div className="relative">
          {/* Progress bar background */}
          <div className="w-full h-1 bg-[#1a1a2e] rounded-full mb-4">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#ff4d6a] to-[#ff4d6a]"
              animate={{ width: `${(value / 10000) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Breakpoint markers */}
          {breakpoints.map((bp) => {
            const position = (bp.qubitsNeeded / 10000) * 100;
            return (
              <div
                key={bp.keyBits}
                className="flex items-center gap-3 mb-2"
              >
                {/* Marker */}
                <div className="relative w-16 shrink-0">
                  <div
                    className="absolute h-3 w-0.5 rounded-full"
                    style={{
                      left: `${position}%`,
                      backgroundColor:
                        bp.status === "broken" ? "#ff4d6a" : "#2a2a40",
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${
                        bp.status === "broken" ? "bg-[#ff4d6a]" : "bg-[#00e88f]"
                      }`}
                      animate={
                        bp.status === "broken"
                          ? { scale: [1, 1.3, 1] }
                          : {}
                      }
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span
                      className={`text-sm font-mono ${
                        bp.status === "broken"
                          ? "text-[#ff4d6a] line-through"
                          : "text-white"
                      }`}
                    >
                      {bp.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 font-mono">
                      ~{bp.qubitsNeeded.toLocaleString()} qubits
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        bp.status === "broken"
                          ? "bg-[#ff4d6a]/10 text-[#ff4d6a]"
                          : "bg-[#00e88f]/10 text-[#00e88f]"
                      }`}
                    >
                      {bp.status === "broken" ? "BROKEN" : "SAFE"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ML-KEM comparison */}
        <div className="mt-4 pt-3 border-t border-[#1e1e30]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00e88f]" />
              <span className="text-sm font-mono text-[#00e88f]">ML-KEM (all levels)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00e88f]/10 text-[#00e88f] font-mono">
              ALWAYS SAFE
            </span>
          </div>
          <p className="text-[10px] text-gray-600 mt-1 ml-4">
            No qubit threshold exists — lattice problems have no known efficient quantum solution
          </p>
        </div>
      </div>
    </div>
  );
}
