import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QubitSlider from "@/components/QubitSlider";

describe("QubitSlider", () => {
  it("renders the heading", () => {
    render(<QubitSlider value={1000} onChange={vi.fn()} />);
    expect(screen.getByText("Qubit Count")).toBeInTheDocument();
  });

  it("displays the current qubit value", () => {
    render(<QubitSlider value={5000} onChange={vi.fn()} />);
    expect(screen.getByText("5,000")).toBeInTheDocument();
  });

  it("renders the range slider with correct attributes", () => {
    render(<QubitSlider value={2000} onChange={vi.fn()} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("min", "100");
    expect(slider).toHaveAttribute("max", "10000");
    expect(slider).toHaveAttribute("step", "100");
  });

  it("calls onChange when slider value changes", () => {
    const handleChange = vi.fn();
    render(<QubitSlider value={1000} onChange={handleChange} />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "5000" } });
    expect(handleChange).toHaveBeenCalledWith(5000);
  });

  it("shows 5 RSA breakpoints", () => {
    render(<QubitSlider value={1000} onChange={vi.fn()} />);
    expect(screen.getByText("RSA-512")).toBeInTheDocument();
    expect(screen.getByText("RSA-1024")).toBeInTheDocument();
    expect(screen.getByText("RSA-2048")).toBeInTheDocument();
    expect(screen.getByText("RSA-3072")).toBeInTheDocument();
    expect(screen.getByText("RSA-4096")).toBeInTheDocument();
  });

  it("shows broken count correctly", () => {
    render(<QubitSlider value={3000} onChange={vi.fn()} />);
    // At 3000 qubits: RSA-512 (1027) and RSA-1024 (2051) are broken
    expect(screen.getByText("RSA KEY VULNERABILITY (2/5 broken)")).toBeInTheDocument();
  });

  it("shows 0/5 broken when qubit count is low", () => {
    render(<QubitSlider value={100} onChange={vi.fn()} />);
    expect(screen.getByText("RSA KEY VULNERABILITY (0/5 broken)")).toBeInTheDocument();
  });

  it("shows ML-KEM as always safe", () => {
    render(<QubitSlider value={10000} onChange={vi.fn()} />);
    expect(screen.getByText("ML-KEM (all levels)")).toBeInTheDocument();
    expect(screen.getByText("ALWAYS SAFE")).toBeInTheDocument();
  });

  it("shows description text", () => {
    render(<QubitSlider value={1000} onChange={vi.fn()} />);
    expect(
      screen.getByText("Drag to simulate quantum computer scaling")
    ).toBeInTheDocument();
  });
});
