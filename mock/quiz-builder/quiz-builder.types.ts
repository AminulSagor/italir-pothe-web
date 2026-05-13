export type QuizQuestionType =
  | "listening"
  | "word_translation"
  | "sentence_translation"
  | "true_false"
  | "fill_blanks"
  | "listen_assemble"
  | "match_pair"
  | "writing_word"
  | "identify_image";

export interface QuizFlowQuestionMock {
  id: number;
  title: string;
  type: string;
  questionType: QuizQuestionType;
}

export interface QuizAnswerOptionMock {
  id: number;
  label: string;
  isCorrect: boolean;
}

export interface QuizBuilderMock {
  lessonTitle: string;
  questionTitle: string;
  flowQuestions: QuizFlowQuestionMock[];
  answerOptions: QuizAnswerOptionMock[];
}

export type QuizAudioTab = "generate" | "upload";
