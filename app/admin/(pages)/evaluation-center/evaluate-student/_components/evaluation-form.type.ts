import type { FinalExamVerdict } from "@/types/evaluation-center/evaluation-center.type";

export interface EvaluationFormState {
  vocabularyUsageScore: string;
  grammarAccuracyScore: string;
  fluencyPronunciationScore: string;

  writingScore: string;
  speakingScore: string;

  teacherComment: string;
  teacherCommentBn: string;

  keyStrength: string;
  criticalGap: string;

  verdict: FinalExamVerdict | "";

  evaluationDurationMinutes: string;
  scoreReliabilityPercent: string;
}

export type EvaluationFormErrors = Partial<
  Record<keyof EvaluationFormState, string>
>;
