"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { uploadNotificationImage } from "@/service/files/file_upload";
import {
  scheduleNotification,
  sendBroadcastNotification,
  sendUserNotification,
} from "@/service/notification/notification.service";
import type { NotificationUser } from "@/types/notification/notification.type";

import CampaignDetailsCard from "./campaign-details-card";
import ComposerHeader from "./composer-header";
import DevicePreviewCard from "./device-preview-card";
import ScheduleCard, {
  type DeliveryMode,
} from "./schedule-card";
import TargetAudienceCard from "./target-audience-card";

export type AudienceType =
  | "all_users"
  | "specific_user";

const getErrorMessage = (
  error: unknown,
): string =>
  error instanceof Error
    ? error.message
    : "Notification request could not be completed.";

const toDateTimeLocalValue = (
  date: Date,
): string => {
  const timezoneOffset =
    date.getTimezoneOffset() * 60_000;

  return new Date(
    date.getTime() - timezoneOffset,
  )
    .toISOString()
    .slice(0, 16);
};

export default function NotificationComposer() {
  const router = useRouter();

  const [mode, setMode] =
    useState<DeliveryMode>("send_now");

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [audienceType, setAudienceType] =
    useState<AudienceType>("all_users");

  const [selectedUser, setSelectedUser] =
    useState<NotificationUser | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [
    imagePreviewUrl,
    setImagePreviewUrl,
  ] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const minimumScheduledAt = useMemo(
    () =>
      toDateTimeLocalValue(
        new Date(Date.now() + 2 * 60_000),
      ),
    [],
  );

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(
          imagePreviewUrl,
        );
      }
    };
  }, [imagePreviewUrl]);

  const handleImageChange = (
    file: File | null,
  ) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(
        imagePreviewUrl,
      );
    }

    setImageFile(file);

    setImagePreviewUrl(
      file
        ? URL.createObjectURL(file)
        : null,
    );
  };

  const handleAudienceChange = (
    type: AudienceType,
  ) => {
    setAudienceType(type);

    if (type === "all_users") {
      setSelectedUser(null);
    }
  };

  const validateForm = (): {
    cleanTitle: string;
    cleanBody: string;
    scheduledDate?: Date;
  } | null => {
    const cleanTitle = title.trim();
    const cleanBody = body.trim();

    if (!cleanTitle) {
      toast.error(
        "Notification title is required.",
      );

      return null;
    }

    if (!cleanBody) {
      toast.error(
        "Notification body is required.",
      );

      return null;
    }

    if (
      audienceType === "specific_user" &&
      !selectedUser
    ) {
      toast.error(
        "Please select a user.",
      );

      return null;
    }

    if (mode === "schedule_later") {
      if (!scheduledAt) {
        toast.error(
          "Please select a delivery date and time.",
        );

        return null;
      }

      const scheduledDate =
        new Date(scheduledAt);

      if (
        Number.isNaN(
          scheduledDate.getTime(),
        )
      ) {
        toast.error(
          "The selected date and time is invalid.",
        );

        return null;
      }

      if (
        scheduledDate.getTime() <=
        Date.now()
      ) {
        toast.error(
          "Scheduled time must be in the future.",
        );

        return null;
      }

      return {
        cleanTitle,
        cleanBody,
        scheduledDate,
      };
    }

    return {
      cleanTitle,
      cleanBody,
    };
  };

  const handleSubmit = async () => {
    const validation = validateForm();

    if (!validation) {
      return;
    }

    const isScheduleMode =
      mode === "schedule_later";

    const toastId = toast.loading(
      imageFile
        ? isScheduleMode
          ? "Uploading image and scheduling notification..."
          : "Uploading image and sending notification..."
        : isScheduleMode
          ? "Scheduling notification..."
          : "Sending notification...",
    );

    setIsSubmitting(true);

    try {
      let imageFileId:
        | string
        | undefined;

      if (imageFile) {
        const uploadedImage =
          await uploadNotificationImage(
            imageFile,
          );

        imageFileId =
          uploadedImage.fileId;
      }

      const commonPayload = {
        type: "admin_message" as const,
        title: validation.cleanTitle,
        body: validation.cleanBody,
        priority: "high" as const,
        ...(imageFileId
          ? { imageFileId }
          : {}),
      };

      if (isScheduleMode) {
        await scheduleNotification({
          ...commonPayload,

          targetType:
            audienceType === "all_users"
              ? "broadcast"
              : "user",

          ...(audienceType ===
            "specific_user" &&
          selectedUser
            ? {
                userIds: [
                  selectedUser.id,
                ],
              }
            : {}),

          scheduledAt:
            validation.scheduledDate!.toISOString(),
        });
      } else if (
        audienceType === "all_users"
      ) {
        await sendBroadcastNotification(
          commonPayload,
        );
      } else {
        await sendUserNotification({
          ...commonPayload,
          userId: selectedUser!.id,
        });
      }

      toast.success(
        isScheduleMode
          ? "Notification scheduled successfully."
          : "Notification sent successfully.",
        {
          id: toastId,
        },
      );

      router.push(
        "/admin/notification-management",
      );

      router.refresh();
    } catch (error) {
      toast.error(
        getErrorMessage(error),
        {
          id: toastId,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (
    nextMode: DeliveryMode,
  ) => {
    setMode(nextMode);

    if (
      nextMode === "schedule_later" &&
      !scheduledAt
    ) {
      setScheduledAt(
        toDateTimeLocalValue(
          new Date(
            Date.now() + 10 * 60_000,
          ),
        ),
      );
    }
  };

  const audienceLabel =
    audienceType === "all_users"
      ? "all users"
      : selectedUser?.fullName ||
        "one selected user";

  return (
    <div className="space-y-6">
      <ComposerHeader />

      <ScheduleCard
        audienceLabel={audienceLabel}
        mode={mode}
        scheduledAt={scheduledAt}
        minimumScheduledAt={
          minimumScheduledAt
        }
        isSubmitting={isSubmitting}
        onModeChange={handleModeChange}
        onScheduledAtChange={
          setScheduledAt
        }
        onSubmit={handleSubmit}
      />

      <TargetAudienceCard
        audienceType={audienceType}
        selectedUser={selectedUser}
        onAudienceChange={
          handleAudienceChange
        }
        onUserSelect={setSelectedUser}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <CampaignDetailsCard
          title={title}
          body={body}
          imageFile={imageFile}
          imagePreviewUrl={
            imagePreviewUrl
          }
          onTitleChange={setTitle}
          onBodyChange={setBody}
          onImageChange={
            handleImageChange
          }
        />

        <DevicePreviewCard
          title={title}
          body={body}
          imagePreviewUrl={
            imagePreviewUrl
          }
        />
      </div>
    </div>
  );
}

