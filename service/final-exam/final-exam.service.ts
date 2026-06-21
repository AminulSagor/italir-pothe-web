import type {
  FinalExam,
  FinalExamDeleteResponse,
  FinalExamLinkableCourse,
  FinalExamListItem,
  FinalExamListParams,
  FinalExamListResponse,
  FinalExamPayload,
  FinalExamQuestion,
  FinalExamQuestionPayload,
  FinalExamSetupProgress,
  FinalExamSpeakingTaskPayload,
  FinalExamWritingTaskPayload,
  LinkFinalExamCoursePayload,
} from "@/types/final-exam/final-exam.type";
import { serviceClient } from "../base/service_client";
import { assertValidUuid } from "@/utils/uuid";

const FINAL_EXAM_ENDPOINTS = {
  list: "/admin/final-exams",
  details: (finalExamId: string) => `/admin/final-exams/${finalExamId}`,
  setupProgress: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/setup-progress`,
  publish: (finalExamId: string) => `/admin/final-exams/${finalExamId}/publish`,
  archive: (finalExamId: string) => `/admin/final-exams/${finalExamId}/archive`,
  hardDelete: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/hard-delete`,
  linkCourse: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/link-course`,

  coreQuestions: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/core-quiz/questions`,
  coreQuestionDetails: (finalExamId: string, questionId: string) =>
    `/admin/final-exams/${finalExamId}/core-quiz/questions/${questionId}`,
  publishCoreQuiz: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/core-quiz/publish`,

  listeningQuestions: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/listening/questions`,
  listeningQuestionDetails: (finalExamId: string, questionId: string) =>
    `/admin/final-exams/${finalExamId}/listening/questions/${questionId}`,
  publishListeningLab: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/listening/publish`,

  writingTask: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/writing-task`,
  speakingTask: (finalExamId: string) =>
    `/admin/final-exams/${finalExamId}/speaking-task`,

  genericQuestionDetails: (questionId: string) =>
    `/admin/final-exams/questions/${questionId}`,
};

interface NestedCollectionResponse<T> {
  items?: T[];
}

interface CollectionResponse<T> {
  items?: T[];
  data?: T[] | NestedCollectionResponse<T>;
}

type ApiCollectionResponse<T> = T[] | CollectionResponse<T>;

const getCollectionItems = <T>(response: ApiCollectionResponse<T>): T[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.items)
  ) {
    return response.data.items;
  }

  return [];
};

const buildQueryString = (params: Record<string, unknown>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    query.set(key, String(value));
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

export const getFinalExams = async (
  params: FinalExamListParams = {},
): Promise<FinalExamListResponse> => {
  return serviceClient.get<FinalExamListResponse>(
    `${FINAL_EXAM_ENDPOINTS.list}${buildQueryString(
      params as Record<string, unknown>,
    )}`,
  );
};

export const createFinalExam = async (
  payload: FinalExamPayload,
): Promise<FinalExam> => {
  return serviceClient.post<FinalExam>(FINAL_EXAM_ENDPOINTS.list, payload);
};

export const archiveFinalExam = async (
  finalExamId: string,
): Promise<FinalExamDeleteResponse> => {
  return serviceClient.patch<FinalExamDeleteResponse>(
    FINAL_EXAM_ENDPOINTS.archive(finalExamId),
  );
};

export const hardDeleteFinalExam = async (
  finalExamId: string,
): Promise<FinalExamDeleteResponse> => {
  return serviceClient.delete<FinalExamDeleteResponse>(
    FINAL_EXAM_ENDPOINTS.hardDelete(finalExamId),
  );
};

export const createListeningQuestion = async (
  finalExamId: string,
  payload: FinalExamQuestionPayload,
): Promise<FinalExamQuestion> => {
  return serviceClient.post<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.listeningQuestions(finalExamId),
    payload,
  );
};

export const updateListeningQuestion = async (
  finalExamId: string,
  questionId: string,
  payload: FinalExamQuestionPayload,
): Promise<FinalExamQuestion> => {
  return serviceClient.patch<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.listeningQuestionDetails(finalExamId, questionId),
    payload,
  );
};

export const deleteListeningQuestion = async (
  finalExamId: string,
  questionId: string,
): Promise<FinalExamDeleteResponse> => {
  return serviceClient.delete<FinalExamDeleteResponse>(
    FINAL_EXAM_ENDPOINTS.listeningQuestionDetails(finalExamId, questionId),
  );
};

export const publishListeningLab = async (
  finalExamId: string,
): Promise<FinalExam> => {
  return serviceClient.patch<FinalExam>(
    FINAL_EXAM_ENDPOINTS.publishListeningLab(finalExamId),
  );
};

export const upsertWritingTask = async (
  finalExamId: string,
  payload: FinalExamWritingTaskPayload,
): Promise<FinalExamQuestion> => {
  return serviceClient.patch<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.writingTask(finalExamId),
    payload,
  );
};

export const getWritingTask = async (
  finalExamId: string,
): Promise<FinalExamQuestion> => {
  return serviceClient.get<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.writingTask(finalExamId),
  );
};

export const deleteWritingTask = async (
  finalExamId: string,
): Promise<FinalExamDeleteResponse> => {
  return serviceClient.delete<FinalExamDeleteResponse>(
    FINAL_EXAM_ENDPOINTS.writingTask(finalExamId),
  );
};

export const upsertSpeakingTask = async (
  finalExamId: string,
  payload: FinalExamSpeakingTaskPayload,
): Promise<FinalExamQuestion> => {
  return serviceClient.patch<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.speakingTask(finalExamId),
    payload,
  );
};

export const getSpeakingTask = async (
  finalExamId: string,
): Promise<FinalExamQuestion> => {
  return serviceClient.get<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.speakingTask(finalExamId),
  );
};

export const deleteSpeakingTask = async (
  finalExamId: string,
): Promise<FinalExamDeleteResponse> => {
  return serviceClient.delete<FinalExamDeleteResponse>(
    FINAL_EXAM_ENDPOINTS.speakingTask(finalExamId),
  );
};

export const getFinalExamQuestionById = async (
  questionId: string,
): Promise<FinalExamQuestion> => {
  return serviceClient.get<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.genericQuestionDetails(questionId),
  );
};

export const getFinalExamById = async (
  finalExamId: string,
): Promise<FinalExam> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.get<FinalExam>(
    FINAL_EXAM_ENDPOINTS.details(safeFinalExamId),
  );
};

export const updateFinalExam = async (
  finalExamId: string,
  payload: FinalExamPayload,
): Promise<FinalExam> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.patch<FinalExam>(
    FINAL_EXAM_ENDPOINTS.details(safeFinalExamId),
    payload,
  );
};

export const getFinalExamSetupProgress = async (
  finalExamId: string,
): Promise<FinalExamSetupProgress> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.get<FinalExamSetupProgress>(
    FINAL_EXAM_ENDPOINTS.setupProgress(safeFinalExamId),
  );
};

export const publishFinalExam = async (
  finalExamId: string,
): Promise<FinalExam> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.patch<FinalExam>(
    FINAL_EXAM_ENDPOINTS.publish(safeFinalExamId),
  );
};

export const getCoreQuizQuestions = async (
  finalExamId: string,
): Promise<FinalExamQuestion[]> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.get<FinalExamQuestion[]>(
    FINAL_EXAM_ENDPOINTS.coreQuestions(safeFinalExamId),
  );
};

export const getCoreQuizQuestionById = async (
  finalExamId: string,
  questionId: string,
): Promise<FinalExamQuestion> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");
  const safeQuestionId = assertValidUuid(questionId, "Question ID");

  return serviceClient.get<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.coreQuestionDetails(safeFinalExamId, safeQuestionId),
  );
};

export const createCoreQuizQuestion = async (
  finalExamId: string,
  payload: FinalExamQuestionPayload,
): Promise<FinalExamQuestion> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.post<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.coreQuestions(safeFinalExamId),
    payload,
  );
};

export const updateCoreQuizQuestion = async (
  finalExamId: string,
  questionId: string,
  payload: FinalExamQuestionPayload,
): Promise<FinalExamQuestion> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");
  const safeQuestionId = assertValidUuid(questionId, "Question ID");

  return serviceClient.patch<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.coreQuestionDetails(safeFinalExamId, safeQuestionId),
    payload,
  );
};

export const deleteCoreQuizQuestion = async (
  finalExamId: string,
  questionId: string,
): Promise<FinalExamDeleteResponse> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");
  const safeQuestionId = assertValidUuid(questionId, "Question ID");

  return serviceClient.delete<FinalExamDeleteResponse>(
    FINAL_EXAM_ENDPOINTS.coreQuestionDetails(safeFinalExamId, safeQuestionId),
  );
};

export const publishCoreQuiz = async (
  finalExamId: string,
): Promise<FinalExam> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.patch<FinalExam>(
    FINAL_EXAM_ENDPOINTS.publishCoreQuiz(safeFinalExamId),
  );
};

export const getListeningQuestions = async (
  finalExamId: string,
): Promise<FinalExamQuestion[]> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.get<FinalExamQuestion[]>(
    FINAL_EXAM_ENDPOINTS.listeningQuestions(safeFinalExamId),
  );
};

export const getListeningQuestionById = async (
  finalExamId: string,
  questionId: string,
): Promise<FinalExamQuestion> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");
  const safeQuestionId = assertValidUuid(questionId, "Question ID");

  return serviceClient.get<FinalExamQuestion>(
    FINAL_EXAM_ENDPOINTS.listeningQuestionDetails(
      safeFinalExamId,
      safeQuestionId,
    ),
  );
};

export const linkFinalExamWithCourse = async (
  finalExamId: string,
  payload: LinkFinalExamCoursePayload,
): Promise<FinalExam> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  const safeCourseId = assertValidUuid(payload.courseId, "Course ID");

  return serviceClient.patch<FinalExam>(
    FINAL_EXAM_ENDPOINTS.linkCourse(safeFinalExamId),
    {
      courseId: safeCourseId,
    },
  );
};

export const delinkFinalExamFromCourse = async (
  finalExamId: string,
): Promise<FinalExam> => {
  const safeFinalExamId = assertValidUuid(finalExamId, "Final exam ID");

  return serviceClient.delete<FinalExam>(
    FINAL_EXAM_ENDPOINTS.linkCourse(safeFinalExamId),
  );
};

export const getAvailableFinalExamCourses = async (): Promise<
  FinalExamLinkableCourse[]
> => {
  const [coursesResponse, linkedExamsResponse] = await Promise.all([
    serviceClient.get<ApiCollectionResponse<FinalExamLinkableCourse>>(
      "/admin/courses?page=1&limit=100",
    ),
    serviceClient.get<ApiCollectionResponse<FinalExamListItem>>(
      "/admin/final-exams?page=1&limit=100&linkedOnly=true",
    ),
  ]);

  const courses = getCollectionItems(coursesResponse);
  const linkedExams = getCollectionItems(linkedExamsResponse);

  const linkedCourseIds = new Set(
    linkedExams
      .map((exam) => exam.courseId)
      .filter((courseId): courseId is string => Boolean(courseId)),
  );

  return courses
    .filter((course) => {
      const isArchived =
        course.status === "archived" || Boolean(course.archivedAt);

      const isAlreadyLinked =
        linkedCourseIds.has(course.id) ||
        Boolean(course.finalExamId) ||
        course.hasFinalExam === true;

      return !isArchived && !isAlreadyLinked;
    })
    .sort((firstCourse, secondCourse) =>
      firstCourse.title.localeCompare(secondCourse.title),
    );
};
