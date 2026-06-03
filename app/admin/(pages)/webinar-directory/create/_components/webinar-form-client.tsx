"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AudienceSettingsCard from "./audience-settings-card";
import PublishCard from "./publish-card";
import WebinarContentForm from "./webinar-content-form";
import { uploadWebinarThumbnail } from "@/service/files/file_upload";
import {
  createWebinar,
  getMyDraftWebinars,
  getMyUpcomingWebinars,
  updateWebinar,
} from "@/service/webinar/webinar";
import type {
  WebinarItem,
  WebinarPayload,
  WebinarPublishType,
} from "@/types/webinar/webinar_type";

export type WebinarFormState = {
  title: string;
  startDate: string;
  startTime: string;
  hostTeacherName: string;
  thumbnailImageUrl: string;
  thumbnailFile: File | null;
  courseIds: string[];
  sendNotification: boolean;
  publishType: WebinarPublishType;
};

const initialFormState: WebinarFormState = {
  title: "",
  startDate: "",
  startTime: "",
  hostTeacherName: "",
  thumbnailImageUrl: "",
  thumbnailFile: null,
  courseIds: [],
  sendNotification: false,
  publishType: "schedule",
};

const toDateInputValue = (dateTime: string) => {
  if (!dateTime) return "";
  return dateTime.slice(0, 10);
};

const toTimeInputValue = (dateTime: string) => {
  if (!dateTime) return "";
  return dateTime.slice(11, 16);
};

const mapWebinarToFormState = (webinar: WebinarItem): WebinarFormState => ({
  title: webinar.title,
  startDate: toDateInputValue(webinar.dateTime),
  startTime: toTimeInputValue(webinar.dateTime),
  hostTeacherName: webinar.hostTeacherName,
  thumbnailImageUrl: webinar.thumbnailImageUrl || "",
  thumbnailFile: null,
  courseIds: webinar.audienceSettings?.courseIds || [],
  sendNotification: Boolean(webinar.sendNotification),
  publishType: webinar.status === "draft" ? "draft" : "schedule",
});

const buildDateTime = (startDate: string, startTime: string) =>
  `${startDate}T${startTime}:00+00:00`;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const WebinarFormClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const webinarId = searchParams.get("id");

  const [form, setForm] = useState<WebinarFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(Boolean(webinarId));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = Boolean(webinarId);

  const pageTitle = useMemo(
    () => (isEditMode ? "Edit Webinar" : "Schedule New Webinar"),
    [isEditMode],
  );

  const updateForm = <K extends keyof WebinarFormState>(
    key: K,
    value: WebinarFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!webinarId) return;

    const loadWebinar = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [upcomingResponse, draftsResponse] = await Promise.all([
          getMyUpcomingWebinars(1, 100),
          getMyDraftWebinars(1, 100),
        ]);

        const selectedWebinar = [
          ...upcomingResponse.webinars,
          ...draftsResponse.webinars,
        ].find((item) => item.id === webinarId);

        if (selectedWebinar) {
          setForm(mapWebinarToFormState(selectedWebinar));
        } else {
          setError("Webinar details could not be loaded for editing.");
        }
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    loadWebinar();
  }, [webinarId]);

  const validateForm = () => {
    if (!form.title.trim()) return "Webinar title is required.";
    if (!form.startDate) return "Start date is required.";
    if (!form.startTime) return "Start time is required.";
    if (!form.hostTeacherName.trim()) return "Host / teacher name is required.";
    if (!form.thumbnailFile && !form.thumbnailImageUrl.trim()) {
      return "Thumbnail image is required.";
    }
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const thumbnailImageUrl = form.thumbnailFile
        ? await uploadWebinarThumbnail(form.thumbnailFile)
        : form.thumbnailImageUrl.trim();

      const payload: WebinarPayload = {
        title: form.title.trim(),
        dateTime: buildDateTime(form.startDate, form.startTime),
        hostTeacherName: form.hostTeacherName.trim(),
        thumbnailImageUrl,
        courseIds: form.courseIds,
        status: form.publishType === "schedule" ? "scheduled" : "draft",
        sendNotification: form.sendNotification,
      };

      if (webinarId) {
        await updateWebinar(webinarId, payload);
      } else {
        await createWebinar(payload);
      }

      router.push(
        `/admin/webinar-directory?tab=${payload.status === "scheduled" ? "upcoming-scheduled" : "draft"}`,
      );
      router.refresh();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-8 text-sm text-[#66736B] shadow-sm">
        Loading webinar details...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <WebinarContentForm
        form={form}
        pageTitle={pageTitle}
        isEditMode={isEditMode}
        onChange={updateForm}
      />

      <div className="space-y-6">
        <AudienceSettingsCard
          courseIds={form.courseIds}
          onCourseIdsChange={(courseIds) => updateForm("courseIds", courseIds)}
        />
        <PublishCard
          publishType={form.publishType}
          sendNotification={form.sendNotification}
          isSaving={isSaving}
          isEditMode={isEditMode}
          onPublishTypeChange={(publishType) => updateForm("publishType", publishType)}
          onSendNotificationChange={(sendNotification) =>
            updateForm("sendNotification", sendNotification)
          }
        />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </form>
  );
};

export default WebinarFormClient;
