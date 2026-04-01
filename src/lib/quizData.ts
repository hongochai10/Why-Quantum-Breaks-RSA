export type QuizTopic = "rsa" | "shor" | "pqc";

export interface QuizQuestionMeta {
  id: number;
  correctIndex: number;
  topic: QuizTopic;
}

export const QUIZ_QUESTION_META: QuizQuestionMeta[] = [
  { id: 1, correctIndex: 1, topic: "rsa" },
  { id: 2, correctIndex: 2, topic: "shor" },
  { id: 3, correctIndex: 2, topic: "shor" },
  { id: 4, correctIndex: 1, topic: "pqc" },
  { id: 5, correctIndex: 1, topic: "pqc" },
  { id: 6, correctIndex: 1, topic: "rsa" },
  { id: 7, correctIndex: 1, topic: "shor" },
  { id: 8, correctIndex: 1, topic: "pqc" },
];
