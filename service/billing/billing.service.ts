import { serviceClient } from "@/service/base/service_client";
import type {
  GooglePlayReconciliationStatusResponse,
  GooglePlayRtdnEvent,
  GooglePlayRtdnEventListResponse,
  GooglePlayVoidedPurchaseRecord,
  GooglePlayVoidedPurchaseRecordListResponse,
  GooglePlayVoidedReconciliationSummary,
  QueryGooglePlayRtdnEventsParams,
  QueryGooglePlayVoidedRecordsParams,
  RetryGooglePlayFailuresPayload,
  RetryGooglePlayFailuresResponse,
  RunGooglePlayReconciliationPayload,
} from "@/types/billing/billing.type";
import { assertValidUuid } from "@/utils/uuid";

const GOOGLE_PLAY_RECONCILIATION_BASE =
  "/admin/billing/google-play/reconciliation";

const buildQueryString = (
  values: Record<string, string | number | undefined>,
) => {
  const query = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === null) {
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

export const getGooglePlayReconciliationStatus =
  async (): Promise<GooglePlayReconciliationStatusResponse> => {
    return serviceClient.get<GooglePlayReconciliationStatusResponse>(
      `${GOOGLE_PLAY_RECONCILIATION_BASE}/status`,
    );
  };

export const runGooglePlayVoidedPurchaseReconciliation = async (
  payload: RunGooglePlayReconciliationPayload = {},
): Promise<GooglePlayVoidedReconciliationSummary> => {
  return serviceClient.post<GooglePlayVoidedReconciliationSummary>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/voided-purchases/run`,
    payload,
  );
};

export const retryFailedGooglePlayVoidedPurchases = async (
  payload: RetryGooglePlayFailuresPayload = {},
): Promise<RetryGooglePlayFailuresResponse> => {
  return serviceClient.post<RetryGooglePlayFailuresResponse>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/voided-purchases/retry-failed`,
    payload,
  );
};

export const retryGooglePlayVoidedPurchaseRecord = async (
  recordId: string,
): Promise<unknown> => {
  const safeRecordId = assertValidUuid(recordId, "Voided purchase record ID");

  return serviceClient.post<unknown>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/voided-purchases/${safeRecordId}/retry`,
  );
};

export const retryFailedGooglePlayRtdnEvents = async (
  payload: RetryGooglePlayFailuresPayload = {},
): Promise<RetryGooglePlayFailuresResponse> => {
  return serviceClient.post<RetryGooglePlayFailuresResponse>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/rtdn/retry-failed`,
    payload,
  );
};

export const retryGooglePlayRtdnEvent = async (
  eventId: string,
): Promise<unknown> => {
  const safeEventId = assertValidUuid(eventId, "RTDN event ID");

  return serviceClient.post<unknown>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/rtdn/${safeEventId}/retry`,
  );
};

export const getGooglePlayVoidedPurchaseRecords = async (
  params: QueryGooglePlayVoidedRecordsParams = {},
): Promise<GooglePlayVoidedPurchaseRecordListResponse> => {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    status: params.status || undefined,
    search: params.search?.trim(),
  });

  return serviceClient.get<GooglePlayVoidedPurchaseRecordListResponse>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/voided-purchases${queryString}`,
  );
};

export const getGooglePlayVoidedPurchaseRecordById = async (
  recordId: string,
): Promise<GooglePlayVoidedPurchaseRecord> => {
  const safeRecordId = assertValidUuid(recordId, "Voided purchase record ID");

  return serviceClient.get<GooglePlayVoidedPurchaseRecord>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/voided-purchases/${safeRecordId}`,
  );
};

export const getGooglePlayRtdnEvents = async (
  params: QueryGooglePlayRtdnEventsParams = {},
): Promise<GooglePlayRtdnEventListResponse> => {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    status: params.status || undefined,
    kind: params.kind || undefined,
    search: params.search?.trim(),
  });

  return serviceClient.get<GooglePlayRtdnEventListResponse>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/rtdn/events${queryString}`,
  );
};

export const getGooglePlayRtdnEventById = async (
  eventId: string,
): Promise<GooglePlayRtdnEvent> => {
  const safeEventId = assertValidUuid(eventId, "RTDN event ID");

  return serviceClient.get<GooglePlayRtdnEvent>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/rtdn/events/${safeEventId}`,
  );
};
