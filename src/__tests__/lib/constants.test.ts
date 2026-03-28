import { describe, it, expect } from "vitest";
import {
  COLORS,
  ANIMATION,
  SHOR_PRESETS,
  QUANTUM_GATES,
  QUBIT_COUNT,
  LATTICE_GRID_SIZE,
} from "@/lib/constants";

describe("COLORS", () => {
  it("contains all expected color keys", () => {
    expect(COLORS).toHaveProperty("red");
    expect(COLORS).toHaveProperty("green");
    expect(COLORS).toHaveProperty("purple");
    expect(COLORS).toHaveProperty("blue");
    expect(COLORS).toHaveProperty("yellow");
    expect(COLORS).toHaveProperty("panelBg");
    expect(COLORS).toHaveProperty("panelBorder");
    expect(COLORS).toHaveProperty("cardBg");
    expect(COLORS).toHaveProperty("surfaceDark");
    expect(COLORS).toHaveProperty("borderDark");
  });

  it("all values are valid hex color strings", () => {
    for (const value of Object.values(COLORS)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe("ANIMATION", () => {
  it("has stepDelayMs and cooldownMs", () => {
    expect(ANIMATION.stepDelayMs).toBe(800);
    expect(ANIMATION.cooldownMs).toBe(1500);
  });

  it("has 4 speed options", () => {
    expect(ANIMATION.speeds).toHaveLength(4);
  });

  it("speeds have label and value", () => {
    for (const speed of ANIMATION.speeds) {
      expect(typeof speed.label).toBe("string");
      expect(typeof speed.value).toBe("number");
      expect(speed.value).toBeGreaterThan(0);
    }
  });

  it("default speed index is valid", () => {
    expect(ANIMATION.defaultSpeedIndex).toBeGreaterThanOrEqual(0);
    expect(ANIMATION.defaultSpeedIndex).toBeLessThan(ANIMATION.speeds.length);
  });

  it("speeds are in descending order of value (slower to faster)", () => {
    for (let i = 1; i < ANIMATION.speeds.length; i++) {
      expect(ANIMATION.speeds[i].value).toBeLessThan(ANIMATION.speeds[i - 1].value);
    }
  });
});

describe("SHOR_PRESETS", () => {
  it("has 6 presets", () => {
    expect(SHOR_PRESETS).toHaveLength(6);
  });

  it("all presets have n and factors", () => {
    for (const preset of SHOR_PRESETS) {
      expect(typeof preset.n).toBe("number");
      expect(typeof preset.factors).toBe("string");
    }
  });

  it("all n values are composite (not prime)", () => {
    for (const preset of SHOR_PRESETS) {
      // Parse factors string "a×b"
      const [a, b] = preset.factors.split("×").map(Number);
      expect(a * b).toBe(preset.n);
      expect(a).toBeGreaterThan(1);
      expect(b).toBeGreaterThan(1);
    }
  });

  it("n values are in ascending order", () => {
    for (let i = 1; i < SHOR_PRESETS.length; i++) {
      expect(SHOR_PRESETS[i].n).toBeGreaterThan(SHOR_PRESETS[i - 1].n);
    }
  });
});

describe("QUANTUM_GATES", () => {
  it("has 4 gates", () => {
    expect(QUANTUM_GATES).toHaveLength(4);
  });

  it("gates have label, color, and desc", () => {
    for (const gate of QUANTUM_GATES) {
      expect(typeof gate.label).toBe("string");
      expect(typeof gate.color).toBe("string");
      expect(typeof gate.desc).toBe("string");
      expect(gate.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("gate labels are H, U_f, QFT†, M", () => {
    expect(QUANTUM_GATES.map((g) => g.label)).toEqual(["H", "U_f", "QFT†", "M"]);
  });

  it("gate descriptions are Hadamard, Oracle, Inverse QFT, Measure", () => {
    expect(QUANTUM_GATES.map((g) => g.desc)).toEqual([
      "Hadamard",
      "Oracle",
      "Inverse QFT",
      "Measure",
    ]);
  });
});

describe("Layout constants", () => {
  it("QUBIT_COUNT is a positive integer", () => {
    expect(QUBIT_COUNT).toBeGreaterThan(0);
    expect(Number.isInteger(QUBIT_COUNT)).toBe(true);
  });

  it("LATTICE_GRID_SIZE is a positive integer", () => {
    expect(LATTICE_GRID_SIZE).toBeGreaterThan(0);
    expect(Number.isInteger(LATTICE_GRID_SIZE)).toBe(true);
  });
});
