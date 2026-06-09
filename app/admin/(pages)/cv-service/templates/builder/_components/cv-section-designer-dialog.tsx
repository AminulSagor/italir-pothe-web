'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import {
  Bold,
  Circle,
  Globe,
  Italic,
  Link as LinkIcon,
  Mail,
  MapPin,
  Minus,
  Phone,
  Save,
  Square,
  TextCursorInput,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import type {
  CvBuilderElementType,
  CvTemplateFieldSchema,
  CvTemplateFieldType,
  CvTemplateSectionDesignerElement,
  CvTemplateSectionSchema,
} from '@/types/cv-template/cv_template_type';
import { fontOptions } from './cv-builder-defaults';


const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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

const defaultCanvas = { width: 470, height: 620 };
const inputClass = 'h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-xs text-[#202420] outline-none focus:border-[#006B3F] disabled:cursor-not-allowed disabled:bg-black/5 disabled:text-black/35';
const labelClass = 'space-y-1.5 text-[11px] font-black uppercase tracking-wide text-black/55';
const iconOptions = ['github', 'linkedin', 'weblink', 'phone', 'location', 'email'] as const;
const sectionPaletteItems: Array<{ label: string; type: CvBuilderElementType }> = [
  { label: 'Text', type: 'text' },
  { label: 'Textarea', type: 'textarea' },
  { label: 'Rectangle', type: 'rectangle' },
  { label: 'Circle', type: 'circle' },
  { label: 'Horizontal Line', type: 'horizontalLine' },
  { label: 'Vertical Line', type: 'verticalLine' },
  { label: 'Icon', type: 'icon' },
];

type ResizeDirection = 'right' | 'bottom' | 'corner';
type IconName = (typeof iconOptions)[number];

interface CvSectionDesignerDialogProps {
  open: boolean;
  section: CvTemplateSectionSchema | null;
  existingSections: CvTemplateSectionSchema[];
  onClose: () => void;
  onSave: (section: CvTemplateSectionSchema) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toCamelKey = (value: string) => {
  const words = value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean);

  if (words.length === 0) return `customSection${Date.now()}`;

  return words
    .map((word, index) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
      if (index === 0) return cleanWord.charAt(0).toLowerCase() + cleanWord.slice(1);
      return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    })
    .join('')
    .replace(/^([0-9])/, 'section$1');
};

const makeUniqueSectionKey = (
  title: string,
  existingSections: CvTemplateSectionSchema[],
  currentKey?: string,
) => {
  const baseKey = toCamelKey(title);
  let nextKey = baseKey;
  let serial = 2;

  while (existingSections.some((item) => item.key === nextKey && item.key !== currentKey)) {
    nextKey = `${baseKey}${serial}`;
    serial += 1;
  }

  return nextKey;
};

const makeSafeFieldKey = (value: string) =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^([0-9])/, 'field_$1') || `field_${Date.now()}`;

const fieldTypeOptions: Array<{ label: string; value: CvTemplateFieldType }> = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'List', value: 'list' },
  { label: 'Date', value: 'date' },
  { label: 'Photo URL', value: 'imageUrl' },
  { label: 'Website', value: 'website' },
];

const getDefaultFieldType = (type: CvBuilderElementType): CvTemplateFieldType => {
  if (type === 'circle') return 'imageUrl';
  if (type === 'textarea') return 'textarea';
  if (type === 'icon') return 'website';
  return 'text';
};

const getDefaultPreviewValue = (type: CvBuilderElementType) => {
  if (type === 'circle') return 'https://example.com/profile-photo.jpg';
  if (type === 'textarea') return '<p>Long text block with <strong>selected</strong> formatting support.</p>';
  if (type === 'icon') return '';
  if (type === 'horizontalLine' || type === 'verticalLine' || type === 'line') return '';
  return 'Sample text';
};

const createDesignerElement = (
  type: CvBuilderElementType,
  index: number,
  fontFamily: string,
): CvTemplateSectionDesignerElement => {
  const isHorizontalLine = type === 'horizontalLine' || type === 'line';
  const isVerticalLine = type === 'verticalLine';
  const isField = type === 'text';
  const fieldKey = makeSafeFieldKey(`${type}_${index + 1}`);

  return {
    id: `${type}-${Date.now()}-${index}`,
    type,
    fieldKey,
    label: `${type === 'circle' ? 'Photo' : type === 'textarea' ? 'Long text' : type === 'icon' ? 'Icon' : type} ${index + 1}`,
    previewValue: getDefaultPreviewValue(type),
    isField,
    richTextFormat: type === 'textarea' ? 'html' : 'plain',
    iconName: type === 'icon' ? 'linkedin' : undefined,
    x: 35 + (index % 3) * 18,
    y: 35 + (index % 5) * 40,
    width: isHorizontalLine ? 260 : isVerticalLine ? 2 : type === 'circle' ? 96 : type === 'icon' ? 34 : 250,
    height: isHorizontalLine ? 2 : isVerticalLine ? 200 : type === 'circle' ? 96 : type === 'icon' ? 34 : type === 'textarea' ? 120 : 62,
    zIndex: index + 1,
    style: {
      fontFamily,
      fontSize: type === 'text' ? 16 : type === 'textarea' ? 13 : 12,
      fontWeight: type === 'text' ? 700 : 500,
      color: '#111827',
      backgroundColor: isHorizontalLine || isVerticalLine ? '#111827' : type === 'rectangle' ? '#F3F4F6' : 'transparent',
      borderColor: isHorizontalLine || isVerticalLine ? '#111827' : type === 'rectangle' || type === 'circle' ? '#111827' : 'transparent',
      borderWidth: isHorizontalLine || isVerticalLine ? 2 : type === 'rectangle' || type === 'circle' ? 1 : 0,
      borderRadius: type === 'circle' ? 999 : 0,
    },
  };
};

export default function CvSectionDesignerDialog({ open, section, existingSections, onClose, onSave }: CvSectionDesignerDialogProps) {
  const [title, setTitle] = useState('Custom Section');
  const [sectionKey, setSectionKey] = useState('customSection');
  const [keyEdited, setKeyEdited] = useState(false);
  const [canvasSize, setCanvasSize] = useState(defaultCanvas);
  const [fields, setFields] = useState<CvTemplateFieldSchema[]>([]);
  const [elements, setElements] = useState<CvTemplateSectionDesignerElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const currentTitle = section?.title ?? 'Custom Section';
    const currentKey = section?.key ?? makeUniqueSectionKey(currentTitle, existingSections);
    const currentCanvas = section?.designerJson?.canvas ?? defaultCanvas;

    setTitle(currentTitle);
    setSectionKey(currentKey);
    setKeyEdited(Boolean(section));
    setFields(section?.fields ?? []);
    setCanvasSize({ width: currentCanvas.width, height: currentCanvas.height });
    setElements(section?.designerJson?.elements ?? []);
    setSelectedElementId(section?.designerJson?.elements?.[0]?.id ?? null);
  }, [open, section, existingSections]);

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedElementId) ?? null,
    [elements, selectedElementId],
  );

  const selectedField = useMemo(
    () => fields.find((field) => field.key === selectedElement?.fieldKey) ?? null,
    [fields, selectedElement?.fieldKey],
  );

  if (!open) return null;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!keyEdited) {
      setSectionKey(makeUniqueSectionKey(value, existingSections, section?.key));
    }
  };

  const handleSectionKeyChange = (value: string) => {
    setKeyEdited(true);
    setSectionKey(toCamelKey(value));
  };

  const addElement = (type: CvBuilderElementType) => {
    const element = createDesignerElement(type, elements.length, 'Inter');
    setElements((current) => [...current, element]);
    if (element.isField) {
      setFields((current) => [
        ...current,
        {
          key: element.fieldKey,
          label: element.label,
          type: getDefaultFieldType(type),
          required: false,
          placeholder: element.previewValue,
        },
      ]);
    }
    setSelectedElementId(element.id);
  };

  const clampElement = (element: CvTemplateSectionDesignerElement): CvTemplateSectionDesignerElement => {
    const width = element.type === 'circle' ? element.width : element.width;
    const height = element.type === 'circle' ? element.width : element.height;
    return {
      ...element,
      width,
      height,
      x: clamp(element.x, 0, canvasSize.width - width),
      y: clamp(element.y, 0, canvasSize.height - height),
    };
  };

  const updateElement = (updatedElement: CvTemplateSectionDesignerElement) => {
    setElements((current) =>
      current.map((element) =>
        element.id === updatedElement.id ? clampElement(updatedElement) : element,
      ),
    );
  };

  const updateField = (currentKey: string, updatedField: CvTemplateFieldSchema) => {
    const safeKey = makeSafeFieldKey(updatedField.key);
    setFields((current) =>
      current.map((field) => (field.key === currentKey ? { ...updatedField, key: safeKey } : field)),
    );
    setElements((current) =>
      current.map((element) =>
        element.fieldKey === currentKey
          ? {
              ...element,
              fieldKey: safeKey,
              label: updatedField.label,
              previewValue: updatedField.placeholder ?? element.previewValue,
            }
          : element,
      ),
    );
  };

  const updateSelectedPreview = (value: string) => {
    if (!selectedElement) return;
    updateElement({ ...selectedElement, previewValue: value });
    if (selectedField) {
      updateField(selectedField.key, { ...selectedField, placeholder: value });
    }
  };

  const toggleFieldRegistration = (registered: boolean) => {
    if (!selectedElement) return;
    if (registered) {
      const field: CvTemplateFieldSchema = selectedField ?? {
        key: makeSafeFieldKey(selectedElement.fieldKey || selectedElement.label),
        label: selectedElement.label,
        type: getDefaultFieldType(selectedElement.type),
        required: false,
        placeholder: selectedElement.previewValue,
      };
      updateElement({ ...selectedElement, isField: true, fieldKey: field.key });
      if (!selectedField) setFields((current) => [...current, field]);
      return;
    }

    updateElement({ ...selectedElement, isField: false });
    setFields((current) => current.filter((field) => field.key !== selectedElement.fieldKey));
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    setElements((current) => current.filter((element) => element.id !== selectedElement.id));
    setFields((current) => current.filter((field) => field.key !== selectedElement.fieldKey));
    setSelectedElementId(null);
  };

  const updateCanvasSize = (nextSize: { width: number; height: number }) => {
    const width = clamp(Math.round(nextSize.width), 260, 1000);
    const height = clamp(Math.round(nextSize.height), 160, 1400);
    setCanvasSize({ width, height });
    setElements((current) => current.map((element) => ({
      ...element,
      width: element.type === 'verticalLine' ? element.width : Math.min(element.width, width),
      height: element.type === 'horizontalLine' ? element.height : Math.min(element.height, height),
      x: clamp(element.x, 0, width - Math.min(element.width, width)),
      y: clamp(element.y, 0, height - Math.min(element.height, height)),
    })));
  };

  const handleSave = () => {
    const safeSectionKey = makeUniqueSectionKey(sectionKey || title, existingSections, section?.key);
    onSave({
      key: safeSectionKey,
      title: title.trim() || 'Custom Section',
      required: false,
      fields,
      designerJson: {
        version: 2,
        canvas: {
          width: canvasSize.width,
          height: canvasSize.height,
          unit: 'px',
        },
        elements,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5">
      <div className="relative grid h-[92vh] w-full max-w-7xl grid-cols-[330px_1fr_330px] overflow-hidden rounded-[30px] bg-white shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full bg-white p-2 text-black/60 shadow-lg hover:text-black">
          <X className="size-5" />
        </button>

        <aside className="h-full space-y-4 overflow-y-auto border-r border-black/10 bg-[#FAFBF8] p-5 pr-4">
          <div className="pr-10">
            <h2 className="text-xl font-black text-[#202420]">Section Designer</h2>
            <p className="mt-1 text-xs leading-5 text-black/55">Design one reusable user-input section, save the whole canvas, then place it on the main CV page.</p>
          </div>

          <label className={labelClass}>Section title<input className={inputClass} value={title} onChange={(event) => handleTitleChange(event.target.value)} /></label>
          <label className={labelClass}>Section key<input className={inputClass} value={sectionKey} onChange={(event) => handleSectionKeyChange(event.target.value)} /></label>

          <section className="rounded-3xl border border-black/5 bg-white p-4">
            <h3 className="mb-3 text-sm font-black text-[#202420]">Canvas size</h3>
            <div className="grid grid-cols-2 gap-2">
              <NumberInput label="Width" value={canvasSize.width} onChange={(value) => updateCanvasSize({ ...canvasSize, width: value })} />
              <NumberInput label="Height" value={canvasSize.height} onChange={(value) => updateCanvasSize({ ...canvasSize, height: value })} />
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-4">
            <h3 className="mb-3 text-sm font-black text-[#202420]">Components</h3>
            <div className="grid grid-cols-2 gap-2">
              {sectionPaletteItems.map((item) => (
                <button key={item.type} type="button" onClick={() => addElement(item.type)} className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[#F7F8F5] p-3 text-left text-xs font-bold text-[#202420] hover:border-[#006B3F] hover:bg-[#E6F6F0]">
                  <PaletteIcon type={item.type} />
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-4">
            <h3 className="text-sm font-black text-[#202420]">Registered Fields</h3>
            <p className="mt-1 text-xs leading-5 text-black/55">Only checked components become Flutter form fields. Text is checked automatically.</p>
            <div className="mt-3 space-y-2">
              {fields.length === 0 ? (
                <div className="rounded-2xl bg-[#F7F8F5] p-3 text-xs font-bold text-black/45">No fields registered yet.</div>
              ) : fields.map((field) => (
                <button key={field.key} type="button" onClick={() => setSelectedElementId(elements.find((element) => element.fieldKey === field.key)?.id ?? null)} className="w-full rounded-2xl border border-black/10 bg-[#F7F8F5] p-3 text-left text-xs">
                  <span className="block font-black text-[#202420]">{field.label}</span>
                  <span className="mt-1 block text-black/50">{field.key} · {field.type}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <main className="h-full overflow-auto bg-[#E9E9E2] p-6">
          <div className="mx-auto rounded-3xl bg-white p-4 shadow-xl" style={{ width: canvasSize.width + 32 }}>
            <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white" style={{ width: canvasSize.width, height: canvasSize.height }}>
              {elements
                .slice()
                .sort((first, second) => first.zIndex - second.zIndex)
                .map((element) => (
                  <DesignerElement
                    key={element.id}
                    canvasSize={canvasSize}
                    element={element}
                    selected={selectedElementId === element.id}
                    onSelect={setSelectedElementId}
                    onChange={updateElement}
                  />
                ))}
            </div>
          </div>
        </main>

        <aside className="h-full space-y-4 overflow-y-auto border-l border-black/10 bg-[#FAFBF8] p-5 pt-14">
          <h3 className="text-sm font-black text-[#202420]">Selected Component</h3>
          {selectedElement ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-3 text-xs font-black text-[#202420]">{selectedElement.label}</div>
              <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-xs font-black text-[#202420]">
                <input type="checkbox" checked={Boolean(selectedElement.isField)} onChange={(event) => toggleFieldRegistration(event.target.checked)} />
                Register as user input field
              </label>

              <label className={labelClass}>Field key<input disabled={!selectedElement.isField || !selectedField} className={inputClass} value={selectedField?.key ?? selectedElement.fieldKey} onChange={(event) => selectedField ? updateField(selectedField.key, { ...selectedField, key: event.target.value }) : undefined} /></label>
              <label className={labelClass}>Field label<input disabled={!selectedElement.isField || !selectedField} className={inputClass} value={selectedField?.label ?? selectedElement.label} onChange={(event) => selectedField ? updateField(selectedField.key, { ...selectedField, label: event.target.value }) : undefined} /></label>
              <label className={labelClass}>Field type<select disabled={!selectedElement.isField || !selectedField} className={inputClass} value={selectedField?.type ?? getDefaultFieldType(selectedElement.type)} onChange={(event) => selectedField ? updateField(selectedField.key, { ...selectedField, type: event.target.value as CvTemplateFieldType }) : undefined}>{fieldTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>

              {selectedElement.type === 'text' ? (
                <NormalTextInspector element={selectedElement} onChange={updateElement} onTextChange={updateSelectedPreview} />
              ) : null}

              {selectedElement.type === 'textarea' ? (
                <RichTextareaInspector element={selectedElement} onChange={updateElement} onTextChange={updateSelectedPreview} />
              ) : null}

              {selectedElement.type === 'circle' && selectedElement.isField ? (
                <label className={labelClass}>Image URL preview<input className={inputClass} value={selectedElement.previewValue} onChange={(event) => updateSelectedPreview(event.target.value)} /></label>
              ) : null}

              {selectedElement.type === 'icon' ? (
                <section className="rounded-3xl border border-black/5 bg-white p-3">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-black/55">Icon</p>
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map((iconName) => (
                      <button key={iconName} type="button" onClick={() => updateElement({ ...selectedElement, iconName })} className={`flex h-10 items-center justify-center rounded-xl border text-[#202420] ${selectedElement.iconName === iconName ? 'border-[#006B3F] bg-[#E6F6F0]' : 'border-black/10 bg-[#F7F8F5]'}`}>
                        <IconGraphic name={iconName} className="size-4" />
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                <NumberInput label="X" value={selectedElement.x} onChange={(value) => updateElement({ ...selectedElement, x: clamp(value, 0, canvasSize.width - selectedElement.width) })} />
                <NumberInput label="Y" value={selectedElement.y} onChange={(value) => updateElement({ ...selectedElement, y: clamp(value, 0, canvasSize.height - selectedElement.height) })} />
                <NumberInput label="W" value={selectedElement.width} onChange={(value) => updateElement(selectedElement.type === 'circle' ? { ...selectedElement, width: value, height: value } : { ...selectedElement, width: value })} />
                <NumberInput label="H" value={selectedElement.height} onChange={(value) => updateElement(selectedElement.type === 'circle' ? { ...selectedElement, width: value, height: value } : { ...selectedElement, height: value })} />
                <NumberInput label="Layer" value={selectedElement.zIndex} onChange={(value) => updateElement({ ...selectedElement, zIndex: value })} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(selectedElement.type === 'text' || selectedElement.type === 'textarea' || selectedElement.type === 'icon') ? <label className={labelClass}>Text/Icon<input className={inputClass} type="color" value={selectedElement.style.color ?? '#111827'} onChange={(event) => updateElement({ ...selectedElement, style: { ...selectedElement.style, color: event.target.value } })} /></label> : null}
                {selectedElement.type !== 'horizontalLine' && selectedElement.type !== 'verticalLine' ? <label className={labelClass}>Fill<input className={inputClass} type="color" value={selectedElement.style.backgroundColor === 'transparent' ? '#ffffff' : selectedElement.style.backgroundColor ?? '#ffffff'} onChange={(event) => updateElement({ ...selectedElement, style: { ...selectedElement.style, backgroundColor: event.target.value } })} /></label> : null}
                <label className={labelClass}>Border / line<input className={inputClass} type="color" value={selectedElement.style.borderColor ?? '#111827'} onChange={(event) => updateElement({ ...selectedElement, style: { ...selectedElement.style, borderColor: event.target.value, backgroundColor: selectedElement.type === 'horizontalLine' || selectedElement.type === 'verticalLine' ? event.target.value : selectedElement.style.backgroundColor } })} /></label>
                <NumberInput label="Border" value={selectedElement.style.borderWidth ?? 0} onChange={(value) => updateElement({ ...selectedElement, style: { ...selectedElement.style, borderWidth: value } })} />
              </div>

              <button type="button" onClick={deleteSelectedElement} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600">
                <Trash2 className="size-4" /> Delete Component
              </button>
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-3 text-xs leading-5 text-black/55">Select a section component to edit field registration, text, rich text, size, icon, and color.</p>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-11 flex-1 rounded-full border border-black/10 text-sm font-black text-[#202420]">Cancel</button>
            <button type="button" onClick={handleSave} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#006B3F] text-sm font-black text-white">
              <Save className="size-4" /> Save Section
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function NormalTextInspector({ element, onChange, onTextChange }: { element: CvTemplateSectionDesignerElement; onChange: (element: CvTemplateSectionDesignerElement) => void; onTextChange: (value: string) => void }) {
  const updateStyle = (style: Partial<CvTemplateSectionDesignerElement['style']>) => onChange({ ...element, style: { ...element.style, ...style } });

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        <FormatButton active={element.style.fontWeight === 800} icon={<Bold className="size-4" />} onClick={() => updateStyle({ fontWeight: element.style.fontWeight === 800 ? 500 : 800 })} />
        <FormatButton active={element.style.fontStyle === 'italic'} icon={<Italic className="size-4" />} onClick={() => updateStyle({ fontStyle: element.style.fontStyle === 'italic' ? 'normal' : 'italic' } as Partial<CvTemplateSectionDesignerElement['style']>)} />
      </div>
      <label className={labelClass}>Text<input className={inputClass} value={element.previewValue} onChange={(event) => onTextChange(event.target.value)} /></label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <NumberInput label="Font size" value={element.style.fontSize ?? 16} onChange={(value) => updateStyle({ fontSize: value })} />
        <label className={labelClass}>Font<select className={inputClass} value={element.style.fontFamily ?? 'Inter'} onChange={(event) => updateStyle({ fontFamily: event.target.value })}>{fontOptions.map((font) => <option key={font} value={font}>{font}</option>)}</select></label>
      </div>
      <label className={`${labelClass} mt-2`}>Hyperlink<input className={inputClass} value={element.hyperlink ?? ''} onChange={(event) => onChange({ ...element, hyperlink: event.target.value })} placeholder="https://example.com" /></label>
    </section>
  );
}

function RichTextareaInspector({ element, onChange, onTextChange }: { element: CvTemplateSectionDesignerElement; onChange: (element: CvTemplateSectionDesignerElement) => void; onTextChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== element.previewValue) {
      editorRef.current.innerHTML = element.previewValue || '';
    }
  }, [element.id, element.previewValue]);

  const applyCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    onTextChange(editorRef.current?.innerHTML ?? '');
  };

  const applyLink = () => {
    const url = window.prompt('Enter hyperlink URL');
    if (!url) return;
    applyCommand('createLink', url);
  };

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        <FormatButton icon={<Bold className="size-4" />} onClick={() => applyCommand('bold')} />
        <FormatButton icon={<Italic className="size-4" />} onClick={() => applyCommand('italic')} />
        <FormatButton label="•" onClick={() => applyCommand('insertUnorderedList')} />
        <FormatButton label="1." onClick={() => applyCommand('insertOrderedList')} />
        <FormatButton icon={<LinkIcon className="size-4" />} onClick={applyLink} />
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <NumberInput label="Font size" value={element.style.fontSize ?? 13} onChange={(value) => onChange({ ...element, style: { ...element.style, fontSize: value } })} />
        <label className={labelClass}>Font<select className={inputClass} value={element.style.fontFamily ?? 'Inter'} onChange={(event) => onChange({ ...element, style: { ...element.style, fontFamily: event.target.value } })}>{fontOptions.map((font) => <option key={font} value={font}>{font}</option>)}</select></label>
      </div>
      <label className={labelClass}>Textarea / preview value</label>
      <div
        ref={editorRef}
        className="min-h-32 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs normal-case text-[#202420] outline-none focus:border-[#006B3F]"
        contentEditable
        suppressContentEditableWarning
        onInput={(event: FormEvent<HTMLDivElement>) => onTextChange(event.currentTarget.innerHTML)}
      />
      <label className={`${labelClass} mt-2`}>Default hyperlink<input className={inputClass} value={element.hyperlink ?? ''} onChange={(event) => onChange({ ...element, hyperlink: event.target.value })} placeholder="https://example.com" /></label>
    </section>
  );
}

function DesignerElement({ canvasSize, element, selected, onSelect, onChange }: { canvasSize: { width: number; height: number }; element: CvTemplateSectionDesignerElement; selected: boolean; onSelect: (id: string) => void; onChange: (element: CvTemplateSectionDesignerElement) => void }) {
  const isHorizontalLine = element.type === 'horizontalLine' || element.type === 'line';
  const isVerticalLine = element.type === 'verticalLine';
  const lineWidth = Math.max(1, element.style.borderWidth ?? 2);
  const style: CSSProperties = {
    left: element.x,
    top: element.y,
    width: isVerticalLine ? lineWidth : element.width,
    height: isHorizontalLine ? lineWidth : element.height,
    zIndex: element.zIndex,
    color: element.style.color,
    backgroundColor: isHorizontalLine || isVerticalLine ? element.style.borderColor ?? '#111827' : element.style.backgroundColor,
    borderColor: element.style.borderColor ?? 'transparent',
    borderWidth: isHorizontalLine || isVerticalLine ? 0 : element.style.borderWidth ?? 0,
    borderStyle: 'solid',
    borderRadius: element.type === 'circle' ? '9999px' : element.style.borderRadius ?? 0,
    fontFamily: element.style.fontFamily,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    fontStyle: element.style.fontStyle as CSSProperties['fontStyle'],
    overflow: 'hidden',
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).dataset.resizeHandle === 'true') return;
    event.preventDefault();
    onSelect(element.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = element.x;
    const startTop = element.y;
    const onPointerMove = (moveEvent: PointerEvent) => {
      const nextX = clamp(Math.round(startLeft + moveEvent.clientX - startX), 0, canvasSize.width - element.width);
      const nextY = clamp(Math.round(startTop + moveEvent.clientY - startY), 0, canvasSize.height - element.height);
      onChange({ ...element, x: nextX, y: nextY });
    };
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const resize = (direction: ResizeDirection, event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(element.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = element.width;
    const startHeight = element.height;
    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (element.type === 'circle') {
        const size = clamp(Math.round(Math.max(startWidth + dx, startHeight + dy, 32)), 32, Math.min(canvasSize.width - element.x, canvasSize.height - element.y));
        onChange({ ...element, width: size, height: size });
        return;
      }
      if (isHorizontalLine) {
        onChange({ ...element, width: clamp(Math.round(startWidth + dx), 16, canvasSize.width - element.x), height: lineWidth });
        return;
      }
      if (isVerticalLine) {
        onChange({ ...element, width: lineWidth, height: clamp(Math.round(startHeight + dy), 16, canvasSize.height - element.y) });
        return;
      }
      const nextWidth = direction === 'right' || direction === 'corner' ? startWidth + dx : startWidth;
      const nextHeight = direction === 'bottom' || direction === 'corner' ? startHeight + dy : startHeight;
      onChange({
        ...element,
        width: clamp(Math.round(nextWidth), 32, canvasSize.width - element.x),
        height: clamp(Math.round(nextHeight), 20, canvasSize.height - element.y),
      });
    };
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div onPointerDown={startDrag} className={`absolute cursor-move ${selected ? 'ring-2 ring-[#006B3F] ring-offset-2' : ''}`} style={style}>
      <DesignerElementContent element={element} />
      {selected ? <>
        {!isVerticalLine ? <span data-resize-handle="true" onPointerDown={(event) => resize('right', event)} className="absolute right-0 top-1/2 h-8 w-2 -translate-y-1/2 cursor-ew-resize bg-[#006B3F]" /> : null}
        {!isHorizontalLine ? <span data-resize-handle="true" onPointerDown={(event) => resize('bottom', event)} className="absolute bottom-0 left-1/2 h-2 w-8 -translate-x-1/2 cursor-ns-resize bg-[#006B3F]" /> : null}
        <span data-resize-handle="true" onPointerDown={(event) => resize('corner', event)} className="absolute bottom-0 right-0 size-4 cursor-nwse-resize bg-[#006B3F]" />
      </> : null}
    </div>
  );
}

function DesignerElementContent({ element }: { element: CvTemplateSectionDesignerElement }) {
  if (element.type === 'rectangle' || element.type === 'horizontalLine' || element.type === 'verticalLine' || element.type === 'line') return null;
  if (element.type === 'circle' && element.isField && element.previewValue.startsWith('http')) {
    return <img src={element.previewValue} alt="Preview" className="h-full w-full object-cover" />;
  }
  if (element.type === 'circle') return null;
  if (element.type === 'icon') return <div className="flex h-full w-full items-center justify-center"><IconGraphic name={element.iconName ?? 'linkedin'} className="h-[70%] w-[70%]" /></div>;
  if (element.type === 'textarea') return <div className="h-full w-full overflow-hidden p-2 leading-tight" dangerouslySetInnerHTML={{ __html: element.previewValue || '' }} />;
  const textNode = <div className="h-full w-full whitespace-pre-line p-2 leading-tight">{element.previewValue || element.label}</div>;
  return element.hyperlink ? <a href={element.hyperlink} className="block h-full w-full" target="_blank" rel="noreferrer">{textNode}</a> : textNode;
}

function PaletteIcon({ type }: { type: string }) {
  if (type === 'rectangle') return <Square className="size-4" />;
  if (type === 'circle') return <Circle className="size-4" />;
  if (type === 'horizontalLine' || type === 'verticalLine' || type === 'line') return <Minus className="size-4" />;
  if (type === 'textarea') return <TextCursorInput className="size-4" />;
  if (type === 'icon') return <LinkedinIcon className="size-4" />;
  return <Type className="size-4" />;
}

function IconGraphic({ name, className }: { name: IconName; className?: string }) {
  if (name === 'github') return <GithubIcon className={className} />;
  if (name === 'linkedin') return <LinkedinIcon className={className} />;
  if (name === 'phone') return <Phone className={className} />;
  if (name === 'location') return <MapPin className={className} />;
  if (name === 'email') return <Mail className={className} />;
  return <Globe className={className} />;
}

function FormatButton({ icon, label, active, onClick }: { icon?: ReactNode; label?: string; active?: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border p-2 text-[#202420] hover:border-[#006B3F] ${active ? 'border-[#006B3F] bg-[#E6F6F0]' : 'border-black/10 bg-[#F7F8F5]'}`}>{icon ?? <span className="text-xs font-black">{label}</span>}</button>;
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className={labelClass}>{label}<input className={inputClass} type="number" value={Math.round(value)} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}
