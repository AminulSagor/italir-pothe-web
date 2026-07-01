"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Presentation } from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";
import type { WebinarFormState } from "./webinar-form-client";

type WebinarContentFormProps = {
  form: WebinarFormState;
  onChange: <K extends keyof WebinarFormState>(
    key: K,
    value: WebinarFormState[K],
  ) => void;
};

const WebinarContentForm = ({ form, onChange }: WebinarContentFormProps) => {
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(
    form.thumbnailImageUrl,
  );

  useEffect(() => {
    if (!form.thumbnailFile) {
      setThumbnailPreviewUrl(form.thumbnailImageUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(form.thumbnailFile);
    setThumbnailPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.thumbnailFile, form.thumbnailImageUrl]);

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8F3ED]">
          <Presentation className="size-5 text-[#006B3F]" />
        </div>

        <h2 className="text-lg font-semibold text-[#202420]">
          Webinar Content
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-medium text-[#202420]">
            Webinar Title
          </label>

          <input
            type="text"
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="e.g., Grammar Bootcamp: Past Tense"
            className="h-14 w-full rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] px-5 text-sm outline-none transition focus:border-[#006B3F]"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-[#202420]">
              Start Date
            </label>

            <div className="relative">
              <CalendarDays className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#006B3F]" />

              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  onChange("startDate", event.target.value)
                }
                className="h-14 w-full rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] pl-14 pr-5 text-sm outline-none transition focus:border-[#006B3F]"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-[#202420]">
              Time (BST)
            </label>

            <div className="relative">
              <Clock3 className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#006B3F]" />

              <input
                type="time"
                value={form.startTime}
                onChange={(event) =>
                  onChange("startTime", event.target.value)
                }
                className="h-14 w-full rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] pl-14 pr-5 text-sm outline-none transition focus:border-[#006B3F]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-[#202420]">
            Host / Teacher
          </label>

          <input
            type="text"
            value={form.hostTeacherName}
            onChange={(event) =>
              onChange("hostTeacherName", event.target.value)
            }
            placeholder="e.g., Test Teacher"
            className="h-14 w-full rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] px-5 text-sm outline-none transition focus:border-[#006B3F]"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-[#202420]">
            Thumbnail Upload
          </label>

          <FileUploader
            accept="image/*"
            className="min-h-[220px]"
            previewUrl={thumbnailPreviewUrl}
            previewAlt="Webinar thumbnail preview"
            title={form.thumbnailFile?.name || "Thumbnail image selected"}
            description={
              form.thumbnailFile
                ? "Selected image will be uploaded before saving. Click to replace it."
                : form.thumbnailImageUrl
                  ? "Existing thumbnail is selected. Click to replace it."
                  : "Drag & drop thumbnail image (16:9) or click to browse local files (Max 5MB)"
            }
            onFileSelect={(file) => onChange("thumbnailFile", file)}
          />
        </div>
      </div>
    </Card>
  );
};

export default WebinarContentForm;
