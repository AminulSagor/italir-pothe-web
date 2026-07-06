import { Download, Loader2, RotateCcw } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import BackButton from "@/components/UI/buttons/back-button";
import type { StoreAdminOrder } from "@/types/package-store/package-store.type";

interface OrderDetailsHeaderProps {
  order: StoreAdminOrder;
  isDownloading: boolean;
  isRefunding: boolean;
  onDownloadInvoice: () => void;
  onRefund: () => void;
}

export default function OrderDetailsHeader({
  order,
  isDownloading,
  isRefunding,
  onDownloadInvoice,
  onRefund,
}: OrderDetailsHeaderProps) {
  const canRefund = order.status === "completed" && !order.payment.refundedAt;

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <BackButton />

        <div>
          <h1 className="text-2xl font-bold text-[#006B3F]">Order Details</h1>

          <p className="text-sm text-[#4F5B52]">
            Finance Manager / Transaction {order.orderNumber}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          className="gap-2 bg-[#58F85F] !text-[#006B3F] hover:!bg-[#58F85F]"
          disabled={isDownloading}
          onClick={onDownloadInvoice}
        >
          {isDownloading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Download Invoice
        </Button>

        {canRefund && (
          <Button
            variant="ghost"
            className="gap-2 bg-[#FCEBEC] text-[#D92D20]"
            disabled={isRefunding}
            onClick={onRefund}
          >
            {isRefunding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            Refund / Revoke Access
          </Button>
        )}
      </div>
    </div>
  );
}
