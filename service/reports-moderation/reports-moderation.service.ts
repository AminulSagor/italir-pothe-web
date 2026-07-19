import { serviceClient } from "@/service/base/service_client";
import type {
  ModerationDashboardMetricsResponse,
  ModerationReportDetailsResponse,
  ModerationReportsQuery,
  ModerationReportsResponse,
  PerformModerationActionPayload,
  PerformModerationActionResponse,
} from "@/types/reports-moderation/reports-moderation.type";
import { assertValidUuid } from "@/utils/uuid";

const MODERATION_ENDPOINT = "/api/v1/moderation";

type QueryValue = string | number | undefined | null;

const buildQueryString = (values: Record<string, QueryValue>) => {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
};

export const getModerationDashboardMetrics = async () => {
  return serviceClient.get<ModerationDashboardMetricsResponse>(
    `${MODERATION_ENDPOINT}/dashboard/metrics`,
  );
};

export const getModerationReports = async (
  query: ModerationReportsQuery = {},
) => {
  const status = query.status === "all" ? undefined : query.status;

  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,

    status,
    reason: query.reason?.trim(),
    search: query.search?.trim(),
  });

  return serviceClient.get<ModerationReportsResponse>(
    `${MODERATION_ENDPOINT}/reports${queryString}`,
  );
};

export const getModerationReportByCaseNumber = async (caseNumber: string) => {
  const normalizedCaseNumber = caseNumber.trim();

  if (!normalizedCaseNumber) {
    throw new Error("Moderation case number is required.");
  }

  return serviceClient.get<ModerationReportDetailsResponse>(
    `${MODERATION_ENDPOINT}/reports/${encodeURIComponent(
      normalizedCaseNumber,
    )}`,
  );
};

export const performModerationAction = async (
  reportId: string,
  payload: PerformModerationActionPayload,
) => {
  const safeReportId = assertValidUuid(reportId, "Moderation report ID");

  const actionReason = payload.action_reason.trim();

  if (!actionReason) {
    throw new Error("Moderation action reason is required.");
  }

  return serviceClient.post<PerformModerationActionResponse>(
    `${MODERATION_ENDPOINT}/reports/${safeReportId}/action`,
    {
      action_type: payload.action_type,
      action_reason: actionReason,
    },
  );
};
