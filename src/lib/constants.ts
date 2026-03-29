// Design tokens — extracted from hardcoded values across components

// Brand colors
export const COLORS = {
  red: "#ff4d6a",
  redHover: "#ff3355",
  green: "#00e88f",
  purple: "#a855f7",
  blue: "#4d9fff",
  yellow: "#fbbf24",
  panelBg: "#0d0d18",
  panelBorder: "#1e1e30",
  cardBg: "#12121e",
  surfaceDark: "#1a1a2e",
  borderDark: "#2a2a40",
  gridLine: "#1a1a30",
  surfaceMuted: "#2a2a50",
} as const;

// Animation durations (ms)
export const ANIMATION = {
  stepDelayMs: 800,
  cooldownMs: 1500,
  speeds: [
    { label: "0.5x", value: 1600 },
    { label: "1x", value: 800 },
    { label: "2x", value: 400 },
    { label: "4x", value: 200 },
  ],
  defaultSpeedIndex: 1,
} as const;

// Preset numbers for Shor's panel with factorization context
export const SHOR_PRESETS = [
  { n: 15, factors: "3×5" },
  { n: 21, factors: "3×7" },
  { n: 35, factors: "5×7" },
  { n: 77, factors: "7×11" },
  { n: 91, factors: "7×13" },
  { n: 143, factors: "11×13" },
] as const;

// Quantum circuit gate definitions
export const QUANTUM_GATES = [
  { label: "H", color: COLORS.blue, desc: "Hadamard" },
  { label: "U_f", color: COLORS.purple, desc: "Oracle" },
  { label: "QFT†", color: COLORS.yellow, desc: "Inverse QFT" },
  { label: "M", color: COLORS.red, desc: "Measure" },
] as const;

// Layout
export const QUBIT_COUNT = 4;
export const LATTICE_GRID_SIZE = 8;
