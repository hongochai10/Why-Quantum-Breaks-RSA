"use client";

import { useState } from "react";
import ShorPanel from "@/components/ShorPanel";
import PQCPanel from "@/components/PQCPanel";
import QubitSlider from "@/components/QubitSlider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ANIMATION } from "@/lib/constants";

export default function Home() {
  const [qubitCount, setQubitCount] = useState(2000);
  const [speedIndex, setSpeedIndex] = useState<number>(ANIMATION.defaultSpeedIndex);

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      {/* Skip to content link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#a855f7] focus:text-white focus:rounded focus:text-sm">
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-[#1e1e30] bg-[#0d0d18]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold">
                <span className="text-white">Why Quantum </span>
                <span className="text-[#ff4d6a]">Breaks</span>
                <span className="text-white"> RSA</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                Interactive comparison: Classical cryptography vs Post-Quantum security
              </p>
            </div>
            <nav aria-label="Security status legend" className="flex items-center gap-3 md:gap-4 shrink-0">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff4d6a]" aria-hidden="true" />
                <span className="text-[10px] md:text-xs text-gray-400">Vulnerable</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00e88f]" aria-hidden="true" />
                <span className="text-[10px] md:text-xs text-gray-400">Quantum-Safe</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div id="main-content">
        {/* Qubit Slider */}
        <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-3 md:py-4">
          <QubitSlider value={qubitCount} onChange={setQubitCount} />
        </div>

        {/* Split Screen Panels */}
        <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-6 pb-4 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full">
            {/* Left Panel - Classical RSA */}
            <div className="rounded-xl bg-[#12121e] border border-[#ff4d6a]/20 p-4 md:p-6 glow-red">
              <ErrorBoundary>
                <ShorPanel speedIndex={speedIndex} onSpeedChange={setSpeedIndex} />
              </ErrorBoundary>
            </div>

            {/* Right Panel - Post-Quantum */}
            <div className="rounded-xl bg-[#12121e] border border-[#00e88f]/20 p-4 md:p-6 glow-green">
              <ErrorBoundary>
                <PQCPanel qubitCount={qubitCount} animationSpeedMs={ANIMATION.speeds[speedIndex].value} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e1e30] py-3 md:py-4">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] md:text-[11px] text-gray-500">
            <span>
              Educational simulation — qubit estimates are approximate based on current research
            </span>
            <span>
              NIST PQC Standard: FIPS 203 (ML-KEM) · August 2024
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
