"use client";

import { Eye, FileText, RefreshCw, Trash2, Video } from "lucide-react";

import FileUploader from "@/components/UI/uploaders/file-uploader";

interface CareerTrackResourceUploaderProps {
  label: string;
  type: "video" | "pdf";
  file: File | null;
  existingFileId?: string | null;
  existingFileName?: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onView?: () => void;
}

export default function CareerTrackResourceUploader({
  label,
  type,
  file,
  existingFileId,
  existingFileName,
  onFileSelect,
  onClear,
  onView,
}: CareerTrackResourceUploaderProps) {
  const Icon = type === "video" ? Video : FileText;
  const accept = type === "video" ? "video/mp4,video/quicktime" : ".pdf";

  const fallbackFileName =
    type === "video" ? "Intro video attached" : "Theory PDF attached";

  const shownFileName =
    file?.name || existingFileName || (existingFileId ? fallbackFileName : "");

  const title =
    type === "video"
      ? "Upload Course Video"
      : "Drag & drop instructional PDF here";

  const description =
    type === "video"
      ? "Drag & drop course video or click to browse. Supported formats: MP4, MOV."
      : "PDF only. Max file size 25MB.";

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-[#66736B]">
        {label}
      </label>

      {shownFileName ? (
        <div className="flex flex-col gap-4 rounded-3xl border border-[#E5ECE6] bg-[#F8FBF7] p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#E6F7EC] text-[#006B3F]">
              <Icon className="size-5" />
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#202420]">
                {shownFileName}
              </h4>

              <p className="mt-1 text-xs text-[#66736B]">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                  : "Uploaded resource"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {existingFileId && onView ? (
              <button
                type="button"
                onClick={onView}
                className="inline-flex items-center rounded-full border border-[#D8DED7] px-4 py-2 text-sm text-[#006B3F]"
              >
                <Eye className="mr-2 size-3.5" />
                VIEW
              </button>
            ) : null}

            <label>
              <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];

                  if (selectedFile) {
                    onFileSelect(selectedFile);
                  }
                }}
              />

              <span className="inline-flex cursor-pointer items-center rounded-full border border-[#D8DED7] px-4 py-2 text-sm text-[#4D574F]">
                <RefreshCw className="mr-2 size-3.5" />
                REPLACE
              </span>
            </label>

            <button type="button" onClick={onClear} className="text-[#D92D20]">
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <FileUploader
          title={title}
          description={description}
          accept={accept}
          onFileSelect={onFileSelect}
        />
      )}
    </div>
  );
}
