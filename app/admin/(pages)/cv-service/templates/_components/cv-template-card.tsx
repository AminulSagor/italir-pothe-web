"use client";

import { useState } from "react";
import { FileImage, Loader2, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { service_URL } from "@/config/env";
import type { CvTemplateItem } from "@/types/cv-template/cv_template_type";

interface CVTemplateCardProps {
  template: CvTemplateItem;
  isDeleting?: boolean;
  onDelete: (template: CvTemplateItem) => void;
}

const normalizeImageUrl = (value: string) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  if (/^(https?:|data:|blob:)/i.test(normalizedValue)) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("//")) {
    return `https:${normalizedValue}`;
  }

  const baseUrl = service_URL.replace(/\/$/, "");

  return `${baseUrl}/${normalizedValue.replace(/^\/+/, "")}`;
};

const formatUploadDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function CVTemplateCard({
  template,
  isDeleting = false,
  onDelete,
}: CVTemplateCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const imageUrl = normalizeImageUrl(template.imageUrl);
  const shouldShowImage = imageUrl.length > 0 && !imageFailed;

  return (
    <Card
      padding="md"
      rounded="3xl"
      shadow="sm"
      className="overflow-hidden bg-white"
    >
      <div className="relative h-[390px] overflow-hidden rounded-2xl border border-black/5 bg-[#F6F7F4]">
        {shouldShowImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={template.name}
            className="absolute inset-0 h-full w-full object-contain p-3"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-black/35">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-white">
              <FileImage className="size-8" />
            </span>

            <p className="text-sm font-medium">
              Image unavailable
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2
            className="truncate text-base font-bold text-[#202420]"
            title={template.name}
          >
            {template.name}
          </h2>

          <p className="mt-1 text-xs text-black/45">
            Uploaded {formatUploadDate(template.createdAt)}
          </p>
        </div>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(template)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0] text-[#D92D20] transition hover:bg-[#FFDCDD] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Delete ${template.name}`}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </button>
      </div>
    </Card>
  );
}