"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  Loader2,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import {
  getGooglePlayReconciliationStatus,
  retryFailedGooglePlayRtdnEvents,
  retryFailedGooglePlayVoidedPurchases,
  retryGooglePlayRtdnEvent,
  retryGooglePlayVoidedPurchaseRecord,
  runGooglePlayVoidedPurchaseReconciliation,
} from "@/service/billing/billing.service";
import type {
  GooglePlayReconciliationStatusResponse,
  GooglePlayRtdnEventStatus,
  GooglePlayVoidedRecordStatus,
  RetryGooglePlayFailuresPayload,
  RunGooglePlayReconciliationPayload,
} from "@/types/billing/billing.type";

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Billing reconciliation action failed.";
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const getCount = <Key extends string>(
  values: Partial<Record<Key, number>> | undefined,
  key: Key,
) => {
  return values?.[key] || 0;
};

const formatJson = (value: unknown) => {
  if (!value) return "—";

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export default function BillingReconciliationClient() {
  const [status, setStatus] =
    useState<GooglePlayReconciliationStatusResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [runningAction, setRunningAction] = useState<string | null>(null);

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

  const [singleRecordId, setSingleRecordId] = useState("");

  const [singleRtdnEventId, setSingleRtdnEventId] = useState("");

  const loadStatus = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getGooglePlayReconciliationStatus();

      setStatus(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const lastResult = status?.checkpoint?.lastResult;

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
      voidedFailed: getCount(voided, "failed"),
      voidedDeadLetter: getCount(voided, "dead_letter"),

      rtdnTotal:
        getCount(rtdn, "pending") +
        getCount(rtdn, "processing") +
        getCount(rtdn, "processed") +
        getCount(rtdn, "failed") +
        getCount(rtdn, "dead_letter"),

      rtdnFailed: getCount(rtdn, "failed"),
      rtdnDeadLetter: getCount(rtdn, "dead_letter"),
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

      await loadStatus();

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

  const handleRetrySingleVoided = () => {
    if (!singleRecordId.trim()) {
      toast.error("Enter a voided purchase record ID.");

      return;
    }

    void runAction(
      "retry-single-voided",
      () => retryGooglePlayVoidedPurchaseRecord(singleRecordId.trim()),
      "Single voided purchase record retried",
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

  const handleRetrySingleRtdn = () => {
    if (!singleRtdnEventId.trim()) {
      toast.error("Enter an RTDN event ID.");

      return;
    }

    void runAction(
      "retry-single-rtdn",
      () => retryGooglePlayRtdnEvent(singleRtdnEventId.trim()),
      "Single RTDN event retried",
    );
  };

  if (isLoading && !status) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-[#006B3F]" />
      </div>
    );
  }

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#006B3F]">
            Billing Reconciliation
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#66736A]">
            Monitor Google Play voided-purchase reconciliation and retry failed
            billing processing jobs. This page never shows raw purchase tokens,
            private keys, or signed payloads.
          </p>
        </div>

        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => void loadStatus()}
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
          helper="Total voided records in backend"
          tone="neutral"
        />

        <StatusMetricCard
          title="Records Processed"
          value={summary.voidedProcessed}
          helper="Successfully processed"
          tone="success"
        />

        <StatusMetricCard
          title="Unmatched Records"
          value={summary.voidedUnmatched}
          helper="Could not match to an internal order yet"
          tone="warning"
        />

        <StatusMetricCard
          title="Failed / Dead Letter"
          value={summary.voidedFailed + summary.voidedDeadLetter}
          helper="Needs retry or manual review"
          tone="danger"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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
                Last run, last successful window and processing checkpoint.
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
              value={formatDateTime(status?.checkpoint?.lastSuccessfulEndTime)}
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

            <pre className="mt-3 max-h-[260px] overflow-auto rounded-xl bg-white p-4 text-xs text-[#202420]">
              {formatJson(lastResult)}
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
              value={runForm.maxPages || 10}
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
              value={runForm.processLimit || 100}
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
            Google Play allows voided-purchase reconciliation only for the
            supported recent window. The backend validates the allowed time
            range.
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card padding="lg" rounded="3xl" shadow="sm" className="space-y-6">
          <div className="flex items-start gap-3">
            <RotateCcw className="mt-1 size-5 text-[#006B3F]" />

            <div>
              <h2 className="text-xl font-bold text-[#202420]">
                Retry Voided Purchase Records
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#66736A]">
                Retry failed/unmatched reconciliation records. A single record
                can be retried only if you already know its backend UUID.
              </p>
            </div>
          </div>

          <RetryOptionsForm
            includeDeadLetter={Boolean(retryForm.includeDeadLetter)}
            limit={Number(retryForm.limit || 100)}
            onIncludeDeadLetterChange={(value) =>
              setRetryForm((current) => ({
                ...current,
                includeDeadLetter: value,
              }))
            }
            onLimitChange={(value) =>
              setRetryForm((current) => ({
                ...current,
                limit: value,
              }))
            }
          />

          <Button
            fullWidth
            disabled={Boolean(runningAction)}
            onClick={handleRetryFailedVoided}
            className="gap-2"
          >
            {runningAction === "retry-voided-failed" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Retry Failed Voided Records
          </Button>

          <div className="space-y-3 border-t border-[#E7EEE8] pt-5">
            <TextField
              label="Single Voided Record ID"
              value={singleRecordId}
              placeholder="UUID from backend logs or future list endpoint"
              onChange={setSingleRecordId}
            />

            <Button
              variant="outline"
              fullWidth
              disabled={Boolean(runningAction)}
              onClick={handleRetrySingleVoided}
            >
              Retry Single Voided Record
            </Button>
          </div>
        </Card>

        <Card padding="lg" rounded="3xl" shadow="sm" className="space-y-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 size-5 text-[#006B3F]" />

            <div>
              <h2 className="text-xl font-bold text-[#202420]">
                RTDN Processing Retry
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#66736A]">
                Backend exposes retry actions for failed Google Play RTDN
                events, but it does not expose an event list yet.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SmallCount label="RTDN Total" value={summary.rtdnTotal} />

            <SmallCount label="RTDN Failed" value={summary.rtdnFailed} />

            <SmallCount
              label="RTDN Dead Letter"
              value={summary.rtdnDeadLetter}
            />
          </div>

          <Button
            fullWidth
            disabled={Boolean(runningAction)}
            onClick={handleRetryFailedRtdn}
            className="gap-2"
          >
            {runningAction === "retry-rtdn-failed" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Retry Failed RTDN Events
          </Button>

          <div className="space-y-3 border-t border-[#E7EEE8] pt-5">
            <TextField
              label="Single RTDN Event ID"
              value={singleRtdnEventId}
              placeholder="UUID from backend logs or future list endpoint"
              onChange={setSingleRtdnEventId}
            />

            <Button
              variant="outline"
              fullWidth
              disabled={Boolean(runningAction)}
              onClick={handleRetrySingleRtdn}
            >
              Retry Single RTDN Event
            </Button>
          </div>
        </Card>
      </div>

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
              Backend endpoint limitation
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6F4A00]">
              This backend currently exposes reconciliation status and retry
              actions, but not a paginated voided-purchase record list or RTDN
              event list. Because of that, this page cannot show row-level
              records, sanitized payload dialogs, or “Open matched order” from a
              table yet.
            </p>
          </div>
        </div>
      </Card>
    </section>
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

function SmallCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#F7FAF7] px-4 py-4 text-center">
      <p className="text-[10px] font-bold uppercase text-[#8A948C]">{label}</p>

      <p className="mt-2 text-2xl font-bold text-[#006B3F]">
        {value.toLocaleString()}
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

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
        {label}
      </span>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none placeholder:text-[#AAB3AD]"
      />
    </label>
  );
}

function RetryOptionsForm({
  includeDeadLetter,
  limit,
  onIncludeDeadLetterChange,
  onLimitChange,
}: {
  includeDeadLetter: boolean;
  limit: number;
  onIncludeDeadLetterChange: (value: boolean) => void;
  onLimitChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_150px]">
      <label className="flex items-center justify-between gap-4 rounded-2xl bg-[#F7FAF7] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[#202420]">
            Include dead-letter records
          </p>

          <p className="mt-1 text-xs text-[#8A948D]">
            Use carefully. Dead-letter records already exhausted normal retry.
          </p>
        </div>

        <input
          type="checkbox"
          checked={includeDeadLetter}
          onChange={(event) => onIncludeDeadLetterChange(event.target.checked)}
          className="size-5 accent-[#006B3F]"
        />
      </label>

      <NumberField
        label="Retry Limit"
        value={limit}
        min={1}
        max={1000}
        onChange={onLimitChange}
      />
    </div>
  );
}
