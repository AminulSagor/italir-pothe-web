"use client";

import { useState } from "react";
import {
  Braces,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";

interface TemplateCodeSectionProps {
  html: string;
  css: string;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
}

const MAX_CODE_LENGTH = 220_000;

const CodeEditor = ({
  label,
  language,
  value,
  onChange,
  defaultExpanded = true,
}: {
  label: string;
  language: string;
  value: string;
  onChange: (value: string) => void;
  defaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DDE5DD] bg-[#101612]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white/90">
          <Braces className="size-4 text-[#70D596]" /> {label}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">
            {value.length.toLocaleString()}/{MAX_CODE_LENGTH.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-expanded={expanded}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${label} editor`}
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

      {expanded && (
        <textarea
          value={value}
          maxLength={MAX_CODE_LENGTH}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label={`${label} ${language} editor`}
          placeholder={`Paste or write ${label} here...`}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[520px] w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-6 text-[#E8F4EA] outline-none placeholder:text-white/20"
        />
      )}
    </div>
  );
};

export default function TemplateCodeSection({
  html,
  css,
  onHtmlChange,
  onCssChange,
}: TemplateCodeSectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#202420]">Template Source</h2>
          <p className="mt-1 text-sm text-black/50">
            HTML and CSS are sent directly to the NestJS preview renderer. Each
            editor can be collapsed independently.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF7EE] px-3 py-1.5 text-xs font-semibold text-[#167347]">
          <ShieldCheck className="size-3.5" /> HTML/CSS only · JavaScript blocked
        </span>
      </div>

      <div className="mt-5 grid gap-5 2xl:grid-cols-2">
        <CodeEditor
          label="HTML"
          language="HTML"
          value={html}
          onChange={onHtmlChange}
        />
        <CodeEditor
          label="CSS"
          language="CSS"
          value={css}
          onChange={onCssChange}
        />
      </div>
    </section>
  );
}
