import { serviceClient } from "@/service/base/service_client";
import {
  confirmUpload,
  createSignedUploadUrl,
  uploadToSignedUrl,
} from "@/service/files/file_upload";
import type {
  CreateQuizPayload,
  Quiz,
  QuizQuestion,
  QuizQuestionPayload,
  UpdateQuizPayload,
} from "@/types/course-directory/quiz.type";

const QUIZ_ENDPOINTS = {
  lessonQuizzes: (lessonId: string) => `/admin/lessons/${lessonId}/quizzes`,
  quiz: (quizId: string) => `/admin/quizzes/${quizId}`,
  publishQuiz: (quizId: string) => `/admin/quizzes/${quizId}/publish`,
  quizQuestions: (quizId: string) => `/admin/quizzes/${quizId}/questions`,
  quizQuestion: (questionId: string) => `/admin/quiz-questions/${questionId}`,
} as const;

export const getQuizzesByLesson = (lessonId: string) =>
  serviceClient.get<Quiz[]>(QUIZ_ENDPOINTS.lessonQuizzes(lessonId));

export const createQuiz = (lessonId: string, payload: CreateQuizPayload) =>
  serviceClient.post<Quiz>(QUIZ_ENDPOINTS.lessonQuizzes(lessonId), payload);

export const updateQuiz = (quizId: string, payload: UpdateQuizPayload) =>
  serviceClient.patch<Quiz>(QUIZ_ENDPOINTS.quiz(quizId), payload);

export const publishQuiz = (quizId: string) =>
  serviceClient.patch<Quiz>(QUIZ_ENDPOINTS.publishQuiz(quizId));

export const createQuizQuestion = (
  quizId: string,
  payload: QuizQuestionPayload,
) =>
  serviceClient.post<QuizQuestion>(
    QUIZ_ENDPOINTS.quizQuestions(quizId),
    payload,
  );

export const getQuizQuestionDetails = (questionId: string) =>
  serviceClient.get<QuizQuestion>(QUIZ_ENDPOINTS.quizQuestion(questionId));

export const updateQuizQuestion = (
  questionId: string,
  payload: QuizQuestionPayload,
) =>
  serviceClient.patch<QuizQuestion>(
    QUIZ_ENDPOINTS.quizQuestion(questionId),
    payload,
  );

export const deleteQuizQuestion = (questionId: string) =>
  serviceClient.delete<{ message: string }>(
    QUIZ_ENDPOINTS.quizQuestion(questionId),
  );

export const uploadQuizAudio = async (file: File) => {
  const mimeType = file.type || "audio/mpeg";

  const signedUpload = await createSignedUploadUrl({
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "quiz_audio",
    visibility: "private",
  });

  await uploadToSignedUrl(signedUpload.signedUploadUrl, file, mimeType);

  const confirmedUpload = await confirmUpload({
    storageKey: signedUpload.storageKey,
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "quiz_audio",
    visibility: "private",
    title: file.name,
    mediaType: "audio",
  });

  return confirmedUpload.file.id;
};

export const uploadQuizImage = async (file: File) => {
  const mimeType = file.type || "image/jpeg";

  const signedUpload = await createSignedUploadUrl({
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "quiz_image",
    visibility: "private",
  });

  await uploadToSignedUrl(signedUpload.signedUploadUrl, file, mimeType);

  const confirmedUpload = await confirmUpload({
    storageKey: signedUpload.storageKey,
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "quiz_image",
    visibility: "private",
    title: file.name,
    mediaType: "image",
  });

  return confirmedUpload.file.id;
};
