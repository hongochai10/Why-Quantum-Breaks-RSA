import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ShorPanel from "@/components/ShorPanel";

describe("ShorPanel", () => {
  it("renders the heading", () => {
    render(<ShorPanel />);
    expect(screen.getByText("Classical RSA / ECC")).toBeInTheDocument();
  });

  it("shows VULNERABLE badge", () => {
    render(<ShorPanel />);
    expect(screen.getByText("VULNERABLE")).toBeInTheDocument();
  });

  it("renders the number input with default value 15", () => {
    render(<ShorPanel />);
    const input = screen.getByRole("spinbutton");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(15);
  });

  it("renders the Run button enabled for valid input", () => {
    render(<ShorPanel />);
    const button = screen.getByText("Run Shor's Algorithm");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("renders all 6 preset buttons with correct aria labels", () => {
    render(<ShorPanel />);
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
    render(<ShorPanel />);
    expect(screen.getByText("ALGORITHM STEPS")).toBeInTheDocument();
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("shows prompt text when idle", () => {
    render(<ShorPanel />);
    expect(
      screen.getByText("Enter a number above to simulate Shor's algorithm")
    ).toBeInTheDocument();
  });

  it("disables Run button for number < 2", () => {
    render(<ShorPanel />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "1" },
    });
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();
  });

  it("disables Run button for number > 999", () => {
    render(<ShorPanel />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "1000" },
    });
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();
  });

  it("disables Run button for empty input", () => {
    render(<ShorPanel />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "" },
    });
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();
  });

  it("disables Run button for non-integer input", () => {
    render(<ShorPanel />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "abc" },
    });
    expect(screen.getByText("Run Shor's Algorithm")).toBeDisabled();
  });

  it("updates input value on change", () => {
    render(<ShorPanel />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "42" } });
    expect(input).toHaveValue(42);
  });

  it("clicking a preset updates input value and starts simulation", () => {
    render(<ShorPanel />);
    fireEvent.click(screen.getByLabelText("Factor 77 (7×11)"));
    expect(screen.getByRole("spinbutton")).toHaveValue(77);
    // Simulation should start — button shows "Running..."
    expect(screen.getByText("Running...")).toBeInTheDocument();
  });

  it("clicking Run starts simulation", () => {
    render(<ShorPanel />);
    fireEvent.click(screen.getByText("Run Shor's Algorithm"));
    expect(screen.getByText("Running...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("preset buttons have correct titles", () => {
    render(<ShorPanel />);
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
    render(<ShorPanel />);
    expect(screen.getByText("QUANTUM CIRCUIT")).toBeInTheDocument();
  });

  it("renders section with proper aria-labelledby", () => {
    render(<ShorPanel />);
    expect(
      screen.getByRole("region", { name: "Classical RSA / ECC" })
    ).toBeInTheDocument();
  });

  it("has accessible description for input range", () => {
    render(<ShorPanel />);
    expect(
      screen.getByText("Enter a number between 2 and 999")
    ).toBeInTheDocument();
  });

  it("renders preset group with proper aria-label", () => {
    render(<ShorPanel />);
    expect(
      screen.getByRole("group", { name: "Preset composite numbers to factor" })
    ).toBeInTheDocument();
  });

  it("description text mentions key quantum concepts", () => {
    render(<ShorPanel />);
    expect(screen.getByText("quantum period-finding")).toBeInTheDocument();
    expect(screen.getByText("modular exponentiation")).toBeInTheDocument();
    expect(screen.getByText("QFT")).toBeInTheDocument();
  });

  it("input has correct min/max attributes", () => {
    render(<ShorPanel />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("min", "2");
    expect(input).toHaveAttribute("max", "999");
  });

  it("label for input section exists", () => {
    render(<ShorPanel />);
    expect(
      screen.getByText(/ENTER A NUMBER TO FACTOR/)
    ).toBeInTheDocument();
  });
});
