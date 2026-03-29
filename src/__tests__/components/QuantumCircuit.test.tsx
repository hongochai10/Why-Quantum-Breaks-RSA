import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import QuantumCircuit from "@/components/QuantumCircuit";

describe("QuantumCircuit", () => {
  it("renders the SVG with title, desc, and aria-labelledby", () => {
    const { container } = render(<QuantumCircuit active={false} step={0} />);
    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute("aria-labelledby")).toBe("quantum-circuit-title quantum-circuit-desc");
    const title = container.querySelector("#quantum-circuit-title");
    const desc = container.querySelector("#quantum-circuit-desc");
    expect(title).toBeInTheDocument();
    expect(title!.textContent).toContain("Quantum circuit diagram");
    expect(desc).toBeInTheDocument();
  });

  it("shows QUANTUM CIRCUIT label", () => {
    render(<QuantumCircuit active={false} step={0} />);
    expect(screen.getByText("QUANTUM CIRCUIT")).toBeInTheDocument();
  });

  it("renders qubit line labels (|0⟩)", () => {
    render(<QuantumCircuit active={false} step={0} />);
    const labels = screen.getAllByText("|0⟩");
    expect(labels.length).toBe(4); // QUBIT_COUNT = 4
  });

  it("renders gate labels", () => {
    render(<QuantumCircuit active={false} step={0} />);
    // Each gate label appears QUBIT_COUNT times (once per qubit line)
    expect(screen.getAllByText("H").length).toBe(4);
    expect(screen.getAllByText("U_f").length).toBe(4);
    expect(screen.getAllByText("QFT†").length).toBe(4);
    expect(screen.getAllByText("M").length).toBe(4);
  });

  it("renders gate descriptions", () => {
    render(<QuantumCircuit active={false} step={0} />);
    expect(screen.getByText("Hadamard")).toBeInTheDocument();
    expect(screen.getByText("Oracle")).toBeInTheDocument();
    expect(screen.getByText("Inverse QFT")).toBeInTheDocument();
    expect(screen.getByText("Measure")).toBeInTheDocument();
  });

  it("desc includes step info when active", () => {
    const { container } = render(<QuantumCircuit active={true} step={2} />);
    const desc = container.querySelector("#quantum-circuit-desc");
    expect(desc!.textContent).toContain("Currently executing step 3");
  });

  it("desc does not include step info when inactive", () => {
    const { container } = render(<QuantumCircuit active={false} step={0} />);
    const desc = container.querySelector("#quantum-circuit-desc");
    expect(desc!.textContent).not.toContain("Currently executing");
  });
});
