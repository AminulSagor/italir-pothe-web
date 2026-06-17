import { serviceClient } from "@/service/base/service_client";
import type {
  ChapterLessonsResponse,
  CourseSyllabusResponse,
  CourseSyllabusSummaryResponse,
  CreateCourseChapterPayload,
  ReorderSyllabusPayload,
  SyllabusChapter,
  UpdateCourseChapterPayload,
} from "@/types/course-directory/syllabus.type";

const SYLLABUS_ENDPOINTS = {
  createChapter: (courseId: string) => `/admin/courses/${courseId}/chapters`,
  syllabus: (courseId: string) => `/admin/courses/${courseId}/syllabus`,
  summary: (courseId: string) => `/admin/courses/${courseId}/summary`,
  chapterLessons: (chapterId: string) =>
    `/admin/course-chapters/${chapterId}/lessons`,
  chapterDetails: (chapterId: string) => `/admin/course-chapters/${chapterId}`,
  reorder: (courseId: string) => `/admin/courses/${courseId}/syllabus/reorder`,
} as const;

export const createCourseChapter = (
  courseId: string,
  payload: CreateCourseChapterPayload,
) =>
  serviceClient.post<SyllabusChapter>(
    SYLLABUS_ENDPOINTS.createChapter(courseId),
    payload,
  );

export const getCourseSyllabus = (courseId: string) =>
  serviceClient.get<CourseSyllabusResponse>(
    SYLLABUS_ENDPOINTS.syllabus(courseId),
  );

export const getCourseSyllabusSummary = (courseId: string) =>
  serviceClient.get<CourseSyllabusSummaryResponse>(
    SYLLABUS_ENDPOINTS.summary(courseId),
  );

export const getChapterLessons = (chapterId: string) =>
  serviceClient.get<ChapterLessonsResponse>(
    SYLLABUS_ENDPOINTS.chapterLessons(chapterId),
  );

export const updateCourseChapter = (
  chapterId: string,
  payload: UpdateCourseChapterPayload,
) =>
  serviceClient.patch<SyllabusChapter>(
    SYLLABUS_ENDPOINTS.chapterDetails(chapterId),
    payload,
  );

export const deleteCourseChapter = (chapterId: string) =>
  serviceClient.delete<{ message?: string }>(
    SYLLABUS_ENDPOINTS.chapterDetails(chapterId),
  );

export const reorderCourseSyllabus = (
  courseId: string,
  payload: ReorderSyllabusPayload,
) =>
  serviceClient.patch<CourseSyllabusResponse>(
    SYLLABUS_ENDPOINTS.reorder(courseId),
    payload,
  );
