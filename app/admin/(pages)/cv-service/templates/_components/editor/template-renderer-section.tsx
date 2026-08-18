"use client";

import type { ResumeRendererConfig } from "@/types/resume-studio/resume-template.types";

interface TemplateRendererSectionProps {
  value: ResumeRendererConfig;
  onChange: (value: ResumeRendererConfig) => void;
}

type TemplateLanguage = "en" | "it" | "bn";

const templateLanguages: Array<{
  value: TemplateLanguage;
  label: string;
}> = [
  { value: "en", label: "English" },
  { value: "it", label: "Italian" },
  { value: "bn", label: "Bengali" },
];

const languageFromLocale = (locale?: string): TemplateLanguage => {
  const normalized = locale?.trim().toLowerCase() ?? "";
  if (
    normalized === "it" ||
    normalized.startsWith("it-") ||
    normalized.startsWith("it_") ||
    normalized.includes("ital")
  ) {
    return "it";
  }
  if (
    normalized === "bn" ||
    normalized.startsWith("bn-") ||
    normalized.startsWith("bn_") ||
    normalized.includes("bengal") ||
    normalized.includes("bangla")
  ) {
    return "bn";
  }
  return "en";
};

export default function TemplateRendererSection({
  value,
  onChange,
}: TemplateRendererSectionProps) {
  const update = <K extends keyof ResumeRendererConfig>(
    key: K,
    nextValue: ResumeRendererConfig[K],
  ) => onChange({ ...value, [key]: nextValue });

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#202420]">PDF Renderer Rules</h2>
      <p className="mt-1 text-sm text-black/50">
        These settings are validated by NestJS before preview or publish.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/50">
            Layout
          </span>
          <select
            value={value.layout}
            onChange={(event) => {
              const layout = event.target.value as ResumeRendererConfig["layout"];
              onChange({
                ...value,
                layout,
                sidebarContinuation:
                  layout === "two-column"
                    ? "template-managed"
                    : "not-applicable",
              });
            }}
            className="h-11 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none"
          >
            <option value="single-column">Single column</option>
            <option value="two-column">Two column</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/50">
            Sidebar continuation
          </span>
          <select
            value={value.sidebarContinuation}
            disabled={value.layout === "two-column"}
            onChange={(event) =>
              update(
                "sidebarContinuation",
                event.target.value as ResumeRendererConfig["sidebarContinuation"],
              )
            }
            className="h-11 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none disabled:opacity-60"
          >
            <option value="not-applicable">Not applicable</option>
            <option value="template-managed">Template managed</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/50">
            Recommended pages
          </span>
          <input
            type="number"
            min={1}
            max={value.hardMaxPages}
            value={value.recommendedMaxPages}
            onChange={(event) =>
              update(
                "recommendedMaxPages",
                Math.max(1, Number(event.target.value) || 1),
              )
            }
            className="h-11 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none"
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/50">
            Hard max pages
          </span>
          <input
            type="number"
            min={1}
            max={6}
            value={value.hardMaxPages}
            onChange={(event) => {
              const hardMaxPages = Math.min(
                6,
                Math.max(1, Number(event.target.value) || 1),
              );
              onChange({
                ...value,
                hardMaxPages,
                recommendedMaxPages: Math.min(
                  value.recommendedMaxPages,
                  hardMaxPages,
                ),
              });
            }}
            className="h-11 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none"
          />
        </label>
      </div>

      <label className="mt-4 block max-w-xs">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/50">
          Template language
        </span>
        <select
          value={languageFromLocale(value.locale)}
          onChange={(event) =>
            update("locale", event.target.value as TemplateLanguage)
          }
          className="h-11 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none"
        >
          {templateLanguages.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
        <span className="mt-1.5 block text-xs text-black/40">
          Used for AI-generated CV suggestions.
        </span>
      </label>
    </section>
  );
}
