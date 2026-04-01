import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ShorPanel from "@/components/ShorPanel";

// Mock runShor to return deterministic results
vi.mock("@/lib/shor", () => ({
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
}));

import { runShor } from "@/lib/shor";
const mockedRunShor = vi.mocked(runShor);

/** Run all pending timers to completion (handles sequential awaited setTimeouts) */
async function completeSimulation() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

describe("ShorPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedRunShor.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --- Basic rendering ---

  it("renders the heading", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(screen.getByText("Classical RSA / ECC")).toBeInTheDocument();
  });

  it("shows VULNERABLE badge", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(screen.getByText("VULNERABLE")).toBeInTheDocument();
  });

  it("renders the number input with default value 15", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(15);
  });

  it("renders the Run button enabled for valid input", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    const button = screen.getByText("Run Shor's Algorithm");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("renders all 6 preset buttons with correct aria labels", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("21")).toBeInTheDocument();
    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getByText("77")).toBeInTheDocument();
    expect(screen.getByText("91")).toBeInTheDocument();
    expect(screen.getByText("143")).toBeInTheDocument();
    expect(screen.getByLabelText("Factor 15 (3×5)")).toBeInTheDocument();
    expect(screen.getByLabelText("Factor 143 (11×13)")).toBeInTheDocument();
  });

  it("renders the ALGORITHM STEPS log area", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(screen.getByText("ALGORITHM STEPS")).toBeInTheDocument();
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("shows prompt text when idle", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(
      screen.getByText("Enter a number above to simulate Shor's algorithm")
    ).toBeInTheDocument();
  });

  // --- Input validation (button disable) ---

  it("disables Run button for number < 2", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "1" },
    });
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();
  });

  it("disables Run button for number > 999", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "1000" },
    });
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();
  });

  it("disables Run button for empty input", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "" },
    });
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();
  });

  it("disables Run button for non-integer input", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "abc" },
    });
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();
  });

  it("updates input value on change", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "42" } });
    expect(input).toHaveValue(42);
  });

  // --- Simulation start ---

  it("clicking a preset updates input value and starts simulation", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByLabelText("Factor 77 (7×11)"));
    expect(screen.getByRole("spinbutton")).toHaveValue(77);
    expect(screen.getByText("Running...")).toBeInTheDocument();
  });

  it("clicking Run starts simulation", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByText("Running...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("preset buttons have correct titles", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(screen.getByLabelText("Factor 15 (3×5)")).toHaveAttribute(
      "title",
      "Composite number: 3×5"
    );
    expect(screen.getByLabelText("Factor 143 (11×13)")).toHaveAttribute(
      "title",
      "Composite number: 11×13"
    );
  });

  it("renders quantum circuit visualization", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(screen.getByText("QUANTUM CIRCUIT")).toBeInTheDocument();
  });

  // --- Accessibility ---

  it("renders section with proper aria-labelledby", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(
      screen.getByRole("region", { name: "Classical RSA / ECC" })
    ).toBeInTheDocument();
  });

  it("has accessible description for input range", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(
      screen.getByText("Enter a number between 2 and 999")
    ).toBeInTheDocument();
  });

  it("renders preset group with proper aria-label", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(
      screen.getByRole("group", { name: "Preset composite numbers to factor" })
    ).toBeInTheDocument();
  });

  it("description text mentions key quantum concepts", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(screen.getByText("quantum period-finding")).toBeInTheDocument();
    expect(screen.getByText("modular exponentiation")).toBeInTheDocument();
    expect(screen.getByText("QFT")).toBeInTheDocument();
  });

  it("input has correct min/max attributes", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "2");
    expect(input).toHaveAttribute("max", "999");
  });

  it("label for input section exists", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    expect(
      screen.getByText(/ENTER A NUMBER TO FACTOR/)
    ).toBeInTheDocument();
  });

  // --- Animation Controls (lines 186-221) ---

  it("shows Pause and Stop buttons when simulation is running", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByLabelText("Pause simulation")).toBeInTheDocument();
    expect(screen.getByLabelText("Stop simulation")).toBeInTheDocument();
  });

  it("shows speed control buttons during simulation", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByRole("group", { name: "Animation speed" })).toBeInTheDocument();
    expect(screen.getByLabelText("Set speed to 0.5x")).toBeInTheDocument();
    expect(screen.getByLabelText("Set speed to 1x")).toBeInTheDocument();
    expect(screen.getByLabelText("Set speed to 2x")).toBeInTheDocument();
    expect(screen.getByLabelText("Set speed to 4x")).toBeInTheDocument();
  });

  it("marks current speed as pressed", () => {
    render(<ShorPanel speedIndex={2} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByLabelText("Set speed to 2x")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Set speed to 1x")).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSpeedChange when clicking a speed button", () => {
    const onSpeedChange = vi.fn();
    render(<ShorPanel speedIndex={1} onSpeedChange={onSpeedChange} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    fireEvent.click(screen.getByLabelText("Set speed to 4x"));
    expect(onSpeedChange).toHaveBeenCalledWith(3);
  });

  // --- Pause/Resume (lines 86-89) ---

  it("toggles Pause to Resume when clicked", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    fireEvent.click(screen.getByLabelText("Pause simulation"));
    expect(screen.getByLabelText("Resume simulation")).toBeInTheDocument();
    expect(screen.getByText("Paused...")).toBeInTheDocument();
  });

  it("toggles Resume back to Pause", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    fireEvent.click(screen.getByLabelText("Pause simulation"));
    fireEvent.click(screen.getByLabelText("Resume simulation"));
    expect(screen.getByLabelText("Pause simulation")).toBeInTheDocument();
    expect(screen.getByText("Quantum computer factoring...")).toBeInTheDocument();
  });

  it("simulation waits while paused then continues after resume", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Advance past first step delay so step 1 resolves and step 2 begins
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    // Now waiting on step 2's setTimeout(800ms). Pause before it fires.
    fireEvent.click(screen.getByLabelText("Pause simulation"));

    // Advance past step 2's delay — the loop will enter the while(pause) body
    // because the for-loop continues after step 2's await and checks pauseRef
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    // Now inside while(pauseRef) loop, a 100ms setTimeout is scheduled
    // Advance to execute the pause-wait body (line 51)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    // Resume — breaks the while loop
    fireEvent.click(screen.getByLabelText("Resume simulation"));

    // Complete remaining steps
    await completeSimulation();

    expect(screen.getByText(/15 = 3 × 5/)).toBeInTheDocument();
  });

  // --- Stop (lines 91-94) ---

  it("stops the simulation and hides controls", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByText("Running...")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Stop simulation"));

    await completeSimulation();

    expect(screen.getByText("Run Shor's Algorithm")).toBeInTheDocument();
    // No result should appear since we aborted
    expect(screen.queryByText(/15 = 3 × 5/)).not.toBeInTheDocument();
  });

  // --- Cooldown (lines 65-67, 81, 96) ---

  it("enters cooldown state after simulation completes", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Advance through just the simulation steps (3 × 800ms) without running cooldown timer
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(800);
      });
    }

    // During cooldown, button should show "Wait..."
    expect(screen.getByText("Wait...")).toBeInTheDocument();
  });

  it("cooldown expires and re-enables Run button", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Complete simulation + cooldown
    await completeSimulation();

    expect(screen.getByText("Run Shor's Algorithm")).toBeInTheDocument();
    expect(screen.getByText("Run Shor's Algorithm")).not.toBeDisabled();
  });

  // --- Result display (lines 276-325) ---

  it("displays successful factorization result", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    await completeSimulation();

    expect(screen.getByText(/15 = 3 × 5/)).toBeInTheDocument();
    expect(screen.getByText(/RSA key factored by quantum computer/)).toBeInTheDocument();
  });

  it("displays academic references on success", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    await completeSimulation();

    expect(screen.getByText(/Shor \(1994\)/)).toBeInTheDocument();
  });

  it("shows step labels after simulation", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    await completeSimulation();

    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("Random")).toBeInTheDocument();
    expect(screen.getByText("Period")).toBeInTheDocument();
  });

  it("displays failure result with retry button", async () => {
    mockedRunShor.mockReturnValueOnce({
      n: 15,
      a: 4,
      period: null,
      factor1: null,
      factor2: null,
      steps: [
        { label: "Input", description: "Factor N = 15", detail: "detail" },
        { label: "Fail", description: "No period found", detail: "detail" },
      ],
      success: false,
    });

    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    await completeSimulation();

    expect(screen.getByText(/Could not factor 15/)).toBeInTheDocument();
    expect(screen.getByText(/probabilistic/)).toBeInTheDocument();
    expect(screen.getByText("Retry with new random 'a'")).toBeInTheDocument();
  });

  it("retry button triggers new simulation", async () => {
    mockedRunShor.mockReturnValueOnce({
      n: 15,
      a: 4,
      period: null,
      factor1: null,
      factor2: null,
      steps: [
        { label: "Input", description: "Factor N = 15", detail: "detail" },
      ],
      success: false,
    });

    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Complete simulation + cooldown
    await completeSimulation();

    fireEvent.click(screen.getByText("Retry with new random 'a'"));
    expect(mockedRunShor).toHaveBeenCalledTimes(2);
  });

  // --- handleRun guards ---

  it("does not run during cooldown", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Complete simulation but use partial advancement to stay in cooldown
    // 3 steps × 800ms = 2400ms for sim, then cooldown starts (1500ms)
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(800);
      });
    }

    // Should be in cooldown now
    if (screen.queryByText("Wait...")) {
      fireEvent.click(screen.getByText("Wait..."));
      expect(mockedRunShor).toHaveBeenCalledTimes(1);
    }
  });

  it("input is disabled during simulation", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });

  it("preset click while not running triggers simulate", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByLabelText("Factor 21 (3×7)"));
    expect(screen.getByRole("spinbutton")).toHaveValue(21);
    expect(mockedRunShor).toHaveBeenCalledWith(21);
  });

  it("shows running status text during active simulation", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByText("Quantum computer factoring...")).toBeInTheDocument();
  });

  it("shows paused status text when paused", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    fireEvent.click(screen.getByLabelText("Pause simulation"));
    expect(screen.getByText("Paused...")).toBeInTheDocument();
  });

  it("Run button shows correct aria-label when running", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByLabelText("Factoring in progress")).toBeInTheDocument();
  });

  // --- Error during cooldown (lines 91-93) ---

  it("sets validation error and does not start simulation when input is invalid during cooldown", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);

    // Run simulation to completion to enter cooldown
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    // Complete simulation steps (3 × 800ms)
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(800);
      });
    }

    // Should be in cooldown now
    expect(screen.getByText("Wait...")).toBeInTheDocument();

    // Set invalid input while in cooldown
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "1" },
    });

    // Advance past cooldown (1500ms)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });

    // Now cooldown is over, but input is invalid — Run button should still be disabled
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();

    // Attempt to run — should set error and not call runShor again
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(mockedRunShor).toHaveBeenCalledTimes(1); // Only the first run
  });

  // --- Error recovery guard (lines 92-93) ---
  // handleRun validates input defensively even though the button is normally disabled
  // for invalid input. To cover this guard, we invoke the handler via React fiber props.

  function getReactOnClick(el: HTMLElement): (() => void) | undefined {
    const key = Object.keys(el).find((k) => k.startsWith("__reactProps$"));
    return key ? (el as Record<string, any>)[key]?.onClick : undefined;
  }

  it("handleRun sets validation error when invoked with empty input", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "" } });

    // Directly invoke handleRun via React fiber — bypasses disabled button
    const onClick = getReactOnClick(screen.getByText("Run Shor's Algorithm"));
    act(() => onClick?.());

    expect(screen.getByRole("alert")).toHaveTextContent(/Please enter a number/);
    expect(mockedRunShor).not.toHaveBeenCalled();
  });

  it("handleRun sets validation error when invoked with out-of-range input", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "1" } });

    const onClick = getReactOnClick(screen.getByText("Run Shor's Algorithm"));
    act(() => onClick?.());

    expect(screen.getByRole("alert")).toHaveTextContent(/Number must be at least 2/);
    expect(mockedRunShor).not.toHaveBeenCalled();
  });

  it("handleRun clears error on subsequent valid input change", () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);

    // Trigger error via handleRun with invalid input
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "" } });
    const onClick = getReactOnClick(screen.getByText("Run Shor's Algorithm"));
    act(() => onClick?.());
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Now change to valid input — handleInputChange should clear error (line 86)
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "21" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  // --- Cleanup verification ---

  it("unmount during active simulation does not throw", async () => {
    const { unmount } = render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Unmount while simulation is running — verifies cleanup (lines 37-43)
    expect(() => unmount()).not.toThrow();

    // Drain any remaining timers to avoid leaks
    await act(async () => {
      await vi.runAllTimersAsync();
    });
  });

  // --- Reduced motion (covers ternary branches lines 293-296, 315-318) ---

  it("renders success result with reduced motion preferences", async () => {
    const { __setReducedMotion, __resetReducedMotion } = await import("framer-motion") as any;
    __setReducedMotion(true);

    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    await completeSimulation();

    expect(screen.getByText(/15 = 3 × 5/)).toBeInTheDocument();
    __resetReducedMotion();
  });

  it("renders failure result with reduced motion preferences", async () => {
    const { __setReducedMotion, __resetReducedMotion } = await import("framer-motion") as any;
    __setReducedMotion(true);

    mockedRunShor.mockReturnValueOnce({
      n: 15, a: 4, period: null, factor1: null, factor2: null,
      steps: [{ label: "Fail", description: "No period found", detail: "detail" }],
      success: false,
    });

    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    await completeSimulation();

    expect(screen.getByText(/Could not factor 15/)).toBeInTheDocument();
    __resetReducedMotion();
  });

  it("stop during cooldown resets to idle state", async () => {
    render(<ShorPanel speedIndex={1} onSpeedChange={() => {}} />);

    fireEvent.click(screen.getByText("Run Shor's Algorithm"));

    // Advance one step to be mid-simulation
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    // Stop mid-simulation (triggers abort, which skips result, then enters cooldown)
    fireEvent.click(screen.getByLabelText("Stop simulation"));

    // Let the abort + cooldown timers resolve
    await completeSimulation();

    // Should be back to idle — no result shown, Run button re-enabled
    expect(screen.queryByText(/15 = 3 × 5/)).not.toBeInTheDocument();
    expect(screen.getByText("Run Shor's Algorithm")).not.toBeDisabled();
  });
});
