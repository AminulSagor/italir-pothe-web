"use client";

import { ExternalLink, Loader2, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAiContentReports,
  updateAiContentReportStatus,
} from "@/service/ai-content-reports/ai-content-reports.service";
import type {
  AiContentReportFeatureType,
  AiContentReportItem,
  AiContentReportsResponse,
  AiContentReportStatus,
} from "@/types/ai-content-reports/ai-content-reports.type";

import ModerationTabs from "../../_components/moderation-tabs";

const PAGE_LIMIT = 20;

const statusOptions: AiContentReportStatus[] = [
  "pending",
  "reviewed",
  "resolved",
  "dismissed",
];

const formatLabel = (value: string) => {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load AI reports.";
};

export default function AiReportsClient() {
  const [response, setResponse] = useState<AiContentReportsResponse | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AiContentReportStatus | "all">("all");
  const [featureType, setFeatureType] = useState<
    AiContentReportFeatureType | "all"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);

      const result = await getAiContentReports({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        status,
        featureType,
      });

      setResponse(result);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [featureType, page, search, status]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const updateStatus = async (
    report: AiContentReportItem,
    nextStatus: AiContentReportStatus,
  ) => {
    try {
      setUpdatingId(report.id);

      const updated = await updateAiContentReportStatus(report.id, {
        status: nextStatus,
      });

      setResponse((current) => {
        if (!current) return current;

        return {
          ...current,
          items: current.items.map((item) =>
            item.id === updated.id ? updated : item,
          ),
        };
      });

      toast.success("AI report status updated.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  };

  const items = response?.items ?? [];
  const totalPages = Math.max(1, response?.meta.totalPages ?? 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black/90">
            AI Content Reports
          </h1>
          <p className="mt-2 text-sm text-black/55">
            Review reports submitted for AI writing, talking, and CV builder
            output.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadReports()}
          disabled={isLoading}
          className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-secondary shadow-sm disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Refresh
        </button>
      </div>

      <ModerationTabs />

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-black/10 px-4">
            <Search className="size-4 text-black/40" />
            <input
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search user, issue, or AI content"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <select
            value={featureType}
            onChange={(event) => {
              setPage(1);
              setFeatureType(
                event.target.value as AiContentReportFeatureType | "all",
              );
            }}
            className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All AI features</option>
            <option value="writing">Writing</option>
            <option value="talking">Talking</option>
            <option value="cv_builder">CV Builder</option>
          </select>

          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as AiContentReportStatus | "all");
            }}
            className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All statuses</option>
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-xs uppercase tracking-wide text-black/55">
              <tr>
                <th className="px-5 py-4">Reported</th>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Feature</th>
                <th className="px-5 py-4">Issue</th>
                <th className="px-5 py-4">Report content</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5">
              {isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin text-secondary" />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-14 text-center text-black/45"
                  >
                    No AI reports found.
                  </td>
                </tr>
              ) : (
                items.map((report) => (
                  <tr key={report.id} className="align-top">
                    <td className="whitespace-nowrap px-5 py-5 text-black/60">
                      {formatDate(report.createdAt)}
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-semibold text-black/85">
                        {report.reporter.fullName || "Unknown user"}
                      </p>
                      <p className="mt-1 text-xs text-black/45">
                        {report.reporter.email || report.reporter.phone || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-5 font-medium text-black/70">
                      {formatLabel(report.featureType)}
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {formatLabel(report.issue)}
                      </span>
                    </td>

                    <td className="max-w-[420px] px-5 py-5">
                      <details>
                        <summary className="cursor-pointer font-semibold text-secondary">
                          View details
                        </summary>

                        <div className="mt-3 space-y-3 rounded-xl bg-black/[0.025] p-4 text-xs leading-5 text-black/65">
                          <div>
                            <p className="font-bold text-black/75">User details</p>
                            <p>{report.details || "No extra details."}</p>
                          </div>

                          <div>
                            <p className="font-bold text-black/75">
                              Automatic AI attachment
                            </p>
                            <pre className="mt-1 max-h-56 overflow-auto whitespace-pre-wrap break-words font-sans">
                              {report.aiContentText || "No text attachment."}
                            </pre>
                          </div>

                          {report.sourceReference && (
                            <p>
                              <strong>Source:</strong> {report.sourceReference}
                            </p>
                          )}

                          {report.messageReference && (
                            <p>
                              <strong>Message:</strong> {report.messageReference}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-3">
                            {report.screenshotUrl && (
                              <a
                                href={report.screenshotUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-secondary"
                              >
                                Screenshot <ExternalLink className="size-3" />
                              </a>
                            )}

                            {report.aiContentFileUrl && (
                              <a
                                href={report.aiContentFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-secondary"
                              >
                                AI file <ExternalLink className="size-3" />
                              </a>
                            )}

                            {report.aiContentUrl && (
                              <a
                                href={report.aiContentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-secondary"
                              >
                                AI output URL <ExternalLink className="size-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </details>
                    </td>

                    <td className="px-5 py-5">
                      <select
                        value={report.status}
                        disabled={updatingId === report.id}
                        onChange={(event) =>
                          void updateStatus(
                            report,
                            event.target.value as AiContentReportStatus,
                          )
                        }
                        className="h-9 rounded-lg border border-black/10 bg-white px-2 text-xs font-semibold outline-none disabled:opacity-60"
                      >
                        {statusOptions.map((item) => (
                          <option key={item} value={item}>
                            {formatLabel(item)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-black/5 px-6 py-4 text-sm">
          <p className="text-black/45">
            {response?.meta.total.toLocaleString() ?? 0} reports
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-black/10 px-3 py-2 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-black/60">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="rounded-lg border border-black/10 px-3 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
