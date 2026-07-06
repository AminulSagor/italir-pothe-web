import { serviceClient } from "@/service/base/service_client";
import type {
  GooglePlayReconciliationStatusResponse,
  GooglePlayVoidedReconciliationSummary,
  RetryGooglePlayFailuresPayload,
  RetryGooglePlayFailuresResponse,
  RunGooglePlayReconciliationPayload,
} from "@/types/billing/billing.type";
import { assertValidUuid } from "@/utils/uuid";

const GOOGLE_PLAY_RECONCILIATION_BASE =
  "/admin/billing/google-play/reconciliation";

export const getGooglePlayReconciliationStatus = async () => {
  return serviceClient.get<GooglePlayReconciliationStatusResponse>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/status`,
  );
};

export const runGooglePlayVoidedPurchaseReconciliation = async (
  payload: RunGooglePlayReconciliationPayload = {},
) => {
  return serviceClient.post<GooglePlayVoidedReconciliationSummary>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/voided-purchases/run`,
    payload,
  );
};

export const retryFailedGooglePlayVoidedPurchases = async (
  payload: RetryGooglePlayFailuresPayload = {},
) => {
  return serviceClient.post<RetryGooglePlayFailuresResponse>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/voided-purchases/retry-failed`,
    payload,
  );
};

export const retryGooglePlayVoidedPurchaseRecord = async (recordId: string) => {
  const safeRecordId = assertValidUuid(recordId, "Voided purchase record ID");

  return serviceClient.post<unknown>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/voided-purchases/${safeRecordId}/retry`,
  );
};

export const retryFailedGooglePlayRtdnEvents = async (
  payload: RetryGooglePlayFailuresPayload = {},
) => {
  return serviceClient.post<RetryGooglePlayFailuresResponse>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/rtdn/retry-failed`,
    payload,
  );
};

export const retryGooglePlayRtdnEvent = async (eventId: string) => {
  const safeEventId = assertValidUuid(eventId, "RTDN event ID");

  return serviceClient.post<unknown>(
    `${GOOGLE_PLAY_RECONCILIATION_BASE}/rtdn/${safeEventId}/retry`,
  );
};
