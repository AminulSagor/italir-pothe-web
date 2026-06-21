import { serviceClient } from "@/service/base/service_client";
import type {
  CommerceSortOrder,
  CourseEnrollment,
  CourseEnrollmentDetails,
  CourseEnrollmentFilterOptions,
  CourseEnrollmentListResponse,
  CourseEnrollmentQuery,
  CourseEnrollmentSortBy,
  CourseEnrollmentSummary,
} from "@/types/course-directory/course-commerce.type";
import { assertValidUuid } from "@/utils/uuid";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const readValue = (record: UnknownRecord | null, keys: string[]): unknown => {
  if (!record) return undefined;

  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }

  return undefined;
};

const readString = (
  record: UnknownRecord | null,
  keys: string[],
): string | undefined => {
  const value = readValue(record, keys);

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
};

const readNumber = (
  record: UnknownRecord | null,
  keys: string[],
  fallback = 0,
): number => {
  const value = readValue(record, keys);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return fallback;
};

const readRecord = (
  record: UnknownRecord | null,
  keys: string[],
): UnknownRecord | null => {
  const value = readValue(record, keys);

  return isRecord(value) ? value : null;
};

const unwrapRecord = (response: unknown): UnknownRecord | null => {
  if (!isRecord(response)) return null;

  const data = response.data;

  return isRecord(data) ? data : response;
};

const getStudentName = (
  student: UnknownRecord | null,
  enrollment: UnknownRecord,
) => {
  const directName =
    readString(student, ["fullName", "name", "displayName"]) ||
    readString(enrollment, ["studentName", "fullName", "name"]);

  if (directName) return directName;

  const firstName =
    readString(student, ["firstName"]) ||
    readString(enrollment, ["firstName"]) ||
    "";

  const lastName =
    readString(student, ["lastName"]) ||
    readString(enrollment, ["lastName"]) ||
    "";

  const combinedName = `${firstName} ${lastName}`.trim();

  return combinedName || "Unknown Student";
};

const normalizeEnrollment = (value: unknown): CourseEnrollment => {
  const enrollment = isRecord(value) ? value : {};

  const student = readRecord(enrollment, ["student", "user", "learner"]) || {};

  const order =
    readRecord(enrollment, ["order", "purchase", "coursePurchase"]) || {};

  const studentId =
    readString(student, ["id", "userId"]) ||
    readString(enrollment, ["userId", "studentId"]) ||
    "";

  return {
    id: readString(enrollment, ["id", "enrollmentId"]) || "",
    courseId: readString(enrollment, ["courseId"]) || "",
    orderId:
      readString(enrollment, [
        "orderId",
        "purchaseOrderId",
        "coursePurchaseId",
      ]) ||
      readString(order, ["id", "orderId"]) ||
      null,
    userId: studentId || null,
    student: {
      id: studentId,
      name: getStudentName(student, enrollment),
      studentCode:
        readString(student, ["studentCode", "studentId", "publicId", "code"]) ||
        readString(enrollment, ["studentCode", "studentPublicId"]) ||
        null,
      email:
        readString(student, ["email"]) ||
        readString(enrollment, ["email", "studentEmail"]) ||
        null,
      phone:
        readString(student, ["phone", "phoneNumber", "mobile"]) ||
        readString(enrollment, ["phone", "phoneNumber", "studentPhone"]) ||
        null,
      avatarUrl:
        readString(student, [
          "avatarUrl",
          "profileImageUrl",
          "photoUrl",
          "imageUrl",
        ]) ||
        readString(enrollment, ["avatarUrl", "profileImageUrl"]) ||
        null,
    },
    amountPaid: readNumber(
      enrollment,
      ["amountPaid", "paidAmount", "amount"],
      readNumber(order, ["amountPaid", "amount"], 0),
    ),
    currency:
      readString(enrollment, ["currency", "currencyCode"]) ||
      readString(order, ["currency", "currencyCode"]) ||
      "EUR",
    status: readString(enrollment, ["status", "enrollmentStatus"]) || "unknown",
    paymentProvider:
      readString(enrollment, ["paymentProvider", "provider"]) ||
      readString(order, ["paymentProvider", "provider"]) ||
      "unknown",
    enrolledAt:
      readString(enrollment, ["enrolledAt", "createdAt", "purchasedAt"]) ||
      null,
    refundedAt:
      readString(enrollment, ["refundedAt"]) ||
      readString(order, ["refundedAt"]) ||
      null,
  };
};

const normalizeEnrollmentList = (
  response: unknown,
  requestedPage: number,
  requestedLimit: number,
): CourseEnrollmentListResponse => {
  const root = isRecord(response) ? response : null;

  const nestedData = root && isRecord(root.data) ? root.data : null;

  const container = nestedData || root;

  let rawItems: unknown[] = [];

  if (Array.isArray(response)) {
    rawItems = response;
  } else if (container && Array.isArray(container.items)) {
    rawItems = container.items;
  } else if (root && Array.isArray(root.data)) {
    rawItems = root.data;
  } else if (container && Array.isArray(container.enrollments)) {
    rawItems = container.enrollments;
  }

  const meta =
    readRecord(container, ["meta", "pagination"]) ||
    readRecord(root, ["meta", "pagination"]) ||
    container ||
    root;

  const items = rawItems.map(normalizeEnrollment);

  const page = readNumber(meta, ["page", "currentPage"], requestedPage);

  const limit = readNumber(
    meta,
    ["limit", "pageSize", "perPage"],
    requestedLimit,
  );

  const totalItems = readNumber(
    meta,
    ["totalItems", "total", "count"],
    items.length,
  );

  const calculatedTotalPages = Math.max(
    1,
    Math.ceil(totalItems / Math.max(1, limit)),
  );

  const totalPages = readNumber(
    meta,
    ["totalPages", "lastPage"],
    calculatedTotalPages,
  );

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages,
  };
};

const normalizeSummary = (
  response: unknown,
  courseId: string,
): CourseEnrollmentSummary => {
  const summary = unwrapRecord(response);

  return {
    courseId: readString(summary, ["courseId"]) || courseId,
    totalStudents: readNumber(summary, [
      "totalStudents",
      "totalEnrollments",
      "enrollmentCount",
    ]),
    activeNow: readNumber(summary, [
      "activeNow",
      "activeStudents",
      "currentlyActive",
    ]),
    revenueYtd: readNumber(summary, ["revenueYtd", "totalRevenue", "revenue"]),
    refunded: readNumber(summary, [
      "refunded",
      "refundedCount",
      "totalRefunded",
    ]),
    currency: readString(summary, ["currency", "currencyCode"]) || "EUR",
    totalStudentsBadge: readString(summary, ["totalStudentsBadge"]) || null,
    activeNowBadge: readString(summary, ["activeNowBadge"]) || null,
    revenueBadge: readString(summary, ["revenueBadge"]) || null,
    refundedBadge: readString(summary, ["refundedBadge"]) || null,
  };
};

const normalizeEnrollmentDetails = (
  response: unknown,
): CourseEnrollmentDetails => {
  const detailsRecord = unwrapRecord(response) || {};
  const enrollment = normalizeEnrollment(detailsRecord);
  const order =
    readRecord(detailsRecord, ["order", "purchase", "coursePurchase"]) || {};

  return {
    ...enrollment,
    courseTitle: readString(detailsRecord, ["courseTitle"]) || null,
    paymentReference:
      readString(detailsRecord, [
        "paymentReference",
        "transactionId",
        "providerTransactionId",
      ]) ||
      readString(order, [
        "paymentReference",
        "transactionId",
        "providerTransactionId",
      ]) ||
      null,
    paymentStatus:
      readString(detailsRecord, ["paymentStatus"]) ||
      readString(order, ["status", "paymentStatus"]) ||
      null,
  };
};

const buildEnrollmentQuery = (query: CourseEnrollmentQuery) => {
  const params = new URLSearchParams();

  if (query.page) {
    params.set("page", String(query.page));
  }

  if (query.limit) {
    params.set("limit", String(query.limit));
  }

  if (query.search?.trim()) {
    params.set("search", query.search.trim());
  }

  if (query.status) {
    params.set("status", query.status);
  }

  if (query.paymentProvider) {
    params.set("paymentProvider", query.paymentProvider);
  }

  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
  }

  if (query.sortOrder) {
    params.set("sortOrder", query.sortOrder);
  }

  return params.toString();
};

export const getCourseEnrollmentSummary = async (
  courseId: string,
): Promise<CourseEnrollmentSummary> => {
  const safeCourseId = assertValidUuid(courseId, "Course ID");

  const response = await serviceClient.get<unknown>(
    `/admin/courses/${safeCourseId}/enrollments/summary`,
  );

  return normalizeSummary(response, safeCourseId);
};

export const getCourseEnrollments = async (
  courseId: string,
  query: CourseEnrollmentQuery = {},
): Promise<CourseEnrollmentListResponse> => {
  const safeCourseId = assertValidUuid(courseId, "Course ID");

  const requestedPage = query.page || 1;
  const requestedLimit = query.limit || 10;
  const queryString = buildEnrollmentQuery({
    ...query,
    page: requestedPage,
    limit: requestedLimit,
  });

  const response = await serviceClient.get<unknown>(
    `/admin/courses/${safeCourseId}/enrollments?${queryString}`,
  );

  return normalizeEnrollmentList(response, requestedPage, requestedLimit);
};

export const getCourseEnrollmentById = async (
  enrollmentId: string,
): Promise<CourseEnrollmentDetails> => {
  const safeEnrollmentId = assertValidUuid(enrollmentId, "Enrollment ID");

  const response = await serviceClient.get<unknown>(
    `/admin/course-enrollments/${safeEnrollmentId}`,
  );

  return normalizeEnrollmentDetails(response);
};

export const demoRefundCoursePurchase = async (
  orderId: string,
): Promise<unknown> => {
  const safeOrderId = assertValidUuid(orderId, "Order ID");

  return serviceClient.post<unknown>(
    `/admin/course-purchases/${safeOrderId}/demo-refund`,
  );
};

export const getAllCourseEnrollments = async (
  courseId: string,
  query: Omit<CourseEnrollmentQuery, "page" | "limit">,
): Promise<CourseEnrollment[]> => {
  const firstPage = await getCourseEnrollments(courseId, {
    ...query,
    page: 1,
    limit: 100,
  });

  const allItems = [...firstPage.items];

  for (
    let currentPage = 2;
    currentPage <= firstPage.totalPages;
    currentPage += 1
  ) {
    const response = await getCourseEnrollments(courseId, {
      ...query,
      page: currentPage,
      limit: 100,
    });

    allItems.push(...response.items);
  }

  return allItems;
};

export const getCourseEnrollmentFilterOptions = async (
  courseId: string,
): Promise<CourseEnrollmentFilterOptions> => {
  const response = await getCourseEnrollments(courseId, {
    page: 1,
    limit: 100,
    sortBy: "enrolledAt",
    sortOrder: "DESC",
  });

  const statuses = Array.from(
    new Set(
      response.items
        .map((item) => item.status)
        .filter((status) => Boolean(status) && status !== "unknown"),
    ),
  ).sort();

  const paymentProviders = Array.from(
    new Set(
      response.items
        .map((item) => item.paymentProvider)
        .filter((provider) => Boolean(provider) && provider !== "unknown"),
    ),
  ).sort();

  return {
    statuses,
    paymentProviders,
  };
};

export type { CommerceSortOrder, CourseEnrollmentSortBy };
