import { serviceClient } from "@/service/base/service_client";
import type {
  Course,
  CourseDeleteSafety,
  CourseListParams,
  CourseListResponse,
  CreateCoursePayload,
  UpdateCoursePayload,
} from "@/types/course-directory/course.type";

const COURSE_ENDPOINTS = {
  courses: "/admin/courses",
  details: (courseId: string) => `/admin/courses/${courseId}`,
  publish: (courseId: string) => `/admin/courses/${courseId}/publish`,
  restore: (courseId: string) => `/admin/courses/${courseId}/restore`,
  permanentDeleteCheck: (courseId: string) =>
    `/admin/courses/${courseId}/permanent-delete-check`,
  permanentDelete: (courseId: string) => `/admin/courses/${courseId}/permanent`,
} as const;

interface CourseListApiResponse {
  items: Course[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

const buildQueryString = (params: CourseListParams) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

const normalizeCourseListResponse = (
  response: CourseListApiResponse,
): CourseListResponse => ({
  items: response.items,
  page: response.meta?.page || 1,
  limit: response.meta?.limit || response.items.length,
  totalItems: response.meta?.total || response.items.length,
  totalPages: response.meta?.totalPages || 1,
});

export const getCourses = async (
  params: CourseListParams = {},
): Promise<CourseListResponse> => {
  const response = await serviceClient.get<CourseListApiResponse>(
    `${COURSE_ENDPOINTS.courses}${buildQueryString(params)}`,
  );

  return normalizeCourseListResponse(response);
};

export const getCourseById = (courseId: string) =>
  serviceClient.get<Course>(COURSE_ENDPOINTS.details(courseId));

export const createCourse = (payload: CreateCoursePayload) =>
  serviceClient.post<Course>(COURSE_ENDPOINTS.courses, payload);

export const updateCourse = (courseId: string, payload: UpdateCoursePayload) =>
  serviceClient.patch<Course>(COURSE_ENDPOINTS.details(courseId), payload);

export const publishCourse = (courseId: string) =>
  serviceClient.patch<Course>(COURSE_ENDPOINTS.publish(courseId));

export const archiveCourse = (courseId: string) =>
  serviceClient.delete<Course>(COURSE_ENDPOINTS.details(courseId));

export const restoreArchivedCourse = (courseId: string) =>
  serviceClient.patch<Course>(COURSE_ENDPOINTS.restore(courseId));

export const checkPermanentDeleteCourse = (courseId: string) =>
  serviceClient.get<CourseDeleteSafety>(
    COURSE_ENDPOINTS.permanentDeleteCheck(courseId),
  );

export const permanentlyDeleteCourse = (courseId: string) =>
  serviceClient.delete<{ message?: string }>(
    COURSE_ENDPOINTS.permanentDelete(courseId),
  );
