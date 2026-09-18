"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Plus, RefreshCw, Search, ShieldCheck, X } from "lucide-react";

import {
  decideDeviceRequest,
  getDeviceRequests,
} from "@/service/device-requests/device-request.service";
import type {
  DeviceRequestDecision,
  DeviceRequestListItem,
  DeviceRequestStatus,
} from "@/types/device-requests/device-request.type";

const statusOptions: Array<{
  label: string;
  value: DeviceRequestStatus | "all";
}> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Replaced", value: "approved_replace" },
  { label: "Added", value: "approved_add" },
  { label: "Rejected", value: "rejected" },
];

const statusStyles: Record<DeviceRequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved_replace: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  approved_add: "bg-blue-50 text-blue-700 ring-blue-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusLabel: Record<DeviceRequestStatus, string> = {
  pending: "Pending",
  approved_replace: "Approved · Replace",
  approved_add: "Approved · Add",
  rejected: "Rejected",
};

export default function DeviceRequestsClient() {
  const [items, setItems] = useState<DeviceRequestListItem[]>([]);
  const [status, setStatus] = useState<DeviceRequestStatus | "all">("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDeviceRequests({
        status: status === "all" ? undefined : status,
        search,
      });
      setItems(response.items);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not load device requests.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timer);
  }, [load]);

  const decide = async (
    item: DeviceRequestListItem,
    decision: DeviceRequestDecision,
  ) => {
    const descriptions: Record<DeviceRequestDecision, string> = {
      replace: `Revoke all active devices for ${item.course.title} and activate ${item.requestedDeviceLabel}?`,
      add: `Keep the current device and add ${item.requestedDeviceLabel} as another active device?`,
      reject: `Reject this device access request?`,
    };
    if (!window.confirm(descriptions[decision])) return;

    setActingId(item.id);
    setError(null);
    try {
      await decideDeviceRequest(item.id, decision);
      await load();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not decide the request.",
      );
    } finally {
      setActingId(null);
    }
  };

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-6 text-white shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/15 p-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">
              Course security
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Device Requests
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50/90">
              Approve a replacement, allow an additional device, or reject a
              verified request.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  status === option.value
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 lg:w-80">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user or course"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => void load()}
              aria-label="Refresh"
              className="rounded-xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {[
                  "User",
                  "Email",
                  "Phone",
                  "Course",
                  "Current device",
                  "Requested device",
                  "Time",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const pending = item.status === "pending";
                const busy = actingId === item.id;
                return (
                  <tr key={item.id} className="align-top hover:bg-slate-50/70">
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {item.user.name}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {item.user.email || "—"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {item.user.phone || "—"}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {item.course.title}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {item.currentDeviceLabel}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {item.requestedDeviceLabel}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      {new Date(item.requestedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[item.status]}`}
                      >
                        {statusLabel[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {pending ? (
                        <div className="flex gap-2">
                          <ActionButton
                            title="Approve with REPLACE"
                            disabled={busy}
                            onClick={() => void decide(item, "replace")}
                            className="bg-emerald-700 text-white hover:bg-emerald-800"
                          >
                            <Check className="h-4 w-4" /> Replace
                          </ActionButton>
                          <ActionButton
                            title="Approve with ADD"
                            disabled={busy}
                            onClick={() => void decide(item, "add")}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4" /> Add
                          </ActionButton>
                          <ActionButton
                            title="Reject"
                            disabled={busy}
                            onClick={() => void decide(item, "reject")}
                            className="bg-rose-50 text-rose-700 hover:bg-rose-100"
                          >
                            <X className="h-4 w-4" /> Reject
                          </ActionButton>
                        </div>
                      ) : (
                        <span className="text-slate-400">Decided</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && items.length === 0 && (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No device requests match these filters.
          </div>
        )}
        {loading && items.length === 0 && (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            Loading device requests…
          </div>
        )}
      </section>
    </main>
  );
}

function ActionButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
