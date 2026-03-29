import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LatticeVisualization from "@/components/LatticeVisualization";

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
});
