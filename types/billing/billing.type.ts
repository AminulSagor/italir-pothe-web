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
