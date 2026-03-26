"use client";

import { useState } from "react";
import ShorPanel from "@/components/ShorPanel";
import PQCPanel from "@/components/PQCPanel";
import QubitSlider from "@/components/QubitSlider";

export default function Home() {
  const [qubitCount, setQubitCount] = useState(2000);

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-[#1e1e30] bg-[#0d0d18]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-white">Why Quantum </span>
                <span className="text-[#ff4d6a]">Breaks</span>
                <span className="text-white"> RSA</span>
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Interactive comparison: Classical cryptography vs Post-Quantum security
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff4d6a]" />
                <span className="text-xs text-gray-400">Vulnerable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00e88f]" />
                <span className="text-xs text-gray-400">Quantum-Safe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Qubit Slider */}
      <div className="max-w-[1600px] mx-auto w-full px-6 py-4">
        <QubitSlider value={qubitCount} onChange={setQubitCount} />
      </div>

      {/* Split Screen Panels */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Panel - Classical RSA */}
          <div className="rounded-xl bg-[#12121e] border border-[#ff4d6a]/20 p-6 glow-red">
            <ShorPanel />
          </div>

          {/* Right Panel - Post-Quantum */}
          <div className="rounded-xl bg-[#12121e] border border-[#00e88f]/20 p-6 glow-green">
            <PQCPanel qubitCount={qubitCount} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e1e30] py-4">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
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
