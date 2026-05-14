export type AudioSourceType = "manual_upload" | "ai_voice";

export interface MiniQuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  completed?: boolean;
}

export interface MiniQuizAnswerOption {
  id: number;
  label: string;
  correct?: boolean;
}

export interface ListeningMiniQuizData {
  pageTitle: string;
  pageDescription: string;
  totalQuestions: number;
  questions: MiniQuizQuestion[];
  answerOptions: MiniQuizAnswerOption[];
}
