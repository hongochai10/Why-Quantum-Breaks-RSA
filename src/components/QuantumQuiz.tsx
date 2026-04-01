"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { QUIZ_QUESTIONS, type QuizQuestion } from "@/lib/quizData";

const TOPIC_LABELS: Record<QuizQuestion["topic"], string> = {
  rsa: "RSA",
  shor: "Shor's Algorithm",
  pqc: "Post-Quantum",
};

const TOPIC_COLORS: Record<QuizQuestion["topic"], string> = {
  rsa: "text-accent-red",
  shor: "text-accent-purple",
  pqc: "text-accent-green",
};

export default function QuantumQuiz() {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const question = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const isCorrect = selectedOption === question?.correctIndex;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (showResult) return;
      setSelectedOption(optionIndex);
    },
    [showResult],
  );

  const handleSubmit = useCallback(() => {
    if (selectedOption === null) return;
    setShowResult(true);
    if (selectedOption === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
    setAnswers((prev) => [...prev, selectedOption]);
  }, [selectedOption, question]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setShowResult(false);
  }, [currentIndex, totalQuestions]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }, []);

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return index === selectedOption
        ? "border-accent-purple bg-accent-purple/10"
        : "border-border-dark hover:border-border-hover";
    }
    if (index === question.correctIndex) {
      return "border-accent-green bg-accent-green/10";
    }
    if (index === selectedOption && index !== question.correctIndex) {
      return "border-accent-red bg-accent-red/10";
    }
    return "border-border-dark opacity-50";
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) return null;
    if (index === question.correctIndex) return "\u2713";
    if (index === selectedOption && index !== question.correctIndex) return "\u2717";
    return null;
  };

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.25 },
      };

  if (finished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <section aria-label="Quiz results" className="space-y-4">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-bold text-white">Quiz Complete</h3>
          <div
            className="text-4xl font-bold"
            aria-label={`Score: ${score} out of ${totalQuestions}`}
          >
            <span
              className={
                percentage >= 75
                  ? "text-accent-green"
                  : percentage >= 50
                    ? "text-accent-yellow"
                    : "text-accent-red"
              }
            >
              {score}
            </span>
            <span className="text-gray-500">/{totalQuestions}</span>
          </div>
          <p className="text-sm text-gray-400">
            {percentage >= 75
              ? "Excellent! You have strong knowledge of quantum cryptography."
              : percentage >= 50
                ? "Good effort! Review the topics you missed to strengthen your understanding."
                : "Keep learning! The visualizations above can help build your understanding."}
          </p>
        </div>

        {/* Answer review */}
        <div className="space-y-2" role="list" aria-label="Answer review">
          {QUIZ_QUESTIONS.map((q, i) => {
            const userAnswer = answers[i];
            const correct = userAnswer === q.correctIndex;
            return (
              <div
                key={q.id}
                role="listitem"
                className={`flex items-start gap-2 text-xs p-2 rounded border ${
                  correct
                    ? "border-accent-green/30 bg-accent-green/5"
                    : "border-accent-red/30 bg-accent-red/5"
                }`}
              >
                <span
                  className={`shrink-0 mt-0.5 font-mono ${correct ? "text-accent-green" : "text-accent-red"}`}
                  aria-hidden="true"
                >
                  {correct ? "\u2713" : "\u2717"}
                </span>
                <span className="text-gray-300">
                  Q{i + 1}: {q.question.slice(0, 60)}
                  {q.question.length > 60 ? "..." : ""}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-panel-bg"
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section aria-label="Quantum cryptography quiz" className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${TOPIC_COLORS[question.topic]} bg-surface-dark`}
        >
          {TOPIC_LABELS[question.topic]}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 rounded-full bg-surface-dark overflow-hidden"
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-label={`Question ${currentIndex + 1} of ${totalQuestions}`}
      >
        <motion.div
          className="h-full bg-accent-purple rounded-full"
          initial={false}
          animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={question.id} {...motionProps} className="space-y-3">
          {/* Question */}
          <h3 className="text-sm font-medium text-white leading-relaxed">
            {question.question}
          </h3>

          {/* Options */}
          <fieldset>
            <legend className="sr-only">
              Select your answer for question {currentIndex + 1}
            </legend>
            <div className="space-y-2" role="radiogroup">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-sm ${getOptionStyle(index)} ${showResult ? "cursor-default" : ""}`}
                >
                  <input
                    type="radio"
                    name={`quiz-q${question.id}`}
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => handleSelect(index)}
                    disabled={showResult}
                    className="sr-only"
                    aria-label={option}
                  />
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                      selectedOption === index && !showResult
                        ? "border-accent-purple bg-accent-purple text-white"
                        : showResult && index === question.correctIndex
                          ? "border-accent-green bg-accent-green text-white"
                          : showResult &&
                              index === selectedOption &&
                              index !== question.correctIndex
                            ? "border-accent-red bg-accent-red text-white"
                            : "border-gray-600"
                    }`}
                    aria-hidden="true"
                  >
                    {getOptionIcon(index) ??
                      (selectedOption === index && !showResult ? "\u2022" : "")}
                  </span>
                  <span className="text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Feedback */}
          {showResult && (
            <motion.div
              {...(shouldReduceMotion
                ? {}
                : {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    transition: { duration: 0.2 },
                  })}
              className={`p-3 rounded-lg border text-xs leading-relaxed ${
                isCorrect
                  ? "border-accent-green/30 bg-accent-green/5 text-gray-300"
                  : "border-accent-red/30 bg-accent-red/5 text-gray-300"
              }`}
              role="status"
              aria-live="polite"
            >
              <p className="font-medium mb-1">
                {isCorrect ? (
                  <span className="text-accent-green">Correct!</span>
                ) : (
                  <span className="text-accent-red">Incorrect</span>
                )}
              </p>
              <p>{question.explanation}</p>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="flex-1 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-panel-bg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-purple/80"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-panel-bg"
              >
                {currentIndex + 1 >= totalQuestions
                  ? "See Results"
                  : "Next Question"}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Score tracker */}
      <div className="flex items-center justify-center gap-1 pt-1">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < answers.length
                ? answers[i] === QUIZ_QUESTIONS[i].correctIndex
                  ? "bg-accent-green"
                  : "bg-accent-red"
                : i === currentIndex
                  ? "bg-accent-purple"
                  : "bg-surface-dark"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
