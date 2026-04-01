import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import QuantumQuiz from "@/components/QuantumQuiz";
import { QUIZ_QUESTIONS } from "@/lib/quizData";

describe("QuantumQuiz", () => {
  it("renders the first question on mount", () => {
    render(<QuantumQuiz />);
    expect(screen.getByText(QUIZ_QUESTIONS[0].question)).toBeInTheDocument();
    expect(screen.getByText(`Question 1 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
  });

  it("renders all options for the first question", () => {
    render(<QuantumQuiz />);
    for (const option of QUIZ_QUESTIONS[0].options) {
      expect(screen.getByText(option)).toBeInTheDocument();
    }
  });

  it("has accessible quiz section label", () => {
    render(<QuantumQuiz />);
    expect(screen.getByRole("region", { name: /quantum cryptography quiz/i })).toBeInTheDocument();
  });

  it("renders radio inputs for keyboard navigation", () => {
    render(<QuantumQuiz />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(QUIZ_QUESTIONS[0].options.length);
  });

  it("has a progress bar with correct aria attributes", () => {
    render(<QuantumQuiz />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "1");
    expect(progressbar).toHaveAttribute("aria-valuemax", String(QUIZ_QUESTIONS.length));
  });

  it("disables Check Answer button when no option is selected", () => {
    render(<QuantumQuiz />);
    const button = screen.getByRole("button", { name: /check answer/i });
    expect(button).toBeDisabled();
  });

  it("enables Check Answer button when an option is selected", () => {
    render(<QuantumQuiz />);
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);
    const button = screen.getByRole("button", { name: /check answer/i });
    expect(button).not.toBeDisabled();
  });

  it("shows correct feedback when the right answer is selected", () => {
    render(<QuantumQuiz />);
    const q = QUIZ_QUESTIONS[0];
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[q.correctIndex]);
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(screen.getByText(q.explanation)).toBeInTheDocument();
  });

  it("shows incorrect feedback when a wrong answer is selected", () => {
    render(<QuantumQuiz />);
    const q = QUIZ_QUESTIONS[0];
    const wrongIndex = q.correctIndex === 0 ? 1 : 0;
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[wrongIndex]);
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Incorrect")).toBeInTheDocument();
    expect(screen.getByText(q.explanation)).toBeInTheDocument();
  });

  it("disables radio inputs after submitting answer", () => {
    render(<QuantumQuiz />);
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

    const updatedRadios = screen.getAllByRole("radio");
    for (const radio of updatedRadios) {
      expect(radio).toBeDisabled();
    }
  });

  it("shows Next Question button after answering", () => {
    render(<QuantumQuiz />);
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByRole("button", { name: /next question/i })).toBeInTheDocument();
  });

  it("advances to the next question when Next is clicked", () => {
    render(<QuantumQuiz />);
    // Answer first question
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));
    fireEvent.click(screen.getByRole("button", { name: /next question/i }));

    expect(screen.getByText(QUIZ_QUESTIONS[1].question)).toBeInTheDocument();
    expect(screen.getByText(`Question 2 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
  });

  it("shows topic badge for each question", () => {
    render(<QuantumQuiz />);
    const topicLabels: Record<string, string> = {
      rsa: "RSA",
      shor: "Shor's Algorithm",
      pqc: "Post-Quantum",
    };
    const expectedLabel = topicLabels[QUIZ_QUESTIONS[0].topic];
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it("renders score dot indicators for all questions", () => {
    const { container } = render(<QuantumQuiz />);
    // Each question gets a dot indicator (aria-hidden)
    const dots = container.querySelectorAll('[aria-hidden="true"].rounded-full.w-2');
    expect(dots.length).toBe(QUIZ_QUESTIONS.length);
  });

  it("displays See Results on the last question", () => {
    render(<QuantumQuiz />);

    // Answer all questions except last
    for (let i = 0; i < QUIZ_QUESTIONS.length - 1; i++) {
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[0]);
      fireEvent.click(screen.getByRole("button", { name: /check answer/i }));
      fireEvent.click(screen.getByRole("button", { name: /next question/i }));
    }

    // Last question
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));
    expect(screen.getByRole("button", { name: /see results/i })).toBeInTheDocument();
  });

  it("shows final score and review when quiz is complete", () => {
    render(<QuantumQuiz />);

    // Answer all questions correctly
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[QUIZ_QUESTIONS[i].correctIndex]);
      fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

      if (i < QUIZ_QUESTIONS.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: /next question/i }));
      } else {
        fireEvent.click(screen.getByRole("button", { name: /see results/i }));
      }
    }

    expect(screen.getByText("Quiz Complete")).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Score: ${QUIZ_QUESTIONS.length} out of ${QUIZ_QUESTIONS.length}`),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("shows answer review list in results", () => {
    render(<QuantumQuiz />);

    // Answer all questions (first option each time)
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[0]);
      fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

      if (i < QUIZ_QUESTIONS.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: /next question/i }));
      } else {
        fireEvent.click(screen.getByRole("button", { name: /see results/i }));
      }
    }

    const reviewList = screen.getByRole("list", { name: /answer review/i });
    const items = within(reviewList).getAllByRole("listitem");
    expect(items).toHaveLength(QUIZ_QUESTIONS.length);
  });

  it("restarts quiz when Try Again is clicked", () => {
    render(<QuantumQuiz />);

    // Complete the quiz
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[0]);
      fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

      if (i < QUIZ_QUESTIONS.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: /next question/i }));
      } else {
        fireEvent.click(screen.getByRole("button", { name: /see results/i }));
      }
    }

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(screen.getByText(QUIZ_QUESTIONS[0].question)).toBeInTheDocument();
    expect(screen.getByText(`Question 1 of ${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
  });

  it("tracks score correctly across mixed answers", () => {
    render(<QuantumQuiz />);

    // Answer first question correctly, rest incorrectly
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const q = QUIZ_QUESTIONS[i];
      const radios = screen.getAllByRole("radio");
      if (i === 0) {
        fireEvent.click(radios[q.correctIndex]);
      } else {
        const wrongIndex = q.correctIndex === 0 ? 1 : 0;
        fireEvent.click(radios[wrongIndex]);
      }
      fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

      if (i < QUIZ_QUESTIONS.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: /next question/i }));
      } else {
        fireEvent.click(screen.getByRole("button", { name: /see results/i }));
      }
    }

    expect(
      screen.getByLabelText(`Score: 1 out of ${QUIZ_QUESTIONS.length}`),
    ).toBeInTheDocument();
  });

  it("shows encouraging message for low scores", () => {
    render(<QuantumQuiz />);

    // Answer all wrong
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const q = QUIZ_QUESTIONS[i];
      const wrongIndex = q.correctIndex === 0 ? 1 : 0;
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[wrongIndex]);
      fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

      if (i < QUIZ_QUESTIONS.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: /next question/i }));
      } else {
        fireEvent.click(screen.getByRole("button", { name: /see results/i }));
      }
    }

    expect(
      screen.getByText(/keep learning/i),
    ).toBeInTheDocument();
  });

  it("shows excellent message for high scores", () => {
    render(<QuantumQuiz />);

    // Answer all correctly
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      const q = QUIZ_QUESTIONS[i];
      const radios = screen.getAllByRole("radio");
      fireEvent.click(radios[q.correctIndex]);
      fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

      if (i < QUIZ_QUESTIONS.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: /next question/i }));
      } else {
        fireEvent.click(screen.getByRole("button", { name: /see results/i }));
      }
    }

    expect(
      screen.getByText(/excellent/i),
    ).toBeInTheDocument();
  });

  it("has accessible fieldset with legend for each question", () => {
    render(<QuantumQuiz />);
    const fieldset = screen.getByRole("group");
    expect(fieldset).toBeInTheDocument();
    // Legend should be visually hidden but present
    expect(screen.getByText(/select your answer for question 1/i)).toBeInTheDocument();
  });

  it("feedback section has aria-live for screen readers", () => {
    render(<QuantumQuiz />);
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[0]);
    fireEvent.click(screen.getByRole("button", { name: /check answer/i }));

    const feedback = screen.getByRole("status");
    expect(feedback).toHaveAttribute("aria-live", "polite");
  });
});

describe("quizData", () => {
  it("has at least 5 questions", () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(5);
  });

  it("covers all three topics", () => {
    const topics = new Set(QUIZ_QUESTIONS.map((q) => q.topic));
    expect(topics.has("rsa")).toBe(true);
    expect(topics.has("shor")).toBe(true);
    expect(topics.has("pqc")).toBe(true);
  });

  it("has valid correctIndex for each question", () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    }
  });

  it("each question has unique id", () => {
    const ids = QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each question has non-empty explanation", () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });
});
