"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  createLeaderboardReward,
  getLeaderboardRewardConfiguration,
} from "@/service/leaderboard/leaderboard.service";
import type {
  CreateLeaderboardRewardPayload,
  CreateLeaderboardRewardResponse,
  LeaderboardRewardType,
  RewardAssetTypeConfiguration,
  RewardConfigurationResponse,
} from "@/types/leaderboard/leaderboard.type";
import { isValidUuid } from "@/utils/uuid";

import PrizeDetailsCard from "./prize-details-card";
import RewardHeader from "./reward-header";
import RewardSuccessModal from "./reward-success-modal";
import SelectedUserCard from "./selected-user-card";
import SystemActionsCard from "./system-actions-card";
import {
  createInitialRewardForm,
  isPhysicalRewardType,
  type RewardConfigurationErrors,
  type RewardConfigurationFormState,
} from "./reward-configuration.types";

interface RewardConfigurationClientProps {
  userId: string;
}

const positiveAmountRewardTypes: LeaderboardRewardType[] = [
  "xp",
  "streak_freeze",
  "cv_credits",
  "ai_package",
];

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};

const isPositiveInteger = (value: string) => {
  const numberValue = Number(value);

  return Number.isInteger(numberValue) && numberValue > 0;
};

const validateRewardForm = (
  form: RewardConfigurationFormState,
  assetType: RewardAssetTypeConfiguration | undefined,
) => {
  const errors: RewardConfigurationErrors = {};

  if (!form.title.trim()) {
    errors.title = "Reward title is required.";
  } else if (form.title.trim().length > 180) {
    errors.title = "Reward title cannot exceed 180 characters.";
  }

  if (form.subtitle.trim().length > 300) {
    errors.subtitle = "Subtitle cannot exceed 300 characters.";
  }

  if (form.congratulatoryNote.trim().length > 1500) {
    errors.congratulatoryNote =
      "Congratulatory note cannot exceed 1,500 characters.";
  }

  if (form.earnedReason.trim().length > 1500) {
    errors.earnedReason = "Earned reason cannot exceed 1,500 characters.";
  }

  if (
    assetType?.requiredFields.includes("congratulatoryNote") &&
    !form.congratulatoryNote.trim()
  ) {
    errors.congratulatoryNote = "Congratulatory note is required.";
  }

  if (form.imageUrl.trim().length > 1200) {
    errors.imageUrl = "Image URL cannot exceed 1,200 characters.";
  }

  if (form.fileUrl.trim().length > 1200) {
    errors.fileUrl = "File URL cannot exceed 1,200 characters.";
  }

  if (
    form.relatedResourceId.trim() &&
    !isValidUuid(form.relatedResourceId.trim())
  ) {
    errors.relatedResourceId = "Related resource ID must be a valid UUID.";
  }

  if (isPhysicalRewardType(form.rewardType) && !form.imageUrl.trim()) {
    errors.imageUrl = "Prize image URL is required for a physical prize.";
  }

  if (form.rewardType === "downloadable_file" && !form.fileUrl.trim()) {
    errors.fileUrl = "File URL is required for a downloadable reward.";
  }

  if (form.rewardType === "course_access" && !form.relatedResourceId.trim()) {
    errors.relatedResourceId =
      "Course resource ID is required for a course-access reward.";
  }

  if (
    form.rewardType === "certificate" &&
    !form.relatedResourceId.trim() &&
    !form.fileUrl.trim()
  ) {
    errors.certificateResource =
      "Provide either a certificate resource ID or certificate file URL.";
  }

  if (
    positiveAmountRewardTypes.includes(form.rewardType) &&
    !isPositiveInteger(form.primaryAmount)
  ) {
    errors.primaryAmount = "Enter a positive whole-number reward amount.";
  }

  if (
    form.rewardType === "ai_package" &&
    !isPositiveInteger(form.secondaryAmount)
  ) {
    errors.secondaryAmount =
      "Enter a positive whole-number voice-minute amount.";
  }

  return errors;
};

const buildRewardPayload = (
  form: RewardConfigurationFormState,
): CreateLeaderboardRewardPayload => {
  const payload: CreateLeaderboardRewardPayload = {
    rewardType: form.rewardType,

    title: form.title.trim(),

    sendPushNotification: form.sendPushNotification,

    playConfettiAnimation: form.playConfettiAnimation,

    requestShippingAddress: isPhysicalRewardType(form.rewardType)
      ? form.requestShippingAddress
      : false,
  };

  if (form.subtitle.trim()) {
    payload.subtitle = form.subtitle.trim();
  }

  if (form.congratulatoryNote.trim()) {
    payload.congratulatoryNote = form.congratulatoryNote.trim();
  }

  if (form.earnedReason.trim()) {
    payload.earnedReason = form.earnedReason.trim();
  }

  if (isPhysicalRewardType(form.rewardType) || form.rewardType === "badge") {
    if (form.imageUrl.trim()) {
      payload.imageUrl = form.imageUrl.trim();
    }
  }

  if (
    form.rewardType === "downloadable_file" ||
    form.rewardType === "certificate"
  ) {
    if (form.fileUrl.trim()) {
      payload.fileUrl = form.fileUrl.trim();
    }
  }

  if (
    form.rewardType === "course_access" ||
    form.rewardType === "certificate"
  ) {
    if (form.relatedResourceId.trim()) {
      payload.relatedResourceId = form.relatedResourceId.trim();
    }
  }

  if (positiveAmountRewardTypes.includes(form.rewardType)) {
    payload.primaryAmount = Number(form.primaryAmount);
  }

  if (form.rewardType === "ai_package") {
    payload.secondaryAmount = Number(form.secondaryAmount);
  }

  return payload;
};

export default function RewardConfigurationClient({
  userId,
}: RewardConfigurationClientProps) {
  const router = useRouter();

  const [configuration, setConfiguration] =
    useState<RewardConfigurationResponse | null>(null);

  const [form, setForm] = useState<RewardConfigurationFormState | null>(null);

  const [savedForm, setSavedForm] =
    useState<RewardConfigurationFormState | null>(null);

  const [errors, setErrors] = useState<RewardConfigurationErrors>({});

  const [successResponse, setSuccessResponse] =
    useState<CreateLeaderboardRewardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loadError, setLoadError] = useState("");

  const isDirty = useMemo(() => {
    if (!form || !savedForm) {
      return false;
    }

    return JSON.stringify(form) !== JSON.stringify(savedForm);
  }, [form, savedForm]);

  const unsavedChanges = useUnsavedChangesWarning(isDirty);

  useEffect(() => {
    let mounted = true;

    const loadConfiguration = async () => {
      try {
        setLoadError("");

        const response = await getLeaderboardRewardConfiguration(userId);

        const initialForm = createInitialRewardForm(response);

        if (!mounted) return;

        setConfiguration(response);
        setForm(initialForm);
        setSavedForm(initialForm);
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

    void loadConfiguration();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const selectedAssetType = useMemo(() => {
    if (!configuration || !form) {
      return undefined;
    }

    return configuration.assetTypes.find(
      (assetType) => assetType.rewardType === form.rewardType,
    );
  }, [configuration, form]);

  const updateForm = <Key extends keyof RewardConfigurationFormState>(
    key: Key,
    value: RewardConfigurationFormState[Key],
  ) => {
    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: value,
      };
    });

    setErrors((current) => ({
      ...current,
      [key]: undefined,

      certificateResource:
        key === "fileUrl" || key === "relatedResourceId"
          ? undefined
          : current.certificateResource,
    }));
  };

  const handleRewardTypeChange = (rewardType: LeaderboardRewardType) => {
    if (!configuration) return;

    const assetType = configuration.assetTypes.find(
      (item) => item.rewardType === rewardType,
    );

    setForm((current) => {
      if (!current) return current;

      return {
        ...current,

        rewardType,

        sendPushNotification:
          assetType?.systemActions?.sendPushNotification ??
          configuration.systemActionDefaults.sendPushNotification,

        playConfettiAnimation:
          assetType?.systemActions?.playConfettiAnimation ??
          configuration.systemActionDefaults.playConfettiAnimation,

        requestShippingAddress:
          assetType?.systemActions?.requestShippingAddress ?? false,
      };
    });

    setErrors({});
  };

  const handleSubmit = async () => {
    if (!form) return;

    const nextErrors = validateRewardForm(form, selectedAssetType);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);

      toast.error("Complete the required reward fields before confirming.");

      return;
    }

    const toastId = toast.loading("Creating leaderboard reward...");

    try {
      setIsSubmitting(true);

      const response = await createLeaderboardReward(
        userId,
        buildRewardPayload(form),
      );

      setSuccessResponse(response);
      setSavedForm(form);
      setErrors({});

      toast.success(response.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-secondary" />
      </div>
    );
  }

  if (!configuration || !form) {
    return (
      <div className="mx-auto flex min-h-[480px] w-full max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h1 className="mt-5 text-2xl font-bold text-black/85">
          Reward configuration unavailable
        </h1>

        <p className="mt-3 max-w-lg text-black/55">
          {loadError || "Unable to load the selected learner."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/admin/league-gamification")}
          className="mt-7 rounded-full bg-secondary px-8 py-3 font-semibold text-white"
        >
          Back to Leaderboard
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1120px] space-y-7">
        <RewardHeader
          isSubmitting={isSubmitting}
          onBack={() =>
            unsavedChanges.requestNavigation("/admin/league-gamification")
          }
          onConfirm={handleSubmit}
        />

        <div className="grid gap-7 xl:grid-cols-[1fr_340px]">
          <div className="space-y-7">
            <SelectedUserCard user={configuration.user} />

            <PrizeDetailsCard
              assetTypes={configuration.assetTypes}
              selectedAssetType={selectedAssetType}
              form={form}
              errors={errors}
              disabled={isSubmitting}
              onRewardTypeChange={handleRewardTypeChange}
              onChange={updateForm}
            />
          </div>

          <SystemActionsCard
            form={form}
            showShippingAddress={isPhysicalRewardType(form.rewardType)}
            disabled={isSubmitting}
            onChange={updateForm}
          />
        </div>
      </div>

      <RewardSuccessModal
        isOpen={Boolean(successResponse)}
        response={successResponse}
        recipientName={configuration.user.displayName}
        onBackToLeaderboard={() => router.push("/admin/league-gamification")}
        onViewDetails={() => {
          if (!successResponse) return;

          router.push(
            `/admin/league-gamification/reward-history/${successResponse.reward.id}`,
          );
        }}
      />

      <UnsavedChangesWarningDialog
        open={unsavedChanges.warningOpen}
        onCancel={unsavedChanges.cancelNavigation}
        onConfirm={unsavedChanges.confirmNavigation}
      />
    </>
  );
}
