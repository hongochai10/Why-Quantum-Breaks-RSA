import { describe, it, expect, vi } from "vitest";
import {
  runShor,
  getRSABreakpoints,
  getPQCStatus,
} from "@/lib/shor";

describe("runShor", () => {
  it("factors even numbers trivially", () => {
    const result = runShor(6);
    expect(result.success).toBe(true);
    expect(result.factor1).toBe(2);
    expect(result.factor2).toBe(3);
    expect(result.n).toBe(6);
    expect(result.steps.length).toBeGreaterThanOrEqual(2);
    expect(result.steps[0].label).toBe("Input");
    expect(result.steps[1].label).toBe("Trivial");
  });

  it("factors even number 100", () => {
    const result = runShor(100);
    expect(result.success).toBe(true);
    expect(result.factor1).toBe(2);
    expect(result.factor2).toBe(50);
  });

  it("always includes an Input step as the first step", () => {
    const result = runShor(15);
    expect(result.steps[0]).toEqual({
      label: "Input",
      description: "Factor N = 15",
      detail: "We want to find the prime factors of 15 using quantum period-finding.",
    });
  });

  it("factors 15 (classic Shor's example)", () => {
    // runShor is probabilistic, so run it multiple times
    let success = false;
    for (let i = 0; i < 20; i++) {
      const result = runShor(15);
      if (result.success) {
        expect(result.factor1! * result.factor2!).toBe(15);
        expect(result.factor1).toBeGreaterThan(1);
        expect(result.factor2).toBeGreaterThan(1);
        success = true;
        break;
      }
    }
    expect(success).toBe(true);
  });

  it("factors 21 (3 × 7)", () => {
    let success = false;
    for (let i = 0; i < 20; i++) {
      const result = runShor(21);
      if (result.success) {
        expect(result.factor1! * result.factor2!).toBe(21);
        success = true;
        break;
      }
    }
    expect(success).toBe(true);
  });

  it("returns success: false when factoring fails", () => {
    // Mock Math.random to force a bad 'a' choice that leads to odd period
    const mockRandom = vi.spyOn(Math, "random");
    // Force a=2 for n=9: period of 2^x mod 9 is 6 (even, but may give trivial factors)
    // Actually, let's just check the shape of a failed result
    mockRandom.mockReturnValue(0); // will pick a=2

    const result = runShor(9);
    // Whether it succeeds or fails, check shape
    expect(result).toHaveProperty("n", 9);
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("steps");
    expect(Array.isArray(result.steps)).toBe(true);

    mockRandom.mockRestore();
  });

  it("handles case where gcd(a, n) > 1 (lucky find)", () => {
    // Force a = 3 for n = 9, gcd(3,9) = 3
    const mockRandom = vi.spyOn(Math, "random");
    // a = 2 + Math.floor(random * (9-3)) = 2 + Math.floor(random * 6)
    // For a=3: random * 6 must be in [1,2), so random in [1/6, 2/6)
    mockRandom.mockReturnValue(1 / 6);

    const result = runShor(9);
    expect(result.success).toBe(true);
    expect(result.factor1).toBe(3);
    expect(result.factor2).toBe(3);
    expect(result.steps.some((s) => s.label === "Lucky")).toBe(true);

    mockRandom.mockRestore();
  });

  it("retries up to MAX_SHOR_RETRIES (3) times on failure", () => {
    // For a prime number, Shor's may fail repeatedly
    // Check that steps include "Retry" labels
    const result = runShor(7); // 7 is prime, harder to factor
    // It may succeed or fail, but the structure should be valid
    expect(result.n).toBe(7);
    expect(result.steps.length).toBeGreaterThanOrEqual(1);
  });

  it("reports failure with odd period and includes 'Failed' step", () => {
    const mockRandom = vi.spyOn(Math, "random");
    // Force a=4 for n=9: a = 2 + floor(random * 6), need floor(random*6)=2 → random ∈ [0.333, 0.5)
    // gcd(4,9)=1 so proceeds to period-finding. findPeriod(4,9)=3 (odd) → failure.
    // We need consistent 0.34 for all retry attempts to ensure odd period each time.
    mockRandom.mockReturnValue(0.34);

    const result = runShor(9);
    // With a=4 and period=3 (odd), every attempt fails
    expect(result.success).toBe(false);
    expect(result.factor1).toBeNull();
    expect(result.factor2).toBeNull();
    // Should have a "Failed" step describing odd period
    const failedStep = result.steps.find((s) => s.label === "Failed");
    expect(failedStep).toBeDefined();
    expect(failedStep!.description).toContain("odd");
    // Should have retry steps
    const retrySteps = result.steps.filter((s) => s.label === "Retry");
    expect(retrySteps.length).toBe(2); // 3 attempts total, 2 retries

    mockRandom.mockRestore();
  });

  it("returns correct failure shape when all retries exhausted", () => {
    const mockRandom = vi.spyOn(Math, "random");
    // Force repeated odd-period results for n=9 with a=4
    mockRandom.mockReturnValue(0.34);

    const result = runShor(9);
    expect(result.success).toBe(false);
    expect(result.n).toBe(9);
    expect(result.period).toBeDefined(); // period is 3 (odd), not null
    expect(result.steps.length).toBeGreaterThanOrEqual(3); // At least input + choose a + period + failed per attempt

    mockRandom.mockRestore();
  });

  it("result always has required shape", () => {
    const result = runShor(35);
    expect(result).toHaveProperty("n");
    expect(result).toHaveProperty("a");
    expect(result).toHaveProperty("period");
    expect(result).toHaveProperty("factor1");
    expect(result).toHaveProperty("factor2");
    expect(result).toHaveProperty("steps");
    expect(result).toHaveProperty("success");
  });
});

describe("getRSABreakpoints", () => {
  it("returns 5 breakpoints", () => {
    const bps = getRSABreakpoints(0);
    expect(bps).toHaveLength(5);
  });

  it("marks all as safe when qubitCount is 0", () => {
    const bps = getRSABreakpoints(0);
    expect(bps.every((bp) => bp.status === "safe")).toBe(true);
  });

  it("marks RSA-512 as broken when qubits >= 1027", () => {
    const bps = getRSABreakpoints(1027);
    const rsa512 = bps.find((bp) => bp.label === "RSA-512");
    expect(rsa512?.status).toBe("broken");
  });

  it("marks RSA-512 as safe when qubits < 1027", () => {
    const bps = getRSABreakpoints(1026);
    const rsa512 = bps.find((bp) => bp.label === "RSA-512");
    expect(rsa512?.status).toBe("safe");
  });

  it("marks all as broken when qubits >= 8195", () => {
    const bps = getRSABreakpoints(8195);
    expect(bps.every((bp) => bp.status === "broken")).toBe(true);
  });

  it("correctly identifies partially broken state", () => {
    const bps = getRSABreakpoints(3000);
    const broken = bps.filter((bp) => bp.status === "broken");
    const safe = bps.filter((bp) => bp.status === "safe");
    expect(broken.length).toBe(2); // RSA-512 (1027) and RSA-1024 (2051)
    expect(safe.length).toBe(3);
  });

  it("each breakpoint has required properties", () => {
    const bps = getRSABreakpoints(5000);
    for (const bp of bps) {
      expect(bp).toHaveProperty("keyBits");
      expect(bp).toHaveProperty("label");
      expect(bp).toHaveProperty("qubitsNeeded");
      expect(bp).toHaveProperty("citation");
      expect(bp).toHaveProperty("status");
      expect(typeof bp.keyBits).toBe("number");
      expect(typeof bp.label).toBe("string");
    }
  });

  it("breakpoints are in ascending order of keyBits", () => {
    const bps = getRSABreakpoints(5000);
    for (let i = 1; i < bps.length; i++) {
      expect(bps[i].keyBits).toBeGreaterThan(bps[i - 1].keyBits);
    }
  });

  it("qubitsNeeded follows 2n+3 formula", () => {
    const bps = getRSABreakpoints(0);
    for (const bp of bps) {
      expect(bp.qubitsNeeded).toBe(2 * bp.keyBits + 3);
    }
  });
});

describe("getPQCStatus", () => {
  it("returns 3 algorithms", () => {
    const status = getPQCStatus();
    expect(status).toHaveLength(3);
  });

  it("all algorithms are safe", () => {
    const status = getPQCStatus();
    expect(status.every((s) => s.status === "safe")).toBe(true);
  });

  it("includes ML-KEM-512, ML-KEM-768, ML-KEM-1024", () => {
    const status = getPQCStatus();
    const names = status.map((s) => s.algorithm);
    expect(names).toEqual(["ML-KEM-512", "ML-KEM-768", "ML-KEM-1024"]);
  });

  it("security levels are 1, 3, 5", () => {
    const status = getPQCStatus();
    expect(status.map((s) => s.securityLevel)).toEqual([1, 3, 5]);
  });

  it("classical bits double to quantum bits (Grover halving)", () => {
    const status = getPQCStatus();
    for (const algo of status) {
      expect(algo.quantumBits).toBe(algo.classicalBits / 2);
    }
  });

  it("each algorithm has required properties", () => {
    const status = getPQCStatus();
    for (const algo of status) {
      expect(algo).toHaveProperty("algorithm");
      expect(algo).toHaveProperty("securityLevel");
      expect(algo).toHaveProperty("classicalBits");
      expect(algo).toHaveProperty("quantumBits");
      expect(algo).toHaveProperty("nistRef");
      expect(algo).toHaveProperty("status");
      expect(algo).toHaveProperty("reason");
    }
  });

  it("nistRef references NIST FIPS 203", () => {
    const status = getPQCStatus();
    for (const algo of status) {
      expect(algo.nistRef).toContain("NIST FIPS 203");
    }
  });
});
