'use client';

import type { ReactNode } from 'react';
import { Circle, Minus, Square, Type } from 'lucide-react';
import type {
  CvBuilderLayoutElement,
  CvTemplatePageSize,
  CvTemplateSectionSchema,
} from '@/types/cv-template/cv_template_type';
import { fontOptions, paletteItems, pageSizes, sectionOptions } from './cv-builder-defaults';

interface CvBuilderSidebarProps {
  title: string;
  description: string;
  pageSize: CvTemplatePageSize;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  selectedSections: string[];
  selectedElement: CvBuilderLayoutElement | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPageSizeChange: (value: CvTemplatePageSize) => void;
  onFontFamilyChange: (value: string) => void;
  onPrimaryColorChange: (value: string) => void;
  onAccentColorChange: (value: string) => void;
  onSectionToggle: (section: CvTemplateSectionSchema) => void;
  onAddElement: (itemIndex: number) => void;
  onUpdateElement: (element: CvBuilderLayoutElement) => void;
  onDeleteElement: (elementId: string) => void;
}

const inputClass = 'h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#202420] outline-none focus:border-[#006B3F]';
const labelClass = 'space-y-2 text-xs font-bold uppercase tracking-wide text-black/55';

export default function CvBuilderSidebar({
  title,
  description,
  pageSize,
  fontFamily,
  primaryColor,
  accentColor,
  selectedSections,
  selectedElement,
  onTitleChange,
  onDescriptionChange,
  onPageSizeChange,
  onFontFamilyChange,
  onPrimaryColorChange,
  onAccentColorChange,
  onSectionToggle,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
}: CvBuilderSidebarProps) {
  return (
    <aside className="space-y-4 overflow-y-auto rounded-[30px] bg-white p-5 shadow-sm xl:max-h-[calc(100vh-150px)]">
      <div>
        <h2 className="text-lg font-black text-[#202420]">Template Setup</h2>
        <p className="mt-1 text-xs leading-5 text-black/55">Add components, move and resize them on the A4/Letter canvas, then publish the reusable CV layout.</p>
      </div>

      <div className="space-y-3">
        <label className={labelClass}>Template name<input className={inputClass} value={title} onChange={(event) => onTitleChange(event.target.value)} /></label>
        <label className={labelClass}>Description<textarea className="min-h-20 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm normal-case text-[#202420] outline-none focus:border-[#006B3F]" value={description} onChange={(event) => onDescriptionChange(event.target.value)} /></label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass}>Page<select className={inputClass} value={pageSize} onChange={(event) => onPageSizeChange(event.target.value as CvTemplatePageSize)}>{Object.entries(pageSizes).map(([value, page]) => <option key={value} value={value}>{page.label}</option>)}</select></label>
        <label className={labelClass}>Font<select className={inputClass} value={fontFamily} onChange={(event) => onFontFamilyChange(event.target.value)}>{fontOptions.map((font) => <option key={font} value={font}>{font}</option>)}</select></label>
        <label className={labelClass}>Primary<input className={inputClass} type="color" value={primaryColor} onChange={(event) => onPrimaryColorChange(event.target.value)} /></label>
        <label className={labelClass}>Accent<input className={inputClass} type="color" value={accentColor} onChange={(event) => onAccentColorChange(event.target.value)} /></label>
      </div>

      <BuilderPanel title="Components">
        <div className="grid grid-cols-2 gap-2">
          {paletteItems.map((item, index) => (
            <button key={`${item.type}-${item.fieldKey}-${item.label}`} type="button" onClick={() => onAddElement(index)} className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[#F7F8F5] p-3 text-left text-xs font-bold text-[#202420] transition hover:border-[#006B3F] hover:bg-[#E6F6F0]">
              <PaletteIcon type={item.type} />
              {item.label}
            </button>
          ))}
        </div>
      </BuilderPanel>

      <BuilderPanel title="User Form Sections">
        <div className="space-y-2">
          {sectionOptions.map((section) => {
            const selected = section.required || selectedSections.includes(section.key);
            return (
              <button key={section.key} type="button" onClick={() => onSectionToggle(section)} className={`w-full rounded-2xl border p-3 text-left text-xs font-bold transition ${selected ? 'border-[#006B3F] bg-[#E6F6F0] text-[#006B3F]' : 'border-black/10 bg-white text-[#202420]'}`}>
                {section.title}
                <span className="ml-2 font-medium text-black/45">{section.required ? 'Required' : `${section.fields.length} fields`}</span>
              </button>
            );
          })}
        </div>
      </BuilderPanel>

      <BuilderPanel title="Selected Element">
        {selectedElement ? (
          <ElementInspector element={selectedElement} onUpdate={onUpdateElement} onDelete={onDeleteElement} />
        ) : (
          <p className="text-sm text-black/50">Select an item on the canvas to edit text, color, size, border, and layer.</p>
        )}
      </BuilderPanel>
    </aside>
  );
}

function BuilderPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-black/5 bg-[#FAFBF8] p-4">
      <h3 className="mb-3 text-sm font-black text-[#202420]">{title}</h3>
      {children}
    </section>
  );
}

function PaletteIcon({ type }: { type: string }) {
  if (type === 'rectangle') return <Square className="size-4" />;
  if (type === 'circle') return <Circle className="size-4" />;
  if (type === 'line') return <Minus className="size-4" />;
  return <Type className="size-4" />;
}

function ElementInspector({
  element,
  onUpdate,
  onDelete,
}: {
  element: CvBuilderLayoutElement;
  onUpdate: (element: CvBuilderLayoutElement) => void;
  onDelete: (elementId: string) => void;
}) {
  const updateStyle = (style: Partial<CvBuilderLayoutElement['style']>) => onUpdate({ ...element, style: { ...element.style, ...style } });
  const updateElement = (updates: Partial<CvBuilderLayoutElement>) => onUpdate({ ...element, ...updates });

  return (
    <div className="space-y-3">
      <label className={labelClass}>Label<input className={inputClass} value={element.label} onChange={(event) => updateElement({ label: event.target.value })} /></label>
      <label className={labelClass}>Placeholder<input className={inputClass} value={element.placeholder} onChange={(event) => updateElement({ placeholder: event.target.value })} /></label>
      <div className="grid grid-cols-2 gap-2">
        <NumberInput label="X" value={element.x} onChange={(value) => updateElement({ x: value })} />
        <NumberInput label="Y" value={element.y} onChange={(value) => updateElement({ y: value })} />
        <NumberInput label="Width" value={element.width} onChange={(value) => updateElement({ width: value })} />
        <NumberInput label="Height" value={element.height} onChange={(value) => updateElement({ height: value })} />
        <NumberInput label="Font" value={element.style.fontSize ?? 12} onChange={(value) => updateStyle({ fontSize: value })} />
        <NumberInput label="Layer" value={element.zIndex} onChange={(value) => updateElement({ zIndex: value })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className={labelClass}>Text<input className={inputClass} type="color" value={element.style.color ?? '#111827'} onChange={(event) => updateStyle({ color: event.target.value })} /></label>
        <label className={labelClass}>Fill<input className={inputClass} type="color" value={element.style.backgroundColor ?? '#ffffff'} onChange={(event) => updateStyle({ backgroundColor: event.target.value })} /></label>
        <label className={labelClass}>Border<input className={inputClass} type="color" value={element.style.borderColor ?? '#ffffff'} onChange={(event) => updateStyle({ borderColor: event.target.value })} /></label>
        <NumberInput label="Border" value={element.style.borderWidth ?? 0} onChange={(value) => updateStyle({ borderWidth: value })} />
      </div>
      <button type="button" onClick={() => onDelete(element.id)} className="w-full rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">Delete Element</button>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className={labelClass}>{label}<input className={inputClass} type="number" value={Math.round(value)} onChange={(event) => onChange(Number(event.target.value))} /></label>
  );
}
