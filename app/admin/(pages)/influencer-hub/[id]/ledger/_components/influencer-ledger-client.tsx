"use client";

import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import {
  createInfluencerPayout,
  getInfluencerReport,
} from "@/service/influencer-hub/influencer-hub.service";
import type {
  InfluencerLedgerEntry,
  InfluencerLedgerStatus,
  InfluencerLedgerTransactionType,
  InfluencerManualPayoutPayload,
  InfluencerReport,
} from "@/types/influencer-hub/influencer-hub.type";

import ManualPayoutDialog from "../../_components/manual-payout-dialog";

interface InfluencerLedgerClientProps {
  partnerId: string;
  dateFrom: string;
  dateTo: string;
  transactionType: string;
  status: string;
}

const transactionTypes: Array<InfluencerLedgerTransactionType | ""> = [
  "",
  "commission",
  "payout",
  "manual_adjustment",
  "reversal",
];

const statuses: Array<InfluencerLedgerStatus | ""> = [
  "",
  "pending",
  "paid",
  "cancelled",
];

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Something went wrong.";
};

const formatCurrency = (value: string | number | null | undefined) => {
  const numericValue = Number(value || 0);

  if (!Number.isFinite(numericValue)) {
    return "€0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(numericValue);
};

const formatLabel = (value?: string | null) => {
  if (!value) return "All";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const filterLedgerEntries = (
  entries: InfluencerLedgerEntry[],
  transactionType: string,
  status: string,
) => {
  return entries.filter((entry) => {
    const matchesType =
      !transactionType || entry.transactionType === transactionType;

    const matchesStatus = !status || entry.status === status;

    return matchesType && matchesStatus;
  });
};

export default function InfluencerLedgerClient({
  partnerId,
  dateFrom,
  dateTo,
  transactionType,
  status,
}: InfluencerLedgerClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [report, setReport] = useState<InfluencerReport | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [dateFromDraft, setDateFromDraft] = useState(dateFrom);

  const [dateToDraft, setDateToDraft] = useState(dateTo);

  const [typeDraft, setTypeDraft] = useState(transactionType);

  const [statusDraft, setStatusDraft] = useState(status);

  const [isPayoutOpen, setIsPayoutOpen] = useState(false);

  const [isPayoutSubmitting, setIsPayoutSubmitting] = useState(false);

  const query = useMemo(
    () => ({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    [dateFrom, dateTo],
  );

  const filteredEntries = useMemo(() => {
    return filterLedgerEntries(
      report?.payoutHistory || [],
      transactionType,
      status,
    );
  }, [report?.payoutHistory, status, transactionType]);

  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (summary, entry) => {
        const amount = Number(entry.amountEur) || 0;

        if (entry.transactionType === "commission") {
          summary.commission += amount;
        }

        if (entry.transactionType === "payout") {
          summary.payout += amount;
        }

        if (entry.transactionType === "manual_adjustment") {
          summary.manualAdjustment += amount;
        }

        if (entry.transactionType === "reversal") {
          summary.reversal += amount;
        }

        summary.net += amount;

        return summary;
      },
      {
        commission: 0,
        payout: 0,
        manualAdjustment: 0,
        reversal: 0,
        net: 0,
      },
    );
  }, [filteredEntries]);

  const loadReport = async (silent = false) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await getInfluencerReport(partnerId, query);

      setReport(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setReport(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setDateFromDraft(dateFrom);
  }, [dateFrom]);

  useEffect(() => {
    setDateToDraft(dateTo);
  }, [dateTo]);

  useEffect(() => {
    setTypeDraft(transactionType);
  }, [transactionType]);

  useEffect(() => {
    setStatusDraft(status);
  }, [status]);

  useEffect(() => {
    void loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId, query]);

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search);

    if (dateFromDraft) {
      params.set("dateFrom", dateFromDraft);
    } else {
      params.delete("dateFrom");
    }

    if (dateToDraft) {
      params.set("dateTo", dateToDraft);
    } else {
      params.delete("dateTo");
    }

    if (typeDraft) {
      params.set("transactionType", typeDraft);
    } else {
      params.delete("transactionType");
    }

    if (statusDraft) {
      params.set("status", statusDraft);
    } else {
      params.delete("status");
    }

    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const clearFilters = () => {
    setDateFromDraft("");
    setDateToDraft("");
    setTypeDraft("");
    setStatusDraft("");

    router.replace(pathname, {
      scroll: false,
    });
  };

  const handleManualPayout = async (payload: InfluencerManualPayoutPayload) => {
    const toastId = toast.loading("Adding manual ledger entry...");

    try {
      setIsPayoutSubmitting(true);

      await createInfluencerPayout(partnerId, payload);

      await loadReport(true);

      setIsPayoutOpen(false);

      toast.success("Manual ledger entry added.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsPayoutSubmitting(false);
    }
  };

  if (isLoading && !report) {
    return (
      <section className="rounded-[2rem] bg-white p-10 text-sm text-black/55 shadow-sm">
        Loading influencer ledger...
      </section>
    );
  }

  if (!report) {
    return (
      <section className="rounded-[2rem] bg-white p-10 text-sm text-black/55 shadow-sm">
        Influencer ledger not found.
      </section>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <Link
              href={`/admin/influencer-hub/${partnerId}`}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-black/50"
            >
              <ArrowLeft className="size-4" />
              Back to Influencer Report
            </Link>

            <h1 className="text-2xl font-bold text-deep-green">
              Full Influencer Ledger
            </h1>

            <p className="mt-1 text-sm text-black/55">
              {report.partner.fullName} • {report.partner.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              disabled={isRefreshing}
              onClick={() => void loadReport(true)}
              className="gap-2"
            >
              {isRefreshing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Refresh
            </Button>

            <Button
              onClick={() => setIsPayoutOpen(true)}
              className="gap-2 bg-[#75FF33] !text-deep-green hover:!bg-[#75FF33]"
            >
              <Plus className="size-4" />
              Add Manual Entry
            </Button>
          </div>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <DateField
              label="Date From"
              value={dateFromDraft}
              onChange={setDateFromDraft}
            />

            <DateField
              label="Date To"
              value={dateToDraft}
              onChange={setDateToDraft}
            />

            <SelectField
              label="Transaction Type"
              value={typeDraft}
              onChange={setTypeDraft}
              options={transactionTypes.map((item) => [
                item,
                formatLabel(item),
              ])}
            />

            <SelectField
              label="Status"
              value={statusDraft}
              onChange={setStatusDraft}
              options={statuses.map((item) => [item, formatLabel(item)])}
            />

            <Button onClick={applyFilters} className="mt-6 gap-2">
              <CalendarDays className="size-4" />
              Apply
            </Button>

            <Button variant="outline" onClick={clearFilters} className="mt-6">
              Clear
            </Button>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <LedgerMetric
            label="Commission"
            value={formatCurrency(totals.commission)}
          />

          <LedgerMetric label="Payouts" value={formatCurrency(totals.payout)} />

          <LedgerMetric
            label="Manual Adjustment"
            value={formatCurrency(totals.manualAdjustment)}
          />

          <LedgerMetric
            label="Reversal"
            value={formatCurrency(totals.reversal)}
            danger
          />

          <LedgerMetric label="Net Total" value={formatCurrency(totals.net)} />
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-deep-green">
                Ledger Entries
              </h2>

              <p className="mt-1 text-sm text-black/45">
                Showing {filteredEntries.length} entry
                {filteredEntries.length === 1 ? "" : "ies"} for the selected
                filter.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1020px]">
              <thead>
                <tr className="bg-[#F7FAF5] text-left text-xs font-bold uppercase text-black/45">
                  <th className="px-5 py-4">Date</th>

                  <th className="px-5 py-4">Type</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Domain</th>

                  <th className="px-5 py-4">Order ID</th>

                  <th className="px-5 py-4">Reference</th>

                  <th className="px-5 py-4">Amount</th>

                  <th className="px-5 py-4">Notes</th>
                </tr>
              </thead>

              <tbody>
                {filteredEntries.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-sm text-black/45"
                    >
                      No ledger entries found.
                    </td>
                  </tr>
                )}

                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-t border-black/5">
                    <td className="px-5 py-4 text-sm text-black/65">
                      {formatDate(entry.transactionDate)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-black/75">
                      {formatLabel(entry.transactionType)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          entry.status === "paid"
                            ? "bg-[#DDF3E8] text-[#007A35]"
                            : entry.status === "cancelled"
                              ? "bg-[#FCEBEC] text-[#B42318]"
                              : "bg-[#FFF3C6] text-[#B77900]"
                        }`}
                      >
                        {formatLabel(entry.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-black/55">
                      {formatLabel(entry.orderDomain)}
                    </td>

                    <td className="max-w-[180px] break-all px-5 py-4 text-xs text-black/45">
                      {entry.orderId || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-black/55">
                      {entry.referenceId || "—"}
                    </td>

                    <td
                      className={`px-5 py-4 text-sm font-bold ${
                        Number(entry.amountEur) < 0
                          ? "text-[#D92D20]"
                          : "text-green-600"
                      }`}
                    >
                      {formatCurrency(entry.amountEur)}
                    </td>

                    <td className="px-5 py-4 text-sm text-black/50">
                      {entry.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <ManualPayoutDialog
        open={isPayoutOpen}
        isSubmitting={isPayoutSubmitting}
        onClose={() => setIsPayoutOpen(false)}
        onSubmit={handleManualPayout}
      />
    </>
  );
}

function LedgerMetric({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
      <p className="text-sm text-black/50">{label}</p>

      <h3
        className={`mt-2 text-2xl font-bold ${
          danger ? "text-[#D92D20]" : "text-deep-green"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function DateField({
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
      <span className="mb-2 block text-xs font-bold uppercase text-black/40">
        {label}
      </span>

      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-full bg-[#EEF3EC] px-4 text-sm outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-black/40">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-full bg-[#EEF3EC] px-4 text-sm outline-none"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={`${label}-${optionValue}`} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
