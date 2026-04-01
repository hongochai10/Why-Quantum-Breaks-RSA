import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import { renderWithDict } from "../helpers/renderWithDictionary";
import HomeClient from "@/components/HomeClient";
import ErrorBoundary from "@/components/ErrorBoundary";
import PQCPanel from "@/components/PQCPanel";
import ShorPanel from "@/components/ShorPanel";
import QubitSlider from "@/components/QubitSlider";

// Mock runShor for deterministic results
vi.mock("@/lib/shor", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/shor")>();
  return {
    ...actual,
    runShor: vi.fn((n: number) => ({
      n,
      a: 7,
      period: 4,
      factor1: 3,
      factor2: n / 3,
      steps: [
        { label: "Input", description: `Factor N = ${n}`, detail: "detail" },
        { label: "Random", description: "Chose a = 7", detail: "detail" },
        { label: "Period", description: "Found r = 4", detail: "detail" },
      ],
      success: true,
    })),
  };
});

import { runShor } from "@/lib/shor";
const mockedRunShor = vi.mocked(runShor);

async function completeSimulation() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

describe("Integration: Cross-panel state updates", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedRunShor.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --- QubitSlider → PQCPanel sync ---

  it("PQCPanel reflects qubit count changes from QubitSlider", () => {
    renderWithDict(<HomeClient />);

    // Default is 2000 qubits
    expect(screen.getByText("ML-KEM remains secure at 2,000 qubits")).toBeInTheDocument();

    // Change slider to 5000
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "5000" } });

    expect(screen.getByText("ML-KEM remains secure at 5,000 qubits")).toBeInTheDocument();
  });

  it("QubitSlider broken count updates when slider changes", () => {
    renderWithDict(<HomeClient />);

    // At default 2000 qubits: RSA-512 (1027) is broken → 1/5
    expect(screen.getByText(/1\/5 broken/)).toBeInTheDocument();

    // Move to 5000 → more breakpoints become broken
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "5000" } });

    expect(screen.getByText(/3\/5 broken/)).toBeInTheDocument();
  });

  it("RSA breakpoints update status when qubit count changes", () => {
    renderWithDict(<HomeClient />);

    // At 100 qubits, nothing is broken
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "100" } });
    expect(screen.getByText(/0\/5 broken/)).toBeInTheDocument();

    // At 10000, everything is broken
    fireEvent.change(slider, { target: { value: "10000" } });
    expect(screen.getByText(/5\/5 broken/)).toBeInTheDocument();
  });

  it("ML-KEM remains ALWAYS SAFE regardless of qubit count", () => {
    renderWithDict(<HomeClient />);

    expect(screen.getByText("ALWAYS SAFE")).toBeInTheDocument();

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "10000" } });

    expect(screen.getByText("ALWAYS SAFE")).toBeInTheDocument();
    expect(screen.getByText("ML-KEM remains secure at 10,000 qubits")).toBeInTheDocument();
  });

  // --- Speed control sync: ShorPanel → PQCPanel ---

  it("speed change in ShorPanel propagates to parent state", async () => {
    renderWithDict(<HomeClient />);

    // Start simulation to reveal speed controls
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Default speed is 1x (index 1), verify it's pressed
    expect(screen.getByLabelText("Set speed to 1x")).toHaveAttribute("aria-pressed", "true");

    // Change speed to 4x
    fireEvent.click(screen.getByLabelText("Set speed to 4x"));
    expect(screen.getByLabelText("Set speed to 4x")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Set speed to 1x")).toHaveAttribute("aria-pressed", "false");

    await completeSimulation();
  });

  // --- Full simulation flow through Home page ---

  it("full simulation flow: input → run → steps → result", async () => {
    renderWithDict(<HomeClient />);

    // Verify idle state
    expect(screen.getByText("Enter a number above to simulate Shor's algorithm")).toBeInTheDocument();

    // Run simulation
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByText("Running...")).toBeInTheDocument();
    expect(screen.getByText("Quantum computer factoring...")).toBeInTheDocument();

    // Complete simulation
    await completeSimulation();

    // Verify results
    expect(screen.getByText(/15 = 3 × 5/)).toBeInTheDocument();
    expect(screen.getByText(/RSA key factored by quantum computer/)).toBeInTheDocument();
  });

  it("preset button triggers simulation within full page context", async () => {
    renderWithDict(<HomeClient />);

    fireEvent.click(screen.getByLabelText("Factor 77 (7×11)"));
    expect(screen.getByText("Running...")).toBeInTheDocument();

    await completeSimulation();

    expect(mockedRunShor).toHaveBeenCalledWith(77);
    expect(screen.getByText(/77 = 3 ×/)).toBeInTheDocument();
  });

  // --- Simultaneous interactions across panels ---

  it("changing qubit slider while simulation runs does not break simulation", async () => {
    renderWithDict(<HomeClient />);

    // Start simulation
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByText("Running...")).toBeInTheDocument();

    // Change qubit slider mid-simulation
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "7000" } });

    // PQCPanel should update despite running simulation
    expect(screen.getByText("ML-KEM remains secure at 7,000 qubits")).toBeInTheDocument();

    // Simulation should still be running
    expect(screen.getByText("Running...")).toBeInTheDocument();

    // Complete and verify result
    await completeSimulation();
    expect(screen.getByText(/15 = 3 × 5/)).toBeInTheDocument();
  });

  // --- Pause/resume within full page ---

  it("pause and resume work within full page context", async () => {
    renderWithDict(<HomeClient />);

    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Pause
    fireEvent.click(screen.getByLabelText("Pause simulation"));
    expect(screen.getByText("Paused...")).toBeInTheDocument();
    expect(screen.getByLabelText("Resume simulation")).toBeInTheDocument();

    // Resume
    fireEvent.click(screen.getByLabelText("Resume simulation"));
    expect(screen.getByText("Quantum computer factoring...")).toBeInTheDocument();

    await completeSimulation();
    expect(screen.getByText(/15 = 3 × 5/)).toBeInTheDocument();
  });

  it("stop aborts simulation and shows no result in full page", async () => {
    renderWithDict(<HomeClient />);

    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    fireEvent.click(screen.getByLabelText("Stop simulation"));

    await completeSimulation();

    expect(screen.getByText("Run Shor's Algorithm")).toBeInTheDocument();
    expect(screen.queryByText(/15 = 3 × 5/)).not.toBeInTheDocument();
  });

  // --- Speed changes during active simulation ---

  it("speed change during simulation updates speed button states", async () => {
    renderWithDict(<HomeClient />);

    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Cycle through speeds
    fireEvent.click(screen.getByLabelText("Set speed to 0.5x"));
    expect(screen.getByLabelText("Set speed to 0.5x")).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByLabelText("Set speed to 2x"));
    expect(screen.getByLabelText("Set speed to 2x")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Set speed to 0.5x")).toHaveAttribute("aria-pressed", "false");

    await completeSimulation();
  });

  // --- Error boundary isolation ---

  it("both panels render within their ErrorBoundary wrappers", () => {
    renderWithDict(<HomeClient />);

    // Both panels should be visible
    expect(screen.getByText("Classical RSA / ECC")).toBeInTheDocument();
    expect(screen.getByText("Post-Quantum (ML-KEM)")).toBeInTheDocument();
  });

  // --- Page structure ---

  it("renders header, slider, both panels, and footer", () => {
    renderWithDict(<HomeClient />);

    // Header
    expect(screen.getByText("Why Quantum")).toBeInTheDocument();
    expect(screen.getByText("Breaks")).toBeInTheDocument();

    // Slider
    expect(screen.getByText("Qubit Count")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();

    // ShorPanel
    expect(screen.getByText("Classical RSA / ECC")).toBeInTheDocument();

    // PQCPanel
    expect(screen.getByText("Post-Quantum (ML-KEM)")).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/Educational simulation/)).toBeInTheDocument();
    expect(screen.getByText(/NIST PQC Standard/)).toBeInTheDocument();
  });

  it("skip-to-content link exists for accessibility", () => {
    renderWithDict(<HomeClient />);
    const skipLink = screen.getByText("Skip to main content");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("security status legend renders in header", () => {
    renderWithDict(<HomeClient />);
    expect(screen.getByText("Vulnerable")).toBeInTheDocument();
    expect(screen.getByText("Quantum-Safe")).toBeInTheDocument();
  });

  // --- Cooldown after simulation completes ---

  it("cooldown state visible in full page context", async () => {
    renderWithDict(<HomeClient />);

    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Advance through 3 steps (3 × 800ms)
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(800);
      });
    }

    // Button should show "Wait..." during cooldown
    expect(screen.getByText("Wait...")).toBeInTheDocument();

    // Advance past cooldown (1500ms)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(screen.getByText("Run Shor's Algorithm")).not.toBeDisabled();
  });

  // --- Multiple simulation runs ---

  it("can run multiple simulations sequentially", async () => {
    renderWithDict(<HomeClient />);

    // First run
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    await completeSimulation();
    expect(screen.getByText(/15 = 3 × 5/)).toBeInTheDocument();

    // Second run with different preset
    fireEvent.click(screen.getByLabelText("Factor 21 (3×7)"));
    await completeSimulation();

    expect(mockedRunShor).toHaveBeenCalledWith(21);
  });

  // --- Qubit slider range extremes ---

  it("handles minimum qubit count (100)", () => {
    renderWithDict(<HomeClient />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "100" } });

    expect(screen.getByText("ML-KEM remains secure at 100 qubits")).toBeInTheDocument();
    expect(screen.getByText(/0\/5 broken/)).toBeInTheDocument();
  });

  it("handles maximum qubit count (10000)", () => {
    renderWithDict(<HomeClient />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "10000" } });

    expect(screen.getByText("ML-KEM remains secure at 10,000 qubits")).toBeInTheDocument();
    expect(screen.getByText(/5\/5 broken/)).toBeInTheDocument();
  });
});

describe("Integration: Error boundary isolation", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("error in ShorPanel does not crash PQCPanel", () => {
    // We test this by rendering the ErrorBoundary-wrapped structure directly
    // since we can't easily make ShorPanel throw without breaking the mock
    function ThrowingPanel(): React.ReactNode {
      throw new Error("ShorPanel crash");
    }

    renderWithDict(
      <div>
        <ErrorBoundary>
          <ThrowingPanel />
        </ErrorBoundary>
        <ErrorBoundary>
          <PQCPanel qubitCount={2000} animationSpeedMs={800} />
        </ErrorBoundary>
      </div>
    );

    // ShorPanel crashed — shows fallback
    expect(screen.getByText("Something went wrong rendering this section.")).toBeInTheDocument();

    // PQCPanel still works
    expect(screen.getByText("Post-Quantum (ML-KEM)")).toBeInTheDocument();
    expect(screen.getByText("ML-KEM remains secure at 2,000 qubits")).toBeInTheDocument();
  });

  it("error in PQCPanel does not crash ShorPanel", () => {
    function ThrowingPanel(): React.ReactNode {
      throw new Error("PQCPanel crash");
    }

    renderWithDict(
      <div>
        <ErrorBoundary>
          <ShorPanel speedIndex={1} onSpeedChange={() => {}} />
        </ErrorBoundary>
        <ErrorBoundary>
          <ThrowingPanel />
        </ErrorBoundary>
      </div>
    );

    // PQCPanel crashed — shows fallback
    expect(screen.getByText("Something went wrong rendering this section.")).toBeInTheDocument();

    // ShorPanel still works
    expect(screen.getByText("Classical RSA / ECC")).toBeInTheDocument();
    expect(screen.getByText("Run Shor's Algorithm")).toBeInTheDocument();
  });

  it("Try again button works in isolated error boundary", () => {
    let shouldThrow = true;
    function ConditionalThrow() {
      if (shouldThrow) throw new Error("Temporary error");
      return <div>Recovered content</div>;
    }

    renderWithDict(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong rendering this section.")).toBeInTheDocument();

    // Fix the error condition
    shouldThrow = false;
    fireEvent.click(screen.getByText("Try again"));

    expect(screen.getByText("Recovered content")).toBeInTheDocument();
  });
});

describe("Integration: QubitSlider keyboard navigation", () => {
  it("slider responds to keyboard arrow events", () => {
    const onChange = vi.fn();

    renderWithDict(<QubitSlider value={2000} onChange={onChange} />);
    const slider = screen.getByRole("slider");

    // Simulate keyboard change via the change event (jsdom limitation)
    fireEvent.change(slider, { target: { value: "2100" } });
    expect(onChange).toHaveBeenCalledWith(2100);

    fireEvent.change(slider, { target: { value: "1900" } });
    expect(onChange).toHaveBeenCalledWith(1900);
  });

  it("slider has correct ARIA attributes for assistive technology", () => {
    renderWithDict(<QubitSlider value={3000} onChange={vi.fn()} />);
    const slider = screen.getByRole("slider");

    expect(slider).toHaveAttribute("aria-valuemin", "100");
    expect(slider).toHaveAttribute("aria-valuemax", "10000");
    expect(slider).toHaveAttribute("aria-valuenow", "3000");
    expect(slider).toHaveAttribute("aria-valuetext", "3,000 logical qubits");
    expect(slider).toHaveAttribute("aria-label", "Qubit count: 3,000");
  });
});

describe("Integration: PQCPanel dynamic qubit count updates", () => {
  it("status message updates when qubitCount prop changes", () => {
    const { rerender } = renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("ML-KEM remains secure at 1,000 qubits")).toBeInTheDocument();

    rerender(<PQCPanel qubitCount={8000} />);
    expect(screen.getByText("ML-KEM remains secure at 8,000 qubits")).toBeInTheDocument();

    rerender(<PQCPanel qubitCount={100} />);
    expect(screen.getByText("ML-KEM remains secure at 100 qubits")).toBeInTheDocument();
  });

  it("all ML-KEM algorithms remain SAFE at any qubit count", () => {
    const { rerender } = renderWithDict(<PQCPanel qubitCount={100} />);
    expect(screen.getAllByText("SAFE")).toHaveLength(3);

    rerender(<PQCPanel qubitCount={10000} />);
    expect(screen.getAllByText("SAFE")).toHaveLength(3);
  });

  it("animationSpeedMs prop change re-renders LatticeVisualization", () => {
    const { rerender } = renderWithDict(<PQCPanel qubitCount={2000} animationSpeedMs={800} />);
    expect(screen.getByText("LATTICE PROBLEM (SVP)")).toBeInTheDocument();

    rerender(<PQCPanel qubitCount={2000} animationSpeedMs={200} />);
    expect(screen.getByText("LATTICE PROBLEM (SVP)")).toBeInTheDocument();
  });
});
