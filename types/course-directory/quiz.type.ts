export type QuizStatus = "draft" | "published" | "archived";

export type QuizQuestionStatus = "draft" | "active" | "published" | "archived";

export type QuizQuestionType =
  | "listening_mcq"
  | "word_translation"
  | "sentence_translation"
  | "true_false"
  | "fill_in_the_blanks"
  | "listen_and_assemble"
  | "match_the_pair"
  | "writing_word_translation"
  | "identify_image";

export interface QuizQuestionOption {
  id?: string;
  questionId?: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestionPair {
  id?: string;
  questionId?: string;
  leftText: string;
  rightText: string;
  leftLabel?: string | null;
  rightLabel?: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestionSequenceItem {
  id?: string;
  questionId?: string;
  wordText: string;
  isRequired: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestionAcceptedAnswer {
  id?: string;
  questionId?: string;
  answerText: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionType: QuizQuestionType;
  title: string;
  promptText: string | null;
  helperText: string | null;
  translationText: string | null;
  mediaFileId: string | null;
  generatedAudioText: string | null;
  correctBoolean?: boolean | null;
  points: number;
  sortOrder: number;
  status: QuizQuestionStatus;
  createdAt: string;
  updatedAt: string;
  options?: QuizQuestionOption[];
  pairs?: QuizQuestionPair[];
  sequenceItems?: QuizQuestionSequenceItem[];
  acceptedAnswers?: QuizQuestionAcceptedAnswer[];
}

export interface Quiz {
  id: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
  title: string;
  description: string | null;
  totalQuestions: number;
  sortOrder: number;
  status: QuizStatus;
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
}

export interface CreateQuizPayload {
  title?: string;
  description?: string | null;
  sortOrder?: number;
  status?: QuizStatus;
}

export interface UpdateQuizPayload extends CreateQuizPayload {}

export interface QuizQuestionPayload {
  questionType?: QuizQuestionType;
  title?: string;
  promptText?: string | null;
  helperText?: string | null;
  translationText?: string | null;
  mediaFileId?: string | null;
  generatedAudioText?: string | null;
  correctBoolean?: boolean | null;
  points?: number;
  sortOrder?: number;
  status?: QuizQuestionStatus;
  options?: QuizQuestionOption[];
  pairs?: QuizQuestionPair[];
  sequenceItems?: QuizQuestionSequenceItem[];
  acceptedAnswers?: QuizQuestionAcceptedAnswer[];
}
