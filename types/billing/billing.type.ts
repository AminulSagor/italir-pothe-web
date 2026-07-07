export type GooglePlayVoidedRecordStatus =
  | "pending"
  | "processing"
  | "processed"
  | "unmatched"
  | "manual_review"
  | "failed"
  | "dead_letter";

export type GooglePlayRtdnEventStatus =
  | "pending"
  | "processing"
  | "processed"
  | "failed"
  | "dead_letter";

export type GooglePlayRtdnNotificationKind =
  | "one_time_product"
  | "subscription"
  | "test"
  | string;

export interface GooglePlayReconciliationCheckpoint {
  key: "voided_purchases";
  lastSuccessfulEndTime: string | null;
  lastStartedAt: string | null;
  lastCompletedAt: string | null;
  lastFailedAt: string | null;
  leaseOwner: string | null;
  leaseExpiresAt: string | null;
  lastErrorMessage: string | null;
  lastResult: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface GooglePlayReconciliationStatusResponse {
  checkpoint: GooglePlayReconciliationCheckpoint | null;

  voidedPurchases: Partial<Record<GooglePlayVoidedRecordStatus, number>>;

  rtdn: Partial<Record<GooglePlayRtdnEventStatus, number>>;
}

export interface RunGooglePlayReconciliationPayload {
  startTime?: string;
  endTime?: string;
  maxPages?: number;
  processLimit?: number;
}

export interface GooglePlayVoidedReconciliationSummary {
  alreadyRunning: boolean;
  windowStart: string | null;
  windowEnd: string | null;
  pagesFetched: number;
  recordsSeen: number;
  recordsInserted: number;
  recordsProcessed: number;
  recordsUnmatched: number;
  recordsFailed: number;
}

export interface RetryGooglePlayFailuresPayload {
  includeDeadLetter?: boolean;
  limit?: number;
}

export interface RetryGooglePlayFailuresResponse {
  queued: number;
  processed?: number;
  unmatched?: number;
  failed?: number;
}

export interface BillingPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface QueryGooglePlayVoidedRecordsParams {
  page?: number;
  limit?: number;
  status?: GooglePlayVoidedRecordStatus | "";
  search?: string;
}

export interface GooglePlayVoidedPurchaseRecord {
  id: string;
  fingerprint: string | null;
  providerOrderId: string | null;
  purchaseTokenHash: string | null;

  purchaseTime: string | null;
  voidedTime: string | null;
  voidedReason: string | null;
  voidedSource: string | null;
  voidedQuantity: number | null;

  matchedDomain: string | null;
  internalOrderId: string | null;

  status: GooglePlayVoidedRecordStatus;
  attemptCount: number;

  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  nextAttemptAt: string | null;
  processingStartedAt: string | null;
  processedAt: string | null;

  discoveredAt: string;
  updatedAt: string;

  processingResult?: Record<string, unknown> | null;
}

export interface GooglePlayVoidedPurchaseRecordListResponse {
  items: GooglePlayVoidedPurchaseRecord[];
  meta: BillingPaginationMeta;
}

export interface QueryGooglePlayRtdnEventsParams {
  page?: number;
  limit?: number;
  status?: GooglePlayRtdnEventStatus | "";
  kind?: GooglePlayRtdnNotificationKind | "";
  search?: string;
}

export interface GooglePlayRtdnEvent {
  id: string;

  messageId: string | null;
  pubsubSubscription: string | null;
  publishTime: string | null;

  packageName: string | null;
  eventTime: string | null;

  notificationKind: GooglePlayRtdnNotificationKind | null;
  notificationType: string | number | null;

  productId: string | null;
  providerOrderId: string | null;
  purchaseTokenHash: string | null;

  status: GooglePlayRtdnEventStatus;
  attemptCount: number;

  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  nextAttemptAt: string | null;
  processingStartedAt: string | null;
  processedAt: string | null;

  receivedAt: string;
  updatedAt: string;

  pubsubAttributes?: Record<string, unknown> | null;
  authoritativePayload?: Record<string, unknown> | null;
  processingResult?: Record<string, unknown> | null;
}

export interface GooglePlayRtdnEventListResponse {
  items: GooglePlayRtdnEvent[];
  meta: BillingPaginationMeta;
}
