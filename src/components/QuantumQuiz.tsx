"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { QUIZ_QUESTION_META, type QuizTopic } from "@/lib/quizData";
import { useDictionary } from "./DictionaryProvider";
import { interpolate } from "@/lib/i18n";

const TOPIC_COLORS: Record<QuizTopic, string> = {
  rsa: "text-accent-red",
  shor: "text-accent-purple",
  pqc: "text-accent-green",
};

export default function QuantumQuiz() {
  const shouldReduceMotion = useReducedMotion();
  const { dict } = useDictionary();
  const t = dict.quiz;
  const questions = t.questions;
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const meta = QUIZ_QUESTION_META[currentIndex];
  const question = questions[currentIndex];
  const isCorrect = selectedOption === meta?.correctIndex;

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
    if (selectedOption === meta.correctIndex) {
      setScore((prev) => prev + 1);
    }
    setAnswers((prev) => [...prev, selectedOption]);
  }, [selectedOption, meta]);

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
    if (index === meta.correctIndex) {
      return "border-accent-green bg-accent-green/10";
    }
    if (index === selectedOption && index !== meta.correctIndex) {
      return "border-accent-red bg-accent-red/10";
    }
    return "border-border-dark opacity-50";
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) return null;
    if (index === meta.correctIndex) return "\u2713";
    if (index === selectedOption && index !== meta.correctIndex) return "\u2717";
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
      <section aria-label={t.resultsAriaLabel} className="space-y-4">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-bold text-white">{t.quizComplete}</h3>
          <div
            className="text-4xl font-bold"
            aria-label={interpolate(t.scoreAriaLabel, { score, total: totalQuestions })}
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
              ? t.excellentMessage
              : percentage >= 50
                ? t.goodMessage
                : t.keepLearningMessage}
          </p>
        </div>

        <div className="space-y-2" role="list" aria-label={t.answerReview}>
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const correct = userAnswer === QUIZ_QUESTION_META[i].correctIndex;
            return (
              <div
                key={QUIZ_QUESTION_META[i].id}
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
          {t.tryAgain}
        </button>
      </section>
    );
  }

  return (
    <section aria-label={t.quizAriaLabel} className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {interpolate(t.questionOf, { current: currentIndex + 1, total: totalQuestions })}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${TOPIC_COLORS[meta.topic]} bg-surface-dark`}
        >
          {t.topicLabels[meta.topic]}
        </span>
      </div>

      <div
        className="h-1 rounded-full bg-surface-dark overflow-hidden"
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-label={interpolate(t.questionOf, { current: currentIndex + 1, total: totalQuestions })}
      >
        <motion.div
          className="h-full bg-accent-purple rounded-full"
          initial={false}
          animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={meta.id} {...motionProps} className="space-y-3">
          <h3 className="text-sm font-medium text-white leading-relaxed">
            {question.question}
          </h3>

          <fieldset>
            <legend className="sr-only">
              {interpolate(t.selectAnswer, { n: currentIndex + 1 })}
            </legend>
            <div className="space-y-2" role="radiogroup">
              {question.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-sm ${getOptionStyle(index)} ${showResult ? "cursor-default" : ""}`}
                >
                  <input
                    type="radio"
                    name={`quiz-q${meta.id}`}
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
                        : showResult && index === meta.correctIndex
                          ? "border-accent-green bg-accent-green text-white"
                          : showResult &&
                              index === selectedOption &&
                              index !== meta.correctIndex
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
                  <span className="text-accent-green">{t.correct}</span>
                ) : (
                  <span className="text-accent-red">{t.incorrect}</span>
                )}
              </p>
              <p>{question.explanation}</p>
            </motion.div>
          )}

          <div className="flex gap-2">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="flex-1 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-panel-bg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-purple/80"
              >
                {t.checkAnswer}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-panel-bg"
              >
                {currentIndex + 1 >= totalQuestions
                  ? t.seeResults
                  : t.nextQuestion}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1 pt-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < answers.length
                ? answers[i] === QUIZ_QUESTION_META[i].correctIndex
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
