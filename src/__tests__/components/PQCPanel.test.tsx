import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PQCPanel from "@/components/PQCPanel";

describe("PQCPanel", () => {
  it("renders the heading", () => {
    render(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("Post-Quantum (ML-KEM)")).toBeInTheDocument();
  });

  it("shows SECURE badge", () => {
    render(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("SECURE")).toBeInTheDocument();
  });

  it("renders all 3 ML-KEM algorithms", () => {
    render(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("ML-KEM-512")).toBeInTheDocument();
    expect(screen.getByText("ML-KEM-768")).toBeInTheDocument();
    expect(screen.getByText("ML-KEM-1024")).toBeInTheDocument();
  });

  it("all algorithms show SAFE status", () => {
    render(<PQCPanel qubitCount={10000} />);
    const safeBadges = screen.getAllByText("SAFE");
    expect(safeBadges.length).toBe(3);
  });

  it("renders the Lattice visualization", () => {
    render(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("LATTICE PROBLEM (SVP)")).toBeInTheDocument();
  });

  it("shows WHY QUANTUM CAN'T BREAK LATTICE section", () => {
    render(<PQCPanel qubitCount={1000} />);
    expect(
      screen.getByText("WHY QUANTUM CAN'T BREAK LATTICE")
    ).toBeInTheDocument();
  });

  it("shows Grover's speedup explanation", () => {
    render(<PQCPanel qubitCount={1000} />);
    expect(
      screen.getByText("Grover's Algorithm: Only √n speedup")
    ).toBeInTheDocument();
  });

  it("shows Grover's speedup comparison section", () => {
    render(<PQCPanel qubitCount={1000} />);
    expect(
      screen.getByText("GROVER'S SPEEDUP COMPARISON")
    ).toBeInTheDocument();
  });

  it("displays qubit count in status message", () => {
    render(<PQCPanel qubitCount={5000} />);
    expect(
      screen.getByText("ML-KEM remains secure at 5,000 qubits")
    ).toBeInTheDocument();
  });

  it("renders section with proper aria-labelledby", () => {
    render(<PQCPanel qubitCount={1000} />);
    const section = screen.getByRole("region", {
      name: "Post-Quantum (ML-KEM)",
    });
    expect(section).toBeInTheDocument();
  });

  it("references NIST and academic papers", () => {
    render(<PQCPanel qubitCount={1000} />);
    const matches = screen.getAllByText(/NIST FIPS 203/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
