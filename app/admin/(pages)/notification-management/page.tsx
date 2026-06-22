"use client";

import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Eye,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  deleteScheduledNotification,
  getNotificationHistory,
  getNotificationHistoryItem,
} from "@/service/notification/notification.service";
import type {
  NotificationHistoryItem,
  NotificationHistoryResponse,
  NotificationHistoryStatus,
} from "@/types/notification/notification-management.types";

const PAGE_LIMIT = 10;

const formatDateTime = (
  value: string | null,
): {
  date: string;
  time: string;
} => {
  if (!value) {
    return {
      date: "—",
      time: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "—",
      time: "",
    };
  }

  return {
    date: new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date),

    time: new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  };
};

const getDisplayDate = (
  item: NotificationHistoryItem,
): string =>
  item.scheduledAt ??
  item.sentAt ??
  item.createdAt;

const getStatusClasses = (
  status: NotificationHistoryStatus,
): string => {
  switch (status) {
    case "completed":
    case "sent":
      return "bg-[#E7F8EC] text-green-700";

    case "scheduled":
      return "bg-[#FFF1E7] text-orange-500";

    case "processing":
      return "bg-blue-50 text-blue-600";

    case "failed":
      return "bg-red-50 text-red-600";

    case "cancelled":
      return "bg-gray-100 text-gray-500";

    default:
      return "bg-gray-100 text-gray-500";
  }
};

export default function NotificationManagementPage() {
  const [data, setData] =
    useState<NotificationHistoryResponse | null>(
      null,
    );

  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isViewLoading, setIsViewLoading] =
    useState(false);

  const [viewItem, setViewItem] =
    useState<NotificationHistoryItem | null>(
      null,
    );

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setSearchQuery(searchInput.trim());
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const loadHistory = useCallback(
    async (showLoader = true) => {
      if (showLoader) {
        setIsLoading(true);
      }

      try {
        const response =
          await getNotificationHistory({
            page,
            limit: PAGE_LIMIT,
            search: searchQuery,
          });

        setData(response);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Notification history could not be loaded.",
        );
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [page, searchQuery],
  );

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const handleView = async (
    item: NotificationHistoryItem,
  ) => {
    setViewItem(item);
    setIsDetailsOpen(true);
    setIsViewLoading(true);

    try {
      const details =
        await getNotificationHistoryItem(
          item.id,
        );

      setViewItem(details);
    } catch (error) {
      setIsDetailsOpen(false);
      setViewItem(null);

      toast.error(
        error instanceof Error
          ? error.message
          : "Notification details could not be loaded.",
      );
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleDelete = async (
    item: NotificationHistoryItem,
  ) => {
    if (!item.canDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete the scheduled notification "${item.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);

    try {
      const response =
        await deleteScheduledNotification(
          item.id,
        );

      toast.success(response.message);

      if (viewItem?.id === item.id) {
        setViewItem(null);
        setIsDetailsOpen(false);
      }

      const currentPageItemCount =
        data?.items.length ?? 0;

      if (
        currentPageItemCount === 1 &&
        page > 1
      ) {
        setPage((current) => current - 1);
      } else {
        await loadHistory(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Scheduled notification could not be deleted.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const items = data?.items ?? [];
  const stats = data?.stats;
  const meta = data?.meta;

  const nextScheduledText =
    stats?.nextScheduled
      ? `Next: ${stats.nextScheduled.title}`
      : "No scheduled notifications";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-deep-green">
            Notification Management
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Review and manage outgoing student
            communication.
          </p>
        </div>

        <Link
          href="/admin/notification-management/create"
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-sm font-medium text-white transition hover:bg-deep-green"
        >
          <CirclePlus className="size-4" />
          CREATE NEW
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatCard
          title="TOTAL SENT"
          value={
            stats?.totalSent.toLocaleString() ??
            "0"
          }
          description="Admin notification campaigns sent"
          variant="sent"
        />

        <StatCard
          title="SCHEDULED"
          value={
            stats?.scheduled.toLocaleString() ??
            "0"
          }
          description={nextScheduledText}
          variant="scheduled"
        />
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-black/5 px-6 py-5 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-xl font-bold text-deep-green">
              Notification History
            </h3>

            <p className="mt-1 text-sm text-black/45">
              Monitor your communication history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-full items-center gap-3 rounded-full bg-[#F5FAF3] px-5 lg:w-[360px]">
              <Search className="size-4 shrink-0 text-black/40" />

              <input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                placeholder="Search by title or body..."
                className="w-full bg-transparent text-sm text-black/70 outline-none placeholder:text-black/40"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchInput("")
                  }
                  className="text-black/35 transition hover:text-black/70"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              title="Refresh history"
              disabled={isLoading}
              onClick={() =>
                void loadHistory()
              }
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F5FAF3] text-black/45 transition hover:text-secondary disabled:opacity-50"
            >
              <RefreshCw
                className={`size-4 ${
                  isLoading
                    ? "animate-spin"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-[#F7FAF5]">
              <tr className="text-left text-xs font-semibold text-black/40">
                <th className="px-6 py-4">
                  DATE & TIME
                </th>

                <th className="px-6 py-4">
                  CAMPAIGN TITLE
                </th>

                <th className="px-6 py-4">
                  TARGET AUDIENCE
                </th>

                <th className="px-6 py-4">
                  STATUS
                </th>

                <th className="px-6 py-4 text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16"
                  >
                    <div className="flex items-center justify-center gap-3 text-sm text-black/45">
                      <Loader2 className="size-5 animate-spin text-secondary" />
                      Loading notifications...
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const displayedDate =
                    formatDateTime(
                      getDisplayDate(item),
                    );

                  return (
                    <tr
                      key={`${item.source}-${item.id}`}
                      className="border-t border-black/5 text-sm"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-black/80">
                          {displayedDate.date}
                        </p>

                        <p className="mt-1 text-black/40">
                          {displayedDate.time}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="max-w-[260px] font-semibold leading-6 text-deep-green">
                          {item.title}
                        </p>

                        <p className="mt-1 max-w-[300px] truncate text-xs text-black/40">
                          {item.body}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-[#F5FAF3] px-4 py-2 text-xs text-black/60">
                          {
                            item.targetAudienceName
                          }
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge
                          status={item.status}
                        />
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-4 text-black/40">
                          <button
                            type="button"
                            title="View details"
                            onClick={() =>
                              void handleView(item)
                            }
                            className="transition hover:text-secondary"
                          >
                            <Eye className="size-4" />
                          </button>

                          {item.canDelete && (
                            <button
                              type="button"
                              title="Permanently delete scheduled notification"
                              disabled={
                                deletingId === item.id
                              }
                              onClick={() =>
                                void handleDelete(
                                  item,
                                )
                              }
                              className="transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              item.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {!isLoading &&
                items.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center text-sm text-black/45"
                    >
                      {searchQuery
                        ? "No notifications matched your search."
                        : "No notification history is available."}
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-4 px-6 py-5 text-sm text-black/45 sm:flex-row sm:items-center">
          <p>
            Showing {items.length} of{" "}
            {meta?.total ?? 0} campaigns
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={
                isLoading ||
                !meta ||
                meta.page <= 1
              }
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1),
                )
              }
              className="flex size-9 items-center justify-center rounded-full border border-black/10 transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>

            <span className="min-w-20 text-center">
              Page {meta?.page ?? 1} of{" "}
              {Math.max(
                meta?.totalPages ?? 1,
                1,
              )}
            </span>

            <button
              type="button"
              disabled={
                isLoading ||
                !meta ||
                meta.page >= meta.totalPages
              }
              onClick={() =>
                setPage(
                  (current) => current + 1,
                )
              }
              className="flex size-9 items-center justify-center rounded-full border border-black/10 transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm"
          onMouseDown={() =>
            setIsDetailsOpen(false)
          }
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-7 shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/40">
                  Notification Details
                </p>

                <h2 className="mt-3 text-xl font-bold text-deep-green">
                  {viewItem?.title ??
                    "Loading notification"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsDetailsOpen(false)
                }
                className="flex size-9 items-center justify-center rounded-full bg-[#F5FAF3] text-black/50"
              >
                <X className="size-4" />
              </button>
            </div>

            {isViewLoading ? (
              <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-black/45">
                <Loader2 className="size-5 animate-spin text-secondary" />
                Loading details...
              </div>
            ) : viewItem ? (
              <>
                {viewItem.imageUrl && (
                  <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#F5FAF3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={viewItem.imageUrl}
                      alt={viewItem.title}
                      className="max-h-[280px] w-full object-cover"
                    />
                  </div>
                )}

                <div className="mt-6 rounded-3xl bg-[#F5FAF3] p-5">
                  <p className="text-sm leading-7 text-black/65">
                    {viewItem.body}
                  </p>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <DetailItem
                    label="Date & Time"
                    value={(() => {
                      const result =
                        formatDateTime(
                          getDisplayDate(
                            viewItem,
                          ),
                        );

                      return `${result.date}${
                        result.time
                          ? `, ${result.time}`
                          : ""
                      }`;
                    })()}
                  />

                  <DetailItem
                    label="Target Audience"
                    value={
                      viewItem.targetAudienceName
                    }
                  />

                  <DetailItem
                    label="Status"
                    value={viewItem.status.toUpperCase()}
                  />

                  <DetailItem
                    label="Delivery Type"
                    value={
                      viewItem.targetType ===
                      "broadcast"
                        ? "Broadcast"
                        : "Selected User"
                    }
                  />

                  {viewItem.sentCount !==
                    undefined && (
                    <DetailItem
                      label="Sent Devices"
                      value={String(
                        viewItem.sentCount,
                      )}
                    />
                  )}

                  {viewItem.failedCount !==
                    undefined && (
                    <DetailItem
                      label="Failed Devices"
                      value={String(
                        viewItem.failedCount,
                      )}
                    />
                  )}
                </div>

                {viewItem.errorMessage && (
                  <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-600">
                    {viewItem.errorMessage}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  variant,
}: {
  title: string;
  value: string;
  description: string;
  variant: "sent" | "scheduled";
}) {
  const isSent = variant === "sent";

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div
        className={`flex size-10 items-center justify-center rounded-full ${
          isSent
            ? "bg-emerald-100 text-secondary"
            : "bg-orange-100 text-orange-500"
        }`}
      >
        <Play className="size-4" />
      </div>

      <p className="mt-4 text-xs font-medium tracking-wide text-black/40">
        {title}
      </p>

      <h2 className="mt-1 text-2xl font-bold text-deep-green">
        {value}
      </h2>

      <p
        className={`mt-2 truncate text-sm ${
          isSent
            ? "text-green-600"
            : "text-black/45"
        }`}
        title={description}
      >
        {description}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: NotificationHistoryStatus;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
        status,
      )}`}
    >
      <span className="size-2 rounded-full bg-current" />

      {status.toUpperCase()}
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-black/35">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-black/70">
        {value}
      </p>
    </div>
  );
}

