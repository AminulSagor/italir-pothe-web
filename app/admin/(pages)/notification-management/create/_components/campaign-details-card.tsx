"use client";

import { Camera, Trash2 } from "lucide-react";
import { ChangeEvent, DragEvent, useRef } from "react";
import toast from "react-hot-toast";

interface CampaignDetailsCardProps {
  title: string;
  body: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onImageChange: (file: File | null) => void;
}

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const maxImageSize = 5 * 1024 * 1024;

export default function CampaignDetailsCard({
  title,
  body,
  imageFile,
  imagePreviewUrl,
  onTitleChange,
  onBodyChange,
  onImageChange,
}: CampaignDetailsCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectImage = (file?: File) => {
    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed.");
      return;
    }

    if (file.size > maxImageSize) {
      toast.error("The image must be smaller than 5 MB.");
      return;
    }

    onImageChange(file);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    validateAndSelectImage(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    validateAndSelectImage(event.dataTransfer.files?.[0]);
  };

  return (
    <section className="rounded-[2rem] bg-white p-7 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-black/45">
        Campaign Details
      </p>

      <div className="mt-6 space-y-4">
        <input
          value={title}
          onChange={(event) =>
            onTitleChange(event.target.value)
          }
          maxLength={180}
          placeholder="Notification Title (e.g., New B1 Practice Material)"
          className="h-12 w-full rounded-3xl bg-[#EEF3EC] px-5 text-sm outline-none placeholder:text-black/40"
        />

        <textarea
          value={body}
          onChange={(event) =>
            onBodyChange(event.target.value)
          }
          maxLength={500}
          placeholder="Notification Body Message... Keep it snappy and engaging."
          className="h-24 w-full resize-none rounded-3xl bg-[#EEF3EC] px-5 py-4 text-sm outline-none placeholder:text-black/40"
        />
      </div>

      <p className="mt-10 text-sm font-bold uppercase tracking-[0.22em] text-black/45">
        Rich Media
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {imageFile && imagePreviewUrl ? (
        <div className="relative mt-5 overflow-hidden rounded-[2rem] border border-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreviewUrl}
            alt="Selected notification"
            className="h-44 w-full object-cover"
          />

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black/75">
                {imageFile.name}
              </p>

              <p className="mt-1 text-xs text-black/45">
                {(imageFile.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="mt-5 flex h-32 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-black/20 text-center"
        >
          <Camera className="size-7 text-secondary" />

          <p className="mt-3 text-base font-bold text-secondary">
            Click or drag image to upload
          </p>

          <p className="mt-1 text-sm text-black/45">
            Recommended: 1024×512px (JPG, PNG, WebP)
          </p>
        </div>
      )}
    </section>
  );
}