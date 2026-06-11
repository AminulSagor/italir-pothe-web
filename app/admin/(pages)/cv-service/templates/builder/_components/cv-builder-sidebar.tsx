"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Circle,
  Globe,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Square,
  TextCursorInput,
  Type,
} from "lucide-react";
import type {
  CvBuilderLayoutElement,
  CvTemplatePageSize,
  CvTemplateSectionSchema,
} from "@/types/cv-template/cv_template_type";
import { fontOptions, paletteItems, pageSizes } from "./cv-builder-defaults";
import CvSectionDesignerDialog from "./cv-section-designer-dialog";

interface CvBuilderSidebarProps {
  title: string;
  description: string;
  pageSize: CvTemplatePageSize;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  formSections: CvTemplateSectionSchema[];
  selectedElement: CvBuilderLayoutElement | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPageSizeChange: (value: CvTemplatePageSize) => void;
  onFontFamilyChange: (value: string) => void;
  onPrimaryColorChange: (value: string) => void;
  onAccentColorChange: (value: string) => void;
  onCreateFormSection: (section: CvTemplateSectionSchema) => void;
  onUpdateFormSection: (
    sectionKey: string,
    section: CvTemplateSectionSchema,
  ) => void;
  onDeleteFormSection: (sectionKey: string) => void;
  onPlaceFormSection: (section: CvTemplateSectionSchema) => void;
  onAddElement: (itemIndex: number) => void;
  onUpdateElement: (element: CvBuilderLayoutElement) => void;
  onDeleteElement: (elementId: string) => void;
}

const inputClass =
  "h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#202420] outline-none focus:border-[#006B3F]";
const labelClass =
  "space-y-2 text-xs font-bold uppercase tracking-wide text-black/55";

const iconOptions = [
  "github",
  "linkedin",
  "weblink",
  "phone",
  "location",
  "email",
] as const;
type IconName = (typeof iconOptions)[number];

const stripHtml = (value: string) =>
  value
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

const GithubIcon = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3" />
    <path d="M15 22v-3.9a3.4 3.4 0 0 0-.9-2.6c3 0 6.1-1.5 6.1-6.6a5.1 5.1 0 0 0-1.4-3.6 4.7 4.7 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.8 12.8 0 0 0-6.7 0C5.7.4 4.6.7 4.6.7a4.7 4.7 0 0 0-.1 3.6A5.1 5.1 0 0 0 3 7.9c0 5.1 3.1 6.6 6.1 6.6a3.4 3.4 0 0 0-.9 2.6V22" />
  </svg>
);

const LinkedinIcon = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function CvBuilderSidebar({
  title,
  description,
  pageSize,
  fontFamily,
  primaryColor,
  accentColor,
  formSections,
  selectedElement,
  onTitleChange,
  onDescriptionChange,
  onPageSizeChange,
  onFontFamilyChange,
  onPrimaryColorChange,
  onAccentColorChange,
  onCreateFormSection,
  onUpdateFormSection,
  onDeleteFormSection,
  onPlaceFormSection,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
}: CvBuilderSidebarProps) {
  const [editingSection, setEditingSection] =
    useState<CvTemplateSectionSchema | null>(null);
  const [sectionDesignerOpen, setSectionDesignerOpen] = useState(false);

  const openNewSectionDesigner = () => {
    setEditingSection(null);
    setSectionDesignerOpen(true);
  };

  const openEditSectionDesigner = (section: CvTemplateSectionSchema) => {
    setEditingSection(section);
    setSectionDesignerOpen(true);
  };

  const handleSaveSection = (section: CvTemplateSectionSchema) => {
    if (editingSection) {
      onUpdateFormSection(editingSection.key, section);
    } else {
      onCreateFormSection(section);
    }
    setSectionDesignerOpen(false);
    setEditingSection(null);
  };

  return (
    <aside className="space-y-4 overflow-y-auto rounded-[30px] bg-white p-5 shadow-sm xl:max-h-[calc(100vh-150px)]">
      <div>
        <h2 className="text-lg font-black text-[#202420]">Template Setup</h2>
        <p className="mt-1 text-xs leading-5 text-black/55">
          Draw the main CV page here. Create reusable user form sections in the
          separate section designer, then place those sections anywhere on the
          CV canvas.
        </p>
      </div>

      <div className="space-y-3">
        <label className={labelClass}>
          Template name
          <input
            className={inputClass}
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Description
          <textarea
            className="min-h-20 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm normal-case text-[#202420] outline-none focus:border-[#006B3F]"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass}>
          Page
          <select
            className={inputClass}
            value={pageSize}
            onChange={(event) =>
              onPageSizeChange(event.target.value as CvTemplatePageSize)
            }
          >
            {Object.entries(pageSizes).map(([value, page]) => (
              <option key={value} value={value}>
                {page.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Font
          <select
            className={inputClass}
            value={fontFamily}
            onChange={(event) => onFontFamilyChange(event.target.value)}
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Primary
          <input
            className={inputClass}
            type="color"
            value={primaryColor}
            onChange={(event) => onPrimaryColorChange(event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Accent
          <input
            className={inputClass}
            type="color"
            value={accentColor}
            onChange={(event) => onAccentColorChange(event.target.value)}
          />
        </label>
      </div>

      <BuilderPanel title="Components">
        <div className="grid grid-cols-2 gap-2">
          {paletteItems.map((item, index) => (
            <button
              key={`${item.type}-${item.label}`}
              type="button"
              onClick={() => onAddElement(index)}
              className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[#F7F8F5] p-3 text-left text-xs font-bold text-[#202420] transition hover:border-[#006B3F] hover:bg-[#E6F6F0]"
            >
              <PaletteIcon type={item.type} />
              {item.label}
            </button>
          ))}
        </div>
      </BuilderPanel>

      <BuilderPanel title="User Form Sections">
        <div className="space-y-3">
          {formSections.length === 0 ? (
            <div className="rounded-2xl bg-white p-3 text-xs font-bold text-black/45">
              No section designed yet.
            </div>
          ) : (
            formSections.map((section) => (
              <div
                key={section.key}
                className="rounded-2xl border border-black/10 bg-white p-3"
              >
                <button
                  type="button"
                  onClick={() => openEditSectionDesigner(section)}
                  className="w-full text-left"
                >
                  <span className="block text-sm font-black text-[#202420]">
                    {section.title}
                  </span>
                  <span className="mt-1 block text-xs text-black/50">
                    {section.fields.length} fields · click to edit designer
                  </span>
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onPlaceFormSection(section)}
                    className="rounded-xl bg-[#E6F6F0] px-3 py-2 text-xs font-black text-[#006B3F]"
                  >
                    Place on CV
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteFormSection(section.key)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          <button
            type="button"
            onClick={openNewSectionDesigner}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E6F6F0] px-4 py-3 text-sm font-black text-[#006B3F]"
          >
            <Plus className="size-4" /> Design New Section
          </button>
        </div>
      </BuilderPanel>

      <BuilderPanel title="Selected Element">
        {selectedElement ? (
          <ElementInspector
            element={selectedElement}
            formSections={formSections}
            onUpdate={onUpdateElement}
            onDelete={onDeleteElement}
          />
        ) : (
          <p className="text-sm text-black/50">
            Select an item on the canvas to edit it. Use arrow keys to move
            selected items by 1px, or Shift + arrow for 10px.
          </p>
        )}
      </BuilderPanel>

      <BuilderPanel title="Dynamic content rule">
        <p className="text-xs leading-5 text-black/55">
          Sections are saved as JSON. Flutter users will only see form fields
          from those sections. The CV renderer can then place the user content
          in the section container and auto-page if content becomes longer.
        </p>
      </BuilderPanel>

      <CvSectionDesignerDialog
        open={sectionDesignerOpen}
        section={editingSection}
        existingSections={formSections}
        onClose={() => {
          setSectionDesignerOpen(false);
          setEditingSection(null);
        }}
        onSave={handleSaveSection}
      />
    </aside>
  );
}

function BuilderPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-black/5 bg-[#FAFBF8] p-4">
      <h3 className="mb-3 text-sm font-black text-[#202420]">{title}</h3>
      {children}
    </section>
  );
}

function PaletteIcon({ type }: { type: string }) {
  if (type === "rectangle") return <Square className="size-4" />;
  if (type === "circle") return <Circle className="size-4" />;
  if (type === "horizontalLine" || type === "verticalLine" || type === "line")
    return <Minus className="size-4" />;
  if (type === "textarea") return <TextCursorInput className="size-4" />;
  if (type === "icon") return <LinkedinIcon className="size-4" />;
  return <Type className="size-4" />;
}

function ElementInspector({
  element,
  formSections,
  onUpdate,
  onDelete,
}: {
  element: CvBuilderLayoutElement;
  formSections: CvTemplateSectionSchema[];
  onUpdate: (element: CvBuilderLayoutElement) => void;
  onDelete: (elementId: string) => void;
}) {
  const isLine =
    element.type === "horizontalLine" ||
    element.type === "verticalLine" ||
    element.type === "line";
  const isShape = element.type === "rectangle" || element.type === "circle";
  const isSection = element.type === "section";
  const updateStyle = (style: Partial<CvBuilderLayoutElement["style"]>) =>
    onUpdate({ ...element, style: { ...element.style, ...style } });
  const updateElement = (updates: Partial<CvBuilderLayoutElement>) =>
    onUpdate({ ...element, ...updates });
  const fieldOptions = formSections.flatMap((section) =>
    section.fields.map((field) => ({ section, field })),
  );

  return (
    <div className="space-y-3">
      <label className={labelClass}>
        Label
        <input
          className={inputClass}
          value={element.label}
          onChange={(event) => updateElement({ label: event.target.value })}
        />
      </label>
      {!isShape && !isLine && !isSection && element.type !== "icon" ? (
        <label className={labelClass}>
          Preview text
          <textarea
            className="min-h-20 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm normal-case text-[#202420] outline-none focus:border-[#006B3F]"
            value={element.type === "textarea" ? stripHtml(element.placeholder) : element.placeholder}
            onChange={(event) =>
              updateElement({ placeholder: event.target.value })
            }
          />
        </label>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <NumberInput
          label="X"
          value={element.x}
          onChange={(value) => updateElement({ x: value })}
        />
        <NumberInput
          label="Y"
          value={element.y}
          onChange={(value) => updateElement({ y: value })}
        />
        {!isLine ||
        element.type === "horizontalLine" ||
        element.type === "line" ? (
          <NumberInput
            label="Width"
            value={element.width}
            onChange={(value) => updateElement({ width: value })}
          />
        ) : null}
        {!isLine || element.type === "verticalLine" ? (
          <NumberInput
            label="Height"
            value={element.height}
            onChange={(value) =>
              updateElement({
                height: element.type === "circle" ? value : value,
                width: element.type === "circle" ? value : element.width,
              })
            }
          />
        ) : null}
        {!isShape && !isLine && !isSection ? (
          <NumberInput
            label="Font"
            value={element.style.fontSize ?? 12}
            onChange={(value) => updateStyle({ fontSize: value })}
          />
        ) : null}
        <NumberInput
          label="Layer"
          value={element.zIndex}
          onChange={(value) => updateElement({ zIndex: value })}
        />
      </div>

      {!isShape && !isLine && !isSection ? (
        <>
          <label className={labelClass}>
            Font family
            <select
              className={inputClass}
              value={element.style.fontFamily ?? "Inter"}
              onChange={(event) =>
                updateStyle({ fontFamily: event.target.value })
              }
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Bind to form field
            <select
              className={inputClass}
              value={`${element.contentBinding?.sectionKey ?? ""}.${element.contentBinding?.fieldKey ?? ""}`}
              onChange={(event) => {
                const [sectionKey, fieldKey] = event.target.value.split(".");
                updateElement({
                  fieldKey: fieldKey || "custom",
                  contentBinding: fieldKey
                    ? {
                        sectionKey,
                        fieldKey,
                        mode: "dynamic",
                        autoHeight: true,
                        allowPageBreak: true,
                      }
                    : {
                        mode: "static",
                        autoHeight: false,
                        allowPageBreak: false,
                      },
                });
              }}
            >
              <option value=".">Static text only</option>
              {fieldOptions.map(({ section, field }) => (
                <option
                  key={`${section.key}.${field.key}`}
                  value={`${section.key}.${field.key}`}
                >
                  {section.title} / {field.label}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Hyperlink
            <input
              className={inputClass}
              value={element.hyperlink ?? ""}
              onChange={(event) =>
                updateElement({ hyperlink: event.target.value })
              }
              placeholder="https://example.com"
            />
          </label>
        </>
      ) : null}

      {element.type === "icon" ? (
        <div className="rounded-2xl border border-black/5 bg-white p-3">
          <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-black/55">
            Icon
          </p>
          <div className="grid grid-cols-3 gap-2">
            {iconOptions.map((iconName) => (
              <button
                key={iconName}
                type="button"
                onClick={() => updateElement({ iconName })}
                className={`flex h-10 items-center justify-center rounded-xl border text-[#202420] ${element.iconName === iconName ? "border-[#006B3F] bg-[#E6F6F0]" : "border-black/10 bg-[#F7F8F5]"}`}
              >
                <IconGraphic name={iconName} className="size-4" />
              </button>
            ))}
          </div>
          <div className="mt-3">
            <NumberInput
              label="Icon size"
              value={element.style.fontSize ?? Math.min(element.width, element.height)}
              onChange={(value) => updateStyle({ fontSize: value })}
            />
          </div>
        </div>
      ) : null}

      {isSection ? (
        <p className="rounded-2xl bg-[#E6F6F0] p-3 text-xs font-bold leading-5 text-[#006B3F]">
          This is a user form section container. It renders fields from “
          {element.contentBinding?.sectionKey ?? element.label}” and can
          auto-grow during user CV rendering.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        {!isShape && !isLine && !isSection ? (
          <label className={labelClass}>
            Text
            <input
              className={inputClass}
              type="color"
              value={element.style.color ?? "#111827"}
              onChange={(event) => updateStyle({ color: event.target.value })}
            />
          </label>
        ) : null}
        {!isLine ? (
          <div className={labelClass}>
            Fill
            <div className="flex gap-2">
              <input
                className={`${inputClass} flex-1`}
                type="color"
                value={
                  element.style.backgroundColor === "transparent"
                    ? "#ffffff"
                    : (element.style.backgroundColor ?? "#ffffff")
                }
                onChange={(event) =>
                  updateStyle({ backgroundColor: event.target.value })
                }
              />
              <ClearColorButton
                label="Clear fill"
                onClick={() => updateStyle({ backgroundColor: "transparent" })}
              />
            </div>
          </div>
        ) : null}
        <div className={labelClass}>
          {isLine ? "Line" : "Border"}
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              type="color"
              value={
                element.style.borderColor === "transparent"
                  ? "#111827"
                  : (element.style.borderColor ?? element.style.backgroundColor ?? "#111827")
              }
              onChange={(event) =>
                updateStyle(
                  isLine
                    ? {
                        borderColor: event.target.value,
                        backgroundColor: event.target.value,
                      }
                    : { borderColor: event.target.value },
                )
              }
            />
            <ClearColorButton
              label="Clear border"
              onClick={() => updateStyle(isLine ? { borderColor: "transparent", backgroundColor: "transparent" } : { borderColor: "transparent" })}
            />
          </div>
        </div>
        <NumberInput
          label={isLine ? "Line width" : "Border"}
          value={element.style.borderWidth ?? (isLine ? 2 : 0)}
          onChange={(value) => updateStyle({ borderWidth: value })}
        />
      </div>

      {!isLine && element.type !== "circle" ? (
        <NumberInput
          label="Radius"
          value={element.style.borderRadius ?? 0}
          onChange={(value) => updateStyle({ borderRadius: value })}
        />
      ) : null}
      <button
        type="button"
        onClick={() => onDelete(element.id)}
        className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
      >
        Delete Element
      </button>
    </div>
  );
}

function IconGraphic({
  name,
  className,
  style,
}: {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}) {
  if (name === "github") return <GithubIcon className={className} style={style} />;
  if (name === "linkedin") return <LinkedinIcon className={className} style={style} />;
  if (name === "phone") return <Phone className={className} style={style} />;
  if (name === "location") return <MapPin className={className} style={style} />;
  if (name === "email") return <Mail className={className} style={style} />;
  return <Globe className={className} style={style} />;
}

function ClearColorButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 rounded-2xl border border-black/10 bg-white px-3 text-xs font-black text-black/55 hover:border-[#006B3F] hover:text-[#006B3F]"
      title={label}
    >
      Clear
    </button>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={labelClass}>
      {label}
      <input
        className={inputClass}
        type="number"
        value={Math.round(value)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
