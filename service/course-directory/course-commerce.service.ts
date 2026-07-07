import { serviceClient } from "@/service/base/service_client";
import type {
  CommerceSortOrder,
  CourseEnrollment,
  CourseEnrollmentBilling,
  CourseEnrollmentDetails,
  CourseEnrollmentFilterOptions,
  CourseEnrollmentListResponse,
  CourseEnrollmentOrder,
  CourseEnrollmentQuery,
  CourseEnrollmentSortBy,
  CourseEnrollmentSummary,
  CourseProviderProduct,
  CourseProviderProductListResponse,
  CourseProviderProductMutationResponse,
  CreateCourseProviderProductPayload,
  UpdateCourseProviderProductPayload,
} from "@/types/course-directory/course-commerce.type";
import { assertValidUuid } from "@/utils/uuid";

export const createCourseProviderProduct = async (
  courseId: string,
  payload: CreateCourseProviderProductPayload,
) => {
  const safeCourseId = assertValidUuid(courseId, "Course ID");

  return serviceClient.post<CourseProviderProduct>(
    `/admin/courses/${safeCourseId}/provider-products`,
    payload,
  );
};

export const getCourseProviderProducts = async (courseId: string) => {
  const safeCourseId = assertValidUuid(courseId, "Course ID");

  return serviceClient.get<CourseProviderProductListResponse>(
    `/admin/courses/${safeCourseId}/provider-products`,
  );
};

export const updateCourseProviderProduct = async (
  courseId: string,
  mappingId: string,
  payload: UpdateCourseProviderProductPayload,
) => {
  const safeCourseId = assertValidUuid(courseId, "Course ID");
  const safeMappingId = assertValidUuid(mappingId, "Course product mapping ID");

  return serviceClient.patch<CourseProviderProduct>(
    `/admin/courses/${safeCourseId}/provider-products/${safeMappingId}`,
    payload,
  );
};

export const deactivateCourseProviderProduct = async (
  courseId: string,
  mappingId: string,
) => {
  const safeCourseId = assertValidUuid(courseId, "Course ID");
  const safeMappingId = assertValidUuid(mappingId, "Course product mapping ID");

  return serviceClient.delete<CourseProviderProductMutationResponse>(
    `/admin/courses/${safeCourseId}/provider-products/${safeMappingId}`,
  );
};

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

const readRecord = (
  record: UnknownRecord | null,
  keys: string[],
): UnknownRecord | null => {
  const value = readValue(record, keys);

  return isRecord(value) ? value : null;
};

const readString = (
  record: UnknownRecord | null,
  keys: string[],
): string | undefined => {
  const value = readValue(record, keys);

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);

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

const normalizeBilling = (
  order: UnknownRecord | null,
  enrollment: UnknownRecord,
): CourseEnrollmentBilling | null => {
  const billing = readRecord(order, ["billing"]);

  const providerSnapshot =
    readRecord(order, ["providerSnapshot"]) ||
    readRecord(enrollment, ["storeProduct", "providerSnapshot"]);

  const providerTransaction =
    readRecord(order, ["providerTransaction"]) ||
    readRecord(enrollment, ["verification", "providerTransaction"]);

  const provider =
    readString(billing, ["provider"]) ||
    readString(providerSnapshot, ["provider"]) ||
    readString(order, ["paymentProvider"]) ||
    readString(enrollment, ["paymentProvider", "provider"]) ||
    null;

  const productId =
    readString(billing, ["productId"]) ||
    readString(providerSnapshot, ["productId", "providerProductId"]) ||
    null;

  const productType =
    readString(billing, ["productType"]) ||
    readString(providerSnapshot, ["productType"]) ||
    null;

  const environment =
    readString(billing, ["environment"]) ||
    readString(providerTransaction, ["environment"]) ||
    null;

  const verificationStatus =
    readString(billing, ["verificationStatus"]) ||
    readString(providerTransaction, ["verificationStatus", "status"]) ||
    null;

  const providerTransactionId =
    readString(billing, ["providerTransactionId"]) ||
    readString(providerTransaction, ["providerTransactionId"]) ||
    null;

  const tokenHash =
    readString(billing, ["tokenHash"]) ||
    readString(providerTransaction, ["tokenHash", "purchaseTokenHash"]) ||
    null;

  const verifiedAt =
    readString(billing, ["verifiedAt"]) ||
    readString(providerTransaction, ["verifiedAt"]) ||
    null;

  if (
    !provider &&
    !productId &&
    !productType &&
    !environment &&
    !verificationStatus &&
    !providerTransactionId &&
    !tokenHash &&
    !verifiedAt
  ) {
    return null;
  }

  return {
    provider,
    productId,
    productType,
    basePlanId:
      readString(billing, ["basePlanId"]) ||
      readString(providerSnapshot, ["basePlanId"]) ||
      null,
    offerId:
      readString(billing, ["offerId"]) ||
      readString(providerSnapshot, ["offerId"]) ||
      null,
    environment,
    verificationStatus,
    providerTransactionId,
    tokenHash,
    verifiedAt,
  };
};

const normalizeOrder = (
  order: UnknownRecord | null,
  enrollment: UnknownRecord,
): CourseEnrollmentOrder | null => {
  if (!order) return null;

  const billing = normalizeBilling(order, enrollment);

  return {
    id: readString(order, ["id", "orderId"]) || "",
    orderNumber: readString(order, ["orderNumber"]) || null,
    amountPaid: readNumber(order, ["amountPaid", "paymentAmount", "amount"], 0),
    currency:
      readString(order, ["currency", "paymentCurrency", "currencyCode"]) ||
      "EUR",
    amountPaidEur:
      readString(order, ["amountPaidEur", "payableAmountEur"]) || null,
    paymentProvider: readString(order, ["paymentProvider"]) || null,
    status: readString(order, ["status"]) || null,
    paidAt: readString(order, ["paidAt"]) || null,
    refundedAt: readString(order, ["refundedAt"]) || null,
    billing,
    providerSnapshot: readRecord(order, ["providerSnapshot"]) as never,
    providerTransaction: readRecord(order, ["providerTransaction"]) as never,
    refundOperation: readRecord(order, ["refundOperation"]) as never,
  };
};

const normalizeEnrollment = (value: unknown): CourseEnrollment => {
  const enrollment = isRecord(value) ? value : {};
  const student = readRecord(enrollment, ["student", "user", "learner"]) || {};
  const order =
    readRecord(enrollment, ["order", "purchase", "coursePurchase"]) || null;

  const normalizedOrder = normalizeOrder(order, enrollment);
  const billing = normalizeBilling(order, enrollment);

  const studentId =
    readString(student, ["id", "userId"]) ||
    readString(enrollment, ["userId", "studentId"]) ||
    "";

  const amountPaid = readNumber(
    enrollment,
    ["amountPaid", "paidAmount", "amount"],
    readNumber(order, ["amountPaid", "paymentAmount", "amount"], 0),
  );

  const currency =
    readString(enrollment, ["currency", "currencyCode"]) ||
    readString(order, ["currency", "paymentCurrency", "currencyCode"]) ||
    "EUR";

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
    amountPaid,
    currency,
    status: readString(enrollment, ["status", "enrollmentStatus"]) || "unknown",
    paymentProvider:
      billing?.provider ||
      readString(enrollment, ["paymentProvider", "provider"]) ||
      readString(order, ["paymentProvider", "provider"]) ||
      "unknown",
    billing,
    order: normalizedOrder,
    storeProduct: (readRecord(enrollment, ["storeProduct"]) ||
      readRecord(order, ["providerSnapshot"])) as never,
    verification: (readRecord(enrollment, ["verification"]) ||
      readRecord(order, ["providerTransaction"])) as never,
    payment: readRecord(enrollment, ["payment"]) as never,
    subscription: readRecord(enrollment, ["subscription"]) as never,
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

  const revenueYtdRecord = readRecord(summary, ["revenueYtd"]);

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
    revenueYtd: {
      currency:
        readString(revenueYtdRecord, ["currency"]) ||
        readString(summary, ["currency", "currencyCode"]) ||
        "EUR",
      amount:
        readString(revenueYtdRecord, ["amount"]) ||
        readString(summary, ["revenueYtd", "totalRevenue", "revenue"]) ||
        "0.00",
    },
    refundedLast30Days: readNumber(summary, [
      "refundedLast30Days",
      "refunded",
      "refundedCount",
      "totalRefunded",
    ]),
    activeWindowMinutes: readNumber(summary, ["activeWindowMinutes"], 15),
  };
};

const normalizeEnrollmentDetails = (
  response: unknown,
): CourseEnrollmentDetails => {
  const detailsRecord = unwrapRecord(response) || {};
  const enrollment = normalizeEnrollment(detailsRecord);
  const order =
    readRecord(detailsRecord, ["order", "purchase", "coursePurchase"]) || {};

  const providerTransaction =
    readRecord(order, ["providerTransaction"]) ||
    readRecord(detailsRecord, ["providerTransaction", "verification"]);

  return {
    ...enrollment,
    courseTitle:
      readString(detailsRecord, ["courseTitle"]) ||
      readString(readRecord(detailsRecord, ["course"]), ["title"]) ||
      null,
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
      readString(providerTransaction, ["providerTransactionId"]) ||
      null,
    paymentStatus:
      readString(detailsRecord, ["paymentStatus"]) ||
      readString(order, ["status", "paymentStatus"]) ||
      null,
  };
};

const buildEnrollmentQuery = (query: CourseEnrollmentQuery) => {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.status) params.set("status", query.status);
  if (query.paymentProvider)
    params.set("paymentProvider", query.paymentProvider);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

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

export const refundCoursePurchase = async (
  orderId: string,
  reason?: string,
): Promise<{
  message?: string;
  refundOperation?: unknown;
}> => {
  const safeOrderId = assertValidUuid(orderId, "Order ID");

  return serviceClient.post<{
    message?: string;
    refundOperation?: unknown;
  }>(`/admin/course-purchases/${safeOrderId}/refund`, {
    reason: reason?.trim() || undefined,
  });
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
