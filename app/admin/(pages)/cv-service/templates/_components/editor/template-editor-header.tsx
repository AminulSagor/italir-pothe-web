"use client";

import {
  Archive,
  Check,
  Cloud,
  CloudOff,
  Eye,
  Loader2,
  Save,
  Send,
} from "lucide-react";

import BackButton from "@/components/UI/buttons/back-button";
import Button from "@/components/UI/buttons/button";
import type {
  ResumeTemplateAutosaveStatus,
  ResumeTemplateStatus,
} from "@/types/resume-studio/resume-template.types";

interface TemplateEditorHeaderProps {
  isNew: boolean;
  templateStatus?: ResumeTemplateStatus;
  autosaveStatus: ResumeTemplateAutosaveStatus;
  isSaving: boolean;
  isPreviewing: boolean;
  isPublishing: boolean;
  isArchiving: boolean;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onArchive?: () => void;
}

const AutosaveIndicator = ({
  status,
}: {
  status: ResumeTemplateAutosaveStatus;
}) => {
  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-black/45">
        <Loader2 className="size-3.5 animate-spin" /> Auto-saving…
      </span>
    );
  }

  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#167347]">
        <Cloud className="size-3.5" /> Draft saved
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#B42318]">
        <CloudOff className="size-3.5" /> Auto-save failed
      </span>
    );
  }

  return null;
};

export default function TemplateEditorHeader({
  isNew,
  templateStatus,
  autosaveStatus,
  isSaving,
  isPreviewing,
  isPublishing,
  isArchiving,
  onSave,
  onPreview,
  onPublish,
  onArchive,
}: TemplateEditorHeaderProps) {
  const busy = isSaving || isPreviewing || isPublishing || isArchiving;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <BackButton />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#006B3F]">
                {isNew ? "Create CV Template" : "Edit CV Template"}
              </h1>
              {templateStatus && (
                <span className="rounded-full bg-[#EEF3EB] px-3 py-1 text-[11px] font-bold uppercase text-[#4D5C51]">
                  {templateStatus}
                </span>
              )}
            </div>
            <div className="mt-1 flex min-h-5 items-center gap-2">
              <p className="text-sm text-black/50">
                Backend Chromium is the source of truth for preview and final PDF.
              </p>
              {!isNew && <AutosaveIndicator status={autosaveStatus} />}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isNew && templateStatus !== "archived" && onArchive && (
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              className="gap-2 text-[#9B4C3F]"
              onClick={onArchive}
            >
              <Archive className="size-4" /> Archive
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            className="gap-2"
            onClick={onSave}
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : autosaveStatus === "saved" && !isNew ? (
              <Check className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            Save Draft
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            className="gap-2"
            onClick={onPreview}
          >
            {isPreviewing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Eye className="size-4" />
            )}
            Sync Preview
          </Button>

          <Button
            size="sm"
            disabled={busy}
            className="gap-2"
            onClick={onPublish}
          >
            {isPublishing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
