"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { runShor, type ShorResult } from "@/lib/shor";
import { ANIMATION, SHOR_PRESETS, QUANTUM_GATES } from "@/lib/constants";
import QuantumCircuit from "./QuantumCircuit";
import { useDictionary } from "./DictionaryProvider";
import { interpolate } from "@/lib/i18n";

interface ShorPanelProps {
  speedIndex: number;
  onSpeedChange: (index: number) => void;
}

export default function ShorPanel({ speedIndex, onSpeedChange }: ShorPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const { dict } = useDictionary();
  const t = dict.shorPanel;

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
  const mountedRef = useRef(true);

  const validateInput = useCallback((value: string): string | null => {
    if (value.trim() === "") return t.validation.empty;
    const n = Number(value);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return t.validation.invalid;
    if (n < 2) return t.validation.tooSmall;
    if (n > 999) return t.validation.tooLarge;
    return null;
  }, [t.validation]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current = true;
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, []);

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
      while (pauseRef.current && !abortRef.current) {
        await new Promise((r) => setTimeout(r, 100));
      }
      if (abortRef.current) break;

      if (mountedRef.current) setCurrentStep(i);
      await new Promise((r) => setTimeout(r, ANIMATION.speeds[speedIndex].value));
    }

    if (!mountedRef.current) return;

    if (!abortRef.current) {
      setResult(shorResult);
    }
    setIsRunning(false);
    setIsPaused(false);

    setCooldown(true);
    if (cooldownRef.current) clearTimeout(cooldownRef.current);
    cooldownRef.current = setTimeout(() => {
      if (mountedRef.current) setCooldown(false);
    }, ANIMATION.cooldownMs);
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
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-accent-red animate-pulse" aria-hidden="true" />
        <h2 id="shor-panel-heading" className="text-lg font-bold text-accent-red">{t.heading}</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red border border-accent-red/20">
          {t.vulnerable}
        </span>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed">
        {t.descPart1}
        <span className="text-accent-purple cursor-help border-b border-dotted border-accent-purple/40" title="Quantum Fourier Transform (QFT): The quantum analogue of the discrete Fourier transform. It maps quantum states to their frequency components in O(n²) gates, enabling efficient period-finding — the core of Shor's algorithm. Classically, the best known factoring algorithm (GNFS) runs in sub-exponential time.">
          {t.quantumPeriodFinding}
        </span>
        {t.descPart2}
        <span className="text-accent-blue cursor-help border-b border-dotted border-accent-blue/40" title="Modular Exponentiation: Computing a^x mod N for all x in superposition. This is the most resource-intensive part of Shor's algorithm, requiring O(n³) quantum gates where n is the number of bits in N. The quantum circuit evaluates f(x) = a^x mod N on a superposition of all possible x values simultaneously.">
          {t.modularExponentiation}
        </span>
        {t.descPart3}
        <span className="text-accent-red cursor-help border-b border-dotted border-accent-red/40" title="Quantum Fourier Transform (QFT): Transforms the quantum state to reveal the period r of f(x) = a^x mod N. Once r is known, the factors of N can be extracted via gcd(a^(r/2) ± 1, N). This is exponentially faster than any known classical approach.">
          {t.qft}
        </span>
        {t.descPart4}
      </p>

      <QuantumCircuit
        active={isRunning}
        step={Math.min(currentStep, QUANTUM_GATES.length - 1)}
      />

      <div className="rounded-lg bg-surface-deep border border-panel-border p-4">
        <label htmlFor="shor-number-input" className="text-[10px] md:text-xs text-gray-500 font-mono block mb-2">
          {t.inputLabel}
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
            aria-label={isRunning ? t.factoringAriaLabel : cooldown ? t.waitAriaLabel : interpolate(t.runAriaLabel, { n: inputN })}
            className="px-3 md:px-4 py-2 rounded bg-accent-red hover:bg-accent-red-hover disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-surface-deep"
          >
            {isRunning ? t.running : cooldown ? t.wait : t.runButton}
          </button>
        </div>
        <p id="shor-input-range" className="sr-only">{t.inputRange}</p>

        {error && (
          <p className="text-xs text-accent-red mt-2 font-mono" role="alert">
            ⚠ {error}
          </p>
        )}

        <div className="flex gap-2 mt-3 flex-wrap" role="group" aria-label={t.presetAriaLabel}>
          {SHOR_PRESETS.map((preset) => (
            <button
              key={preset.n}
              onClick={() => {
                setInputN(String(preset.n));
                if (!isRunning) simulate(preset.n);
              }}
              title={interpolate(t.compositeNumber, { factors: preset.factors })}
              aria-label={interpolate(t.factorAriaLabel, { n: preset.n, factors: preset.factors })}
              className="px-2 py-1 text-xs font-mono rounded bg-surface-dark hover:bg-border-dark text-gray-400 hover:text-white transition-colors border border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-1 focus:ring-offset-surface-deep"
            >
              {preset.n}
            </button>
          ))}
        </div>
      </div>

      {isRunning && (
        <div className="flex items-center gap-3 px-1">
          <button
            onClick={handlePauseResume}
            aria-label={isPaused ? t.resumeAriaLabel : t.pauseAriaLabel}
            className="px-3 py-1.5 text-xs rounded bg-surface-dark hover:bg-border-dark text-gray-300 border border-border-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-1 focus:ring-offset-surface-deep"
          >
            {isPaused ? t.resume : t.pause}
          </button>
          <button
            onClick={handleStop}
            aria-label={t.stopAriaLabel}
            className="px-3 py-1.5 text-xs rounded bg-accent-red/10 hover:bg-accent-red/20 text-accent-red border border-accent-red/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-1 focus:ring-offset-surface-deep"
          >
            {t.stop}
          </button>
          <div className="ml-auto flex items-center gap-1.5" role="group" aria-label={t.speedAriaLabel}>
            <span className="text-[10px] text-gray-500">{t.speed}</span>
            {ANIMATION.speeds.map((speed, idx) => (
              <button
                key={speed.label}
                onClick={() => onSpeedChange(idx)}
                aria-label={interpolate(t.setSpeedAriaLabel, { label: speed.label })}
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

      <div className="flex-1 overflow-y-auto rounded-lg bg-surface-deep border border-panel-border p-4" role="log" aria-label={t.algorithmStepsAriaLabel} aria-live="polite" aria-atomic="true">
        <h3 className="text-xs text-gray-500 font-mono mb-3">{t.algorithmSteps}</h3>

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
            {t.idlePrompt}
          </div>
        )}

        {isRunning && (
          <div className="text-center text-accent-red text-sm py-8 animate-pulse" role="status">
            {isPaused ? t.paused : t.factoring}
          </div>
        )}
      </div>

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
                {interpolate(t.resultLine, { n: result.n, f1: result.factor1 ?? 0, f2: result.factor2 ?? 0 })}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {t.encryptionBroken}
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                {t.shorRef}
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
                {interpolate(t.couldNotFactor, { n: result.n })}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {t.probabilistic}
              </p>
              <button
                onClick={() => simulate(result.n)}
                disabled={isRunning || cooldown}
                className="mt-2 px-3 py-1 text-xs rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 transition-colors disabled:bg-gray-700/50 disabled:text-gray-500 disabled:border-gray-600/30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 focus:ring-offset-panel-bg"
              >
                {t.retryButton}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
