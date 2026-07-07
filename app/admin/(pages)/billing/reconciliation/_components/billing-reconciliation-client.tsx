"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  Eye,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import Dialog from "@/components/UI/dialogs/dialog";
import {
  getGooglePlayReconciliationStatus,
  getGooglePlayRtdnEventById,
  getGooglePlayRtdnEvents,
  getGooglePlayVoidedPurchaseRecordById,
  getGooglePlayVoidedPurchaseRecords,
  retryFailedGooglePlayRtdnEvents,
  retryFailedGooglePlayVoidedPurchases,
  retryGooglePlayRtdnEvent,
  retryGooglePlayVoidedPurchaseRecord,
  runGooglePlayVoidedPurchaseReconciliation,
} from "@/service/billing/billing.service";
import type {
  GooglePlayReconciliationStatusResponse,
  GooglePlayRtdnEvent,
  GooglePlayRtdnEventListResponse,
  GooglePlayRtdnEventStatus,
  GooglePlayVoidedPurchaseRecord,
  GooglePlayVoidedPurchaseRecordListResponse,
  GooglePlayVoidedRecordStatus,
  RetryGooglePlayFailuresPayload,
  RunGooglePlayReconciliationPayload,
} from "@/types/billing/billing.type";

const emptyVoidedResponse: GooglePlayVoidedPurchaseRecordListResponse = {
  items: [],
  meta: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

const emptyRtdnResponse: GooglePlayRtdnEventListResponse = {
  items: [],
  meta: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Billing request failed.";
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const formatLabel = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatJson = (value: unknown) => {
  if (!value) return "—";

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const getCount = <Key extends string>(
  values: Partial<Record<Key, number>> | undefined,
  key: Key,
) => {
  return values?.[key] || 0;
};

const getStatusClass = (status?: string | null) => {
  if (status === "processed" || status === "verified") {
    return "bg-[#DDF3E8] text-[#007A35]";
  }

  if (
    status === "failed" ||
    status === "dead_letter" ||
    status === "manual_review"
  ) {
    return "bg-[#FCEBEC] text-[#B42318]";
  }

  if (
    status === "pending" ||
    status === "processing" ||
    status === "unmatched"
  ) {
    return "bg-[#FFF3C6] text-[#B77900]";
  }

  return "bg-[#EEF3EC] text-[#4F5B52]";
};

export default function BillingReconciliationClient() {
  const [status, setStatus] =
    useState<GooglePlayReconciliationStatusResponse | null>(null);

  const [voidedResponse, setVoidedResponse] =
    useState<GooglePlayVoidedPurchaseRecordListResponse>(emptyVoidedResponse);

  const [rtdnResponse, setRtdnResponse] =
    useState<GooglePlayRtdnEventListResponse>(emptyRtdnResponse);

  const [isLoading, setIsLoading] = useState(true);
  const [runningAction, setRunningAction] = useState<string | null>(null);

  const [voidedSearch, setVoidedSearch] = useState("");
  const [voidedStatus, setVoidedStatus] = useState<
    GooglePlayVoidedRecordStatus | ""
  >("");
  const [voidedPage, setVoidedPage] = useState(1);

  const [rtdnSearch, setRtdnSearch] = useState("");
  const [rtdnStatus, setRtdnStatus] = useState<GooglePlayRtdnEventStatus | "">(
    "",
  );
  const [rtdnKind, setRtdnKind] = useState("");
  const [rtdnPage, setRtdnPage] = useState(1);

  const [runForm, setRunForm] = useState<RunGooglePlayReconciliationPayload>({
    startTime: "",
    endTime: "",
    maxPages: 10,
    processLimit: 100,
  });

  const [retryForm, setRetryForm] = useState<RetryGooglePlayFailuresPayload>({
    includeDeadLetter: false,
    limit: 100,
  });

  const [selectedVoidedRecord, setSelectedVoidedRecord] =
    useState<GooglePlayVoidedPurchaseRecord | null>(null);

  const [selectedRtdnEvent, setSelectedRtdnEvent] =
    useState<GooglePlayRtdnEvent | null>(null);

  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const loadStatus = useCallback(async () => {
    const response = await getGooglePlayReconciliationStatus();
    setStatus(response);
  }, []);

  const loadVoidedRecords = useCallback(async () => {
    const response = await getGooglePlayVoidedPurchaseRecords({
      page: voidedPage,
      limit: 10,
      status: voidedStatus,
      search: voidedSearch,
    });

    setVoidedResponse(response);
  }, [voidedPage, voidedSearch, voidedStatus]);

  const loadRtdnEvents = useCallback(async () => {
    const response = await getGooglePlayRtdnEvents({
      page: rtdnPage,
      limit: 10,
      status: rtdnStatus,
      kind: rtdnKind,
      search: rtdnSearch,
    });

    setRtdnResponse(response);
  }, [rtdnKind, rtdnPage, rtdnSearch, rtdnStatus]);

  const loadAll = useCallback(async () => {
    try {
      setIsLoading(true);

      await Promise.all([loadStatus(), loadVoidedRecords(), loadRtdnEvents()]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [loadRtdnEvents, loadStatus, loadVoidedRecords]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const summary = useMemo(() => {
    const voided = status?.voidedPurchases;
    const rtdn = status?.rtdn;

    return {
      voidedTotal:
        getCount(voided, "pending") +
        getCount(voided, "processing") +
        getCount(voided, "processed") +
        getCount(voided, "unmatched") +
        getCount(voided, "manual_review") +
        getCount(voided, "failed") +
        getCount(voided, "dead_letter"),

      voidedProcessed: getCount(voided, "processed"),
      voidedUnmatched: getCount(voided, "unmatched"),
      voidedFailed:
        getCount(voided, "failed") + getCount(voided, "dead_letter"),

      rtdnTotal:
        getCount(rtdn, "pending") +
        getCount(rtdn, "processing") +
        getCount(rtdn, "processed") +
        getCount(rtdn, "failed") +
        getCount(rtdn, "dead_letter"),

      rtdnFailed: getCount(rtdn, "failed") + getCount(rtdn, "dead_letter"),
    };
  }, [status]);

  const runAction = async (
    actionName: string,
    action: () => Promise<unknown>,
    successMessage: string,
  ) => {
    const toastId = toast.loading(`${successMessage}...`);

    try {
      setRunningAction(actionName);

      await action();
      await loadAll();

      toast.success(successMessage, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setRunningAction(null);
    }
  };

  const handleRunReconciliation = () => {
    const payload: RunGooglePlayReconciliationPayload = {};

    if (runForm.startTime) {
      payload.startTime = runForm.startTime;
    }

    if (runForm.endTime) {
      payload.endTime = runForm.endTime;
    }

    if (runForm.maxPages) {
      payload.maxPages = Number(runForm.maxPages);
    }

    if (runForm.processLimit) {
      payload.processLimit = Number(runForm.processLimit);
    }

    void runAction(
      "run-voided",
      () => runGooglePlayVoidedPurchaseReconciliation(payload),
      "Voided purchase reconciliation completed",
    );
  };

  const handleRetryFailedVoided = () => {
    void runAction(
      "retry-voided-failed",
      () =>
        retryFailedGooglePlayVoidedPurchases({
          includeDeadLetter: retryForm.includeDeadLetter,
          limit: Number(retryForm.limit) || 100,
        }),
      "Failed voided purchase records retried",
    );
  };

  const handleRetryFailedRtdn = () => {
    void runAction(
      "retry-rtdn-failed",
      () =>
        retryFailedGooglePlayRtdnEvents({
          includeDeadLetter: retryForm.includeDeadLetter,
          limit: Number(retryForm.limit) || 100,
        }),
      "Failed RTDN events retried",
    );
  };

  const handleRetryVoidedRow = (recordId: string) => {
    void runAction(
      `retry-voided-${recordId}`,
      () => retryGooglePlayVoidedPurchaseRecord(recordId),
      "Voided purchase record retried",
    );
  };

  const handleRetryRtdnRow = (eventId: string) => {
    void runAction(
      `retry-rtdn-${eventId}`,
      () => retryGooglePlayRtdnEvent(eventId),
      "RTDN event retried",
    );
  };

  const openVoidedDetails = async (recordId: string) => {
    try {
      setIsDetailsLoading(true);

      const response = await getGooglePlayVoidedPurchaseRecordById(recordId);

      setSelectedVoidedRecord(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const openRtdnDetails = async (eventId: string) => {
    try {
      setIsDetailsLoading(true);

      const response = await getGooglePlayRtdnEventById(eventId);

      setSelectedRtdnEvent(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDetailsLoading(false);
    }
  };

  if (isLoading && !status) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-[#006B3F]" />
      </div>
    );
  }

  return (
    <>
      <section className="space-y-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#006B3F]">
              Billing Reconciliation
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#66736A]">
              Monitor Google Play voided-purchase reconciliation and RTDN event
              processing. This page shows only sanitized provider data, token
              hashes, processing results and matched internal order IDs.
            </p>
          </div>

          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => void loadAll()}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Refresh
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatusMetricCard
            title="Records Found"
            value={summary.voidedTotal}
            helper="Total voided purchase records"
            tone="neutral"
          />

          <StatusMetricCard
            title="Records Processed"
            value={summary.voidedProcessed}
            helper="Successfully matched and processed"
            tone="success"
          />

          <StatusMetricCard
            title="Unmatched Records"
            value={summary.voidedUnmatched}
            helper="Need matching or manual review"
            tone="warning"
          />

          <StatusMetricCard
            title="Failed / Dead Letter"
            value={summary.voidedFailed + summary.rtdnFailed}
            helper="Voided records and RTDN events needing retry"
            tone="danger"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card padding="lg" rounded="3xl" shadow="sm" className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-[#DDF3E8] text-[#006B3F]">
                <DatabaseZap className="size-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#202420]">
                  Reconciliation Status
                </h2>

                <p className="text-sm text-[#66736A]">
                  Last run, checkpoint window and backend processing state.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DetailBox
                label="Last Run Started"
                value={formatDateTime(status?.checkpoint?.lastStartedAt)}
              />

              <DetailBox
                label="Last Completed"
                value={formatDateTime(status?.checkpoint?.lastCompletedAt)}
              />

              <DetailBox
                label="Last Failed"
                value={formatDateTime(status?.checkpoint?.lastFailedAt)}
              />

              <DetailBox
                label="Last Successful Window"
                value={formatDateTime(
                  status?.checkpoint?.lastSuccessfulEndTime,
                )}
              />

              <DetailBox
                label="Lease Owner"
                value={status?.checkpoint?.leaseOwner || "—"}
              />

              <DetailBox
                label="Lease Expires At"
                value={formatDateTime(status?.checkpoint?.leaseExpiresAt)}
              />
            </div>

            {status?.checkpoint?.lastErrorMessage && (
              <div className="rounded-2xl border border-[#F4D5D2] bg-[#FFF7F6] p-4">
                <p className="text-xs font-bold uppercase text-[#B42318]">
                  Last Error
                </p>

                <p className="mt-2 text-sm leading-6 text-[#7A2E25]">
                  {status.checkpoint.lastErrorMessage}
                </p>
              </div>
            )}

            <div className="rounded-2xl bg-[#F7FAF7] p-4">
              <p className="text-xs font-bold uppercase text-[#66736A]">
                Last Result
              </p>

              <pre className="mt-3 max-h-[240px] overflow-auto rounded-xl bg-white p-4 text-xs text-[#202420]">
                {formatJson(status?.checkpoint?.lastResult)}
              </pre>
            </div>
          </Card>

          <Card padding="lg" rounded="3xl" shadow="sm" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#202420]">
                Run Voided Purchase Reconciliation
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#66736A]">
                Leave dates empty to let backend use the checkpoint window.
              </p>
            </div>

            <div className="space-y-4">
              <DateTimeField
                label="Start Time"
                value={runForm.startTime || ""}
                onChange={(value) =>
                  setRunForm((current) => ({
                    ...current,
                    startTime: value,
                  }))
                }
              />

              <DateTimeField
                label="End Time"
                value={runForm.endTime || ""}
                onChange={(value) =>
                  setRunForm((current) => ({
                    ...current,
                    endTime: value,
                  }))
                }
              />

              <NumberField
                label="Max Pages"
                value={Number(runForm.maxPages || 10)}
                min={1}
                max={100}
                onChange={(value) =>
                  setRunForm((current) => ({
                    ...current,
                    maxPages: value,
                  }))
                }
              />

              <NumberField
                label="Process Limit"
                value={Number(runForm.processLimit || 100)}
                min={1}
                max={1000}
                onChange={(value) =>
                  setRunForm((current) => ({
                    ...current,
                    processLimit: value,
                  }))
                }
              />
            </div>

            <Button
              fullWidth
              disabled={Boolean(runningAction)}
              onClick={handleRunReconciliation}
              className="gap-2"
            >
              {runningAction === "run-voided" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Run Voided Purchase Reconciliation
            </Button>

            <div className="rounded-2xl border border-[#FFE2A8] bg-[#FFF8E8] p-4 text-xs leading-5 text-[#8A5A00]">
              Google Play controls refund settlement. Backend reconciliation
              only matches Google voided purchases to internal orders and
              revokes entitlements when applicable.
            </div>
          </Card>
        </div>

        <Card padding="lg" rounded="3xl" shadow="sm" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#202420]">
                Google Play Voided Purchase Records
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#66736A]">
                Row-level refund/revoke records returned by Google Play and
                processed by backend reconciliation.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <SearchField
                value={voidedSearch}
                placeholder="Search order ID, token hash, internal order ID..."
                onChange={(value) => {
                  setVoidedSearch(value);
                  setVoidedPage(1);
                }}
              />

              <select
                value={voidedStatus}
                onChange={(event) => {
                  setVoidedStatus(
                    event.target.value as GooglePlayVoidedRecordStatus | "",
                  );
                  setVoidedPage(1);
                }}
                className="h-11 rounded-full border border-[#D9E2DA] bg-white px-4 text-sm outline-none"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="processed">Processed</option>
                <option value="unmatched">Unmatched</option>
                <option value="manual_review">Manual Review</option>
                <option value="failed">Failed</option>
                <option value="dead_letter">Dead Letter</option>
              </select>

              <Button
                variant="outline"
                disabled={Boolean(runningAction)}
                onClick={handleRetryFailedVoided}
                className="gap-2"
              >
                {runningAction === "retry-voided-failed" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RotateCcw className="size-4" />
                )}
                Retry Failed
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px]">
              <thead>
                <tr className="bg-[#F7FAF7] text-left text-xs font-bold uppercase text-[#66736A]">
                  <th className="px-4 py-4">Provider Order</th>
                  <th className="px-4 py-4">Token Hash</th>
                  <th className="px-4 py-4">Matched Order</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Attempts</th>
                  <th className="px-4 py-4">Voided At</th>
                  <th className="px-4 py-4">Processed At</th>
                  <th className="px-4 py-4">Last Error</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {voidedResponse.items.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-sm text-[#66736A]"
                    >
                      No voided purchase records found.
                    </td>
                  </tr>
                )}

                {voidedResponse.items.map((record) => (
                  <tr key={record.id} className="border-t border-[#EEF3EC]">
                    <td className="max-w-[220px] break-all px-4 py-5 text-xs text-[#202420]">
                      {record.providerOrderId || "—"}
                    </td>

                    <td className="max-w-[220px] break-all px-4 py-5 text-xs text-[#4F5B52]">
                      {record.purchaseTokenHash || "—"}
                    </td>

                    <td className="px-4 py-5 text-xs text-[#4F5B52]">
                      <p>{formatLabel(record.matchedDomain)}</p>
                      <p className="mt-1 max-w-[220px] break-all">
                        {record.internalOrderId || "—"}
                      </p>
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          record.status,
                        )}`}
                      >
                        {formatLabel(record.status)}
                      </span>
                    </td>

                    <td className="px-4 py-5 text-sm font-semibold text-[#202420]">
                      {record.attemptCount}
                    </td>

                    <td className="px-4 py-5 text-xs text-[#4F5B52]">
                      {formatDateTime(record.voidedTime)}
                    </td>

                    <td className="px-4 py-5 text-xs text-[#4F5B52]">
                      {formatDateTime(record.processedAt)}
                    </td>

                    <td className="max-w-[260px] px-4 py-5 text-xs text-[#B42318]">
                      {record.lastErrorMessage || "—"}
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          disabled={isDetailsLoading}
                          onClick={() => void openVoidedDetails(record.id)}
                          className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-[#4F5B52]"
                          aria-label="View voided record"
                        >
                          <Eye className="size-4" />
                        </button>

                        <button
                          type="button"
                          disabled={Boolean(runningAction)}
                          onClick={() => handleRetryVoidedRow(record.id)}
                          className="flex size-9 items-center justify-center rounded-full bg-[#FFF3C6] text-[#B77900] disabled:opacity-60"
                          aria-label="Retry voided record"
                        >
                          {runningAction === `retry-voided-${record.id}` ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <RotateCcw className="size-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationBar
            page={voidedResponse.meta.page}
            totalPages={voidedResponse.meta.totalPages}
            total={voidedResponse.meta.total}
            onPageChange={setVoidedPage}
          />
        </Card>

        <Card padding="lg" rounded="3xl" shadow="sm" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#202420]">
                Google Play RTDN Events
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#66736A]">
                Real-time Developer Notification events received from Google
                Play Pub/Sub.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <SearchField
                value={rtdnSearch}
                placeholder="Search message, product, order, token hash..."
                onChange={(value) => {
                  setRtdnSearch(value);
                  setRtdnPage(1);
                }}
              />

              <select
                value={rtdnStatus}
                onChange={(event) => {
                  setRtdnStatus(
                    event.target.value as GooglePlayRtdnEventStatus | "",
                  );
                  setRtdnPage(1);
                }}
                className="h-11 rounded-full border border-[#D9E2DA] bg-white px-4 text-sm outline-none"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="processed">Processed</option>
                <option value="failed">Failed</option>
                <option value="dead_letter">Dead Letter</option>
              </select>

              <input
                value={rtdnKind}
                onChange={(event) => {
                  setRtdnKind(event.target.value);
                  setRtdnPage(1);
                }}
                placeholder="Notification kind"
                className="h-11 rounded-full border border-[#D9E2DA] bg-white px-4 text-sm outline-none placeholder:text-[#AAB3AD]"
              />

              <Button
                variant="outline"
                disabled={Boolean(runningAction)}
                onClick={handleRetryFailedRtdn}
                className="gap-2"
              >
                {runningAction === "retry-rtdn-failed" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RotateCcw className="size-4" />
                )}
                Retry Failed
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1380px]">
              <thead>
                <tr className="bg-[#F7FAF7] text-left text-xs font-bold uppercase text-[#66736A]">
                  <th className="px-4 py-4">Message ID</th>
                  <th className="px-4 py-4">Notification</th>
                  <th className="px-4 py-4">Product / Order</th>
                  <th className="px-4 py-4">Token Hash</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Attempts</th>
                  <th className="px-4 py-4">Received At</th>
                  <th className="px-4 py-4">Processed At</th>
                  <th className="px-4 py-4">Last Error</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rtdnResponse.items.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-12 text-center text-sm text-[#66736A]"
                    >
                      No RTDN events found.
                    </td>
                  </tr>
                )}

                {rtdnResponse.items.map((event) => (
                  <tr key={event.id} className="border-t border-[#EEF3EC]">
                    <td className="max-w-[220px] break-all px-4 py-5 text-xs text-[#202420]">
                      {event.messageId || "—"}
                    </td>

                    <td className="px-4 py-5 text-xs text-[#4F5B52]">
                      <p className="font-semibold text-[#202420]">
                        {formatLabel(event.notificationKind)}
                      </p>
                      <p className="mt-1">
                        Type: {formatLabel(event.notificationType)}
                      </p>
                    </td>

                    <td className="px-4 py-5 text-xs text-[#4F5B52]">
                      <p className="max-w-[220px] break-all">
                        Product: {event.productId || "—"}
                      </p>
                      <p className="mt-1 max-w-[220px] break-all">
                        Order: {event.providerOrderId || "—"}
                      </p>
                    </td>

                    <td className="max-w-[220px] break-all px-4 py-5 text-xs text-[#4F5B52]">
                      {event.purchaseTokenHash || "—"}
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          event.status,
                        )}`}
                      >
                        {formatLabel(event.status)}
                      </span>
                    </td>

                    <td className="px-4 py-5 text-sm font-semibold text-[#202420]">
                      {event.attemptCount}
                    </td>

                    <td className="px-4 py-5 text-xs text-[#4F5B52]">
                      {formatDateTime(event.receivedAt)}
                    </td>

                    <td className="px-4 py-5 text-xs text-[#4F5B52]">
                      {formatDateTime(event.processedAt)}
                    </td>

                    <td className="max-w-[260px] px-4 py-5 text-xs text-[#B42318]">
                      {event.lastErrorMessage || "—"}
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          disabled={isDetailsLoading}
                          onClick={() => void openRtdnDetails(event.id)}
                          className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-[#4F5B52]"
                          aria-label="View RTDN event"
                        >
                          <Eye className="size-4" />
                        </button>

                        <button
                          type="button"
                          disabled={Boolean(runningAction)}
                          onClick={() => handleRetryRtdnRow(event.id)}
                          className="flex size-9 items-center justify-center rounded-full bg-[#FFF3C6] text-[#B77900] disabled:opacity-60"
                          aria-label="Retry RTDN event"
                        >
                          {runningAction === `retry-rtdn-${event.id}` ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <RotateCcw className="size-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationBar
            page={rtdnResponse.meta.page}
            totalPages={rtdnResponse.meta.totalPages}
            total={rtdnResponse.meta.total}
            onPageChange={setRtdnPage}
          />
        </Card>

        <Card
          padding="lg"
          rounded="3xl"
          shadow="sm"
          className="border border-[#FFE2A8] bg-[#FFFDF6]"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 size-5 text-[#A86500]" />

            <div>
              <h2 className="text-lg font-bold text-[#202420]">
                Sensitive data safety
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6F4A00]">
                This page must never show full purchase tokens, encrypted
                payloads, private keys, .p8 files or raw signed payloads.
                Backend only returns token hashes, provider order IDs, sanitized
                authoritative payload and processing result.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <VoidedRecordDetailsDialog
        record={selectedVoidedRecord}
        onClose={() => setSelectedVoidedRecord(null)}
      />

      <RtdnEventDetailsDialog
        event={selectedRtdnEvent}
        onClose={() => setSelectedRtdnEvent(null)}
      />
    </>
  );
}

function StatusMetricCard({
  title,
  value,
  helper,
  tone,
}: {
  title: string;
  value: number;
  helper: string;
  tone: "neutral" | "success" | "warning" | "danger";
}) {
  const config = {
    neutral: {
      icon: DatabaseZap,
      bg: "bg-[#EEF3EC]",
      text: "text-[#006B3F]",
    },
    success: {
      icon: CheckCircle2,
      bg: "bg-[#DDF3E8]",
      text: "text-[#006B3F]",
    },
    warning: {
      icon: Clock3,
      bg: "bg-[#FFF3C6]",
      text: "text-[#B77900]",
    },
    danger: {
      icon: ShieldAlert,
      bg: "bg-[#FCEBEC]",
      text: "text-[#B42318]",
    },
  }[tone];

  const Icon = config.icon;

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#66736A]">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-[#202420]">
            {value.toLocaleString()}
          </h3>

          <p className="mt-2 text-xs leading-5 text-[#8A948D]">{helper}</p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-full ${config.bg} ${config.text}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F7FAF7] px-4 py-3">
      <p className="text-[10px] font-bold uppercase text-[#8A948C]">{label}</p>

      <p className="mt-1 break-all text-sm font-semibold text-[#202420]">
        {value}
      </p>
    </div>
  );
}

function DateTimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
        {label}
      </span>

      <input
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
      />
    </label>
  );
}

function SearchField({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-11 min-w-[260px] items-center gap-2 rounded-full border border-[#D9E2DA] bg-white px-4">
      <Search className="size-4 text-[#8A948D]" />

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-[#AAB3AD]"
      />
    </div>
  );
}

function PaginationBar({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-t border-[#EEF3EC] pt-5 text-sm text-[#66736A] md:flex-row md:items-center">
      <p>
        Total records:{" "}
        <span className="font-bold text-[#202420]">
          {total.toLocaleString()}
        </span>
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        <span className="text-sm font-semibold text-[#202420]">
          Page {page} of {Math.max(totalPages, 1)}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function VoidedRecordDetailsDialog({
  record,
  onClose,
}: {
  record: GooglePlayVoidedPurchaseRecord | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(record)} onClose={onClose} size="lg" className="p-0">
      <div className="border-b border-[#EEF3EC] px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC]"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-xl font-bold text-[#006B3F]">
          Voided Purchase Record
        </h2>

        <p className="mt-2 text-sm text-[#66736A]">
          Sanitized Google Play voided-purchase processing details.
        </p>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-7 py-6">
        {record && (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailBox label="Record ID" value={record.id} />
              <DetailBox label="Status" value={formatLabel(record.status)} />
              <DetailBox
                label="Provider Order ID"
                value={record.providerOrderId || "—"}
              />
              <DetailBox
                label="Purchase Token Hash"
                value={record.purchaseTokenHash || "—"}
              />
              <DetailBox
                label="Matched Domain"
                value={formatLabel(record.matchedDomain)}
              />
              <DetailBox
                label="Internal Order ID"
                value={record.internalOrderId || "—"}
              />
              <DetailBox
                label="Voided Time"
                value={formatDateTime(record.voidedTime)}
              />
              <DetailBox
                label="Processed At"
                value={formatDateTime(record.processedAt)}
              />
            </div>

            <div className="rounded-2xl border border-[#F4D5D2] bg-[#FFF7F6] p-4">
              <p className="text-xs font-bold uppercase text-[#B42318]">
                Last Error
              </p>

              <p className="mt-2 text-sm leading-6 text-[#7A2E25]">
                {record.lastErrorMessage || "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FAF7] p-4">
              <p className="text-xs font-bold uppercase text-[#66736A]">
                Processing Result
              </p>

              <pre className="mt-3 max-h-[300px] overflow-auto rounded-xl bg-white p-4 text-xs text-[#202420]">
                {formatJson(record.processingResult)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

function RtdnEventDetailsDialog({
  event,
  onClose,
}: {
  event: GooglePlayRtdnEvent | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(event)} onClose={onClose} size="lg" className="p-0">
      <div className="border-b border-[#EEF3EC] px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC]"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-xl font-bold text-[#006B3F]">
          Google Play RTDN Event
        </h2>

        <p className="mt-2 text-sm text-[#66736A]">
          Sanitized Pub/Sub notification and backend processing result.
        </p>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-7 py-6">
        {event && (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailBox label="Event ID" value={event.id} />
              <DetailBox label="Message ID" value={event.messageId || "—"} />
              <DetailBox
                label="Notification Kind"
                value={formatLabel(event.notificationKind)}
              />
              <DetailBox
                label="Notification Type"
                value={formatLabel(event.notificationType)}
              />
              <DetailBox label="Product ID" value={event.productId || "—"} />
              <DetailBox
                label="Provider Order ID"
                value={event.providerOrderId || "—"}
              />
              <DetailBox
                label="Purchase Token Hash"
                value={event.purchaseTokenHash || "—"}
              />
              <DetailBox label="Status" value={formatLabel(event.status)} />
              <DetailBox
                label="Received At"
                value={formatDateTime(event.receivedAt)}
              />
              <DetailBox
                label="Processed At"
                value={formatDateTime(event.processedAt)}
              />
            </div>

            <div className="rounded-2xl border border-[#F4D5D2] bg-[#FFF7F6] p-4">
              <p className="text-xs font-bold uppercase text-[#B42318]">
                Last Error
              </p>

              <p className="mt-2 text-sm leading-6 text-[#7A2E25]">
                {event.lastErrorMessage || "—"}
              </p>
            </div>

            <JsonBlock
              title="Pub/Sub Attributes"
              value={event.pubsubAttributes}
            />

            <JsonBlock
              title="Authoritative Payload"
              value={event.authoritativePayload}
            />

            <JsonBlock
              title="Processing Result"
              value={event.processingResult}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="rounded-2xl bg-[#F7FAF7] p-4">
      <p className="text-xs font-bold uppercase text-[#66736A]">{title}</p>

      <pre className="mt-3 max-h-[300px] overflow-auto rounded-xl bg-white p-4 text-xs text-[#202420]">
        {formatJson(value)}
      </pre>
    </div>
  );
}
