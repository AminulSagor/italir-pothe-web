"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  dispatchLeaderboardReward,
  getLeaderboardRewardById,
  markLeaderboardRewardDelivered,
  requestLeaderboardRewardAddress,
  revokeLeaderboardReward,
  sendLeaderboardRewardUpdate,
  updateLeaderboardRewardAddress,
  updateLeaderboardRewardStatus,
} from "@/service/leaderboard/leaderboard.service";
import type {
  DispatchRewardPayload,
  LeaderboardRewardDetail,
  LeaderboardRewardStatus,
  SendRewardUpdatePayload,
  UpdateRewardShippingAddressPayload,
} from "@/types/leaderboard/leaderboard.type";

import ConfirmRewardActionDialog from "./confirm-reward-action-dialog";
import DispatchRewardDialog from "./dispatch-reward-dialog";
import FulfillmentActionsCard from "./fulfillment-actions-card";
import RewardDetailHeader from "./reward-detail-header";
import RewardPrizeCard from "./reward-prize-card";
import RewardUserCard from "./reward-user-card";
import SendRewardUpdateDialog from "./send-reward-update-dialog";
import ShippingAddressDialog from "./shipping-address-dialog";
import ShippingCard from "./shipping-card";
import UpdateRewardStatusDialog from "./update-reward-status-dialog";

interface RewardDetailClientProps {
  rewardId: string;
}

type ConfirmAction = "deliver" | "revoke" | "request-address";

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Something went wrong.";
};

export default function RewardDetailClient({
  rewardId,
}: RewardDetailClientProps) {
  const router = useRouter();

  const [detail, setDetail] = useState<LeaderboardRewardDetail | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sendUpdateOpen, setSendUpdateOpen] = useState(false);

  const [shippingOpen, setShippingOpen] = useState(false);

  const [dispatchOpen, setDispatchOpen] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );

  const [updateTitle, setUpdateTitle] = useState("");

  const [updateBody, setUpdateBody] = useState("");

  const [shippingForm, setShippingForm] =
    useState<UpdateRewardShippingAddressPayload>({
      fullName: "",
      whatsappNumber: "",
      addressLine: "",
      countryCode: "IT",
    });

  const [dispatchForm, setDispatchForm] = useState<DispatchRewardPayload>({
    carrierName: "",
    trackingNumber: "",
    invoiceUrl: "",
    sendNotification: true,
  });

  const [nextStatus, setNextStatus] = useState<LeaderboardRewardStatus | "">(
    "",
  );

  const loadDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await getLeaderboardRewardById(rewardId);

      setDetail(response);
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [rewardId]);

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      try {
        const response = await getLeaderboardRewardById(rewardId);

        if (mounted) {
          setDetail(response);
          setLoadError("");
        }
      } catch (error) {
        if (!mounted) return;

        const message = getErrorMessage(error);

        setLoadError(message);
        toast.error(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchDetail();

    return () => {
      mounted = false;
    };
  }, [rewardId]);

  const dialogDirty = useMemo(() => {
    if (sendUpdateOpen) {
      return Boolean(updateTitle.trim() || updateBody.trim());
    }

    if (shippingOpen) {
      const currentAddress = detail?.shippingAddress;

      return (
        shippingForm.fullName !== (currentAddress?.fullName || "") ||
        shippingForm.whatsappNumber !==
          (currentAddress?.whatsappNumber || "") ||
        shippingForm.addressLine !== (currentAddress?.addressLine || "") ||
        (shippingForm.countryCode || "IT") !==
          (currentAddress?.countryCode || "IT") ||
        String(shippingForm.latitude || "") !==
          String(currentAddress?.latitude || "") ||
        String(shippingForm.longitude || "") !==
          String(currentAddress?.longitude || "")
      );
    }

    if (dispatchOpen) {
      return Boolean(
        dispatchForm.carrierName?.trim() ||
        dispatchForm.trackingNumber?.trim() ||
        dispatchForm.invoiceUrl?.trim() ||
        dispatchForm.sendNotification === false,
      );
    }

    return Boolean(statusOpen && nextStatus);
  }, [
    detail?.shippingAddress,
    dispatchForm,
    dispatchOpen,
    nextStatus,
    sendUpdateOpen,
    shippingForm,
    shippingOpen,
    statusOpen,
    updateBody,
    updateTitle,
  ]);

  const unsavedChanges = useUnsavedChangesWarning(dialogDirty);

  const closeDialogSafely = (action: () => void) => {
    unsavedChanges.requestAction(action);
  };

  const refreshAfterAction = async (message: string, toastId: string) => {
    await loadDetail();

    toast.success(message, {
      id: toastId,
    });
  };

  const openShippingDialog = () => {
    const address = detail?.shippingAddress;

    setShippingForm({
      fullName: address?.fullName || detail?.recipient.displayName || "",

      whatsappNumber: address?.whatsappNumber || detail?.recipient.phone || "",

      addressLine: address?.addressLine || "",

      countryCode: address?.countryCode || "IT",

      latitude: address?.latitude ? Number(address.latitude) : undefined,

      longitude: address?.longitude ? Number(address.longitude) : undefined,
    });

    setShippingOpen(true);
  };

  const openDispatchDialog = () => {
    setDispatchForm({
      carrierName: detail?.fulfillment?.carrierName || "",

      trackingNumber: detail?.fulfillment?.trackingNumber || "",

      invoiceUrl: detail?.fulfillment?.invoiceUrl || "",

      sendNotification: true,
    });

    setDispatchOpen(true);
  };

  const handleSendUpdate = async () => {
    const payload: SendRewardUpdatePayload = {};

    if (updateTitle.trim()) {
      payload.title = updateTitle.trim();
    }

    if (updateBody.trim()) {
      payload.body = updateBody.trim();
    }

    const toastId = toast.loading("Sending reward update...");

    try {
      setIsSubmitting(true);

      const response = await sendLeaderboardRewardUpdate(rewardId, payload);

      setSendUpdateOpen(false);
      setUpdateTitle("");
      setUpdateBody("");

      await refreshAfterAction(response.message, toastId);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!shippingForm.fullName.trim()) {
      toast.error("Recipient full name is required.");

      return;
    }

    if (!shippingForm.whatsappNumber.trim()) {
      toast.error("WhatsApp number is required.");

      return;
    }

    if (!shippingForm.addressLine.trim()) {
      toast.error("Shipping address is required.");

      return;
    }

    const toastId = toast.loading("Saving shipping address...");

    try {
      setIsSubmitting(true);

      const response = await updateLeaderboardRewardAddress(rewardId, {
        ...shippingForm,

        fullName: shippingForm.fullName.trim(),

        whatsappNumber: shippingForm.whatsappNumber.trim(),

        addressLine: shippingForm.addressLine.trim(),

        countryCode: shippingForm.countryCode?.trim().toUpperCase() || "IT",
      });

      setShippingOpen(false);

      await refreshAfterAction(response.message, toastId);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispatch = async () => {
    const toastId = toast.loading("Dispatching reward...");

    try {
      setIsSubmitting(true);

      const response = await dispatchLeaderboardReward(rewardId, {
        carrierName: dispatchForm.carrierName?.trim() || undefined,

        trackingNumber: dispatchForm.trackingNumber?.trim() || undefined,

        invoiceUrl: dispatchForm.invoiceUrl?.trim() || undefined,

        sendNotification: dispatchForm.sendNotification,
      });

      setDispatchOpen(false);

      await refreshAfterAction(response.message, toastId);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!nextStatus) {
      toast.error("Select the new reward status.");

      return;
    }

    const toastId = toast.loading("Updating reward status...");

    try {
      setIsSubmitting(true);

      const response = await updateLeaderboardRewardStatus(rewardId, {
        status: nextStatus,
      });

      setStatusOpen(false);
      setNextStatus("");

      await refreshAfterAction(response.message, toastId);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    const loadingMessage =
      confirmAction === "deliver"
        ? "Marking reward as delivered..."
        : confirmAction === "revoke"
          ? "Revoking reward..."
          : "Requesting shipping address...";

    const toastId = toast.loading(loadingMessage);

    try {
      setIsSubmitting(true);

      const response =
        confirmAction === "deliver"
          ? await markLeaderboardRewardDelivered(rewardId)
          : confirmAction === "revoke"
            ? await revokeLeaderboardReward(rewardId)
            : await requestLeaderboardRewardAddress(rewardId);

      setConfirmAction(null);

      await refreshAfterAction(response.message, toastId);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !detail) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-secondary" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="mx-auto flex min-h-[480px] w-full max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h1 className="mt-5 text-2xl font-bold text-black/85">
          Reward details unavailable
        </h1>

        <p className="mt-3 max-w-lg text-black/55">{loadError}</p>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/league-gamification/reward-history")
          }
          className="mt-7 rounded-full bg-secondary px-8 py-3 font-semibold text-white"
        >
          Back to Reward History
        </button>
      </div>
    );
  }

  const isPhysicalReward = ["physical_prize", "physical_gift"].includes(
    detail.reward.rewardType,
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[1120px] space-y-8">
        <RewardDetailHeader
          detail={detail}
          onBack={() =>
            unsavedChanges.requestNavigation(
              "/admin/league-gamification/reward-history",
            )
          }
          onOpenUpdate={() => setSendUpdateOpen(true)}
          onRequestAddress={() => setConfirmAction("request-address")}
          onDownloadInvoice={() => {
            const invoiceUrl = detail.fulfillment?.invoiceUrl;

            if (!invoiceUrl) {
              toast.error("No invoice is available for this reward.");

              return;
            }

            window.open(invoiceUrl, "_blank", "noopener,noreferrer");
          }}
        />

        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <RewardUserCard recipient={detail.recipient} />

          <div className="space-y-7">
            <RewardPrizeCard reward={detail.reward} />

            {isPhysicalReward && (
              <ShippingCard
                shippingAddress={detail.shippingAddress}
                fulfillment={detail.fulfillment}
                canEdit={detail.availableActions.canEditAddress}
                onEdit={openShippingDialog}
              />
            )}

            <FulfillmentActionsCard
              actions={detail.availableActions}
              onSendUpdate={() => setSendUpdateOpen(true)}
              onUpdateStatus={() => setStatusOpen(true)}
              onDispatch={openDispatchDialog}
              onMarkDelivered={() => setConfirmAction("deliver")}
              onRevoke={() => setConfirmAction("revoke")}
            />
          </div>
        </div>
      </div>

      <SendRewardUpdateDialog
        open={sendUpdateOpen}
        title={updateTitle}
        body={updateBody}
        isSubmitting={isSubmitting}
        onTitleChange={setUpdateTitle}
        onBodyChange={setUpdateBody}
        onClose={() =>
          closeDialogSafely(() => {
            setSendUpdateOpen(false);
            setUpdateTitle("");
            setUpdateBody("");
          })
        }
        onSubmit={handleSendUpdate}
      />

      <ShippingAddressDialog
        open={shippingOpen}
        form={shippingForm}
        isSubmitting={isSubmitting}
        onChange={setShippingForm}
        onClose={() => closeDialogSafely(() => setShippingOpen(false))}
        onSubmit={handleSaveAddress}
      />

      <DispatchRewardDialog
        open={dispatchOpen}
        form={dispatchForm}
        isSubmitting={isSubmitting}
        onChange={setDispatchForm}
        onClose={() => closeDialogSafely(() => setDispatchOpen(false))}
        onSubmit={handleDispatch}
      />

      <UpdateRewardStatusDialog
        open={statusOpen}
        currentStatus={detail.reward.status}
        nextStatus={nextStatus}
        isSubmitting={isSubmitting}
        onStatusChange={setNextStatus}
        onClose={() =>
          closeDialogSafely(() => {
            setStatusOpen(false);
            setNextStatus("");
          })
        }
        onSubmit={handleUpdateStatus}
      />

      <ConfirmRewardActionDialog
        open={Boolean(confirmAction)}
        action={confirmAction}
        isSubmitting={isSubmitting}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />

      <UnsavedChangesWarningDialog
        open={unsavedChanges.warningOpen}
        onCancel={unsavedChanges.cancelNavigation}
        onConfirm={unsavedChanges.confirmNavigation}
      />
    </>
  );
}
