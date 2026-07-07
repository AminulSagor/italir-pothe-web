"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  getAdminStoreOrderById,
  getAdminStoreOrderInvoice,
  refundAdminStoreOrder,
} from "@/service/package-store/package-store.service";
import type { StoreAdminOrder } from "@/types/package-store/package-store.type";
import { downloadTextFile } from "@/utils/package-store-download.util";

import CustomerInfoCard from "./customer-info-card";
import OrderDetailsHeader from "./order-details-header";
import OrderSummaryCard from "./order-summary-card";
import PackageDetailsCard from "./package-details-card";
import PaymentSummaryCard from "./payment-summary-card";
import RefundOrderDialog from "./refund-order-dialog";
import TimelineActivityCard from "./timeline-activity-card";

interface OrderDetailsClientProps {
  orderId: string;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

export default function OrderDetailsClient({
  orderId,
}: OrderDetailsClientProps) {
  const [order, setOrder] = useState<StoreAdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isRefunding, setIsRefunding] = useState(false);

  const unsaved = useUnsavedChangesWarning(
    isRefundOpen && refundReason.trim().length > 0,
  );

  useEffect(() => {
    let mounted = true;

    const fetchOrder = async () => {
      try {
        const response = await getAdminStoreOrderById(orderId);

        if (mounted) {
          setOrder(response);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
          setOrder(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchOrder();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  const requestCloseRefund = () => {
    unsaved.requestAction(() => {
      setIsRefundOpen(false);
      setRefundReason("");
    });
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;

    const toastId = toast.loading("Preparing invoice...");

    try {
      setIsDownloading(true);

      const html = await getAdminStoreOrderInvoice(order.id);

      downloadTextFile(
        html,
        `invoice-${order.orderNumber}.html`,
        "text/html;charset=utf-8",
      );

      toast.success("Invoice downloaded.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRefund = async () => {
    if (!order) return;

    const toastId = toast.loading("Processing refund / revocation...");

    try {
      setIsRefunding(true);

      const response = await refundAdminStoreOrder(order.id, {
        reason: refundReason.trim() || undefined,
      });

      if (response.order) {
        setOrder(response.order);
      } else {
        const refreshedOrder = await getAdminStoreOrderById(order.id);
        setOrder(refreshedOrder);
      }

      setIsRefundOpen(false);
      setRefundReason("");

      toast.success(
        response.message || "Refund / revocation request processed.",
        {
          id: toastId,
        },
      );
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsRefunding(false);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl bg-white p-10 text-sm text-[#4F5B52]">
          Loading order details...
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl bg-white p-10 text-sm text-[#4F5B52]">
          Order not found.
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <OrderDetailsHeader
          order={order}
          isDownloading={isDownloading}
          isRefunding={isRefunding}
          onDownloadInvoice={handleDownloadInvoice}
          onRefund={() => setIsRefundOpen(true)}
        />

        <OrderSummaryCard order={order} />

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <CustomerInfoCard order={order} />
          <PackageDetailsCard order={order} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <PaymentSummaryCard order={order} />
          <TimelineActivityCard order={order} />
        </div>
      </section>

      <RefundOrderDialog
        open={isRefundOpen}
        reason={refundReason}
        isSubmitting={isRefunding}
        onReasonChange={setRefundReason}
        onClose={requestCloseRefund}
        onConfirm={handleRefund}
      />

      <UnsavedChangesWarningDialog
        open={unsaved.warningOpen}
        onCancel={unsaved.cancelNavigation}
        onConfirm={unsaved.confirmNavigation}
      />
    </>
  );
}
