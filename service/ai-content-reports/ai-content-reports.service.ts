import { serviceClient } from "@/service/base/service_client";
import type {
  AiContentReportItem,
  AiContentReportsQuery,
  AiContentReportsResponse,
  UpdateAiContentReportStatusPayload,
} from "@/types/ai-content-reports/ai-content-reports.type";
import { assertValidUuid } from "@/utils/uuid";

const ENDPOINT = "/api/v1/admin/ai-content-reports";

type QueryValue = string | number | undefined | null;

const buildQueryString = (values: Record<string, QueryValue>) => {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();

  return query ? `?${query}` : "";
};

export const getAiContentReports = async (
  query: AiContentReportsQuery = {},
) => {
  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,
    status: query.status === "all" ? undefined : query.status,
    featureType:
      query.featureType === "all" ? undefined : query.featureType,
    search: query.search?.trim(),
  });

  return serviceClient.get<AiContentReportsResponse>(
    `${ENDPOINT}${queryString}`,
  );
};

export const getAiContentReport = async (reportId: string) => {
  const safeReportId = assertValidUuid(reportId, "AI content report ID");

  return serviceClient.get<AiContentReportItem>(
    `${ENDPOINT}/${safeReportId}`,
  );
};

export const updateAiContentReportStatus = async (
  reportId: string,
  payload: UpdateAiContentReportStatusPayload,
) => {
  const safeReportId = assertValidUuid(reportId, "AI content report ID");

  return serviceClient.patch<AiContentReportItem>(
    `${ENDPOINT}/${safeReportId}/status`,
    payload,
  );
};
