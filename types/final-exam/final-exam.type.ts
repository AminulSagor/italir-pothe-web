import type {
  QuizQuestionAcceptedAnswer,
  QuizQuestionOption,
  QuizQuestionPair,
  QuizQuestionSequenceItem,
  QuizQuestionType,
} from "@/types/course-directory/quiz.type";

export type FinalExamStatus = "draft" | "published" | "archived";

export type FinalExamQuestionStatus =
  | "draft"
  | "active"
  | "published"
  | "archived";

export type FinalExamSectionType =
  | "core_quiz"
  | "listening_lab"
  | "writing_task"
  | "speaking_lab";

export type FinalExamReviewMode = "auto" | "manual";

export interface FinalExamSetupProgressSection {
  sectionId?: string;
  currentQuestions: number;
  requiredQuestions: number;
  ready: boolean;
}

export interface FinalExamSetupProgress {
  percentage: number;
  complete: number;
  total: number;
  checklist: {
    courseLinked: boolean;
    globalRulesConfigured: boolean;
    coreQuizReady: boolean;
    listeningLabReady: boolean;
    writingTaskReady: boolean;
    speakingLabReady: boolean;
  };
  sections: {
    coreQuiz: FinalExamSetupProgressSection;
    listeningLab: FinalExamSetupProgressSection;
    writingTask: FinalExamSetupProgressSection;
    speakingLab: FinalExamSetupProgressSection;
  };
}

export interface FinalExamSectionRule {
  id?: string;
  sectionId?: string;
  playbackLocked?: boolean | null;
  accentBarEnabled?: boolean | null;
  minWords?: number | null;
  maxWords?: number | null;
  maxDurationSeconds?: number | null;
  rerecordPolicy?: string | null;
}

export interface FinalExamQuestion {
  id: string;
  sectionId: string;
  questionType: QuizQuestionType | "writing_task" | "speaking_task";
  questionFormat?: string;
  title: string;
  promptText: string | null;
  helperText: string | null;
  translationText: string | null;
  mediaFileId: string | null;
  audioFileId?: string | null;
  imageFileId?: string | null;
  generatedAudioText: string | null;
  correctBoolean: boolean | null;
  audioSourceType?: string | null;
  points?: number;
  sortOrder: number;
  status: FinalExamQuestionStatus;
  options: QuizQuestionOption[];
  pairs: QuizQuestionPair[];
  sequenceItems: QuizQuestionSequenceItem[];
  acceptedAnswers: QuizQuestionAcceptedAnswer[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FinalExamSection {
  id: string;
  examTemplateId: string;
  sectionType: FinalExamSectionType;
  title: string;
  subtitle: string;
  reviewMode: FinalExamReviewMode;
  questionCount: number;
  targetQuestionCount: number;
  passingPercent: number;
  timeLimitSeconds: number | null;
  sortOrder: number;
  status: FinalExamStatus | "active";
  rule: FinalExamSectionRule | null;
  questions: FinalExamQuestion[];
}

export interface FinalExam {
  id: string;
  courseId: string | null;
  courseTitle?: string | null;
  linkedCourseTitle?: string | null;
  title: string;
  description: string;
  status: FinalExamStatus;
  overallPassingPercent: number;
  totalDurationMinutes: number;
  unlockCompletionPercent: number;
  plagiarismMonitorEnabled: boolean;
  copyPasteMonitorEnabled: boolean;
  resultNotice: string;
  resultNoticeBn: string;
  publishedAt: string | null;
  archivedAt: string | null;
  setupProgress: FinalExamSetupProgress;
  sections: FinalExamSection[];
  createdAt: string;
  updatedAt: string;
}

export interface FinalExamListItem {
  id: string;
  title: string;
  status: FinalExamStatus;
  courseId: string | null;
  linkedCourseTitle?: string | null;
  courseTitle?: string | null;
  isLinkedToCourse: boolean;
  totalQuestions: number;
  totalDurationMinutes: number;
  overallPassingPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinalExamListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FinalExamListResponse {
  items: FinalExamListItem[];
  meta: FinalExamListMeta;
}

export interface FinalExamListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: FinalExamStatus;
  courseId?: string;
  linkedOnly?: boolean;
}

export interface FinalExamPayload {
  courseId?: string | null;
  title: string;
  description: string;
  overallPassingPercent: number;
  totalDurationMinutes: number;
  unlockCompletionPercent: number;
  plagiarismMonitorEnabled: boolean;
  copyPasteMonitorEnabled: boolean;
  resultNotice: string;
  resultNoticeBn: string;
}

export interface FinalExamQuestionPayload {
  questionType: QuizQuestionType;
  title: string;
  promptText?: string | null;
  helperText?: string | null;
  translationText?: string | null;
  mediaFileId?: string | null;
  generatedAudioText?: string | null;
  correctBoolean?: boolean | null;
  audioSourceType?: string | null;
  points?: number;
  sortOrder: number;
  status: FinalExamQuestionStatus;
  options?: QuizQuestionOption[];
  pairs?: QuizQuestionPair[];
  sequenceItems?: QuizQuestionSequenceItem[];
  acceptedAnswers?: QuizQuestionAcceptedAnswer[];
}

export interface FinalExamListeningQuestionPayload {
  questionTitle: string;
  questionPrompt: string;
  audioFileId?: string | null;
  generatedAudioText?: string | null;
  audioSourceType?: string | null;
  points?: number;
  sortOrder?: number;
  options: QuizQuestionOption[];
}

export interface FinalExamWritingTaskPayload {
  title: string;
  titleBn: string;
  instruction: string;
  minWords: number;
  maxWords: number;
  italianAccentBarEnabled: boolean;
}

export interface FinalExamSpeakingTaskPayload {
  title: string;
  titleBn: string;
  instruction: string;
  maxDurationSeconds: number;
  unlimitedRerecords: boolean;
}

export interface FinalExamDeleteResponse {
  message: string;
  id: string;
}

export interface FinalExamLinkableCourse {
  id: string;
  title: string;
  subtitle?: string | null;
  status?: string | null;
  levelTitle?: string | null;
  categoryTitle?: string | null;
  finalExamId?: string | null;
  hasFinalExam?: boolean;
  archivedAt?: string | null;
}

export interface LinkFinalExamCoursePayload {
  courseId: string;
}
