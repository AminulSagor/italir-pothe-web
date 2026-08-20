"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from "lucide-react";

import type {
  ResumeFieldDefinition,
  ResumeSectionDefinition,
  ResumeTemplateFieldSchema,
} from "@/types/resume-studio/resume-template.types";
import { normalizeSectionOrder } from "@/utils/resume-studio/resume-template-editor.utils";

interface TemplateFieldSchemaSectionProps {
  value: ResumeTemplateFieldSchema;
  inferenceStatus?: "idle" | "detecting" | "synced" | "error";
  detectedFieldCount?: number;
  ignoredPlaceholders?: string[];
  inferenceError?: string;
  onAutoDetect?: () => void;
  onChange: (value: ResumeTemplateFieldSchema) => void;
}

const checkboxClassName = "size-4 accent-[#006B3F]";

export default function TemplateFieldSchemaSection({
  value,
  inferenceStatus = "idle",
  detectedFieldCount,
  ignoredPlaceholders = [],
  inferenceError = "",
  onAutoDetect,
  onChange,
}: TemplateFieldSchemaSectionProps) {
  const [expandedSection, setExpandedSection] = useState<string>("personal");

  const updateSection = (
    index: number,
    updater: (section: ResumeSectionDefinition) => ResumeSectionDefinition,
  ) => {
    const sections = value.sections.map((section, sectionIndex) =>
      sectionIndex === index ? updater(section) : section,
    );

    onChange({ ...value, sections });
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= value.sections.length) {
      return;
    }

    const sections = [...value.sections];
    const [section] = sections.splice(index, 1);
    sections.splice(targetIndex, 0, section);

    onChange({
      ...value,
      sections: normalizeSectionOrder(sections),
    });
  };

  const updateField = (
    sectionIndex: number,
    fieldIndex: number,
    updater: (field: ResumeFieldDefinition) => ResumeFieldDefinition,
  ) => {
    updateSection(sectionIndex, (section) => ({
      ...section,
      fields: (section.fields ?? []).map((field, index) =>
        index === fieldIndex ? updater(field) : field,
      ),
    }));
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#202420]">
            Flutter Field Schema
          </h2>
          <p className="mt-1 max-w-[760px] text-sm text-black/50">
            Flutter builds its input form from this schema. Keep the stable backend
            keys; enable only the sections and fields this template actually uses.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#EAF7EE] px-3 py-1 text-xs font-bold text-[#167347]">
            Schema v{value.version}
          </span>

          {onAutoDetect && (
            <button
              type="button"
              onClick={onAutoDetect}
              disabled={inferenceStatus === "detecting"}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#D7E2D8] bg-white px-3 text-xs font-bold text-[#006B3F] transition hover:bg-[#F4F8F4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {inferenceStatus === "detecting" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              Detect from HTML
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#F7FAF6] px-4 py-3 text-xs leading-5 text-black/55">
        <p>
          Field detection runs automatically after the HTML changes and before
          Sync Preview, Save, or Publish. Manual labels, limits, order, zones,
          required, and hidden settings stay editable and are preserved across scans.
        </p>
        {inferenceStatus === "synced" && detectedFieldCount !== undefined && (
          <p className="mt-1 font-semibold text-[#167347]">
            Detected {detectedFieldCount} field{detectedFieldCount === 1 ? "" : "s"}
            {ignoredPlaceholders.length
              ? ` · ${ignoredPlaceholders.length} unsupported placeholder${
                  ignoredPlaceholders.length === 1 ? "" : "s"
                } ignored`
              : ""}
          </p>
        )}
        {inferenceStatus === "error" && inferenceError && (
          <p className="mt-1 font-semibold text-[#B5473B]">{inferenceError}</p>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {value.sections.map((section, sectionIndex) => {
          const expanded = expandedSection === section.key;

          return (
            <div
              key={section.key}
              className="overflow-hidden rounded-2xl border border-[#E4EAE4]"
            >
              <div className="flex flex-wrap items-center gap-3 bg-[#FAFCF9] px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection(expanded ? "" : section.key)
                  }
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  {expanded ? (
                    <ChevronUp className="size-4 shrink-0 text-[#006B3F]" />
                  ) : (
                    <ChevronDown className="size-4 shrink-0 text-[#006B3F]" />
                  )}
                  <span className="truncate font-bold text-[#263029]">
                    {section.label}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-black/40">
                    {section.key}
                  </span>
                </button>

                <div className="flex items-center gap-3 text-xs text-black/55">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      className={checkboxClassName}
                      checked={section.enabled}
                      onChange={(event) =>
                        updateSection(sectionIndex, (current) => ({
                          ...current,
                          enabled: event.target.checked,
                          required: event.target.checked
                            ? current.required
                            : false,
                        }))
                      }
                    />
                    Enabled
                  </label>

                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      className={checkboxClassName}
                      checked={Boolean(section.required)}
                      disabled={!section.enabled || section.hidden}
                      onChange={(event) =>
                        updateSection(sectionIndex, (current) => ({
                          ...current,
                          required: event.target.checked,
                        }))
                      }
                    />
                    Required
                  </label>

                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      className={checkboxClassName}
                      checked={Boolean(section.hidden)}
                      disabled={!section.enabled}
                      onChange={(event) =>
                        updateSection(sectionIndex, (current) => ({
                          ...current,
                          hidden: event.target.checked,
                          required: event.target.checked
                            ? false
                            : current.required,
                        }))
                      }
                    />
                    Hidden
                  </label>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={sectionIndex === 0}
                    onClick={() => moveSection(sectionIndex, -1)}
                    className="flex size-8 items-center justify-center rounded-full bg-white text-black/50 disabled:opacity-30"
                    aria-label={`Move ${section.label} up`}
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={sectionIndex === value.sections.length - 1}
                    onClick={() => moveSection(sectionIndex, 1)}
                    className="flex size-8 items-center justify-center rounded-full bg-white text-black/50 disabled:opacity-30"
                    aria-label={`Move ${section.label} down`}
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
              </div>

              {expanded && (
                <div className="space-y-5 p-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <label>
                      <span className="mb-1 block text-xs font-semibold text-black/50">
                        Section label
                      </span>
                      <input
                        value={section.label}
                        onChange={(event) =>
                          updateSection(sectionIndex, (current) => ({
                            ...current,
                            label: event.target.value,
                          }))
                        }
                        className="h-10 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-xs font-semibold text-black/50">
                        Zone
                      </span>
                      <select
                        value={section.zone ?? "main"}
                        onChange={(event) =>
                          updateSection(sectionIndex, (current) => ({
                            ...current,
                            zone: event.target.value as ResumeSectionDefinition["zone"],
                          }))
                        }
                        className="h-10 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none"
                      >
                        <option value="header">Header</option>
                        <option value="main">Main</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="footer">Footer</option>
                      </select>
                    </label>

                    <label>
                      <span className="mb-1 block text-xs font-semibold text-black/50">
                        Order
                      </span>
                      <input
                        type="number"
                        value={section.order}
                        onChange={(event) =>
                          updateSection(sectionIndex, (current) => ({
                            ...current,
                            order: Number(event.target.value) || 0,
                          }))
                        }
                        className="h-10 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none"
                      />
                    </label>

                    {section.maxItems !== undefined && (
                      <label>
                        <span className="mb-1 block text-xs font-semibold text-black/50">
                          Max items
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={section.maxItems}
                          onChange={(event) =>
                            updateSection(sectionIndex, (current) => ({
                              ...current,
                              maxItems: Math.max(
                                1,
                                Number(event.target.value) || 1,
                              ),
                            }))
                          }
                          className="h-10 w-full rounded-xl bg-[#F1F5EF] px-3 text-sm outline-none"
                        />
                      </label>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-[#E6EBE6]">
                    <table className="w-full min-w-[980px] text-left text-sm">
                      <thead className="bg-[#F6F8F5] text-xs uppercase text-black/45">
                        <tr>
                          <th className="px-3 py-3">Field</th>
                          <th className="px-3 py-3">Type</th>
                          <th className="px-3 py-3 text-center">Show</th>
                          <th className="px-3 py-3 text-center">Required</th>
                          <th className="px-3 py-3 text-center">Hidden</th>
                          <th className="px-3 py-3">Max length</th>
                          <th className="px-3 py-3">Max items / options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(section.fields ?? []).map((field, fieldIndex) => (
                          <tr
                            key={field.key}
                            className="border-t border-[#EEF1EE] align-top"
                          >
                            <td className="px-3 py-3">
                              <input
                                value={field.label}
                                onChange={(event) =>
                                  updateField(
                                    sectionIndex,
                                    fieldIndex,
                                    (current) => ({
                                      ...current,
                                      label: event.target.value,
                                    }),
                                  )
                                }
                                className="h-9 w-full rounded-lg bg-[#F7F9F6] px-2 text-sm font-semibold outline-none"
                              />
                              <div className="mt-1 flex items-center gap-1 text-[11px] text-black/40">
                                <code>{field.key}</code>
                                {field.aiAssist && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F1E9FF] px-2 py-0.5 text-[#6D3FB3]">
                                    <Sparkles className="size-3" /> {field.aiAssist.replace("-suggestions", "").replaceAll("-", " ")}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-xs text-black/55">
                              {field.type}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <input
                                type="checkbox"
                                className={checkboxClassName}
                                checked={field.enabled}
                                onChange={(event) =>
                                  updateField(
                                    sectionIndex,
                                    fieldIndex,
                                    (current) => ({
                                      ...current,
                                      enabled: event.target.checked,
                                      required: event.target.checked
                                        ? current.required
                                        : false,
                                    }),
                                  )
                                }
                              />
                            </td>
                            <td className="px-3 py-3 text-center">
                              <input
                                type="checkbox"
                                className={checkboxClassName}
                                checked={Boolean(field.required)}
                                disabled={!field.enabled || field.hidden}
                                onChange={(event) =>
                                  updateField(
                                    sectionIndex,
                                    fieldIndex,
                                    (current) => ({
                                      ...current,
                                      required: event.target.checked,
                                    }),
                                  )
                                }
                              />
                            </td>
                            <td className="px-3 py-3 text-center">
                              <input
                                type="checkbox"
                                className={checkboxClassName}
                                checked={Boolean(field.hidden)}
                                disabled={!field.enabled}
                                onChange={(event) =>
                                  updateField(
                                    sectionIndex,
                                    fieldIndex,
                                    (current) => ({
                                      ...current,
                                      hidden: event.target.checked,
                                      required: event.target.checked
                                        ? false
                                        : current.required,
                                    }),
                                  )
                                }
                              />
                            </td>
                            <td className="px-3 py-3">
                              {field.maxLength !== undefined ? (
                                <input
                                  type="number"
                                  min={1}
                                  value={field.maxLength}
                                  onChange={(event) =>
                                    updateField(
                                      sectionIndex,
                                      fieldIndex,
                                      (current) => ({
                                        ...current,
                                        maxLength: Math.max(
                                          1,
                                          Number(event.target.value) || 1,
                                        ),
                                      }),
                                    )
                                  }
                                  className="h-9 w-24 rounded-lg bg-[#F7F9F6] px-2 text-xs outline-none"
                                />
                              ) : (
                                <span className="text-xs text-black/30">—</span>
                              )}
                            </td>
                            <td className="px-3 py-3">
                              {field.type === "select" ? (
                                <input
                                  value={(field.options ?? []).join(", ")}
                                  onChange={(event) =>
                                    updateField(
                                      sectionIndex,
                                      fieldIndex,
                                      (current) => ({
                                        ...current,
                                        options: event.target.value
                                          .split(",")
                                          .map((item) => item.trim())
                                          .filter(Boolean)
                                          .slice(0, 50),
                                      }),
                                    )
                                  }
                                  placeholder="Option 1, Option 2"
                                  className="h-9 min-w-52 rounded-lg bg-[#F7F9F6] px-2 text-xs outline-none"
                                />
                              ) : field.maxItems !== undefined ? (
                                <input
                                  type="number"
                                  min={1}
                                  value={field.maxItems}
                                  onChange={(event) =>
                                    updateField(
                                      sectionIndex,
                                      fieldIndex,
                                      (current) => ({
                                        ...current,
                                        maxItems: Math.max(
                                          1,
                                          Number(event.target.value) || 1,
                                        ),
                                      }),
                                    )
                                  }
                                  className="h-9 w-24 rounded-lg bg-[#F7F9F6] px-2 text-xs outline-none"
                                />
                              ) : (
                                <span className="text-xs text-black/30">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
