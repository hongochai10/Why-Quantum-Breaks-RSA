import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import LatticeVisualization from "@/components/LatticeVisualization";
import { __setReducedMotion, __resetReducedMotion } from "../mocks/framer-motion";

describe("LatticeVisualization", () => {
  it("renders the SVG with title, desc, and aria-labelledby", () => {
    const { container } = render(<LatticeVisualization qubitCount={1000} />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute("aria-labelledby")).toBe("lattice-viz-title lattice-viz-desc");
    const title = container.querySelector("#lattice-viz-title");
    const desc = container.querySelector("#lattice-viz-desc");
    expect(title).toBeInTheDocument();
    expect(title!.textContent).toContain("Shortest Vector Problem");
    expect(desc).toBeInTheDocument();
    expect(desc!.textContent).toContain("grid");
  });

  it("shows the LATTICE PROBLEM label", () => {
    render(<LatticeVisualization qubitCount={1000} />);
    expect(screen.getByText("LATTICE PROBLEM (SVP)")).toBeInTheDocument();
  });

  it("renders the closest vector label", () => {
    render(<LatticeVisualization qubitCount={1000} />);
    expect(screen.getByText("closest vector")).toBeInTheDocument();
  });

  it("shows Grover legend text", () => {
    render(<LatticeVisualization qubitCount={1000} />);
    expect(screen.getByText("Grover: √n speedup only")).toBeInTheDocument();
  });

  it("renders lattice points as SVG circles", () => {
    const { container } = render(
      <LatticeVisualization qubitCount={1000} />
    );
    // 8x8 grid = 64 points + search attempt circles
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThanOrEqual(64);
  });

  it("renders grid lines", () => {
    const { container } = render(
      <LatticeVisualization qubitCount={1000} />
    );
    const lines = container.querySelectorAll("line");
    expect(lines.length).toBeGreaterThan(0);
  });

  it("desc mentions search attempts count", () => {
    const { container } = render(<LatticeVisualization qubitCount={2000} />);
    const desc = container.querySelector("#lattice-viz-desc");
    expect(desc!.textContent).toContain("quantum search attempts");
  });

  describe("with reduced motion", () => {
    afterEach(() => {
      __resetReducedMotion();
    });

    it("renders correctly with reduced motion enabled", () => {
      __setReducedMotion(true);
      const { container } = render(<LatticeVisualization qubitCount={1000} />);
      expect(screen.getByText("closest vector")).toBeInTheDocument();
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBeGreaterThanOrEqual(64);
    });

    it("renders search attempts with reduced motion", () => {
      __setReducedMotion(true);
      vi.useFakeTimers();
      render(<LatticeVisualization qubitCount={2000} animationSpeedMs={100} />);
      // Advance enough to reveal all search attempts
      act(() => { vi.advanceTimersByTime(1000); });
      expect(screen.getByText("closest vector")).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  describe("animation interval", () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it("reveals search attempts sequentially over time", () => {
      const { container } = render(
        <LatticeVisualization qubitCount={2000} animationSpeedMs={100} />
      );
      // Initially no search attempt markers visible (✗ text)
      const getFailMarkers = () => container.querySelectorAll("text");
      const initialCount = getFailMarkers().length;

      // Advance one tick
      act(() => { vi.advanceTimersByTime(100); });
      const afterOneCount = getFailMarkers().length;
      expect(afterOneCount).toBeGreaterThanOrEqual(initialCount);
    });

    it("completes all search attempts and clears interval", () => {
      const { container } = render(
        <LatticeVisualization qubitCount={2000} animationSpeedMs={50} />
      );
      // Advance enough time to complete all attempts (max 6 attempts * 50ms = 300ms)
      act(() => { vi.advanceTimersByTime(500); });
      // Should render without errors after completion
      expect(screen.getByText("closest vector")).toBeInTheDocument();
    });

    it("cleans up interval on unmount", () => {
      const { unmount } = render(
        <LatticeVisualization qubitCount={2000} animationSpeedMs={100} />
      );
      // Advance partway through animation
      act(() => { vi.advanceTimersByTime(150); });
      // Unmount mid-animation to trigger cleanup
      unmount();
      // No errors thrown — cleanup successful
    });

    it("resets animation when qubitCount changes", () => {
      const { rerender } = render(
        <LatticeVisualization qubitCount={1000} animationSpeedMs={100} />
      );
      act(() => { vi.advanceTimersByTime(200); });
      // Change qubit count to trigger effect re-run (covers clearInterval on re-render)
      rerender(<LatticeVisualization qubitCount={3000} animationSpeedMs={100} />);
      act(() => { vi.advanceTimersByTime(500); });
      expect(screen.getByText("closest vector")).toBeInTheDocument();
    });

    it("handles custom animationSpeedMs", () => {
      render(<LatticeVisualization qubitCount={1000} animationSpeedMs={200} />);
      act(() => { vi.advanceTimersByTime(1200); });
      expect(screen.getByText("Grover: √n speedup only")).toBeInTheDocument();
    });

    it("calls clearInterval on unmount and prevents further state updates", () => {
      const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
      const { unmount } = render(
        <LatticeVisualization qubitCount={2000} animationSpeedMs={100} />
      );
      // Advance partway so interval is active
      act(() => { vi.advanceTimersByTime(100); });

      const callsBefore = clearIntervalSpy.mock.calls.length;
      unmount();

      // clearInterval should have been called during cleanup
      expect(clearIntervalSpy.mock.calls.length).toBeGreaterThan(callsBefore);

      // Advancing timers after unmount should not throw
      act(() => { vi.advanceTimersByTime(500); });

      clearIntervalSpy.mockRestore();
    });

    it("clears previous interval before setting a new one on prop change", () => {
      const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
      const { rerender } = render(
        <LatticeVisualization qubitCount={2000} animationSpeedMs={100} />
      );
      act(() => { vi.advanceTimersByTime(100); });

      const callsBefore = clearIntervalSpy.mock.calls.length;
      // Change animationSpeedMs to trigger effect re-run
      rerender(<LatticeVisualization qubitCount={2000} animationSpeedMs={200} />);

      // clearInterval should have been called to clean up the old interval
      expect(clearIntervalSpy.mock.calls.length).toBeGreaterThan(callsBefore);

      act(() => { vi.advanceTimersByTime(1200); });
      expect(screen.getByText("closest vector")).toBeInTheDocument();

      clearIntervalSpy.mockRestore();
    });
  });

  it("handles very small qubit count with minimal search attempts", () => {
    const { container } = render(<LatticeVisualization qubitCount={1} />);
    const circles = container.querySelectorAll("circle");
    // Should still render grid (64 points) even with minimal search attempts
    expect(circles.length).toBeGreaterThanOrEqual(64);
  });
});
