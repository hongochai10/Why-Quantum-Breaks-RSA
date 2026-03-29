"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { runShor, type ShorResult } from "@/lib/shor";
import { ANIMATION, SHOR_PRESETS } from "@/lib/constants";
import QuantumCircuit from "./QuantumCircuit";

interface ShorPanelProps {
  speedIndex: number;
  onSpeedChange: (index: number) => void;
}

function validateInput(value: string): string | null {
  if (value.trim() === "") return "Please enter a number.";
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return "Please enter a valid integer.";
  if (n < 2) return "Number must be at least 2.";
  if (n > 999) return "Number must be 999 or less.";
  return null;
}

export default function ShorPanel({ speedIndex, onSpeedChange }: ShorPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const [inputN, setInputN] = useState("15");
  const [result, setResult] = useState<ShorResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseRef = useRef(false);
  const abortRef = useRef(false);

  const simulate = useCallback(async (n: number) => {
    setIsRunning(true);
    setResult(null);
    setError(null);
    setCurrentStep(-1);
    setIsPaused(false);
    pauseRef.current = false;
    abortRef.current = false;

    const shorResult = runShor(n);

    for (let i = 0; i < shorResult.steps.length; i++) {
      if (abortRef.current) break;
      // Wait while paused
      while (pauseRef.current && !abortRef.current) {
        await new Promise((r) => setTimeout(r, 100));
      }
      if (abortRef.current) break;

      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, ANIMATION.speeds[speedIndex].value));
    }

    if (!abortRef.current) {
      setResult(shorResult);
    }
    setIsRunning(false);
    setIsPaused(false);

    setCooldown(true);
    if (cooldownRef.current) clearTimeout(cooldownRef.current);
    cooldownRef.current = setTimeout(() => setCooldown(false), ANIMATION.cooldownMs);
  }, [speedIndex]);

  const handleInputChange = (value: string) => {
    setInputN(value);
    if (error) setError(validateInput(value));
  };

  const handleRun = () => {
    const validationError = validateInput(inputN);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (isRunning || cooldown) return;
    setError(null);
    simulate(Number(inputN));
  };

  const handlePauseResume = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
  };

  const handleStop = () => {
    abortRef.current = true;
    pauseRef.current = false;
  };

  const isButtonDisabled = isRunning || cooldown || validateInput(inputN) !== null;

  return (
    <section aria-labelledby="shor-panel-heading" className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-accent-red animate-pulse" aria-hidden="true" />
        <h2 id="shor-panel-heading" className="text-lg font-bold text-accent-red">Classical RSA / ECC</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red border border-accent-red/20">
          VULNERABLE
        </span>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed">
        Shor&apos;s algorithm uses{" "}
        <span className="text-accent-purple cursor-help border-b border-dotted border-accent-purple/40" title="Quantum Fourier Transform (QFT): The quantum analogue of the discrete Fourier transform. It maps quantum states to their frequency components in O(n²) gates, enabling efficient period-finding — the core of Shor's algorithm. Classically, the best known factoring algorithm (GNFS) runs in sub-exponential time.">
          quantum period-finding
        </span>{" "}
        to factor large numbers exponentially faster than any classical algorithm. The key step is{" "}
        <span className="text-accent-blue cursor-help border-b border-dotted border-accent-blue/40" title="Modular Exponentiation: Computing a^x mod N for all x in superposition. This is the most resource-intensive part of Shor's algorithm, requiring O(n³) quantum gates where n is the number of bits in N. The quantum circuit evaluates f(x) = a^x mod N on a superposition of all possible x values simultaneously.">
          modular exponentiation
        </span>{" "}
        in superposition, followed by the{" "}
        <span className="text-accent-red cursor-help border-b border-dotted border-accent-red/40" title="Quantum Fourier Transform (QFT): Transforms the quantum state to reveal the period r of f(x) = a^x mod N. Once r is known, the factors of N can be extracted via gcd(a^(r/2) ± 1, N). This is exponentially faster than any known classical approach.">
          QFT
        </span>
        . This breaks RSA, whose security relies on the difficulty of factoring.
      </p>

      {/* Quantum Circuit Visualization */}
      <QuantumCircuit
        active={isRunning}
        step={Math.min(currentStep, 3)}
      />

      {/* Input Section */}
      <div className="rounded-lg bg-surface-deep border border-panel-border p-4">
        <label htmlFor="shor-number-input" className="text-[10px] md:text-xs text-gray-500 font-mono block mb-2">
          ENTER A NUMBER TO FACTOR (Shor&apos;s Simulation)
        </label>
        <div className="flex gap-2">
          <input
            id="shor-number-input"
            type="number"
            value={inputN}
            onChange={(e) => handleInputChange(e.target.value)}
            aria-describedby="shor-input-range"
            className="flex-1 min-w-0 bg-panel-bg border border-border-dark rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-accent-red transition-colors"
            min={2}
            max={999}
            disabled={isRunning}
          />
          <button
            onClick={handleRun}
            disabled={isButtonDisabled}
            aria-label={isRunning ? "Factoring in progress" : cooldown ? "Please wait before trying again" : `Run Shor's Algorithm on ${inputN}`}
            className="px-3 md:px-4 py-2 rounded bg-accent-red hover:bg-accent-red-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-surface-deep"
          >
            {isRunning ? "Running..." : cooldown ? "Wait..." : "Run Shor's Algorithm"}
          </button>
        </div>
        <p id="shor-input-range" className="sr-only">Enter a number between 2 and 999</p>

        {/* Validation Error */}
        {error && (
          <p className="text-xs text-accent-red mt-2 font-mono" role="alert">
            ⚠ {error}
          </p>
        )}

        {/* Presets */}
        <div className="flex gap-2 mt-3 flex-wrap" role="group" aria-label="Preset composite numbers to factor">
          {SHOR_PRESETS.map((preset) => (
            <button
              key={preset.n}
              onClick={() => {
                setInputN(String(preset.n));
                if (!isRunning) simulate(preset.n);
              }}
              title={`Composite number: ${preset.factors}`}
              aria-label={`Factor ${preset.n} (${preset.factors})`}
              className="px-2 py-1 text-xs font-mono rounded bg-surface-dark hover:bg-border-dark text-gray-400 hover:text-white transition-colors border border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-1 focus:ring-offset-surface-deep"
            >
              {preset.n}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Controls */}
      {isRunning && (
        <div className="flex items-center gap-3 px-1">
          <button
            onClick={handlePauseResume}
            aria-label={isPaused ? "Resume simulation" : "Pause simulation"}
            className="px-3 py-1.5 text-xs rounded bg-surface-dark hover:bg-border-dark text-gray-300 border border-border-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-1 focus:ring-offset-surface-deep"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={handleStop}
            aria-label="Stop simulation"
            className="px-3 py-1.5 text-xs rounded bg-accent-red/10 hover:bg-accent-red/20 text-accent-red border border-accent-red/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-1 focus:ring-offset-surface-deep"
          >
            Stop
          </button>
          <div className="ml-auto flex items-center gap-1.5" role="group" aria-label="Animation speed">
            <span className="text-[10px] text-gray-500">Speed:</span>
            {ANIMATION.speeds.map((speed, idx) => (
              <button
                key={speed.label}
                onClick={() => onSpeedChange(idx)}
                aria-label={`Set speed to ${speed.label}`}
                aria-pressed={idx === speedIndex}
                className={`px-1.5 py-0.5 text-[10px] rounded font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple ${
                  idx === speedIndex
                    ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                    : "text-gray-500 hover:text-gray-300 border border-transparent"
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step-by-step Results */}
      <div className="flex-1 overflow-y-auto rounded-lg bg-surface-deep border border-panel-border p-4" role="log" aria-label="Algorithm steps" aria-live="polite">
        <h3 className="text-xs text-gray-500 font-mono mb-3">ALGORITHM STEPS</h3>

        <AnimatePresence mode="popLayout">
          {result?.steps.map((step, i) => (
            <motion.div
              key={`${result.n}-${i}`}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.1 }}
              className="mb-3 last:mb-0"
            >
              <article className="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    i === result.steps.length - 1
                      ? result.success
                        ? "bg-accent-red/20 text-accent-red"
                        : "bg-yellow-500/20 text-yellow-500"
                      : "bg-surface-dark text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1 md:gap-2">
                    <span className="text-[10px] md:text-xs font-mono text-accent-purple">{step.label}</span>
                    <span className="text-sm text-white">{step.description}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.detail}</p>
                </div>
              </article>
            </motion.div>
          ))}
        </AnimatePresence>

        {!result && !isRunning && (
          <div className="text-center text-gray-600 text-sm py-8">
            Enter a number above to simulate Shor&apos;s algorithm
          </div>
        )}

        {isRunning && (
          <div className="text-center text-accent-red text-sm py-8 animate-pulse" role="status">
            {isPaused ? "Paused..." : "Quantum computer factoring..."}
          </div>
        )}
      </div>

      {/* Result highlight */}
      <AnimatePresence>
        {result?.success && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : undefined}
            className="rounded-lg bg-accent-red/10 border border-accent-red/30 p-4 glow-red"
            role="alert"
          >
            <div className="text-center">
              <span className="text-accent-red font-mono text-lg font-bold">
                {result.n} = {result.factor1} × {result.factor2}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                RSA key factored by quantum computer — encryption broken
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                Ref: Shor (1994) · Beauregard (2003) · Gidney &amp; Ekerå (2021)
              </p>
            </div>
          </motion.div>
        )}
        {result && !result.success && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : undefined}
            className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4"
            role="alert"
          >
            <div className="text-center">
              <span className="text-yellow-500 font-mono text-sm font-bold">
                Could not factor {result.n} in this run
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Shor&apos;s algorithm is probabilistic — the chosen random values didn&apos;t yield factors this time. Try again!
              </p>
              <button
                onClick={() => simulate(result.n)}
                disabled={isRunning || cooldown}
                className="mt-2 px-3 py-1 text-xs rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 focus:ring-offset-panel-bg"
              >
                Retry with new random &apos;a&apos;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
