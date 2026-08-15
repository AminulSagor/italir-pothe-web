"use client";

import { Eye, FileText, RefreshCw, Zap } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface TemplatePreviewSectionProps {
  previewUrl: string | null;
  persistedPreviewUrl?: string | null;
  onPreview: () => void;
  isPreviewing: boolean;
  autoPreviewEnabled: boolean;
  onAutoPreviewChange: (enabled: boolean) => void;
}

export default function TemplatePreviewSection({
  previewUrl,
  persistedPreviewUrl,
  onPreview,
  isPreviewing,
  autoPreviewEnabled,
  onAutoPreviewChange,
}: TemplatePreviewSectionProps) {
  const visibleUrl = previewUrl || persistedPreviewUrl || null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#202420]">Backend PDF Preview</h2>
          <p className="mt-1 text-sm text-black/50">
            The same NestJS Chromium renderer is used for admin preview,
            published template preview, and the final Flutter CV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-[#D7E2D8] bg-[#F8FBF7] px-3 text-xs font-bold text-[#29543B]">
            <input
              type="checkbox"
              checked={autoPreviewEnabled}
              onChange={(event) => onAutoPreviewChange(event.target.checked)}
              className="size-4 accent-[#006B3F]"
            />
            <Zap className="size-3.5" />
            Auto Preview
          </label>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isPreviewing}
            onClick={onPreview}
          >
            <RefreshCw className={`size-4 ${isPreviewing ? "animate-spin" : ""}`} />
            Sync Preview
          </Button>
        </div>
      </div>

      {autoPreviewEnabled && (
        <p className="mt-3 text-xs text-black/40">
          Auto Preview renders after you stop editing for about 1.2 seconds.
          Sync Preview remains available as a manual fallback.
        </p>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#DDE5DD] bg-[#EFF3EF]">
        {visibleUrl ? (
          <iframe
            key={visibleUrl}
            src={visibleUrl}
            title="CV template PDF preview"
            className="h-[820px] w-full bg-white"
          />
        ) : (
          <div className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-[#006B3F] shadow-sm">
              <FileText className="size-7" />
            </span>
            <h3 className="mt-4 font-bold text-[#29312B]">No PDF preview yet</h3>
            <p className="mt-2 max-w-[480px] text-sm leading-6 text-black/45">
              Add HTML/CSS, optionally add sample JSON, then use Sync Preview or
              turn on Auto Preview. Nothing is published by previewing.
            </p>
            <Button
              className="mt-5 gap-2"
              size="sm"
              onClick={onPreview}
              disabled={isPreviewing}
            >
              <Eye className="size-4" /> Generate Preview
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
