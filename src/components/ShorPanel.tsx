"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runShor, type ShorResult } from "@/lib/shor";
import QuantumCircuit from "./QuantumCircuit";

export default function ShorPanel() {
  const [inputN, setInputN] = useState("15");
  const [result, setResult] = useState<ShorResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const presets = [15, 21, 35, 77, 91, 143];

  const simulate = useCallback(async (n: number) => {
    setIsRunning(true);
    setResult(null);
    setCurrentStep(-1);

    const shorResult = runShor(n);

    // Animate through steps
    for (let i = 0; i < shorResult.steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 800));
    }

    setResult(shorResult);
    setIsRunning(false);
  }, []);

  const handleRun = () => {
    const n = parseInt(inputN);
    if (n > 1 && n < 1000 && !isRunning) {
      simulate(n);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#ff4d6a] animate-pulse" />
        <h2 className="text-lg font-bold text-[#ff4d6a]">Classical RSA / ECC</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff4d6a]/10 text-[#ff4d6a] border border-[#ff4d6a]/20">
          VULNERABLE
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        Shor&apos;s algorithm uses quantum period-finding to factor large numbers exponentially
        faster than any classical algorithm. This breaks RSA, whose security relies on
        the difficulty of factoring.
      </p>

      {/* Quantum Circuit Visualization */}
      <QuantumCircuit
        active={isRunning}
        step={Math.min(currentStep, 3)}
      />

      {/* Input Section */}
      <div className="rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-4">
        <label className="text-xs text-gray-500 font-mono block mb-2">
          ENTER A NUMBER TO FACTOR (Shor&apos;s Simulation)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={inputN}
            onChange={(e) => setInputN(e.target.value)}
            className="flex-1 bg-[#12121e] border border-[#2a2a40] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#ff4d6a] transition-colors"
            min={2}
            max={999}
            disabled={isRunning}
          />
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-2 rounded bg-[#ff4d6a] hover:bg-[#ff3355] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {isRunning ? "Running..." : "Factor"}
          </button>
        </div>

        {/* Presets */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => {
                setInputN(String(p));
                if (!isRunning) simulate(p);
              }}
              className="px-2 py-1 text-xs font-mono rounded bg-[#1a1a2e] hover:bg-[#2a2a40] text-gray-400 hover:text-white transition-colors border border-[#2a2a40]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-step Results */}
      <div className="flex-1 overflow-y-auto rounded-lg bg-[#0d0d18] border border-[#1e1e30] p-4">
        <div className="text-xs text-gray-500 font-mono mb-3">ALGORITHM STEPS</div>

        <AnimatePresence mode="popLayout">
          {result?.steps.map((step, i) => (
            <motion.div
              key={`${result.n}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.1 }}
              className="mb-3 last:mb-0"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    i === result.steps.length - 1
                      ? result.success
                        ? "bg-[#ff4d6a]/20 text-[#ff4d6a]"
                        : "bg-yellow-500/20 text-yellow-500"
                      : "bg-[#1a1a2e] text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#a855f7]">{step.label}</span>
                    <span className="text-sm text-white">{step.description}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!result && !isRunning && (
          <div className="text-center text-gray-600 text-sm py-8">
            Enter a number above to simulate Shor&apos;s algorithm
          </div>
        )}

        {isRunning && (
          <div className="text-center text-[#ff4d6a] text-sm py-8 animate-pulse">
            Quantum computer factoring...
          </div>
        )}
      </div>

      {/* Result highlight */}
      <AnimatePresence>
        {result?.success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-[#ff4d6a]/10 border border-[#ff4d6a]/30 p-3 glow-red"
          >
            <div className="text-center">
              <span className="text-[#ff4d6a] font-mono text-lg font-bold">
                {result.n} = {result.factor1} × {result.factor2}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                RSA key factored by quantum computer — encryption broken
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
