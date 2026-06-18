export type LessonStatus = "draft" | "published" | "archived";

export interface LessonChapterSummary {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseLessonDetails {
  id: string;
  courseId: string;
  chapterId: string;
  title: string;
  slug: string;
  videoFileId?: string | null;
  theoryText?: string | null;
  theoryAudioFileId?: string | null;
  bengaliTranslation?: string | null;
  supplementaryMaterialFileId?: string | null;
  isFree: boolean;
  sortOrder: number;
  status: LessonStatus;
  createdAt?: string;
  updatedAt?: string;
  chapter?: LessonChapterSummary;
}

export interface CreateLessonPayload {
  title: string;
  slug: string;
  videoFileId?: string | null;
  theoryText?: string | null;
  theoryAudioFileId?: string | null;
  bengaliTranslation?: string | null;
  supplementaryMaterialFileId?: string | null;
  isFree: boolean;
  sortOrder: number;
}

export type UpdateLessonPayload = Partial<CreateLessonPayload>;

export interface LessonVocabulary {
  id: string;
  lessonId: string;
  italianWord: string;
  aiPronunciationFileId?: string | null;
  englishMeaning: string;
  englishExample?: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonVocabularyListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface LessonVocabularyListResponse {
  items: LessonVocabulary[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  search?: string | null;
}

export interface CreateLessonVocabularyPayload {
  italianWord: string;
  aiPronunciationFileId?: string | null;
  englishMeaning: string;
  englishExample?: string | null;
  sortOrder: number;
}

export type UpdateLessonVocabularyPayload =
  Partial<CreateLessonVocabularyPayload>;
