"use client";

import { useState } from "react";
import {
  Braces,
  ChevronDown,
  ChevronUp,
  Eraser,
  Info,
} from "lucide-react";

import { MAX_PREVIEW_SAMPLE_DATA_LENGTH } from "@/utils/resume-studio/resume-preview-sample-data.utils";

interface TemplateSampleDataSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TemplateSampleDataSection({
  value,
  onChange,
}: TemplateSampleDataSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#202420]">
            Preview Sample Data
          </h2>
          <p className="mt-1 max-w-[760px] text-sm leading-6 text-black/50">
            Optional JSON used only to render this template&apos;s admin and
            published preview. It is versioned with the template and never becomes
            a user&apos;s CV.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#D7E2D8] bg-white px-3 text-xs font-bold text-black/55 transition hover:bg-[#F6F8F5]"
            >
              <Eraser className="size-3.5" /> Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#D7E2D8] bg-white px-3 text-xs font-bold text-[#006B3F] transition hover:bg-[#F4F8F4]"
            aria-expanded={expanded}
          >
            {expanded ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[#F7FAF6] px-4 py-3 text-xs leading-5 text-black/55">
        <Info className="mt-0.5 size-4 shrink-0 text-[#006B3F]" />
        <p>
          Leave this empty to use the backend default preview fixture. Add custom
          data when the template needs restaurant, marketing, healthcare, or other
          role-specific preview content.
        </p>
      </div>

      {expanded && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#DDE5DD] bg-[#101612]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white/90">
              <Braces className="size-4 text-[#70D596]" /> JSON
            </div>
            <span className="text-xs text-white/40">
              {value.length.toLocaleString()}/
              {MAX_PREVIEW_SAMPLE_DATA_LENGTH.toLocaleString()}
            </span>
          </div>
          <textarea
            value={value}
            maxLength={MAX_PREVIEW_SAMPLE_DATA_LENGTH}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Preview sample data JSON editor"
            placeholder={'{\n  "personal": {\n    "fullName": "..."\n  },\n  "experience": []\n}'}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-[360px] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 text-[#E8F4EA] outline-none placeholder:text-white/20"
          />
        </div>
      )}
    </section>
  );
}
