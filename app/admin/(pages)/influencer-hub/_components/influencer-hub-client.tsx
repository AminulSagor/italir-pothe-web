"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  Eye,
  Filter,
  Loader2,
  Pencil,
  Search,
  Trash2,
  UserRoundPlus,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import ConfirmActionDialog from "@/components/UI/dialogs/confirm-action-dialog";
import {
  archiveInfluencerPartner,
  exportInfluencerPartnersCsv,
  getInfluencerDashboard,
  getInfluencerPartners,
} from "@/service/influencer-hub/influencer-hub.service";
import type {
  InfluencerCouponProductDomain,
  InfluencerDashboard,
  InfluencerPartnerListItem,
  InfluencerPartnerListResponse,
  InfluencerPartnerSortBy,
  InfluencerPartnerStatus,
  InfluencerSortOrder,
} from "@/types/influencer-hub/influencer-hub.type";

interface InfluencerHubClientProps {
  page: number;
  limit: number;
  search: string;
  status: InfluencerPartnerStatus | "";
  couponCode: string;
  productDomain: InfluencerCouponProductDomain | "";
  sortBy: InfluencerPartnerSortBy;
  sortOrder: InfluencerSortOrder;
}

const emptyDashboard: InfluencerDashboard = {
  totalPartners: 0,
  activePartners: 0,
  totalLinkedUsers: 0,
  activeReferrals: 0,
  totalSales: "0.00",
  lifetimeCommissionEarned: "0.00",
  totalCommissionOwed: "0.00",
  pendingPayoutAmount: "0.00",
  paidPayoutAmount: "0.00",
  currency: "EUR",
};

const emptyList: InfluencerPartnerListResponse = {
  items: [],
  meta: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Something went wrong.";
};

const formatCurrency = (value: string | number) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "€0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(numericValue);
};

const formatLabel = (value: string | null | undefined) => {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const downloadTextFile = (
  content: string,
  filename: string,
  mimeType: string,
) => {
  const blob = new Blob([content], {
    type: mimeType,
  });

  const url = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
};

export default function InfluencerHubClient({
  page,
  limit,
  search,
  status,
  couponCode,
  productDomain,
  sortBy,
  sortOrder,
}: InfluencerHubClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [dashboard, setDashboard] =
    useState<InfluencerDashboard>(emptyDashboard);

  const [list, setList] = useState<InfluencerPartnerListResponse>(emptyList);

  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  const [isListLoading, setIsListLoading] = useState(true);

  const [isExporting, setIsExporting] = useState(false);

  const [searchDraft, setSearchDraft] = useState(search);

  const [couponDraft, setCouponDraft] = useState(couponCode);

  const [archiveTarget, setArchiveTarget] =
    useState<InfluencerPartnerListItem | null>(null);

  const [isArchiving, setIsArchiving] = useState(false);

  const query = useMemo(
    () => ({
      page,
      limit,
      search,
      status: status || undefined,
      couponCode: couponCode.trim() || undefined,
      productDomain: productDomain || undefined,
      sortBy,
      sortOrder,
    }),
    [couponCode, limit, page, productDomain, search, sortBy, sortOrder, status],
  );

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  useEffect(() => {
    setCouponDraft(couponCode);
  }, [couponCode]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setIsDashboardLoading(true);

        const response = await getInfluencerDashboard();

        if (mounted) {
          setDashboard(response);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setIsDashboardLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadPartners = async () => {
      try {
        setIsListLoading(true);

        const response = await getInfluencerPartners(query);

        if (mounted) {
          setList(response);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));

          setList(emptyList);
        }
      } finally {
        if (mounted) {
          setIsListLoading(false);
        }
      }
    };

    void loadPartners();

    return () => {
      mounted = false;
    };
  }, [query]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchDraft === search) {
        return;
      }

      updateQuery({
        search: searchDraft,
        page: 1,
      });
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (couponDraft === couponCode) {
        return;
      }

      updateQuery({
        couponCode: couponDraft,
        page: 1,
      });
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponDraft]);

  const updateQuery = (values: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const reloadAfterArchive = async () => {
    const [dashboardResponse, listResponse] = await Promise.all([
      getInfluencerDashboard(),
      getInfluencerPartners(query),
    ]);

    setDashboard(dashboardResponse);
    setList(listResponse);
  };

  const handleArchive = async () => {
    if (!archiveTarget) return;

    const toastId = toast.loading("Archiving influencer partner...");

    try {
      setIsArchiving(true);

      await archiveInfluencerPartner(archiveTarget.id);

      await reloadAfterArchive();

      setArchiveTarget(null);

      toast.success("Influencer partner archived.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleExport = async () => {
    const toastId = toast.loading("Preparing influencer CSV...");

    try {
      setIsExporting(true);

      const csv = await exportInfluencerPartnersCsv(query);

      downloadTextFile(
        csv,
        "influencer-partners.csv",
        "text/csv;charset=utf-8",
      );

      toast.success("Influencer CSV exported.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const showingStart =
    list.meta.totalItems === 0 ? 0 : (list.meta.page - 1) * list.meta.limit + 1;

  const showingEnd = Math.min(
    list.meta.page * list.meta.limit,
    list.meta.totalItems,
  );

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-deep-green">
              Influencer Hub
            </h1>

            <p className="mt-1 text-sm text-black/55">
              Manage influencer partners, coupons, provider product mappings and
              payout tracking.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              disabled={isExporting}
              onClick={handleExport}
              className="gap-2"
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Export CSV
            </Button>

            <Link
              href="/admin/influencer-hub/deal-configurator"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#75FF33] px-6 text-sm font-bold text-deep-green shadow-sm"
            >
              <UserRoundPlus className="size-4" />
              Onboard New Influencer
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <StatCard
            label="Total Influencer Partners"
            value={
              isDashboardLoading
                ? "..."
                : dashboard.totalPartners.toLocaleString()
            }
            helper={`${dashboard.activePartners.toLocaleString()} active partners`}
            tone="green"
          />

          <StatCard
            label="Active Referrals"
            value={
              isDashboardLoading
                ? "..."
                : dashboard.activeReferrals.toLocaleString()
            }
            helper={`${dashboard.totalLinkedUsers.toLocaleString()} linked users`}
            tone="blue"
          />

          <StatCard
            label="Total Commission Owed"
            value={
              isDashboardLoading
                ? "..."
                : formatCurrency(dashboard.totalCommissionOwed)
            }
            helper="Pending payout amount"
            tone="orange"
          />
        </div>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="grid w-full gap-3 md:grid-cols-[1.3fr_0.9fr] lg:max-w-[660px]">
            <div className="flex h-12 items-center gap-3 rounded-full bg-white px-5 text-black/45 shadow-sm">
              <Search className="size-4" />

              <input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder="Search influencers or codes..."
                className="w-full bg-transparent text-sm text-black/75 outline-none placeholder:text-black/35"
              />
            </div>

            <div className="flex h-12 items-center gap-3 rounded-full bg-white px-5 text-black/45 shadow-sm">
              <Filter className="size-4" />

              <input
                value={couponDraft}
                onChange={(event) =>
                  setCouponDraft(event.target.value.toUpperCase())
                }
                placeholder="Coupon code"
                className="w-full bg-transparent text-sm text-black/75 outline-none placeholder:text-black/35"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={status}
              onChange={(event) =>
                updateQuery({
                  status: event.target.value,
                  page: 1,
                })
              }
              className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm text-black/65 outline-none"
            >
              <option value="">All Statuses</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>

              <option value="suspended">Suspended</option>
            </select>

            <select
              value={productDomain}
              onChange={(event) =>
                updateQuery({
                  productDomain: event.target.value,
                  page: 1,
                })
              }
              className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm text-black/65 outline-none"
            >
              <option value="">All Products</option>

              <option value="course">Courses</option>

              <option value="store_package">Store Packages</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                updateQuery({
                  sortBy: event.target.value,
                  page: 1,
                })
              }
              className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm text-black/65 outline-none"
            >
              <option value="createdAt">Sort: Created</option>

              <option value="fullName">Sort: Name</option>

              <option value="usersLinked">Sort: Users Linked</option>

              <option value="totalSales">Sort: Sales</option>

              <option value="commission">Sort: Commission</option>
            </select>

            <select
              value={sortOrder}
              onChange={(event) =>
                updateQuery({
                  sortOrder: event.target.value,
                  page: 1,
                })
              }
              className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm text-black/65 outline-none"
            >
              <option value="DESC">DESC</option>

              <option value="ASC">ASC</option>
            </select>
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 px-6 py-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-bold text-deep-green">
                Partner Performance Overview
              </h2>

              <p className="mt-1 text-sm text-black/45">
                Search, filters and pagination are powered by the backend API.
              </p>
            </div>

            <Button
              variant="outline"
              disabled={isExporting}
              onClick={handleExport}
              className="gap-2"
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px]">
              <thead className="bg-[#F7FAF5]">
                <tr className="text-left text-xs font-bold uppercase text-black/45">
                  <th className="px-6 py-4">Partner</th>

                  <th className="px-6 py-4">Coupon Code</th>

                  <th className="px-6 py-4">Users Linked</th>

                  <th className="px-6 py-4">Total Sales</th>

                  <th className="px-6 py-4">Commission / Share</th>

                  <th className="px-6 py-4">Status</th>

                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isListLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-14 text-center text-sm text-black/50"
                    >
                      Loading influencer partners...
                    </td>
                  </tr>
                )}

                {!isListLoading && list.items.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-14 text-center text-sm text-black/50"
                    >
                      No influencer partners found.
                    </td>
                  </tr>
                )}

                {!isListLoading &&
                  list.items.map((partner) => (
                    <tr key={partner.id} className="border-t border-black/5">
                      <td className="px-6 py-5">
                        <p className="font-bold text-black/85">
                          {partner.fullName}
                        </p>

                        <p className="mt-1 text-sm text-black/35">
                          {partner.email}
                        </p>

                        {partner.title && (
                          <p className="mt-1 text-xs text-black/35">
                            {partner.title}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {partner.primaryCouponCode ? (
                          <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-secondary ring-1 ring-secondary/15">
                            {partner.primaryCouponCode}
                          </span>
                        ) : (
                          <span className="text-sm text-black/35">—</span>
                        )}

                        {partner.userDiscountPercentage > 0 && (
                          <p className="mt-2 text-xs text-black/45">
                            User discount: {partner.userDiscountPercentage}%
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5 font-bold text-black/80">
                        {partner.usersLinked.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 font-bold text-black/80">
                        {formatCurrency(partner.totalSalesEur)}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-bold leading-5 text-green-600">
                          {partner.influencerSharePercentage}% Share
                        </p>

                        <p className="text-sm text-black/35">
                          Earned: {formatCurrency(partner.commissionEarnedEur)}
                        </p>

                        <p className="text-sm text-black/35">
                          Owed: {formatCurrency(partner.commissionOwedEur)}
                        </p>
                      </td>

                      <td className="px-6 py-5">
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

                        {partner.couponStatus && (
                          <p className="mt-2 text-xs text-black/40">
                            Coupon: {formatLabel(partner.couponStatus)}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-5 text-black/35">
                          <Link
                            href={`/admin/influencer-hub/${partner.id}`}
                            aria-label={`View ${partner.fullName}`}
                          >
                            <Eye className="size-4" />
                          </Link>

                          <Link
                            href={`/admin/influencer-hub/${partner.id}/edit`}
                            aria-label={`Edit ${partner.fullName}`}
                          >
                            <Pencil className="size-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setArchiveTarget(partner)}
                            aria-label={`Archive ${partner.fullName}`}
                          >
                            <Trash2 className="size-4 text-[#D92D20]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-4 px-6 py-5 text-sm text-black/55 lg:flex-row lg:items-center">
            <p>
              Showing {showingStart}-{showingEnd} of {list.meta.totalItems}{" "}
              Partners
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!list.meta.hasPreviousPage}
                onClick={() =>
                  updateQuery({
                    page: list.meta.page - 1,
                  })
                }
                className="text-xl text-black/60 disabled:opacity-30"
              >
                ‹
              </button>

              <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-bold text-white">
                {list.meta.page}
              </span>

              <span className="text-black/45">/ {list.meta.totalPages}</span>

              <button
                type="button"
                disabled={!list.meta.hasNextPage}
                onClick={() =>
                  updateQuery({
                    page: list.meta.page + 1,
                  })
                }
                className="text-xl text-black/60 disabled:opacity-30"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </section>

      <ConfirmActionDialog
        open={Boolean(archiveTarget)}
        title="Archive Influencer Partner"
        description={
          archiveTarget
            ? `This will deactivate ${archiveTarget.fullName} and pause their coupon. Business history will be kept.`
            : "This will archive the influencer partner."
        }
        confirmLabel="Archive"
        danger
        isSubmitting={isArchiving}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
      />
    </>
  );
}

function StatCard({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  tone: "green" | "blue" | "orange";
}) {
  const Icon =
    tone === "orange" ? Download : tone === "blue" ? Search : UserRoundPlus;

  return (
    <div className="flex min-h-[130px] justify-between rounded-[1.7rem] bg-white p-6 shadow-sm">
      <div>
        <p className="max-w-[190px] text-sm leading-6 text-black/70">{label}</p>

        <h2
          className={`mt-2 text-2xl font-bold ${
            tone === "orange" ? "text-orange-500" : "text-deep-green"
          }`}
        >
          {value}
        </h2>

        <p
          className={`mt-2 text-sm ${
            tone === "orange" ? "text-red-500" : "text-green-600"
          }`}
        >
          {helper}
        </p>
      </div>

      <div
        className={`flex size-11 items-center justify-center rounded-full ${
          tone === "orange"
            ? "bg-orange-100 text-orange-500"
            : tone === "blue"
              ? "bg-sky-100 text-secondary"
              : "bg-emerald-100 text-secondary"
        }`}
      >
        <Icon className="size-5" />
      </div>
    </div>
  );
}
