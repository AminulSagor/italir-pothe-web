"use client";

/* eslint-disable @next/next/no-img-element */

import {
  Archive,
  Braces,
  Crown,
  Eye,
  FileText,
  Pencil,
} from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type { ResumeTemplate } from "@/types/resume-studio/resume-template.types";

interface CVTemplateCardProps {
  template: ResumeTemplate;
  onEdit: (template: ResumeTemplate) => void;
  onPreview: (template: ResumeTemplate) => void;
  onArchive: (template: ResumeTemplate) => void;
}

const statusClasses: Record<ResumeTemplate["status"], string> = {
  draft: "bg-[#FFF7D6] text-[#8A6500]",
  published: "bg-[#DDF8D5] text-[#007A3D]",
  archived: "bg-[#EEF0EE] text-[#59615B]",
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function CVTemplateCard({
  template,
  onEdit,
  onPreview,
  onArchive,
}: CVTemplateCardProps) {
  return (
    <Card
      padding="md"
      rounded="3xl"
      shadow="sm"
      className="flex h-full flex-col overflow-hidden bg-white"
    >
      <div className="relative flex min-h-[185px] items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-[#F6F8F5]">
        {template.previewImageUrl ? (
          <>
            {/* Signed backend preview image; plain img avoids Next remote-host coupling. */}
            <img
              src={template.previewImageUrl}
              alt={`${template.name} CV preview`}
              className="h-[185px] w-full object-contain object-top bg-white"
            />
            {template.previewPdfUrl && (
              <button
                type="button"
                onClick={() => onPreview(template)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/10 hover:opacity-100"
                aria-label={`Preview ${template.name}`}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#006B3F] shadow-lg">
                  <Eye className="size-4" /> View PDF
                </span>
              </button>
            )}
          </>
        ) : (
          <div className="text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white text-[#006B3F] shadow-sm">
              {template.previewImageStorageKey ? (
                <FileText className="size-7" />
              ) : (
                <Braces className="size-7" />
              )}
            </span>
            <p className="mt-3 text-xs font-semibold text-black/45">
              {template.previewImageStorageKey
                ? "Published preview available"
                : "Backend HTML/CSS template"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusClasses[template.status]}`}
              >
                {template.status}
              </span>

              {template.isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF0C8] px-2.5 py-1 text-[11px] font-bold text-[#8A6200]">
                  <Crown className="size-3" /> Premium
                </span>
              )}
            </div>

            <h2 className="mt-3 truncate text-lg font-bold text-[#202420]">
              {template.name}
            </h2>
            <p className="mt-1 truncate text-xs text-black/45">
              {template.slug}
            </p>
          </div>

          <span className="rounded-full bg-[#EEF3EB] px-3 py-1 text-xs font-semibold text-[#47604F]">
            {template.category}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-black/55">
          {template.description || "No description provided."}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#F8FAF7] p-3 text-xs text-black/50">
          <span>Sort: {template.sortOrder}</span>
          <span className="text-right">
            Version: {template.publishedVersionNumber ?? "—"}
          </span>
          <span className="col-span-2">Updated {formatDate(template.updatedAt)}</span>
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onEdit(template)}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>

          {template.previewPdfUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-[#006B3F]"
              onClick={() => onPreview(template)}
            >
              <Eye className="size-3.5" />
              Preview
            </Button>
          )}

          {template.status !== "archived" && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-[#8A5145]"
              onClick={() => onArchive(template)}
            >
              <Archive className="size-3.5" />
              Archive
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
