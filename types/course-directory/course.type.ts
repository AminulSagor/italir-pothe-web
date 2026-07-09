export type CourseStatus = "draft" | "published" | "archived";

export interface CourseChapter {
  id: string;
  courseId: string | null;
  title: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseLesson {
  id: string;
  courseId: string | null;
  chapterId?: string | null;
  title: string;
  slug: string;
  videoFileId?: string | null;
  theoryText?: string | null;
  theoryAudioFileId?: string | null;
  bengaliTranslation?: string | null;
  supplementaryMaterialFileId?: string | null;
  isFree: boolean;
  sortOrder: number;
  status: CourseStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseSetupProgress {
  percentage: number;
  steps: {
    courseDetails: boolean;
    pricingAccess: boolean;
    finalExamination: boolean;
    syllabusBuilder: boolean;
  };
  counts: {
    chapters: number;
    lessons: number;
  };
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description?: string | null;
  slug: string;
  isFree: boolean;
  price?: string | number | null;
  couponCode?: string | null;
  finalExamTemplateId?: string | null;
  status: CourseStatus;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  chapters?: CourseChapter[];
  lessons?: CourseLesson[];
  setupProgress?: CourseSetupProgress;
  totalStudentEnrollments?: number;
}

export interface CourseDirectorySummary {
  totalCourses: number;
  activeStudents: number;
  averageCompletionRate: number;
}

export interface CourseListParams {
  page?: number;
  limit?: number;
  search?: string;
  statuses?: CourseStatus | "";
}

export interface CourseListResponse {
  items: Course[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateCoursePayload {
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  isFree: boolean;
  price: number | null;
  couponCode: string | null;
  status: CourseStatus;
}

export type UpdateCoursePayload = Partial<CreateCoursePayload>;

export interface CourseDeleteSafety {
  courseId: string;
  status: CourseStatus;
  canDeletePermanently: boolean;
  requiresArchiveFirst?: boolean;

  dependencies?: {
    hasDependencies?: boolean;
    hasHistoricalDependencies?: boolean;
    blocksPermanentDelete?: boolean;
    chapterCount?: number;
    lessonCount?: number;
    studentEnrollmentCount?: number;
    purchaseHistoryCount?: number;
    revenueHistoryCount?: number;
  };

  recordsToBeDetached?: {
    chapterCount: number;
    lessonCount: number;
    providerProductCount: number;
    enrollmentCount: number;
    purchaseOrderCount: number;
    certificateCount: number;
    examTemplateCount: number;
    examAttemptCount: number;
    legacyEnrollmentCount: number;
  };

  recommendation: string;
}

export interface PermanentlyDeleteCourseResponse {
  message: string;
  id: string;
  preservedDependencies?: CourseDeleteSafety["dependencies"];
  detachedRecords?: CourseDeleteSafety["recordsToBeDetached"];
}
