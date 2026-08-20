"use client";

import { useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import type { ResumeTemplateContract } from "@/types/resume-studio/resume-template.types";

interface TemplateContractPanelProps {
  contract: ResumeTemplateContract;
}

const CodeValue = ({ children }: { children: string }) => (
  <code className="block overflow-x-auto rounded-xl bg-[#101612] px-3 py-2 text-xs leading-5 text-[#DDF2E2]">
    {children}
  </code>
);

const copyText = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

export default function TemplateContractPanel({
  contract,
}: TemplateContractPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAiInstructions = async () => {
    try {
      await copyText(contract.aiCodeGenerationInstructions);
      setCopied(true);
      toast.success("AI template instructions copied.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy AI instructions.");
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#167347]">
            <Info className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#202420]">
              Backend Template Contract
            </h2>
            <p className="mt-1 max-w-[900px] text-sm leading-6 text-black/50">
              Use these exact placeholders and markup conventions so the backend can
              infer Flutter fields, hide empty content, and handle page-break
              anomalies consistently.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAiInstructions}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#006B3F] px-4 text-sm font-bold text-white transition hover:bg-[#005A35]"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy AI Instructions"}
        </button>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#29312B]">
            <Code2 className="size-4 text-[#006B3F]" /> Placeholder syntax
          </h3>
          <div className="space-y-2">
            <CodeValue>{contract.placeholderSyntax.value}</CodeValue>
            <CodeValue>{contract.placeholderSyntax.condition}</CodeValue>
            <CodeValue>{contract.placeholderSyntax.list}</CodeValue>
            <CodeValue>{contract.placeholderSyntax.parent}</CodeValue>
            <CodeValue>{contract.placeholderSyntax.index}</CodeValue>
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#29312B]">
            <ShieldCheck className="size-4 text-[#006B3F]" /> Pagination markup
          </h3>
          <div className="space-y-2">
            <CodeValue>{contract.markupConventions.hideEmptySection}</CodeValue>
            <CodeValue>{contract.markupConventions.avoidEntrySplit}</CodeValue>
            <CodeValue>{contract.markupConventions.avoidOrphanHeading}</CodeValue>
            <CodeValue>{contract.markupConventions.cropPhoto}</CodeValue>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl bg-[#F7F9F6] p-4">
          <p className="text-xs font-bold uppercase text-black/40">Security</p>
          <p className="mt-2 text-xs leading-5 text-black/60">{contract.security}</p>
        </div>
        <div className="rounded-2xl bg-[#F7F9F6] p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-black/40">
            <Sparkles className="size-3.5" /> CV AI
          </p>
          <p className="mt-2 break-all text-xs leading-5 text-black/60">
            {contract.aiAssist.fieldSuggestions}
          </p>
        </div>
        <div className="rounded-2xl bg-[#F7F9F6] p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-black/40">
            <Code2 className="size-3.5" /> Field detection
          </p>
          <p className="mt-2 text-xs leading-5 text-black/60">
            {contract.fieldInference.behavior}
          </p>
        </div>
        <div className="rounded-2xl bg-[#F7F9F6] p-4">
          <p className="text-xs font-bold uppercase text-black/40">Sample JSON</p>
          <p className="mt-2 text-xs leading-5 text-black/60">
            {contract.sampleData.behavior}
          </p>
        </div>
        <div className="rounded-2xl bg-[#F7F9F6] p-4">
          <p className="text-xs font-bold uppercase text-black/40">Rendering</p>
          <p className="mt-2 text-xs leading-5 text-black/60">
            {contract.rendering}
          </p>
        </div>
      </div>
    </section>
  );
}
