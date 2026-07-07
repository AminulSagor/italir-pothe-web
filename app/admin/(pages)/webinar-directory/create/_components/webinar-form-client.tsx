"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import BackButton from "@/components/UI/buttons/back-button";
import { getCourses } from "@/service/course-directory/course.service";
import { uploadWebinarThumbnail } from "@/service/files/file_upload";
import {
  createWebinar,
  getAdminWebinarById,
  updateWebinar,
} from "@/service/webinar/webinar";
import type { Course } from "@/types/course-directory/course.type";
import type {
  WebinarItem,
  WebinarPayload,
  WebinarPublishType,
} from "@/types/webinar/webinar_type";
import AudienceSettingsCard from "./audience-settings-card";
import PublishCard from "./publish-card";
import WebinarContentForm from "./webinar-content-form";

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

const toBangladeshDate = (dateTime: string) => {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getTime() + 6 * 60 * 60 * 1000);
};

const toDateInputValue = (dateTime: string) => {
  const date = toBangladeshDate(dateTime);
  if (!date) return "";
  return date.toISOString().slice(0, 10);
};

const toTimeInputValue = (dateTime: string) => {
  const date = toBangladeshDate(dateTime);
  if (!date) return "";
  return date.toISOString().slice(11, 16);
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
  `${startDate}T${startTime}:00+06:00`;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const WebinarFormClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const webinarId = searchParams.get("id");

  const [form, setForm] = useState<WebinarFormState>(initialFormState);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(webinarId));
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [courseError, setCourseError] = useState("");

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
    const loadCourses = async () => {
      try {
        setIsCoursesLoading(true);
        setCourseError("");
        const response = await getCourses({
          page: 1,
          limit: 100,
          statuses: "published",
        });
        setCourses(response.items);
      } catch (loadError) {
        setCourseError(getErrorMessage(loadError));
      } finally {
        setIsCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    if (!webinarId) return;

    const loadWebinar = async () => {
      try {
        setIsLoading(true);
        setError("");
        const selectedWebinar = await getAdminWebinarById(webinarId);
        setForm(mapWebinarToFormState(selectedWebinar));
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
        `/admin/webinar-directory?tab=${
          payload.status === "scheduled" ? "upcoming-scheduled" : "draft"
        }`,
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
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[#66736B]">
        <BackButton />
        <span>Webinars</span>
        <span>›</span>
        <span className="font-semibold text-[#006B3F]">
          {isEditMode ? "Edit" : "Create"}
        </span>
      </div>

      <h1 className="text-2xl font-semibold text-[#006339]">{pageTitle}</h1>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-6 xl:grid-cols-[1fr_320px]"
      >
        <WebinarContentForm form={form} onChange={updateForm} />

        <div className="space-y-6">
          <AudienceSettingsCard
            courseIds={form.courseIds}
            courses={courses}
            isLoading={isCoursesLoading}
            error={courseError}
            onCourseIdsChange={(courseIds) => updateForm("courseIds", courseIds)}
          />
          <PublishCard
            publishType={form.publishType}
            sendNotification={form.sendNotification}
            isSaving={isSaving}
            isEditMode={isEditMode}
            onPublishTypeChange={(publishType) =>
              updateForm("publishType", publishType)
            }
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
    </div>
  );
};

export default WebinarFormClient;
