import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LatticeVisualization from "@/components/LatticeVisualization";

describe("LatticeVisualization", () => {
  it("renders the SVG with descriptive aria-label", () => {
    render(<LatticeVisualization qubitCount={1000} />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute("aria-label")).toContain("Lattice visualization");
    expect(svg.getAttribute("aria-label")).toContain("Shortest Vector Problem");
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

  it("aria-label mentions search attempts count", () => {
    render(<LatticeVisualization qubitCount={2000} />);
    const svg = screen.getByRole("img");
    expect(svg.getAttribute("aria-label")).toContain("quantum search attempts");
  });
});
