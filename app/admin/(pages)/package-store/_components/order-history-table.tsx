"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import {
  exportAdminStoreOrdersCsv,
  getAdminStoreOrderInvoice,
  getAdminStoreOrders,
} from "@/service/package-store/package-store.service";
import type {
  StoreAdminOrder,
  StoreAdminOrderListResponse,
  StoreOrderSortBy,
  StoreOrderStatus,
  StorePackageType,
  StorePaymentProvider,
  StoreSortOrder,
} from "@/types/package-store/package-store.type";
import {
  downloadCurrentStoreOrdersCsv,
  downloadTextFile,
} from "@/utils/package-store-download.util";

import OrderFilterDialog from "./dialogs/order-filter-dialog";
import OrderExportMenu from "./order-export-menu";
import StorePagination from "./store-pagination";

interface OrderHistoryTableProps {
  search: string;
  page: number;
  packageType: string;
  status: string;
  paymentProvider: string;
  dateFrom: string;
  dateTo: string;
  sortBy: StoreOrderSortBy;
  sortOrder: StoreSortOrder;
}

const initialResponse: StoreAdminOrderListResponse = {
  items: [],
  meta: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

const statusClasses: Record<string, string> = {
  completed: "bg-[#DDF3E8] text-[#007A35]",
  pending: "bg-[#FFF3C6] text-[#D89600]",
  failed: "bg-[#FCEBEC] text-[#B42318]",
  refunded: "bg-[#FCEBEC] text-[#D92D20]",
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function OrderHistoryTable({
  search,
  page,
  packageType,
  status,
  paymentProvider,
  dateFrom,
  dateTo,
  sortBy,
  sortOrder,
}: OrderHistoryTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [response, setResponse] =
    useState<StoreAdminOrderListResponse>(initialResponse);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(
    null,
  );

  const query = useMemo(() => {
    const normalizedPackageType: StorePackageType | undefined =
      packageType === "ai_bundle" ||
      packageType === "streak_freeze" ||
      packageType === "cv_credit"
        ? packageType
        : undefined;

    const normalizedStatus: StoreOrderStatus | undefined =
      status === "pending" ||
      status === "completed" ||
      status === "failed" ||
      status === "refunded"
        ? status
        : undefined;

    const normalizedPaymentProvider: StorePaymentProvider | undefined =
      paymentProvider === "google_play" || paymentProvider === "app_store"
        ? paymentProvider
        : undefined;

    return {
      page,
      limit: 10,
      search,
      packageType: normalizedPackageType,
      status: normalizedStatus,
      paymentProvider: normalizedPaymentProvider,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
      sortOrder,
    };
  }, [
    dateFrom,
    dateTo,
    packageType,
    page,
    paymentProvider,
    search,
    sortBy,
    sortOrder,
    status,
  ]);

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        const result = await getAdminStoreOrders(query);

        if (mounted) {
          setResponse(result);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
          setResponse(initialResponse);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchOrders();

    return () => {
      mounted = false;
    };
  }, [query]);

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

  const handleDownloadInvoice = async (order: StoreAdminOrder) => {
    const toastId = toast.loading("Preparing invoice...");

    try {
      setDownloadingOrderId(order.id);
      const html = await getAdminStoreOrderInvoice(order.id);
      downloadTextFile(
        html,
        `invoice-${order.orderNumber}.html`,
        "text/html;charset=utf-8",
      );
      toast.success("Invoice downloaded.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const handleExportCurrentPage = () => {
    if (response.items.length === 0) {
      toast.error("There are no orders on this page to export.");
      return;
    }

    downloadCurrentStoreOrdersCsv(
      response.items,
      `package-store-orders-page-${response.meta.page}.csv`,
    );
    toast.success("Current page exported.");
  };

  const handleExportAll = async () => {
    const toastId = toast.loading("Preparing filtered order export...");

    try {
      setIsExporting(true);
      const csv = await exportAdminStoreOrdersCsv({
        search: query.search,
        packageType: query.packageType,
        status: query.status,
        paymentProvider: query.paymentProvider,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      });

      downloadTextFile(
        csv,
        "package-store-orders.csv",
        "text/csv;charset=utf-8",
      );
      toast.success("Filtered orders exported.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Card padding="lg" rounded="3xl" shadow="sm">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#006B3F]">Transaction Logs</h2>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(true)}
            >
              Filter
            </Button>

            <OrderExportMenu
              disabled={response.items.length === 0}
              isExporting={isExporting}
              onExportCurrentPage={handleExportCurrentPage}
              onExportAll={handleExportAll}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                {[
                  "ORDER ID",
                  "CUSTOMER",
                  "PACKAGE",
                  "DATE",
                  "AMOUNT",
                  "STATUS",
                  "ACTIONS",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-4 text-left text-xs font-bold text-[#4F5B52]"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-[#4F5B52]"
                  >
                    Loading orders...
                  </td>
                </tr>
              )}

              {!isLoading && response.items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-[#4F5B52]"
                  >
                    No orders found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                response.items.map((order) => {
                  const customerName = order.user?.name || "Unknown Customer";

                  return (
                    <tr key={order.id} className="border-t border-[#EEF2EE]">
                      <td className="px-4 py-7 text-sm font-bold text-[#006B3F]">
                        {order.orderNumber}
                      </td>

                      <td className="px-4 py-7">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-[#DDF3E8] text-xs font-bold text-[#006B3F]">
                            {getInitials(customerName)}
                          </div>
                          <div>
                            <p className="text-sm">{customerName}</p>
                            <p className="text-xs text-[#8A948C]">
                              {order.user?.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-7">
                        <p className="text-sm text-[#4F5B52]">
                          {order.package.name}
                        </p>

                        <p className="mt-1 text-xs capitalize text-[#8A948C]">
                          {order.storeProduct.provider.replace(/_/g, " ")}
                        </p>
                      </td>
                      <td className="px-4 py-7 text-sm text-[#4F5B52]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-7 text-sm font-bold">
                        {order.pricing.formattedPaymentAmount}
                      </td>

                      <td className="px-4 py-7">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClasses[order.status] ||
                            "bg-[#EEF3EC] text-[#4F5B52]"
                          }`}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="px-4 py-7">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/package-store/order-details/${order.id}`}
                            className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC]"
                            aria-label={`View ${order.orderNumber}`}
                          >
                            <Eye className="size-4" />
                          </Link>

                          <button
                            type="button"
                            disabled={downloadingOrderId === order.id}
                            onClick={() => handleDownloadInvoice(order)}
                            className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
                            aria-label={`Download invoice for ${order.orderNumber}`}
                          >
                            <Download className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <StorePagination
          page={response.meta.page}
          totalPages={response.meta.totalPages}
          total={response.meta.total}
          limit={response.meta.limit}
          onPageChange={(nextPage) => updateQuery({ page: nextPage })}
        />
      </Card>

      <OrderFilterDialog
        key={`${isFilterOpen ? "open" : "closed"}-${packageType}-${status}-${paymentProvider}-${dateFrom}-${dateTo}-${sortBy}-${sortOrder}`}
        open={isFilterOpen}
        values={{
          packageType,
          status,
          paymentProvider,
          dateFrom,
          dateTo,
          sortBy,
          sortOrder,
        }}
        onClose={() => setIsFilterOpen(false)}
        onApply={(values) => {
          setIsFilterOpen(false);
          updateQuery({
            page: 1,
            packageType: values.packageType,
            status: values.status,
            paymentProvider: values.paymentProvider,
            dateFrom: values.dateFrom,
            dateTo: values.dateTo,
            sortBy: values.sortBy,
            sortOrder: values.sortOrder,
          });
        }}
      />
    </>
  );
}
