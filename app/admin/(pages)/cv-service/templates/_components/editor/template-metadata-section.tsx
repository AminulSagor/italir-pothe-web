"use client";

import type { ResumeTemplateEditorMetadata } from "@/types/resume-studio/resume-template.types";

interface TemplateMetadataSectionProps {
  value: ResumeTemplateEditorMetadata;
  isNew: boolean;
  onChange: (value: ResumeTemplateEditorMetadata) => void;
}

export default function TemplateMetadataSection({
  value,
  isNew,
  onChange,
}: TemplateMetadataSectionProps) {
  const update = <K extends keyof ResumeTemplateEditorMetadata>(
    key: K,
    nextValue: ResumeTemplateEditorMetadata[K],
  ) => onChange({ ...value, [key]: nextValue });

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-[#202420]">Template Metadata</h2>
        <p className="mt-1 text-sm text-black/50">
          These values drive admin discovery and the Flutter template catalogue.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#29312B]">
            Template name
          </span>
          <input
            value={value.name}
            maxLength={120}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Modern Professional"
            className="h-11 w-full rounded-xl bg-[#F1F5EF] px-4 text-sm outline-none focus:ring-2 focus:ring-[#57B87A]/30"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#29312B]">
            Slug
          </span>
          <input
            value={value.slug}
            maxLength={140}
            disabled={!isNew}
            onChange={(event) => update("slug", event.target.value.toLowerCase())}
            placeholder="modern-professional"
            className="h-11 w-full rounded-xl bg-[#F1F5EF] px-4 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-55"
          />
          {!isNew && (
            <span className="mt-1 block text-xs text-black/40">
              Slug is immutable after creation.
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#29312B]">
            Category
          </span>
          <input
            value={value.category}
            maxLength={80}
            onChange={(event) => update("category", event.target.value)}
            placeholder="modern"
            className="h-11 w-full rounded-xl bg-[#F1F5EF] px-4 text-sm outline-none focus:ring-2 focus:ring-[#57B87A]/30"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#29312B]">
            Sort order
          </span>
          <input
            type="number"
            min={0}
            max={100000}
            value={value.sortOrder}
            onChange={(event) =>
              update("sortOrder", Math.max(0, Number(event.target.value) || 0))
            }
            className="h-11 w-full rounded-xl bg-[#F1F5EF] px-4 text-sm outline-none focus:ring-2 focus:ring-[#57B87A]/30"
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 flex items-center justify-between text-sm font-semibold text-[#29312B]">
            Description
            <span className="font-normal text-black/35">
              {value.description.length}/600
            </span>
          </span>
          <textarea
            value={value.description}
            maxLength={600}
            rows={3}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Describe the intended CV style and audience."
            className="w-full resize-y rounded-2xl bg-[#F1F5EF] px-4 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#57B87A]/30"
          />
        </label>
      </div>
    </section>
  );
}
