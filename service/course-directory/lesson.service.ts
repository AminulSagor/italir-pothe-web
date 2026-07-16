import { serviceClient } from "@/service/base/service_client";
import {
  confirmUpload,
  createSignedUploadUrl,
  UploadProgressCallback,
  uploadToSignedUrl,
} from "@/service/files/file_upload";
import type {
  CourseLessonDetails,
  CreateLessonPayload,
  CreateLessonVocabularyPayload,
  LessonVocabulary,
  LessonVocabularyListParams,
  LessonVocabularyListResponse,
  UpdateLessonPayload,
  UpdateLessonVocabularyPayload,
} from "@/types/course-directory/lesson.type";

const LESSON_ENDPOINTS = {
  createLesson: (chapterId: string) =>
    `/admin/course-chapters/${chapterId}/lessons`,
  lessonDetails: (lessonId: string) => `/admin/lessons/${lessonId}`,
  lessonVocabulary: (lessonId: string) =>
    `/admin/lessons/${lessonId}/vocabulary`,
  vocabularyDetails: (vocabId: string) => `/admin/lesson-vocabulary/${vocabId}`,
} as const;

interface VocabularyListApiResponse {
  items: LessonVocabulary[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    search?: string | null;
  };
}

const buildQueryString = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

const normalizeVocabularyList = (
  response: VocabularyListApiResponse,
): LessonVocabularyListResponse => ({
  items: response.items || [],
  page: response.meta?.page || 1,
  limit: response.meta?.limit || response.items?.length || 10,
  totalItems: response.meta?.total || response.items?.length || 0,
  totalPages: response.meta?.totalPages || 1,
  search: response.meta?.search || null,
});

export const createLesson = (chapterId: string, payload: CreateLessonPayload) =>
  serviceClient.post<CourseLessonDetails>(
    LESSON_ENDPOINTS.createLesson(chapterId),
    payload,
  );

export const getLessonDetails = (lessonId: string) =>
  serviceClient.get<CourseLessonDetails>(
    LESSON_ENDPOINTS.lessonDetails(lessonId),
  );

export const updateLesson = (lessonId: string, payload: UpdateLessonPayload) =>
  serviceClient.patch<CourseLessonDetails>(
    LESSON_ENDPOINTS.lessonDetails(lessonId),
    payload,
  );

export const deleteLesson = (lessonId: string) =>
  serviceClient.delete<{ message?: string }>(
    LESSON_ENDPOINTS.lessonDetails(lessonId),
  );

export const createLessonVocabulary = (
  lessonId: string,
  payload: CreateLessonVocabularyPayload,
) =>
  serviceClient.post<LessonVocabulary>(
    LESSON_ENDPOINTS.lessonVocabulary(lessonId),
    payload,
  );

export const getLessonVocabulary = async (
  lessonId: string,
  params: LessonVocabularyListParams = {},
): Promise<LessonVocabularyListResponse> => {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    search: params.search,
  });

  const response = await serviceClient.get<VocabularyListApiResponse>(
    `${LESSON_ENDPOINTS.lessonVocabulary(lessonId)}${queryString}`,
  );

  return normalizeVocabularyList(response);
};

export const updateLessonVocabulary = (
  vocabId: string,
  payload: UpdateLessonVocabularyPayload,
) =>
  serviceClient.patch<LessonVocabulary>(
    LESSON_ENDPOINTS.vocabularyDetails(vocabId),
    payload,
  );

export const deleteLessonVocabulary = (vocabId: string) =>
  serviceClient.delete<{ message?: string }>(
    LESSON_ENDPOINTS.vocabularyDetails(vocabId),
  );

const uploadLessonFile = async (params: {
  file: File;
  filePurpose: "lesson_video" | "lesson_audio" | "lesson_pdf";
  mediaType: "video" | "audio" | "pdf";
  onProgress?: UploadProgressCallback;
}) => {
  const mimeType =
    params.file.type ||
    (params.mediaType === "pdf"
      ? "application/pdf"
      : params.mediaType === "audio"
        ? "audio/mpeg"
        : "video/mp4");

  const signedUpload = await createSignedUploadUrl({
    originalName: params.file.name,
    mimeType,
    sizeBytes: params.file.size,
    filePurpose: params.filePurpose,
    visibility: "private",
  });

  await uploadToSignedUrl(
    signedUpload.signedUploadUrl,
    params.file,
    mimeType,
    params.onProgress,
  );

  const confirmedUpload = await confirmUpload({
    storageKey: signedUpload.storageKey,
    originalName: params.file.name,
    mimeType,
    sizeBytes: params.file.size,
    filePurpose: params.filePurpose,
    visibility: "private",
    title: params.file.name,
    mediaType: params.mediaType,
  });

  return confirmedUpload.file.id;
};

export const uploadLessonVideo = (
  file: File,
  onProgress?: UploadProgressCallback,
) =>
  uploadLessonFile({
    file,
    filePurpose: "lesson_video",
    mediaType: "video",
    onProgress,
  });

export const uploadLessonAudio = (file: File) =>
  uploadLessonFile({
    file,
    filePurpose: "lesson_audio",
    mediaType: "audio",
  });

export const uploadLessonPdf = (file: File) =>
  uploadLessonFile({
    file,
    filePurpose: "lesson_pdf",
    mediaType: "pdf",
  });
