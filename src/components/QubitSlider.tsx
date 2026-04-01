"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getRSABreakpoints } from "@/lib/shor";
import { COLORS } from "@/lib/constants";
import { useDictionary } from "./DictionaryProvider";
import { interpolate } from "@/lib/i18n";

interface QubitSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function QubitSlider({ value, onChange }: QubitSliderProps) {
  const shouldReduceMotion = useReducedMotion();
  const { dict, lang } = useDictionary();
  const t = dict.qubitSlider;
  const breakpoints = getRSABreakpoints(value);
  const brokenCount = breakpoints.filter((b) => b.status === "broken").length;

  return (
    <section className="rounded-xl bg-panel-bg border border-panel-border p-4 md:p-6" aria-labelledby="qubit-slider-heading">
      <div className="flex items-center justify-between mb-3 md:mb-4 gap-4">
        <div className="min-w-0">
          <h2 id="qubit-slider-heading" className="text-sm font-bold text-white">{t.heading}</h2>
          <p id="qubit-slider-desc" className="text-xs md:text-sm text-gray-500 mt-0.5">
            {t.description}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl md:text-2xl font-bold font-mono text-accent-purple" aria-live="polite" aria-atomic="true">
            {value.toLocaleString(lang)}
          </div>
          <div className="text-[10px] text-gray-500">{t.logicalQubits}</div>
        </div>
      </div>

      <div className="relative mb-4 md:mb-6">
        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={interpolate(t.qubitCountLabel, { value: value.toLocaleString(lang) })}
          aria-describedby="qubit-slider-desc"
          aria-valuemin={100}
          aria-valuemax={10000}
          aria-valuenow={value}
          aria-valuetext={interpolate(t.qubitCountValueText, { value: value.toLocaleString(lang) })}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-600 font-mono">100</span>
          <span className="text-[10px] text-gray-600 font-mono">10,000</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs text-gray-500 font-mono mb-2">
          {interpolate(t.rsaKeyVulnerability, { broken: brokenCount, total: breakpoints.length })}
        </h3>

        <div className="relative">
          <div className="w-full h-1 bg-surface-dark rounded-full mb-4">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-red to-accent-red"
              animate={{ width: `${(value / 10000) * 100}%` }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            />
          </div>

          {breakpoints.map((bp) => {
            const position = (bp.qubitsNeeded / 10000) * 100;
            return (
              <div
                key={bp.keyBits}
                className="flex items-center gap-3 mb-2"
              >
                <div className="relative w-16 shrink-0">
                  <div
                    className="absolute h-3 w-0.5 rounded-full"
                    style={{
                      left: `${position}%`,
                      backgroundColor:
                        bp.status === "broken" ? COLORS.red : COLORS.borderDark,
                    }}
                  />
                </div>

                <div className="flex-1 flex items-center justify-between min-w-0 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <motion.div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        bp.status === "broken" ? "bg-accent-red" : "bg-accent-green"
                      }`}
                      aria-hidden="true"
                      animate={
                        bp.status === "broken" && !shouldReduceMotion
                          ? { scale: [1, 1.3, 1] }
                          : {}
                      }
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, repeat: Infinity }}
                    />
                    <span
                      className={`text-xs md:text-sm font-mono truncate ${
                        bp.status === "broken"
                          ? "text-accent-red line-through"
                          : "text-white"
                      }`}
                    >
                      {bp.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    <span className="text-[10px] text-gray-600 font-mono cursor-help hidden sm:inline" title={bp.citation}>
                      {interpolate(t.qubits, { value: bp.qubitsNeeded.toLocaleString(lang) })}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 md:px-2 py-0.5 rounded font-mono ${
                        bp.status === "broken"
                          ? "bg-accent-red/10 text-accent-red"
                          : "bg-accent-green/10 text-accent-green"
                      }`}
                    >
                      {bp.status === "broken" ? t.statusBroken : t.statusSafe}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-panel-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              <span className="text-sm font-mono text-accent-green">{t.mlkemAllLevels}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-accent-green/10 text-accent-green font-mono">
              {t.alwaysSafe}
            </span>
          </div>
          <p className="text-[10px] text-gray-600 mt-1 ml-4">
            {t.mlkemExplanation}
          </p>
        </div>
      </div>
    </section>
  );
}
