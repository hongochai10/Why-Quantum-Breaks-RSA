import { describe, it, expect, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithDict } from "../helpers/renderWithDictionary";
import PQCPanel from "@/components/PQCPanel";
import { __setReducedMotion, __resetReducedMotion } from "../mocks/framer-motion";

describe("PQCPanel", () => {
  afterEach(() => {
    __resetReducedMotion();
  });
  it("renders the heading", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("Post-Quantum (ML-KEM)")).toBeInTheDocument();
  });

  it("shows SECURE badge", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("SECURE")).toBeInTheDocument();
  });

  it("renders all 3 ML-KEM algorithms", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("ML-KEM-512")).toBeInTheDocument();
    expect(screen.getByText("ML-KEM-768")).toBeInTheDocument();
    expect(screen.getByText("ML-KEM-1024")).toBeInTheDocument();
  });

  it("all algorithms show SAFE status", () => {
    renderWithDict(<PQCPanel qubitCount={10000} />);
    const safeBadges = screen.getAllByText("SAFE");
    expect(safeBadges.length).toBe(3);
  });

  it("renders the Lattice visualization", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("LATTICE PROBLEM (SVP)")).toBeInTheDocument();
  });

  it("shows WHY QUANTUM CAN'T BREAK LATTICE section", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(
      screen.getByText("WHY QUANTUM CAN'T BREAK LATTICE")
    ).toBeInTheDocument();
  });

  it("shows Grover's speedup explanation", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(
      screen.getByText("Grover's Algorithm: Only √n speedup")
    ).toBeInTheDocument();
  });

  it("shows Grover's speedup comparison section", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(
      screen.getByText("GROVER'S SPEEDUP COMPARISON")
    ).toBeInTheDocument();
  });

  it("displays qubit count in status message", () => {
    renderWithDict(<PQCPanel qubitCount={5000} />);
    expect(
      screen.getByText("ML-KEM remains secure at 5,000 qubits")
    ).toBeInTheDocument();
  });

  it("renders section with proper aria-labelledby", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    const section = screen.getByRole("region", {
      name: "Post-Quantum (ML-KEM)",
    });
    expect(section).toBeInTheDocument();
  });

  it("references NIST and academic papers", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    const matches = screen.getAllByText(/NIST FIPS 203/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders correctly with reduced motion enabled", () => {
    __setReducedMotion(true);
    renderWithDict(<PQCPanel qubitCount={2048} />);
    expect(screen.getByText("Post-Quantum (ML-KEM)")).toBeInTheDocument();
    expect(screen.getByText("ML-KEM remains secure at 2,048 qubits")).toBeInTheDocument();
    const safeBadges = screen.getAllByText("SAFE");
    expect(safeBadges.length).toBe(3);
  });

  it("renders with custom animationSpeedMs prop", () => {
    renderWithDict(<PQCPanel qubitCount={1000} animationSpeedMs={400} />);
    expect(screen.getByText("Post-Quantum (ML-KEM)")).toBeInTheDocument();
  });

  it("displays formatted Grover comparison values", () => {
    renderWithDict(<PQCPanel qubitCount={1000} />);
    expect(screen.getByText("Classical brute force")).toBeInTheDocument();
    expect(screen.getByText("Grover's quantum search")).toBeInTheDocument();
  });

  it("renders with very high qubit count", () => {
    renderWithDict(<PQCPanel qubitCount={100000} />);
    expect(screen.getByText("ML-KEM remains secure at 100,000 qubits")).toBeInTheDocument();
  });
});
