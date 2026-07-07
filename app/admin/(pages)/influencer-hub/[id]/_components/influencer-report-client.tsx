"use client";

import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  Edit,
  Loader2,
  Plus,
  RefreshCw,
  TrendingUp,
  UserRound,
  UsersRound,
  WalletCards,
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
  InfluencerManualPayoutPayload,
  InfluencerReport,
} from "@/types/influencer-hub/influencer-hub.type";

import ManualPayoutDialog from "./manual-payout-dialog";
import ProviderMappingsCard from "./provider-mappings-card";

interface InfluencerReportClientProps {
  partnerId: string;
  dateFrom: string;
  dateTo: string;
}

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
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

export default function InfluencerReportClient({
  partnerId,
  dateFrom,
  dateTo,
}: InfluencerReportClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [report, setReport] = useState<InfluencerReport | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [dateFromDraft, setDateFromDraft] = useState(dateFrom);

  const [dateToDraft, setDateToDraft] = useState(dateTo);

  const [isPayoutOpen, setIsPayoutOpen] = useState(false);

  const [isPayoutSubmitting, setIsPayoutSubmitting] = useState(false);

  const query = useMemo(
    () => ({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    [dateFrom, dateTo],
  );

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
    void loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId, query]);

  const applyDateFilter = () => {
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

    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const clearDateFilter = () => {
    setDateFromDraft("");
    setDateToDraft("");

    router.replace(pathname, {
      scroll: false,
    });
  };

  const handleManualPayout = async (payload: InfluencerManualPayoutPayload) => {
    const toastId = toast.loading("Adding manual payout entry...");

    try {
      setIsPayoutSubmitting(true);

      await createInfluencerPayout(partnerId, payload);

      await loadReport(true);

      setIsPayoutOpen(false);

      toast.success("Manual payout entry added.", {
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
        Loading influencer report...
      </section>
    );
  }

  if (!report) {
    return (
      <section className="rounded-[2rem] bg-white p-10 text-sm text-black/55 shadow-sm">
        Influencer report not found.
      </section>
    );
  }

  const partner = report.partner;
  const primaryDeal = partner.deals?.[0] || null;

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <Link
              href="/admin/influencer-hub"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-black/50"
            >
              <ArrowLeft className="size-4" />
              Back to Influencer Hub
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-deep-green">
                {partner.fullName}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  partner.status === "active"
                    ? "bg-[#DDF3E8] text-[#007A35]"
                    : partner.status === "suspended"
                      ? "bg-[#FCEBEC] text-[#B42318]"
                      : "bg-[#EEF3EC] text-[#4F5B52]"
                }`}
              >
                {formatLabel(partner.status)}
              </span>
            </div>

            <p className="mt-1 text-sm text-black/55">
              {partner.email}
              {partner.title ? ` • ${partner.title}` : ""}
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

            <Link
              href={`/admin/influencer-hub/${partnerId}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-black/65"
            >
              <Edit className="size-4" />
              Edit Partner
            </Link>

            <Link
              href={`/admin/influencer-hub/${partnerId}/ledger`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-black/65"
            >
              <WalletCards className="size-4" />
              View Full Ledger
            </Link>

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
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <h2 className="text-xl font-bold text-deep-green">
                Influencer Report
              </h2>

              <p className="mt-1 text-sm leading-6 text-black/50">
                Filter report summary, earnings trend and payout history by date
                range.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[180px_180px_auto_auto]">
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

              <Button onClick={applyDateFilter} className="mt-6 gap-2">
                <CalendarDays className="size-4" />
                Apply
              </Button>

              <Button
                variant="outline"
                onClick={clearDateFilter}
                className="mt-6"
              >
                Clear
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Total Users"
            value={report.summary.totalUsers.toLocaleString()}
            helper="Users linked to this influencer"
            icon={UsersRound}
          />

          <MetricCard
            title="Total Conversions"
            value={report.summary.totalConversions.toLocaleString()}
            helper="Completed purchases"
            icon={UserRound}
          />

          <MetricCard
            title="Total Sales"
            value={formatCurrency(report.summary.totalSalesEur)}
            helper="Attributed revenue"
            icon={DollarSign}
          />

          <MetricCard
            title="Lifetime Earnings"
            value={formatCurrency(report.summary.lifetimeEarningsEur)}
            helper="Total commission earned"
            icon={TrendingUp}
          />

          <MetricCard
            title="Commission Owed"
            value={formatCurrency(report.summary.commissionOwedEur)}
            helper="Pending payout"
            icon={WalletCards}
            danger
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-deep-green">
              Partner & Coupon Summary
            </h2>

            <div className="mt-5 space-y-4">
              <DetailRow
                label="Coupon Code"
                value={
                  primaryDeal?.couponCode || partner.primaryCouponCode || "—"
                }
              />

              <DetailRow
                label="Coupon Status"
                value={formatLabel(primaryDeal?.status || partner.couponStatus)}
              />

              <DetailRow
                label="User Discount"
                value={`${
                  primaryDeal?.userDiscountPercentage ??
                  partner.userDiscountPercentage ??
                  0
                }%`}
              />

              <DetailRow
                label="Influencer Share"
                value={`${
                  primaryDeal?.influencerSharePercentage ??
                  partner.influencerSharePercentage ??
                  0
                }%`}
              />

              <DetailRow
                label="Lifetime Association"
                value={
                  primaryDeal?.lifetimeAssociationEnabled
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <DetailRow
                label="Starts At"
                value={formatDate(
                  primaryDeal?.startsAt || partner.couponStartsAt,
                )}
              />

              <DetailRow
                label="Expires At"
                value={formatDate(
                  primaryDeal?.expiresAt || partner.couponExpiresAt,
                )}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-[#FFE2A8] bg-[#FFF8E8] p-5 text-sm leading-6 text-[#7A4E00]">
              The coupon only selects the matching discounted Google Play/App
              Store product. Final charge is controlled by the store and may
              include local VAT, tax, currency conversion, or regional pricing.
            </div>
          </section>

          <ProviderMappingsCard deal={primaryDeal} />

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-deep-green">
                  Earnings Growth Trend
                </h2>

                <p className="mt-1 text-sm text-black/45">
                  Monthly sales and commission generated by this partner.
                </p>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="bg-[#F7FAF5] text-left text-xs font-bold uppercase text-black/45">
                    <th className="px-4 py-3">Month</th>

                    <th className="px-4 py-3">Sales</th>

                    <th className="px-4 py-3">Commission</th>
                  </tr>
                </thead>

                <tbody>
                  {report.earningsGrowthTrend.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-10 text-center text-sm text-black/45"
                      >
                        No growth data found.
                      </td>
                    </tr>
                  )}

                  {report.earningsGrowthTrend.map((item) => (
                    <tr key={item.month} className="border-t border-black/5">
                      <td className="px-4 py-4 font-semibold text-black/75">
                        {item.month}
                      </td>

                      <td className="px-4 py-4 font-bold text-black/80">
                        {formatCurrency(item.salesEur)}
                      </td>

                      <td className="px-4 py-4 font-bold text-green-600">
                        {formatCurrency(item.commissionEur)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-deep-green">
                Payout History
              </h2>

              <p className="mt-1 text-sm text-black/45">
                Commission, payout, manual adjustment and reversal entries.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsPayoutOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Manual Entry
            </Button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="bg-[#F7FAF5] text-left text-xs font-bold uppercase text-black/45">
                  <th className="px-5 py-4">Date</th>

                  <th className="px-5 py-4">Type</th>

                  <th className="px-5 py-4">Reference</th>

                  <th className="px-5 py-4">Amount</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Notes</th>
                </tr>
              </thead>

              <tbody>
                {report.payoutHistory.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-black/45"
                    >
                      No payout history found.
                    </td>
                  </tr>
                )}

                {report.payoutHistory.map((entry) => (
                  <tr key={entry.id} className="border-t border-black/5">
                    <td className="px-5 py-4 text-sm text-black/65">
                      {formatDate(entry.transactionDate)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-black/75">
                      {formatLabel(entry.transactionType)}
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

function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  danger = false,
}: {
  title: string;
  value: string;
  helper: string;
  icon: typeof UsersRound;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
      <div
        className={`mb-4 flex size-11 items-center justify-center rounded-full ${
          danger ? "bg-[#FCEBEC] text-[#D92D20]" : "bg-[#DDF3E8] text-secondary"
        }`}
      >
        <Icon className="size-5" />
      </div>

      <p className="text-sm text-black/50">{title}</p>

      <h3
        className={`mt-2 text-2xl font-bold ${
          danger ? "text-[#D92D20]" : "text-deep-green"
        }`}
      >
        {value}
      </h3>

      <p className="mt-2 text-xs leading-5 text-black/40">{helper}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-[#F7FAF5] px-4 py-3">
      <p className="text-xs font-bold uppercase text-black/40">{label}</p>

      <p className="max-w-[60%] break-all text-right text-sm font-semibold text-black/75">
        {value}
      </p>
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
