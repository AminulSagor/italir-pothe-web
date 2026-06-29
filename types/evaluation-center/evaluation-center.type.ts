export type FinalExamAttemptStatus =
  | "in_progress"
  | "submitted"
  | "under_review"
  | "evaluated"
  | "certificate_issued"
  | "retake_requested"
  | "cancelled";

export type FinalExamVerdict = "passed" | "retake_required" | "failed";

export type FinalExamSectionType =
  | "core_quiz"
  | "listening_lab"
  | "writing_task"
  | "speaking_lab";

export type FinalExamAnswerType =
  | "single_option"
  | "true_false"
  | "text"
  | "audio"
  | "sequence"
  | "matching";

export type EvaluationQueueSortBy =
  | "timeInQueue"
  | "submissionDate"
  | "studentName"
  | "status";

export type EvaluationQueueSortOrder = "ASC" | "DESC";

export type EvaluationQueueActionType =
  | "grade_now"
  | "view_result"
  | "review_sent";

export interface EvaluationQueueQuery {
  status?: FinalExamAttemptStatus;
  search?: string;
  level?: string;
  courseId?: string;
  examTemplateId?: string;
  sortBy?: EvaluationQueueSortBy;
  sortOrder?: EvaluationQueueSortOrder;
  page?: number;
  limit?: number;
}

export interface EvaluationQueueStats {
  pending: number;
  gradedToday: number;
  gradedTodayGoal: number;
  averageWaitHours: number;
  targetWaitHours: number;
  isWithinTarget: boolean;
}

export interface EvaluationQueueItem {
  attemptId: string;
  referenceCode: string;

  student: {
    id: string;
    fullName: string;
    email: string | null;
    avatarUrl: string | null;
    initials: string;
    isDeleted: boolean;
  };

  course: {
    id: string;
    title: string;
  };

  exam: {
    id: string;
    title: string;
  };

  level: string | null;
  submissionDate: string | null;
  timeInQueueSeconds: number;
  timeInQueueLabel: string;
  status: FinalExamAttemptStatus;
  statusLabel: string;

  action: {
    type: EvaluationQueueActionType;
    label: string;
    enabled: boolean;
  };
}

export interface EvaluationQueueMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  from: number;
  to: number;
}

export interface EvaluationQueueResponse {
  stats: EvaluationQueueStats;
  items: EvaluationQueueItem[];
  meta: EvaluationQueueMeta;

  appliedFilters: {
    search: string | null;
    level: string | null;
    status: FinalExamAttemptStatus | null;
    courseId: string | null;
    examTemplateId: string | null;
    sortBy: EvaluationQueueSortBy;
    sortOrder: EvaluationQueueSortOrder;
  };
}

export interface FinalExamEvaluationUser {
  id?: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
}

export interface FinalExamEvaluationCourse {
  id?: string;
  title: string;
}

export interface FinalExamEvaluationTemplate {
  id?: string;
  title: string;
  totalDurationMinutes: number;
  overallPassingPercent?: number;
}

export interface FinalExamEvaluationSection {
  id: string;
  sectionType: FinalExamSectionType;
  title: string;
  subtitle: string | null;
  reviewMode: "auto" | "manual";
  passingPercent: number;
  timeLimitSeconds: number | null;
}

export interface FinalExamEvaluationQuestion {
  id: string;
  questionFormat: string;
  points: number;
  title: string | null;
  subtitle: string | null;
  prompt: string | null;
  promptBn: string | null;
  audioFileId: string | null;
  imageFileId: string | null;
}

export interface FinalExamEvaluationAnswerItem {
  id: string;
  selectedItemId: string | null;
  matchedWithItemId: string | null;
  textValue: string | null;
  sortOrder: number;
}

export interface FinalExamEvaluationAnswer {
  id: string;
  attemptId: string;
  sectionId: string;
  questionId: string;
  answerType: FinalExamAnswerType;
  selectedOptionId: string | null;
  textAnswer: string | null;
  audioFileId: string | null;
  isCorrect: boolean | null;
  score: string;
  durationSeconds: number;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  section: FinalExamEvaluationSection;
  question: FinalExamEvaluationQuestion;
  items: FinalExamEvaluationAnswerItem[];
}

export interface FinalExamReviewMetric {
  id?: string;
  reviewId?: string;
  evaluationDurationMinutes: number;
  scoreReliabilityPercent: number;
  gradedAt: string;
}

export interface FinalExamReview {
  id: string;
  attemptId: string;
  reviewedById: string;
  vocabularyUsageScore: number;
  grammarAccuracyScore: number;
  fluencyPronunciationScore: number;
  writingScore: string;
  speakingScore: string;
  finalAverageScore: string;
  teacherComment: string | null;
  teacherCommentBn: string | null;
  keyStrength: string | null;
  criticalGap: string | null;
  verdict: FinalExamVerdict;
  createdAt: string;
  updatedAt: string;
  metric: FinalExamReviewMetric | null;
}

export interface FinalExamEvaluationDetails {
  id: string;
  userId: string;
  courseId: string;
  examTemplateId: string;
  referenceCode: string;
  status: FinalExamAttemptStatus;
  startedAt: string;
  submittedAt: string | null;
  totalDurationSeconds: number;
  createdAt: string;
  updatedAt: string;
  user: FinalExamEvaluationUser | null;
  course: FinalExamEvaluationCourse;
  examTemplate: FinalExamEvaluationTemplate;
  answers: FinalExamEvaluationAnswer[];
  review: FinalExamReview | null;
}

export interface GiveFinalVerdictPayload {
  vocabularyUsageScore: number;
  grammarAccuracyScore: number;
  fluencyPronunciationScore: number;
  writingScore?: number;
  speakingScore?: number;
  finalAverageScore?: number;
  teacherComment: string;
  teacherCommentBn?: string;
  keyStrength?: string;
  criticalGap?: string;
  verdict: FinalExamVerdict;
  evaluationDurationMinutes?: number;
  scoreReliabilityPercent?: number;
  issueCertificate?: boolean;
  pdfFileId?: string;
  notifyStudent?: boolean;
}

export interface RequestFinalExamRetakePayload {
  keyStrength?: string;
  criticalGap: string;
  teacherComment: string;
  teacherCommentBn?: string;
  notifyStudent?: boolean;
}

export interface IssueEvaluationCertificatePayload {
  pdfFileId?: string;
  notifyStudent?: boolean;
}

export interface ReopenEvaluationPayload {
  reason?: string;
}

export type CertificateStatus = "issued" | "revoked";

export interface EvaluationCertificateSummary {
  id: string;
  certificateNumber: string;
  status: CertificateStatus;
  issuedAt: string | null;
  revokedAt: string | null;
  verificationUrl: string | null;
  pdfFileId: string | null;
  pdfUrl: string | null;
}

export interface CertificationCenterResponse {
  attemptId: string;
  referenceCode: string;

  student: {
    id: string;
    fullName: string;
    email: string | null;
    avatarUrl: string | null;
    isDeleted: boolean;
  };

  course: {
    id: string;
    title: string;
    level: string | null;
  };

  exam: {
    id: string;
    title: string;
  };

  result: {
    finalScore: number;
    passed: boolean;
    label: string;
    evaluationTitle: string;
    verdict: FinalExamVerdict;
    teacherComment: string | null;
    teacherCommentBn: string | null;
    keyStrength: string | null;
    criticalGap: string | null;
  };

  evaluationMetric: {
    evaluationDurationMinutes: number;
    scoreReliabilityPercent: number;
    gradedAt: string | null;
  };

  certificate: EvaluationCertificateSummary | null;

  actions: {
    canIssueCertificate: boolean;
    canRequestRetake: boolean;
    canReEvaluate: boolean;
    issueCertificateEndpoint: string;
    requestRetakeEndpoint: string;
    reEvaluateEndpoint: string;
  };
}

export interface IssueEvaluationCertificateResponse {
  message: string;
  notificationRequested: boolean;
  certificate: AdminCertificate;
  attempt: FinalExamEvaluationDetails;
}

export interface RequestFinalExamRetakeResponse {
  message: string;
  notificationRequested: boolean;
  notificationSent: boolean;
  attempt: FinalExamEvaluationDetails;
}

export interface ReopenEvaluationResponse {
  changed: boolean;
  message: string;
  reason: string | null;
  attempt: FinalExamEvaluationDetails;
}

export interface AdminCertificateFile {
  id?: string;
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
}

export interface AdminCertificate {
  id: string;
  userId: string;
  courseId: string;
  examAttemptId: string;
  certificateNumber: string;
  pdfFileId: string | null;
  recipientNameSnapshot: string | null;
  courseTitleSnapshot: string | null;
  courseLevelSnapshot: string | null;
  scorePercentSnapshot: string | null;
  verificationUrl: string | null;
  issuedByAdminId: string | null;
  revocationReason: string | null;
  status: CertificateStatus;
  issuedAt: string;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: FinalExamEvaluationUser | null;
  course?: FinalExamEvaluationCourse;
  examAttempt?: FinalExamEvaluationDetails;
  pdfFile?: AdminCertificateFile | null;
}

export interface AdminCertificateQuery {
  status?: CertificateStatus;
  userId?: string;
  courseId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminCertificateListResponse {
  items: AdminCertificate[];

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IssueAdminCertificatePayload {
  examAttemptId: string;
  notifyStudent?: boolean;
}

export interface IssueAdminCertificateResponse {
  message: string;
  notificationRequested: boolean;
  notificationSent: boolean;
  certificate: AdminCertificate;
}

export interface RevokeCertificatePayload {
  reason?: string;
}

export interface VerifyCertificateResponse {
  isValid: boolean;

  reason: "not_found" | "revoked" | null;

  certificate: {
    id: string;
    certificateNumber: string;
    recipientName: string;
    courseTitle: string;
    courseLevel: string | null;
    scorePercent: number | null;
    status: CertificateStatus;
    issuedAt: string;
    revokedAt: string | null;
    revocationReason: string | null;
    verificationUrl: string | null;
    pdfUrl: string | null;
  } | null;
}
