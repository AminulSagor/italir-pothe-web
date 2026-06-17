"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import {
  Bold,
  Circle,
  Globe,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Mail,
  MapPin,
  Minus,
  Phone,
  Save,
  Square,
  TextCursorInput,
  Trash2,
  Repeat,
  Type,
  X,
} from "lucide-react";
import type {
  CvBuilderElementType,
  CvBuilderThemeColorRole,
  CvTemplateFieldSchema,
  CvTemplateFieldType,
  CvTemplateSectionDesignerElement,
  CvTemplateSectionSchema,
} from "@/types/cv-template/cv_template_type";
import { fontOptions } from "./cv-builder-defaults";

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

const defaultCanvas = { width: 470, height: 620 };
const inputClass =
  "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-xs text-[#202420] outline-none focus:border-[#006B3F] disabled:cursor-not-allowed disabled:bg-black/5 disabled:text-black/35";
const labelClass =
  "space-y-1.5 text-[11px] font-black uppercase tracking-wide text-black/55";
const iconOptions = [
  "github",
  "linkedin",
  "weblink",
  "phone",
  "location",
  "email",
] as const;
const sectionPaletteItems: Array<{
  label: string;
  type: CvBuilderElementType;
}> = [
  { label: "Text", type: "text" },
  { label: "Textarea", type: "textarea" },
  { label: "List", type: "list" },
  { label: "Rectangle", type: "rectangle" },
  { label: "Circle", type: "circle" },
  { label: "Horizontal Line", type: "horizontalLine" },
  { label: "Vertical Line", type: "verticalLine" },
  { label: "Icon", type: "icon" },
];

type ResizeDirection = "top" | "right" | "bottom" | "left" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
type IconName = (typeof iconOptions)[number];

interface CvSectionDesignerDialogProps {
  open: boolean;
  section: CvTemplateSectionSchema | null;
  existingSections: CvTemplateSectionSchema[];
  primaryColor: string;
  accentColor: string;
  onClose: () => void;
  onSave: (section: CvTemplateSectionSchema) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isTextInputTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return ["input", "textarea", "select"].includes(tagName) || target.isContentEditable;
};

const getElementEffectiveSize = (element: CvTemplateSectionDesignerElement) => {
  const isHorizontalLine =
    element.type === "horizontalLine" || element.type === "line";
  const isVerticalLine = element.type === "verticalLine";
  const lineWidth = Math.max(1, element.style.borderWidth ?? 2);

  return {
    width: isVerticalLine ? lineWidth : element.width,
    height: isHorizontalLine ? lineWidth : element.type === "circle" ? element.width : element.height,
  };
};

const getElementBounds = (element: CvTemplateSectionDesignerElement) => {
  const size = getElementEffectiveSize(element);

  return {
    left: element.x,
    top: element.y,
    right: element.x + size.width,
    bottom: element.y + size.height,
  };
};

const isLeftResize = (direction: ResizeDirection) =>
  direction === "left" || direction === "topLeft" || direction === "bottomLeft";

const isRightResize = (direction: ResizeDirection) =>
  direction === "right" || direction === "topRight" || direction === "bottomRight";

const isTopResize = (direction: ResizeDirection) =>
  direction === "top" || direction === "topLeft" || direction === "topRight";

const isBottomResize = (direction: ResizeDirection) =>
  direction === "bottom" || direction === "bottomLeft" || direction === "bottomRight";

const estimateTextElementHeight = (element: CvTemplateSectionDesignerElement) => {
  if (element.type !== "text" && element.type !== "textarea" && element.type !== "list") {
    return element.height;
  }

  const fontSize = element.style.fontSize ?? (element.type === "text" ? 16 : 13);
  const lineHeight = element.style.lineHeight ?? 1.25;
  const content = element.previewValue
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<li>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
  const width = Math.max(24, element.width - 8);
  const charsPerLine = Math.max(8, Math.floor(width / Math.max(4, fontSize * 0.52)));
  const lines = (content ? content.split(/\n+/) : [""]).reduce((total, line) => {
    const length = line.trim().length || 1;
    return total + Math.max(1, Math.ceil(length / charsPerLine));
  }, 0);

  return Math.max(20, Math.ceil(lines * fontSize * lineHeight + 10));
};

const getFieldAwareElement = (
  element: CvTemplateSectionDesignerElement,
  flowOrder: number,
): CvTemplateSectionDesignerElement => ({
  ...element,
  height: element.type === "circle" ? element.width : element.height,
  contentFlow: {
    flowOrder,
    collapseWhenEmpty: Boolean(element.isField),
    reserveSpaceWhenEmpty: !element.isField,
    autoHeight:
      Boolean(element.isField) &&
      (element.type === "text" || element.type === "textarea" || element.type === "list" || element.type === "dynamicItems"),
    allowPageBreak: Boolean(element.isField),
    moveFollowingElements: Boolean(element.isField),
    growDirection: "down",
  },
});

const fitSectionToContent = (params: {
  elements: CvTemplateSectionDesignerElement[];
  canvasSize: { width: number; height: number };
}) => {
  const visibleElements = params.elements.filter(
    (element) => element.width > 0 && element.height > 0,
  );

  if (visibleElements.length === 0) {
    return {
      canvas: { width: 260, height: 160, unit: "px" as const },
      elements: [] as CvTemplateSectionDesignerElement[],
    };
  }

  const bounds = visibleElements.map(getElementBounds);
  const minX = Math.min(...bounds.map((item) => item.left));
  const minY = Math.min(...bounds.map((item) => item.top));
  const maxX = Math.max(...bounds.map((item) => item.right));
  const maxY = Math.max(...bounds.map((item) => item.bottom));
  const fittedWidth = Math.max(1, Math.round(maxX - minX));
  const fittedHeight = Math.max(1, Math.round(maxY - minY));
  const sortedElementIds = visibleElements
    .slice()
    .sort((first, second) => first.y - second.y || first.x - second.x)
    .map((element) => element.id);

  return {
    canvas: {
      width: fittedWidth,
      height: fittedHeight,
      unit: "px" as const,
    },
    elements: visibleElements.map((element) =>
      getFieldAwareElement(
        {
          ...element,
          x: Math.round(element.x - minX),
          y: Math.round(element.y - minY),
        },
        sortedElementIds.indexOf(element.id) + 1,
      ),
    ),
  };
};

const toCamelKey = (value: string) => {
  const words = value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) return `customSection${Date.now()}`;

  return words
    .map((word, index) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
      if (index === 0)
        return cleanWord.charAt(0).toLowerCase() + cleanWord.slice(1);
      return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    })
    .join("")
    .replace(/^([0-9])/, "section$1");
};

const makeUniqueSectionKey = (
  title: string,
  existingSections: CvTemplateSectionSchema[],
  currentKey?: string,
) => {
  const baseKey = toCamelKey(title);
  let nextKey = baseKey;
  let serial = 2;

  while (
    existingSections.some(
      (item) => item.key === nextKey && item.key !== currentKey,
    )
  ) {
    nextKey = `${baseKey}${serial}`;
    serial += 1;
  }

  return nextKey;
};

const toCamelFieldKey = (value: string) => {
  const words = value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) return "";

  return words
    .map((word, index) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
      if (index === 0)
        return cleanWord.charAt(0).toLowerCase() + cleanWord.slice(1);
      return cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    })
    .join("")
    .replace(/^([0-9])/, "field$1");
};

const makeSafeFieldKey = (value: string) =>
  toCamelFieldKey(value) || `field${Date.now()}`;

const makeUniqueFieldKey = (
  value: string,
  fields: CvTemplateFieldSchema[],
  currentKey?: string,
) => {
  const baseKey = makeSafeFieldKey(value);
  let nextKey = baseKey;
  let serial = 2;

  while (fields.some((field) => field.key === nextKey && field.key !== currentKey)) {
    nextKey = `${baseKey}${serial}`;
    serial += 1;
  }

  return nextKey;
};

const fieldTypeOptions: Array<{ label: string; value: CvTemplateFieldType }> = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Textarea", value: "textarea" },
  { label: "List", value: "list" },
  { label: "Date", value: "date" },
  { label: "Photo Upload", value: "photoUrl" },
  { label: "Website", value: "website" },
];

const getDefaultFieldType = (
  type: CvBuilderElementType,
): CvTemplateFieldType => {
  if (type === "circle") return "photoUrl";
  if (type === "textarea") return "textarea";
  if (type === "list") return "list";
  if (type === "dynamicItems") return "dynamicItems";
  if (type === "icon") return "website";
  return "text";
};

const getDefaultPreviewValue = (type: CvBuilderElementType) => {
  if (type === "circle") return "https://example.com/profile-photo.jpg";
  if (type === "textarea")
    return "<p>Long text block with <strong>selected</strong> formatting support.</p>";
  if (type === "list") return "First bullet item\nSecond bullet item\nThird bullet item";
  if (type === "dynamicItems")
    return "Job Title\nCompany - Country | Jan 2022 - Dec 2023\nDescribe this item in bullet points";
  if (type === "icon") return "";
  if (type === "horizontalLine" || type === "verticalLine" || type === "line")
    return "";
  return "Sample text";
};


const defaultDynamicItemFields = () => [
  { key: "title", label: "Title", type: "text" as const, required: false, placeholder: "Senior Software Developer" },
  { key: "subtitle", label: "Company / Institution", type: "text" as const, required: false, placeholder: "Company - Country" },
  { key: "dateRange", label: "Date range", type: "text" as const, required: false, placeholder: "Jan 2022 - Dec 2023" },
  { key: "description", label: "Description", type: "textarea" as const, required: false, placeholder: "Describe the role or achievement" },
];

const parseDynamicItemFields = (value: string) => {
  const rows = value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (rows.length === 0) return defaultDynamicItemFields();

  return rows.map((row, index) => {
    const [rawKey, rawLabel, rawType] = row.split('|').map((item) => item?.trim());
    const label = rawLabel || rawKey || `Item field ${index + 1}`;
    return {
      key: makeSafeFieldKey(rawKey || label),
      label,
      type: ((rawType || 'text') === 'textarea' ? 'textarea' : 'text') as 'text' | 'textarea',
      required: false,
      placeholder: label,
    };
  });
};

const serializeDynamicItemFields = (
  fields?: ReturnType<typeof defaultDynamicItemFields>,
) =>
  (fields?.length ? fields : defaultDynamicItemFields())
    .map((field) => `${field.key}|${field.label}|${field.type}`)
    .join('\n');

const isDynamicItemsType = (value?: string) => {
  const type = (value ?? '').trim().toLowerCase();
  return type === 'dynamicitems' || type === 'dynamic_items' || type === 'repeatable' || type === 'repeatableitems';
};

const toDynamicItemFieldSchemas = (fields: CvTemplateFieldSchema[]) =>
  fields.map((field) => ({
    key: field.key,
    label: field.label,
    type: (isDynamicItemsType(field.type) || field.type === 'photoUrl' || field.type === 'imageUrl'
      ? 'text'
      : field.type) as Exclude<CvTemplateFieldType, 'dynamicItems' | 'photoUrl' | 'imageUrl'>,
    required: field.required,
    placeholder: field.placeholder,
  }));

const dynamicItemFieldsToSectionFields = (
  itemFields: ReturnType<typeof toDynamicItemFieldSchemas>,
): CvTemplateFieldSchema[] =>
  itemFields.map((field) => ({
    key: field.key,
    label: field.label,
    type: field.type,
    required: field.required ?? false,
    placeholder: field.placeholder,
    options: undefined,
    listStyle: field.type === 'list' ? 'bullet' : undefined,
  }));

const normalizeHex = (value?: string) => (value ?? '').trim().toLowerCase();

const inferColorRole = (
  value: string | undefined,
  explicitRole: CvBuilderThemeColorRole | undefined,
  primaryColor: string,
  accentColor: string,
): CvBuilderThemeColorRole => {
  if (explicitRole) return explicitRole;
  const color = normalizeHex(value);
  if (color && color === normalizeHex(primaryColor)) return 'primary';
  if (color && color === normalizeHex(accentColor)) return 'accent';
  return 'custom';
};

const colorFromRole = (
  role: CvBuilderThemeColorRole,
  customColor: string | undefined,
  primaryColor: string,
  accentColor: string,
  fallbackColor: string,
) => {
  if (role === 'primary') return primaryColor;
  if (role === 'accent') return accentColor;
  return customColor && customColor !== 'transparent' ? customColor : fallbackColor;
};

const resolveThemeColor = (
  value: string | undefined,
  role: CvBuilderThemeColorRole | undefined,
  primaryColor: string,
  accentColor: string,
) => {
  if (role === 'primary') return primaryColor;
  if (role === 'accent') return accentColor;
  return value;
};

const createDesignerElement = (
  type: CvBuilderElementType,
  index: number,
  fontFamily: string,
  primaryColor: string,
  accentColor: string,
): CvTemplateSectionDesignerElement => {
  const isHorizontalLine = type === "horizontalLine" || type === "line";
  const isVerticalLine = type === "verticalLine";
  const isField = false;
  const fieldKey = makeSafeFieldKey(`${type}_${index + 1}`);
  const isFillThemeElement =
    isHorizontalLine || isVerticalLine || type === "rectangle" || type === "circle";
  const isBorderThemeElement =
    isHorizontalLine || isVerticalLine || type === "rectangle" || type === "circle";

  return {
    id: `${type}-${Date.now()}-${index}`,
    type,
    fieldKey,
    label: `${type === "circle" ? "Photo" : type === "textarea" ? "Long text" : type === "list" ? "List" : type === "dynamicItems" ? "Dynamic items" : type === "icon" ? "Icon" : type} ${index + 1}`,
    previewValue: getDefaultPreviewValue(type),
    isField,
    richTextFormat: type === "textarea" ? "html" : "plain",
    listStyle: type === "list" ? "bullet" : undefined,
    iconName: type === "icon" ? "linkedin" : undefined,
    x: 35 + (index % 3) * 18,
    y: 35 + (index % 5) * 40,
    width: isHorizontalLine
      ? 260
      : isVerticalLine
        ? 2
        : type === "circle"
          ? 96
          : type === "icon"
            ? 34
            : type === "dynamicItems"
              ? 300
              : 250,
    height: isHorizontalLine
      ? 2
      : isVerticalLine
        ? 200
        : type === "circle"
          ? 96
          : type === "icon"
            ? 34
            : type === "textarea" || type === "list" || type === "dynamicItems"
              ? 120
              : 62,
    zIndex: index + 1,
    style: {
      fontFamily,
      fontSize: type === "text" ? 16 : type === "textarea" || type === "list" || type === "dynamicItems" ? 13 : 12,
      fontWeight: type === "text" ? 700 : 500,
      color: "#111827",
      backgroundColor: isFillThemeElement ? primaryColor : "transparent",
      backgroundColorRole: isFillThemeElement ? "primary" : "custom",
      borderColor: isBorderThemeElement ? accentColor : "transparent",
      borderColorRole: isBorderThemeElement ? "accent" : "custom",
      borderWidth:
        isHorizontalLine || isVerticalLine
          ? 2
          : type === "rectangle" || type === "circle"
            ? 1
            : 0,
      borderRadius: type === "circle" ? 999 : 0,
    },
  };
};

export default function CvSectionDesignerDialog({
  open,
  section,
  existingSections,
  primaryColor,
  accentColor,
  onClose,
  onSave,
}: CvSectionDesignerDialogProps) {
  const [title, setTitle] = useState("Custom Section");
  const [sectionKey, setSectionKey] = useState("customSection");
  const [keyEdited, setKeyEdited] = useState(false);
  const [canvasSize, setCanvasSize] = useState(defaultCanvas);
  const [fields, setFields] = useState<CvTemplateFieldSchema[]>([]);
  const [isDynamicItemSection, setIsDynamicItemSection] = useState(false);
  const [elements, setElements] = useState<CvTemplateSectionDesignerElement[]>(
    [],
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [manualFieldElementIds, setManualFieldElementIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (!open) return;
    const currentTitle = section?.title ?? "Custom Section";
    const currentKey =
      section?.key ?? makeUniqueSectionKey(currentTitle, existingSections);
    const savedCanvas = section?.designerJson?.canvas ?? defaultCanvas;
    const currentCanvas = {
      width: Math.max(defaultCanvas.width, savedCanvas.width),
      height: Math.max(defaultCanvas.height, savedCanvas.height),
    };

    const dynamicField = section?.fields.find((field) => isDynamicItemsType(field.type));
    const dynamicItemConfig = section?.dynamicItem ?? section?.designerJson?.dynamicItem;
    const dynamicEnabled = Boolean(dynamicItemConfig?.enabled || dynamicField);
    const editableFields = dynamicEnabled && dynamicField?.itemFields?.length
      ? dynamicItemFieldsToSectionFields(dynamicField.itemFields)
      : section?.fields ?? [];

    setTitle(currentTitle);
    setSectionKey(currentKey);
    setKeyEdited(Boolean(section));
    setFields(editableFields);
    setIsDynamicItemSection(dynamicEnabled);
    setCanvasSize({ width: currentCanvas.width, height: currentCanvas.height });
    const designerElements = section?.designerJson?.elements ?? [];
    setElements(designerElements);
    setSelectedElementId(designerElements[0]?.id ?? null);
    setManualFieldElementIds(
      new Set(designerElements.filter((element) => element.isField).map((element) => element.id)),
    );
  }, [open, section, existingSections]);

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedElementId) ?? null,
    [elements, selectedElementId],
  );

  const selectedField = useMemo(
    () =>
      fields.find((field) => field.key === selectedElement?.fieldKey) ?? null,
    [fields, selectedElement?.fieldKey],
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!keyEdited) {
      setSectionKey(
        makeUniqueSectionKey(value, existingSections, section?.key),
      );
    }
  };

  const handleSectionKeyChange = (value: string) => {
    setKeyEdited(true);
    setSectionKey(toCamelKey(value));
  };

  const addElement = (type: CvBuilderElementType) => {
    const element = createDesignerElement(type, elements.length, "Inter", primaryColor, accentColor);
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
          listStyle: type === "list" ? "bullet" : undefined,
          repeatGap: type === "dynamicItems" ? 10 : undefined,
          itemFields: type === "dynamicItems" ? defaultDynamicItemFields() : undefined,
        },
      ]);
    }
    setSelectedElementId(element.id);
  };

  const clampElement = (
    element: CvTemplateSectionDesignerElement,
  ): CvTemplateSectionDesignerElement => {
    const width = element.type === "circle" ? element.width : element.width;
    const height = element.type === "circle" ? element.width : element.height;
    return {
      ...element,
      width,
      height,
      x: clamp(element.x, 0, Math.max(0, canvasSize.width - width)),
      y: clamp(element.y, 0, Math.max(0, canvasSize.height - height)),
    };
  };

  const updateElement = (updatedElement: CvTemplateSectionDesignerElement) => {
    setElements((current) =>
      current.map((element) =>
        element.id === updatedElement.id
          ? clampElement(updatedElement)
          : element,
      ),
    );
  };

  const updateField = (
    currentKey: string,
    updatedField: CvTemplateFieldSchema,
  ) => {
    setFields((current) =>
      current.map((field) => (field.key === currentKey ? updatedField : field)),
    );
    setElements((current) =>
      current.map((element) =>
        element.fieldKey === currentKey
          ? {
              ...element,
              fieldKey: updatedField.key,
              label: updatedField.label,
              previewValue: updatedField.placeholder ?? element.previewValue,
            }
          : element,
      ),
    );
  };

  const applyGeneratedFieldKey = (elementId: string) => {
    const element = elements.find((item) => item.id === elementId);
    if (!element?.isField) return;
    const field = fields.find((item) => item.key === element.fieldKey);
    if (!field) return;

    const manualKey = manualFieldElementIds.has(elementId);
    const nextKey =
      manualKey && field.key.trim()
        ? makeUniqueFieldKey(field.key, fields, field.key)
        : makeUniqueFieldKey(field.label || element.label, fields, field.key);

    if (nextKey === field.key) return;
    updateField(field.key, { ...field, key: nextKey });
  };

  const updateSelectedFieldLabel = (value: string) => {
    if (!selectedField) return;
    updateField(selectedField.key, {
      ...selectedField,
      label: value,
    });
  };

  const updateSelectedFieldKey = (value: string) => {
    if (!selectedElement || !selectedField) return;
    setManualFieldElementIds((current) => new Set(current).add(selectedElement.id));
    updateField(selectedField.key, {
      ...selectedField,
      key: value,
    });
  };

  const updateSelectedPreview = (value: string) => {
    if (!selectedElement) return;
    const nextElement = { ...selectedElement, previewValue: value };
    updateElement({
      ...nextElement,
      height: estimateTextElementHeight(nextElement),
    });
    if (selectedField) {
      updateField(selectedField.key, { ...selectedField, placeholder: value });
    }
  };

  const toggleFieldRegistration = (registered: boolean) => {
    if (!selectedElement) return;
    if (registered) {
      const field: CvTemplateFieldSchema = selectedField ?? {
        key: makeUniqueFieldKey(
          selectedElement.label || selectedElement.fieldKey,
          fields,
        ),
        label: selectedElement.label,
        type: getDefaultFieldType(selectedElement.type),
        required: false,
        placeholder: selectedElement.previewValue,
        listStyle: selectedElement.type === "list" ? (selectedElement.listStyle ?? "bullet") : undefined,
        repeatGap: selectedElement.type === "dynamicItems" ? 10 : undefined,
        itemFields: selectedElement.type === "dynamicItems" ? defaultDynamicItemFields() : undefined,
        options: selectedElement.type === "dynamicItems"
          ? defaultDynamicItemFields().map((item) => `${item.key}|${item.label}|${item.type}`)
          : undefined,
      };
      updateElement({ ...selectedElement, isField: true, fieldKey: field.key });
      if (!selectedField) setFields((current) => [...current, field]);
      setManualFieldElementIds((current) => {
        const next = new Set(current);
        next.delete(selectedElement.id);
        return next;
      });
      return;
    }

    updateElement({ ...selectedElement, isField: false });
    setFields((current) =>
      current.filter((field) => field.key !== selectedElement.fieldKey),
    );
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    setElements((current) =>
      current.filter((element) => element.id !== selectedElement.id),
    );
    setFields((current) =>
      current.filter((field) => field.key !== selectedElement.fieldKey),
    );
    setManualFieldElementIds((current) => {
      const next = new Set(current);
      next.delete(selectedElement.id);
      return next;
    });
    setSelectedElementId(null);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!selectedElementId || isTextInputTarget(event.target)) return;
      if (event.key !== "Delete" && event.key !== "Backspace") return;

      event.preventDefault();
      deleteSelectedElement();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, selectedElementId, selectedElement]);

  const updateCanvasSize = (nextSize: { width: number; height: number }) => {
    const width = clamp(Math.round(nextSize.width), 260, 1000);
    const height = clamp(Math.round(nextSize.height), 160, 1400);
    setCanvasSize({ width, height });
    setElements((current) =>
      current.map((element) => ({
        ...element,
        width:
          element.type === "verticalLine"
            ? element.width
            : Math.min(element.width, width),
        height:
          element.type === "horizontalLine"
            ? element.height
            : Math.min(element.height, height),
        x: clamp(element.x, 0, width - Math.min(element.width, width)),
        y: clamp(element.y, 0, height - Math.min(element.height, height)),
      })),
    );
  };

  const startCanvasResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = canvasSize.width;
    const startHeight = canvasSize.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      updateCanvasSize({
        width: startWidth + moveEvent.clientX - startX,
        height: startHeight + moveEvent.clientY - startY,
      });
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleSave = () => {
    const safeSectionKey = makeUniqueSectionKey(
      sectionKey || title,
      existingSections,
      section?.key,
    );
    const fittedSection = fitSectionToContent({ elements, canvasSize });
    const fieldKeys = new Set(
      fittedSection.elements
        .filter((element) => element.isField)
        .map((element) => element.fieldKey),
    );
    const registeredFields = fields.filter((field) => fieldKeys.has(field.key));
    const dynamicItemFieldKey = makeSafeFieldKey(`${safeSectionKey}Items`);
    const dynamicItemConfig = isDynamicItemSection
      ? {
          enabled: true,
          fieldKey: dynamicItemFieldKey,
          fieldLabel: title.trim() || "Custom Section",
          repeatGap: 12,
          itemFields: toDynamicItemFieldSchemas(registeredFields),
        }
      : undefined;
    const savedFields: CvTemplateFieldSchema[] = dynamicItemConfig
      ? [
          {
            key: dynamicItemConfig.fieldKey,
            label: dynamicItemConfig.fieldLabel,
            type: "dynamicItems",
            required: false,
            placeholder: undefined,
            repeatGap: dynamicItemConfig.repeatGap,
            itemFields: dynamicItemConfig.itemFields,
            options: dynamicItemConfig.itemFields.map(
              (item) => `${item.key}|${item.label}|${item.type}`,
            ),
          },
        ]
      : registeredFields;

    onSave({
      key: safeSectionKey,
      title: title.trim() || "Custom Section",
      required: false,
      fields: savedFields,
      dynamicItem: dynamicItemConfig,
      designerJson: {
        version: 3,
        canvas: fittedSection.canvas,
        contentFlow: {
          fitToContent: true,
          autoCropOnSave: true,
          collapseEmptyFields: true,
          autoGrowFields: true,
          autoCreatePages: true,
          overflowBehavior: "create_new_page",
          stackingStrategy: "absolute_with_reflow",
          baseWidth: fittedSection.canvas.width,
          baseHeight: fittedSection.canvas.height,
        },
        dynamicItem: dynamicItemConfig,
        elements: fittedSection.elements,
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5">
      <div className="relative grid h-[92vh] w-full max-w-7xl grid-cols-[330px_1fr_330px] overflow-hidden rounded-[30px] bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white p-2 text-black/60 shadow-lg hover:text-black"
        >
          <X className="size-5" />
        </button>

        <aside className="h-full space-y-4 overflow-y-auto border-r border-black/10 bg-[#FAFBF8] p-5 pr-4">
          <div className="pr-10">
            <h2 className="text-xl font-black text-[#202420]">
              Section Designer
            </h2>
            <p className="mt-1 text-xs leading-5 text-black/55">
              Design one reusable user-input section, save the whole canvas,
              then place it on the main CV page.
            </p>
          </div>

          <label className={labelClass}>
            Section title
            <input
              className={inputClass}
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
            />
          </label>
          <label className={labelClass}>
            Section key
            <input
              className={inputClass}
              value={sectionKey}
              onChange={(event) => handleSectionKeyChange(event.target.value)}
            />
          </label>

          <section className="rounded-3xl border border-black/5 bg-white p-4">
            <h3 className="mb-3 text-sm font-black text-[#202420]">
              Canvas size
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <NumberInput
                label="Width"
                value={canvasSize.width}
                onChange={(value) =>
                  updateCanvasSize({ ...canvasSize, width: value })
                }
              />
              <NumberInput
                label="Height"
                value={canvasSize.height}
                onChange={(value) =>
                  updateCanvasSize({ ...canvasSize, height: value })
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-4">
            <h3 className="mb-3 text-sm font-black text-[#202420]">
              Components
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {sectionPaletteItems.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => addElement(item.type)}
                  className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[#F7F8F5] p-3 text-left text-xs font-bold text-[#202420] hover:border-[#006B3F] hover:bg-[#E6F6F0]"
                >
                  <PaletteIcon type={item.type} />
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-4">
            <h3 className="text-sm font-black text-[#202420]">
              Registered Fields
            </h3>
            <p className="mt-1 text-xs leading-5 text-black/55">
              Only checked components become Flutter form fields. Text, textarea and photo circles are
              checked automatically.
            </p>
            <div className="mt-3 space-y-2">
              {fields.length === 0 ? (
                <div className="rounded-2xl bg-[#F7F8F5] p-3 text-xs font-bold text-black/45">
                  No fields registered yet.
                </div>
              ) : (
                fields.map((field) => (
                  <button
                    key={field.key}
                    type="button"
                    onClick={() =>
                      setSelectedElementId(
                        elements.find(
                          (element) => element.fieldKey === field.key,
                        )?.id ?? null,
                      )
                    }
                    className="w-full rounded-2xl border border-black/10 bg-[#F7F8F5] p-3 text-left text-xs"
                  >
                    <span className="block font-black text-[#202420]">
                      {field.label}
                    </span>
                    <span className="mt-1 block text-black/50">
                      {field.key} · {field.type}
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>
        </aside>

        <main className="h-full overflow-auto bg-[#E9E9E2] p-6">
          <div
            className="mx-auto rounded-3xl bg-white p-10 shadow-xl"
            style={{ width: canvasSize.width + 96, minHeight: canvasSize.height + 96 }}
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-black/10 bg-white"
              style={{ width: canvasSize.width, height: canvasSize.height }}
            >
              {elements
                .slice()
                .sort((first, second) => first.zIndex - second.zIndex)
                .map((element) => (
                  <DesignerElement
                    key={element.id}
                    canvasSize={canvasSize}
                    element={element}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    selected={selectedElementId === element.id}
                    onSelect={setSelectedElementId}
                    onChange={updateElement}
                  />
                ))}
              <span
                data-resize-handle="true"
                onPointerDown={startCanvasResize}
                className="absolute bottom-0 right-0 size-5 cursor-nwse-resize rounded-tl-xl border border-black/20 bg-white/90 shadow-sm"
                title="Resize section canvas"
              />
            </div>
          </div>
        </main>

        <aside className="h-full space-y-4 overflow-y-auto border-l border-black/10 bg-[#FAFBF8] p-5 pt-14">
          <h3 className="text-sm font-black text-[#202420]">
            Selected Component
          </h3>
          {selectedElement ? (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-3 text-xs font-black text-[#202420]">
                {selectedElement.label}
              </div>
              <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-xs font-black text-[#202420]">
                <input
                  type="checkbox"
                  checked={Boolean(selectedElement.isField)}
                  onChange={(event) =>
                    toggleFieldRegistration(event.target.checked)
                  }
                />
                Register as user input field
              </label>
              <label className="flex items-start gap-2 rounded-2xl bg-white p-3 text-xs font-black text-[#202420]">
                <input
                  type="checkbox"
                  checked={isDynamicItemSection}
                  onChange={(event) => setIsDynamicItemSection(event.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Register this section as a dynamic item
                  <span className="mt-1 block text-[11px] font-semibold leading-4 text-black/45">
                    The full section design repeats in Flutter when the user taps Add item.
                  </span>
                </span>
              </label>

              <label className={labelClass}>
                Field key
                <input
                  disabled={!selectedElement.isField || !selectedField}
                  className={inputClass}
                  value={selectedField?.key ?? selectedElement.fieldKey}
                  onChange={(event) => updateSelectedFieldKey(event.target.value)}
                  onBlur={() => applyGeneratedFieldKey(selectedElement.id)}
                />
              </label>
              <label className={labelClass}>
                Field label
                <input
                  disabled={!selectedElement.isField || !selectedField}
                  className={inputClass}
                  value={selectedField?.label ?? selectedElement.label}
                  onChange={(event) => updateSelectedFieldLabel(event.target.value)}
                  onBlur={() => applyGeneratedFieldKey(selectedElement.id)}
                />
              </label>
              <label className={labelClass}>
                Field type
                <select
                  disabled={!selectedElement.isField || !selectedField}
                  className={inputClass}
                  value={
                    selectedField?.type ??
                    getDefaultFieldType(selectedElement.type)
                  }
                  onChange={(event) =>
                    selectedField
                      ? updateField(selectedField.key, {
                          ...selectedField,
                          type: event.target.value as CvTemplateFieldType,
                        })
                      : undefined
                  }
                >
                  {fieldTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {selectedElement.type === "text" ? (
                <NormalTextInspector
                  element={selectedElement}
                  onChange={updateElement}
                  onTextChange={updateSelectedPreview}
                />
              ) : null}

              {selectedElement.type === "textarea" ? (
                <RichTextareaInspector
                  element={selectedElement}
                  onChange={updateElement}
                  onTextChange={updateSelectedPreview}
                />
              ) : null}

              {selectedElement.type === "list" ? (
                <ListInspector
                  element={selectedElement}
                  field={selectedField}
                  onChange={updateElement}
                  onFieldChange={(field) =>
                    selectedField ? updateField(selectedField.key, field) : undefined
                  }
                  onTextChange={updateSelectedPreview}
                />
              ) : null}

              {selectedElement.type === "dynamicItems" ? (
                <DynamicItemsInspector
                  element={selectedElement}
                  field={selectedField}
                  onChange={updateElement}
                  onFieldChange={(field) =>
                    selectedField ? updateField(selectedField.key, field) : undefined
                  }
                  onTextChange={updateSelectedPreview}
                />
              ) : null}

              {selectedElement.type === "circle" && selectedElement.isField ? (
                <label className={labelClass}>
                  Image URL preview
                  <input
                    className={inputClass}
                    value={selectedElement.previewValue}
                    onChange={(event) =>
                      updateSelectedPreview(event.target.value)
                    }
                  />
                </label>
              ) : null}

              {selectedElement.type === "icon" ? (
                <section className="rounded-3xl border border-black/5 bg-white p-3">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-black/55">
                    Icon
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() =>
                          updateElement({ ...selectedElement, iconName })
                        }
                        className={`flex h-10 items-center justify-center rounded-xl border text-[#202420] ${selectedElement.iconName === iconName ? "border-[#006B3F] bg-[#E6F6F0]" : "border-black/10 bg-[#F7F8F5]"}`}
                      >
                        <IconGraphic name={iconName} className="size-4" />
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <NumberInput
                      label="Icon size"
                      value={selectedElement.style.fontSize ?? Math.min(selectedElement.width, selectedElement.height)}
                      onChange={(value) =>
                        updateElement({
                          ...selectedElement,
                          style: { ...selectedElement.style, fontSize: value },
                        })
                      }
                    />
                  </div>
                </section>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                <NumberInput
                  label="X"
                  value={selectedElement.x}
                  onChange={(value) =>
                    updateElement({
                      ...selectedElement,
                      x: clamp(
                        value,
                        0,
                        canvasSize.width - selectedElement.width,
                      ),
                    })
                  }
                />
                <NumberInput
                  label="Y"
                  value={selectedElement.y}
                  onChange={(value) =>
                    updateElement({
                      ...selectedElement,
                      y: clamp(
                        value,
                        0,
                        canvasSize.height - selectedElement.height,
                      ),
                    })
                  }
                />
                <NumberInput
                  label="W"
                  value={selectedElement.width}
                  onChange={(value) =>
                    updateElement(
                      selectedElement.type === "circle"
                        ? { ...selectedElement, width: value, height: value }
                        : { ...selectedElement, width: value },
                    )
                  }
                />
                <NumberInput
                  label="H"
                  value={selectedElement.height}
                  onChange={(value) =>
                    updateElement(
                      selectedElement.type === "circle"
                        ? { ...selectedElement, width: value, height: value }
                        : { ...selectedElement, height: value },
                    )
                  }
                />
                <NumberInput
                  label="Layer"
                  value={selectedElement.zIndex}
                  onChange={(value) =>
                    updateElement({ ...selectedElement, zIndex: value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {selectedElement.type === "text" ||
                selectedElement.type === "textarea" ||
                selectedElement.type === "list" ||
                selectedElement.type === "dynamicItems" ||
                selectedElement.type === "icon" ? (
                  <ThemeColorControl
                    label="Text / icon"
                    role={inferColorRole(
                      selectedElement.style.color,
                      selectedElement.style.colorRole,
                      primaryColor,
                      accentColor,
                    )}
                    color={selectedElement.style.color}
                    fallbackColor="#111827"
                    onRoleChange={(role) =>
                      updateElement({
                        ...selectedElement,
                        style: {
                          ...selectedElement.style,
                          colorRole: role,
                          color: colorFromRole(
                            role,
                            selectedElement.style.color,
                            primaryColor,
                            accentColor,
                            "#111827",
                          ),
                        },
                      })
                    }
                    onColorChange={(color) =>
                      updateElement({
                        ...selectedElement,
                        style: {
                          ...selectedElement.style,
                          colorRole: "custom",
                          color,
                        },
                      })
                    }
                    onClear={() =>
                      updateElement({
                        ...selectedElement,
                        style: {
                          ...selectedElement.style,
                          colorRole: "custom",
                          color: "#111827",
                        },
                      })
                    }
                  />
                ) : null}
                {selectedElement.type !== "horizontalLine" &&
                selectedElement.type !== "verticalLine" ? (
                  <ThemeColorControl
                    label="Fill"
                    role={inferColorRole(
                      selectedElement.style.backgroundColor,
                      selectedElement.style.backgroundColorRole,
                      primaryColor,
                      accentColor,
                    )}
                    color={selectedElement.style.backgroundColor}
                    fallbackColor="#ffffff"
                    onRoleChange={(role) =>
                      updateElement({
                        ...selectedElement,
                        style: {
                          ...selectedElement.style,
                          backgroundColorRole: role,
                          backgroundColor: colorFromRole(
                            role,
                            selectedElement.style.backgroundColor,
                            primaryColor,
                            accentColor,
                            '#ffffff',
                          ),
                        },
                      })
                    }
                    onColorChange={(color) =>
                      updateElement({
                        ...selectedElement,
                        style: {
                          ...selectedElement.style,
                          backgroundColorRole: 'custom',
                          backgroundColor: color,
                        },
                      })
                    }
                    onClear={() =>
                      updateElement({
                        ...selectedElement,
                        style: {
                          ...selectedElement.style,
                          backgroundColorRole: 'custom',
                          backgroundColor: 'transparent',
                        },
                      })
                    }
                  />
                ) : null}
                <ThemeColorControl
                  label="Border / line"
                  role={inferColorRole(
                    selectedElement.style.borderColor,
                    selectedElement.style.borderColorRole,
                    primaryColor,
                    accentColor,
                  )}
                  color={selectedElement.style.borderColor}
                  fallbackColor="#111827"
                  onRoleChange={(role) => {
                    const color = colorFromRole(
                      role,
                      selectedElement.style.borderColor,
                      primaryColor,
                      accentColor,
                      '#111827',
                    );
                    updateElement({
                      ...selectedElement,
                      style: {
                        ...selectedElement.style,
                        borderColorRole: role,
                        borderColor: color,
                        backgroundColorRole:
                          selectedElement.type === "horizontalLine" ||
                          selectedElement.type === "verticalLine"
                            ? role
                            : selectedElement.style.backgroundColorRole,
                        backgroundColor:
                          selectedElement.type === "horizontalLine" ||
                          selectedElement.type === "verticalLine"
                            ? color
                            : selectedElement.style.backgroundColor,
                      },
                    });
                  }}
                  onColorChange={(color) =>
                    updateElement({
                      ...selectedElement,
                      style: {
                        ...selectedElement.style,
                        borderColorRole: 'custom',
                        borderColor: color,
                        backgroundColorRole:
                          selectedElement.type === "horizontalLine" ||
                          selectedElement.type === "verticalLine"
                            ? 'custom'
                            : selectedElement.style.backgroundColorRole,
                        backgroundColor:
                          selectedElement.type === "horizontalLine" ||
                          selectedElement.type === "verticalLine"
                            ? color
                            : selectedElement.style.backgroundColor,
                      },
                    })
                  }
                  onClear={() =>
                    updateElement({
                      ...selectedElement,
                      style: {
                        ...selectedElement.style,
                        borderColorRole: 'custom',
                        borderColor: 'transparent',
                        backgroundColorRole:
                          selectedElement.type === "horizontalLine" ||
                          selectedElement.type === "verticalLine"
                            ? 'custom'
                            : selectedElement.style.backgroundColorRole,
                        backgroundColor:
                          selectedElement.type === "horizontalLine" ||
                          selectedElement.type === "verticalLine"
                            ? 'transparent'
                            : selectedElement.style.backgroundColor,
                      },
                    })
                  }
                />
                <NumberInput
                  label="Border"
                  value={selectedElement.style.borderWidth ?? 0}
                  onChange={(value) =>
                    updateElement({
                      ...selectedElement,
                      style: { ...selectedElement.style, borderWidth: value },
                    })
                  }
                />
              </div>

              {selectedElement.type !== "horizontalLine" &&
              selectedElement.type !== "verticalLine" &&
              selectedElement.type !== "line" &&
              selectedElement.type !== "circle" ? (
                <NumberInput
                  label="Radius"
                  value={selectedElement.style.borderRadius ?? 0}
                  onChange={(value) =>
                    updateElement({
                      ...selectedElement,
                      style: { ...selectedElement.style, borderRadius: value },
                    })
                  }
                />
              ) : null}

              <button
                type="button"
                onClick={deleteSelectedElement}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600"
              >
                <Trash2 className="size-4" /> Delete Component
              </button>
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-3 text-xs leading-5 text-black/55">
              Select a section component to edit field registration, text, rich
              text, size, icon, and color.
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-full border border-black/10 text-sm font-black text-[#202420]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#006B3F] text-sm font-black text-white"
            >
              <Save className="size-4" /> Save Section
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AlignmentButtons({
  value,
  onChange,
}: {
  value?: "left" | "center" | "right" | "justify";
  onChange: (value: "left" | "center" | "right" | "justify") => void;
}) {
  const options: Array<{ label: string; value: "left" | "center" | "right" | "justify" }> = [
    { label: "L", value: "left" },
    { label: "C", value: "center" },
    { label: "R", value: "right" },
    { label: "J", value: "justify" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <FormatButton
          key={option.value}
          active={(value ?? "left") === option.value}
          label={option.label}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

function NormalTextInspector({
  element,
  onChange,
  onTextChange,
}: {
  element: CvTemplateSectionDesignerElement;
  onChange: (element: CvTemplateSectionDesignerElement) => void;
  onTextChange: (value: string) => void;
}) {
  const updateStyle = (
    style: Partial<CvTemplateSectionDesignerElement["style"]>,
  ) => onChange({ ...element, style: { ...element.style, ...style } });

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        <FormatButton
          active={element.style.fontWeight === 800}
          icon={<Bold className="size-4" />}
          onClick={() =>
            updateStyle({
              fontWeight: element.style.fontWeight === 800 ? 500 : 800,
            })
          }
        />
        <FormatButton
          active={element.style.fontStyle === "italic"}
          icon={<Italic className="size-4" />}
          onClick={() =>
            updateStyle({
              fontStyle:
                element.style.fontStyle === "italic" ? "normal" : "italic",
            } as Partial<CvTemplateSectionDesignerElement["style"]>)
          }
        />
      </div>
      <div className="mb-2">
        <AlignmentButtons
          value={element.style.textAlign}
          onChange={(textAlign) => updateStyle({ textAlign })}
        />
      </div>
      <label className={labelClass}>
        Text
        <input
          className={inputClass}
          value={element.previewValue}
          onChange={(event) => onTextChange(event.target.value)}
        />
      </label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <NumberInput
          label="Font size"
          value={element.style.fontSize ?? 16}
          onChange={(value) => updateStyle({ fontSize: value })}
        />
        <label className={labelClass}>
          Font
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
      </div>
      <LinkUrlControl
        value={element.hyperlink ?? ""}
        onChange={(hyperlink) => onChange({ ...element, hyperlink })}
      />
    </section>
  );
}


function ListInspector({
  element,
  field,
  onChange,
  onFieldChange,
  onTextChange,
}: {
  element: CvTemplateSectionDesignerElement;
  field: CvTemplateFieldSchema | null;
  onChange: (element: CvTemplateSectionDesignerElement) => void;
  onFieldChange: (field: CvTemplateFieldSchema) => void;
  onTextChange: (value: string) => void;
}) {
  const updateStyle = (
    style: Partial<CvTemplateSectionDesignerElement["style"]>,
  ) => onChange({ ...element, style: { ...element.style, ...style } });

  const updateListStyle = (listStyle: "bullet" | "number") => {
    onChange({ ...element, listStyle });
    if (field) onFieldChange({ ...field, type: "list", listStyle });
  };

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        <FormatButton
          active={element.style.fontWeight === 800}
          icon={<Bold className="size-4" />}
          onClick={() =>
            updateStyle({
              fontWeight: element.style.fontWeight === 800 ? 500 : 800,
            })
          }
        />
        <FormatButton
          active={element.style.fontStyle === "italic"}
          icon={<Italic className="size-4" />}
          onClick={() =>
            updateStyle({
              fontStyle:
                element.style.fontStyle === "italic" ? "normal" : "italic",
            } as Partial<CvTemplateSectionDesignerElement["style"]>)
          }
        />
        <FormatButton
          active={(element.listStyle ?? field?.listStyle ?? "bullet") === "bullet"}
          icon={<List className="size-4" />}
          onClick={() => updateListStyle("bullet")}
        />
        <FormatButton
          active={(element.listStyle ?? field?.listStyle) === "number"}
          icon={<ListOrdered className="size-4" />}
          onClick={() => updateListStyle("number")}
        />
      </div>
      <div className="mb-2">
        <AlignmentButtons
          value={element.style.textAlign}
          onChange={(textAlign) => updateStyle({ textAlign })}
        />
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <NumberInput
          label="Font size"
          value={element.style.fontSize ?? 13}
          onChange={(value) => updateStyle({ fontSize: value })}
        />
        <label className={labelClass}>
          Font
          <select
            className={inputClass}
            value={element.style.fontFamily ?? "Inter"}
            onChange={(event) => updateStyle({ fontFamily: event.target.value })}
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={labelClass}>
        List items
        <textarea
          className="min-h-32 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs normal-case text-[#202420] outline-none focus:border-[#006B3F]"
          value={element.previewValue}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Each new line becomes one bullet or number item"
        />
      </label>
      <p className="mt-2 text-[11px] font-semibold normal-case leading-5 text-black/50">
        Press Enter for a new item. Choose bullet or numbered style above.
      </p>
    </section>
  );
}

function DynamicItemsInspector({
  element,
  field,
  onChange,
  onFieldChange,
  onTextChange,
}: {
  element: CvTemplateSectionDesignerElement;
  field: CvTemplateFieldSchema | null;
  onChange: (element: CvTemplateSectionDesignerElement) => void;
  onFieldChange: (field: CvTemplateFieldSchema) => void;
  onTextChange: (value: string) => void;
}) {
  const updateStyle = (
    style: Partial<CvTemplateSectionDesignerElement["style"]>,
  ) => onChange({ ...element, style: { ...element.style, ...style } });

  const itemFieldText = serializeDynamicItemFields(field?.itemFields as ReturnType<typeof defaultDynamicItemFields> | undefined);

  const updateItemFields = (value: string) => {
    if (!field) return;
    onFieldChange({
      ...field,
      type: "dynamicItems",
      itemFields: parseDynamicItemFields(value),
      options: parseDynamicItemFields(value).map(
        (item) => `${item.key}|${item.label}|${item.type}`,
      ),
    });
  };

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        <FormatButton
          active={element.style.fontWeight === 800}
          icon={<Bold className="size-4" />}
          onClick={() =>
            updateStyle({
              fontWeight: element.style.fontWeight === 800 ? 500 : 800,
            })
          }
        />
        <FormatButton
          active={element.style.fontStyle === "italic"}
          icon={<Italic className="size-4" />}
          onClick={() =>
            updateStyle({
              fontStyle:
                element.style.fontStyle === "italic" ? "normal" : "italic",
            } as Partial<CvTemplateSectionDesignerElement["style"]>)
          }
        />
      </div>
      <div className="mb-2">
        <AlignmentButtons
          value={element.style.textAlign}
          onChange={(textAlign) => updateStyle({ textAlign })}
        />
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <NumberInput
          label="Font size"
          value={element.style.fontSize ?? 13}
          onChange={(value) => updateStyle({ fontSize: value })}
        />
        <NumberInput
          label="Repeat gap"
          value={field?.repeatGap ?? 10}
          onChange={(value) => field ? onFieldChange({ ...field, repeatGap: value }) : undefined}
        />
      </div>
      <label className={labelClass}>
        Item design preview
        <textarea
          className="min-h-24 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs normal-case text-[#202420] outline-none focus:border-[#006B3F]"
          value={element.previewValue}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Preview for one repeated item"
        />
      </label>
      <label className={`${labelClass} mt-2`}>
        Required fields for each item
        <textarea
          className="min-h-32 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs normal-case text-[#202420] outline-none focus:border-[#006B3F]"
          value={itemFieldText}
          onChange={(event) => updateItemFields(event.target.value)}
          placeholder="title|Title|text\nsubtitle|Company|text\ndescription|Description|textarea"
        />
      </label>
      <p className="mt-2 text-[11px] font-semibold normal-case leading-5 text-black/50">
        Flutter will show Add item. Each added item repeats this component style in the final CV.
      </p>
    </section>
  );
}

function RichTextareaInspector({
  element,
  onChange,
  onTextChange,
}: {
  element: CvTemplateSectionDesignerElement;
  onChange: (element: CvTemplateSectionDesignerElement) => void;
  onTextChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState(element.hyperlink ?? "");

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== element.previewValue
    ) {
      editorRef.current.innerHTML = element.previewValue || "";
    }
  }, [element.id, element.previewValue]);

  const syncEditorValue = () => {
    window.setTimeout(
      () => onTextChange(editorRef.current?.innerHTML ?? ""),
      0,
    );
  };

  const placeCursorAtEnd = (node: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const applyCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value);
    syncEditorValue();
  };

  const applyListCommand = (ordered: boolean) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    document.execCommand("styleWithCSS", false, "true");
    const command = ordered ? "insertOrderedList" : "insertUnorderedList";
    const fallbackHtml = ordered
      ? "<ol><li>List item</li></ol>"
      : "<ul><li>List item</li></ul>";

    if (!editor.innerText.trim()) {
      editor.innerHTML = fallbackHtml;
      placeCursorAtEnd(editor);
      onTextChange(editor.innerHTML);
      return;
    }

    const applied = document.execCommand(command, false);
    if (!applied) {
      document.execCommand("insertHTML", false, fallbackHtml);
    }
    syncEditorValue();
  };

  const applyAlignment = (textAlign: "left" | "center" | "right" | "justify") => {
    const commandMap = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull",
    } as const;
    onChange({ ...element, style: { ...element.style, textAlign } });
    applyCommand(commandMap[textAlign]);
  };

  const applyLink = (url: string) => {
    if (!url.trim()) return;
    applyCommand("createLink", url.trim());
  };

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-3">
      <div className="mb-2 flex flex-wrap gap-2">
        <FormatButton
          icon={<Bold className="size-4" />}
          onClick={() => applyCommand("bold")}
        />
        <FormatButton
          icon={<Italic className="size-4" />}
          onClick={() => applyCommand("italic")}
        />
        <FormatButton
          label="•"
          onClick={() => applyListCommand(false)}
        />
        <FormatButton
          label="1."
          onClick={() => applyListCommand(true)}
        />
        <FormatButton
          icon={<LinkIcon className="size-4" />}
          onClick={() => {
            setPendingLink(element.hyperlink ?? "");
            setLinkDialogOpen(true);
          }}
        />
      </div>
      <div className="mb-2">
        <AlignmentButtons
          value={element.style.textAlign}
          onChange={applyAlignment}
        />
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <NumberInput
          label="Font size"
          value={element.style.fontSize ?? 13}
          onChange={(value) =>
            onChange({
              ...element,
              style: { ...element.style, fontSize: value },
            })
          }
        />
        <label className={labelClass}>
          Font
          <select
            className={inputClass}
            value={element.style.fontFamily ?? "Inter"}
            onChange={(event) =>
              onChange({
                ...element,
                style: { ...element.style, fontFamily: event.target.value },
              })
            }
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={labelClass}>Textarea / preview value</label>
      <div
        ref={editorRef}
        className="min-h-32 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs normal-case text-[#202420] outline-none focus:border-[#006B3F] [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        contentEditable
        suppressContentEditableWarning
        style={{ textAlign: element.style.textAlign ?? "left" }}
        onInput={(event: FormEvent<HTMLDivElement>) =>
          onTextChange(event.currentTarget.innerHTML)
        }
      />
      <LinkUrlControl
        value={element.hyperlink ?? ""}
        onChange={(hyperlink) => onChange({ ...element, hyperlink })}
      />
      {linkDialogOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-2xl">
            <h4 className="text-base font-black text-[#202420]">Add hyperlink</h4>
            <p className="mt-1 text-xs leading-5 text-black/55">Enter the URL that should be attached to the selected text.</p>
            <input
              className={`${inputClass} mt-4`}
              value={pendingLink}
              onChange={(event) => setPendingLink(event.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setLinkDialogOpen(false)} className="rounded-full border border-black/10 px-4 py-2 text-xs font-black text-black/60">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({ ...element, hyperlink: pendingLink.trim() });
                  applyLink(pendingLink);
                  setLinkDialogOpen(false);
                }}
                className="rounded-full bg-[#006B3F] px-4 py-2 text-xs font-black text-white"
              >
                Apply link
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function DesignerElement({
  canvasSize,
  element,
  primaryColor,
  accentColor,
  selected,
  onSelect,
  onChange,
}: {
  canvasSize: { width: number; height: number };
  element: CvTemplateSectionDesignerElement;
  primaryColor: string;
  accentColor: string;
  selected: boolean;
  onSelect: (id: string) => void;
  onChange: (element: CvTemplateSectionDesignerElement) => void;
}) {
  const isHorizontalLine =
    element.type === "horizontalLine" || element.type === "line";
  const isVerticalLine = element.type === "verticalLine";
  const lineWidth = Math.max(1, element.style.borderWidth ?? 2);
  const resolvedTextColor = resolveThemeColor(
    element.style.color,
    element.style.colorRole,
    primaryColor,
    accentColor,
  );
  const resolvedFillColor = resolveThemeColor(
    element.style.backgroundColor,
    element.style.backgroundColorRole,
    primaryColor,
    accentColor,
  );
  const resolvedBorderColor = resolveThemeColor(
    element.style.borderColor,
    element.style.borderColorRole,
    primaryColor,
    accentColor,
  );
  const style: CSSProperties = {
    left: element.x,
    top: element.y,
    width: isVerticalLine ? lineWidth : element.width,
    height: isHorizontalLine ? lineWidth : element.height,
    zIndex: element.zIndex,
    color: resolvedTextColor,
    backgroundColor:
      isHorizontalLine || isVerticalLine
        ? (resolvedBorderColor ?? "#111827")
        : resolvedFillColor,
    borderColor: resolvedBorderColor ?? "transparent",
    borderWidth:
      isHorizontalLine || isVerticalLine ? 0 : (element.style.borderWidth ?? 0),
    borderStyle: "solid",
    borderRadius:
      element.type === "circle" ? "9999px" : (element.style.borderRadius ?? 0),
    fontFamily: element.style.fontFamily,
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    fontStyle: element.style.fontStyle as CSSProperties["fontStyle"],
    textAlign: element.style.textAlign,
    overflow: selected ? "visible" : "hidden",
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event.button !== 0 ||
      (event.target as HTMLElement).dataset.resizeHandle === "true"
    )
      return;
    event.preventDefault();
    onSelect(element.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = element.x;
    const startTop = element.y;
    const onPointerMove = (moveEvent: PointerEvent) => {
      const nextX = clamp(
        Math.round(startLeft + moveEvent.clientX - startX),
        0,
        canvasSize.width - element.width,
      );
      const nextY = clamp(
        Math.round(startTop + moveEvent.clientY - startY),
        0,
        canvasSize.height - element.height,
      );
      onChange({ ...element, x: nextX, y: nextY });
    };
    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const resize = (
    direction: ResizeDirection,
    event: ReactPointerEvent<HTMLSpanElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(element.id);
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = element.x;
    const startTop = element.y;
    const startWidth = element.width;
    const startHeight = element.height;
    const startRight = startLeft + startWidth;
    const startBottom = startTop + startHeight;
    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const minWidth = element.type === "circle" ? 32 : isVerticalLine ? lineWidth : isHorizontalLine ? 16 : 32;
      const minHeight = element.type === "circle" ? 32 : isHorizontalLine ? lineWidth : isVerticalLine ? 16 : 20;
      let nextLeft = startLeft;
      let nextTop = startTop;
      let nextRight = startRight;
      let nextBottom = startBottom;

      if (isLeftResize(direction)) nextLeft = clamp(startLeft + dx, 0, startRight - minWidth);
      if (isRightResize(direction)) nextRight = clamp(startRight + dx, startLeft + minWidth, canvasSize.width);
      if (isTopResize(direction)) nextTop = clamp(startTop + dy, 0, startBottom - minHeight);
      if (isBottomResize(direction)) nextBottom = clamp(startBottom + dy, startTop + minHeight, canvasSize.height);

      if (isHorizontalLine) {
        onChange({
          ...element,
          x: Math.round(nextLeft),
          width: clamp(Math.round(nextRight - nextLeft), 16, canvasSize.width - nextLeft),
          height: lineWidth,
        });
        return;
      }
      if (isVerticalLine) {
        onChange({
          ...element,
          y: Math.round(nextTop),
          width: lineWidth,
          height: clamp(Math.round(nextBottom - nextTop), 16, canvasSize.height - nextTop),
        });
        return;
      }
      if (element.type === "circle") {
        const proposedSize = Math.max(nextRight - nextLeft, nextBottom - nextTop, 32);
        const maxSize = Math.min(canvasSize.width - nextLeft, canvasSize.height - nextTop);
        const size = clamp(Math.round(proposedSize), 32, maxSize);
        onChange({ ...element, x: Math.round(nextLeft), y: Math.round(nextTop), width: size, height: size });
        return;
      }

      const resizedElement = {
        ...element,
        x: Math.round(nextLeft),
        y: Math.round(nextTop),
        width: clamp(Math.round(nextRight - nextLeft), 32, canvasSize.width - nextLeft),
        height: clamp(Math.round(nextBottom - nextTop), 20, canvasSize.height - nextTop),
      };
      onChange({
        ...resizedElement,
        height: estimateTextElementHeight(resizedElement),
      });
    };
    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const resizeHandles: Array<{ direction: ResizeDirection; className: string }> = [
    { direction: "topLeft", className: "absolute -left-2 -top-2 z-20 size-4 cursor-nwse-resize bg-transparent" },
    { direction: "top", className: "absolute -top-1 left-0 z-10 h-2 w-full cursor-ns-resize bg-[#006B3F]/10 hover:bg-[#006B3F]/30" },
    { direction: "topRight", className: "absolute -right-2 -top-2 z-20 size-4 cursor-nesw-resize bg-transparent" },
    { direction: "right", className: "absolute -right-1 top-0 z-10 h-full w-2 cursor-ew-resize bg-[#006B3F]/10 hover:bg-[#006B3F]/30" },
    { direction: "bottomRight", className: "absolute -bottom-2 -right-2 z-20 size-4 cursor-nwse-resize bg-transparent" },
    { direction: "bottom", className: "absolute -bottom-1 left-0 z-10 h-2 w-full cursor-ns-resize bg-[#006B3F]/10 hover:bg-[#006B3F]/30" },
    { direction: "bottomLeft", className: "absolute -bottom-2 -left-2 z-20 size-4 cursor-nesw-resize bg-transparent" },
    { direction: "left", className: "absolute -left-1 top-0 z-10 h-full w-2 cursor-ew-resize bg-[#006B3F]/10 hover:bg-[#006B3F]/30" },
  ];

  return (
    <div
      onPointerDown={startDrag}
      className={`absolute cursor-move ${selected ? "ring-2 ring-[#006B3F] ring-offset-2" : ""}`}
      style={style}
    >
      <DesignerElementContent element={element} />
      {selected
        ? resizeHandles.map((handle) => {
            if (isHorizontalLine && (isTopResize(handle.direction) || isBottomResize(handle.direction))) return null;
            if (isVerticalLine && (isLeftResize(handle.direction) || isRightResize(handle.direction))) return null;
            return (
              <span
                key={handle.direction}
                data-resize-handle="true"
                onPointerDown={(event) => resize(handle.direction, event)}
                className={handle.className}
              />
            );
          })
        : null}
    </div>
  );
}

function DesignerElementContent({
  element,
}: {
  element: CvTemplateSectionDesignerElement;
}) {
  if (
    element.type === "rectangle" ||
    element.type === "horizontalLine" ||
    element.type === "verticalLine" ||
    element.type === "line"
  )
    return null;
  if (
    element.type === "circle" &&
    element.isField &&
    element.previewValue.startsWith("http")
  ) {
    return (
      <img
        src={element.previewValue}
        alt="Preview"
        className="h-full w-full object-cover"
      />
    );
  }
  if (element.type === "circle") return null;
  if (element.type === "icon")
    return (
      <div className="flex h-full w-full items-center justify-center">
        <IconGraphic
          name={element.iconName ?? "linkedin"}
          className="shrink-0"
          style={{
            width: element.style.fontSize ?? Math.min(element.width, element.height) * 0.7,
            height: element.style.fontSize ?? Math.min(element.width, element.height) * 0.7,
          }}
        />
      </div>
    );
  if (element.type === "textarea")
    return (
      <div
        className="h-full w-full overflow-hidden p-1 leading-tight [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: element.previewValue || "" }}
      />
    );
  if (element.type === "list") {
    const items = element.previewValue
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
    const isNumberList = element.listStyle === "number";
    const ListTag = isNumberList ? "ol" : "ul";
    return (
      <ListTag
        className="h-full w-full overflow-hidden p-1 leading-tight"
        style={{
          listStylePosition: "inside",
          listStyleType: isNumberList ? "decimal" : "disc",
        }}
      >
        {items.length ? items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>) : <li>List item</li>}
      </ListTag>
    );
  }
  if (element.type === "dynamicItems")
    return (
      <div className="h-full w-full overflow-hidden whitespace-pre-line p-1 leading-tight">
        {element.previewValue || "Dynamic items preview"}
      </div>
    );
  const textNode = (
    <div className="h-full w-full whitespace-pre-line p-1 leading-tight">
      {element.previewValue || element.label}
    </div>
  );
  return element.hyperlink ? (
    <a
      href={element.hyperlink}
      className="block h-full w-full"
      target="_blank"
      rel="noreferrer"
    >
      {textNode}
    </a>
  ) : (
    textNode
  );
}

function PaletteIcon({ type }: { type: string }) {
  if (type === "rectangle") return <Square className="size-4" />;
  if (type === "circle") return <Circle className="size-4" />;
  if (type === "horizontalLine" || type === "verticalLine" || type === "line")
    return <Minus className="size-4" />;
  if (type === "textarea") return <TextCursorInput className="size-4" />;
  if (type === "list") return <List className="size-4" />;
  if (type === "dynamicItems") return <Repeat className="size-4" />;
  if (type === "icon") return <LinkedinIcon className="size-4" />;
  return <Type className="size-4" />;
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

function FormatButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon?: ReactNode;
  label?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`rounded-xl border p-2 text-[#202420] hover:border-[#006B3F] ${active ? "border-[#006B3F] bg-[#E6F6F0]" : "border-black/10 bg-[#F7F8F5]"}`}
    >
      {icon ?? <span className="text-xs font-black">{label}</span>}
    </button>
  );
}

function LinkUrlControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draftUrl, setDraftUrl] = useState(value);

  useEffect(() => {
    if (!open) setDraftUrl(value);
  }, [open, value]);

  return (
    <div className={`${labelClass} mt-2`}>
      Hyperlink
      <button
        type="button"
        onClick={() => {
          setDraftUrl(value);
          setOpen(true);
        }}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-black/10 bg-white px-3 text-xs normal-case text-[#202420] outline-none hover:border-[#006B3F]"
      >
        <span className="truncate text-left">{value || "Add URL link"}</span>
        <LinkIcon className="size-4 text-[#006B3F]" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-2xl">
            <h4 className="text-base font-black text-[#202420]">Hyperlink URL</h4>
            <p className="mt-1 text-xs leading-5 text-black/55">Set the URL for this component. Leave it empty to remove the link.</p>
            <input
              className={`${inputClass} mt-4`}
              value={draftUrl}
              onChange={(event) => setDraftUrl(event.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-black/10 px-4 py-2 text-xs font-black text-black/60">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(draftUrl.trim());
                  setOpen(false);
                }}
                className="rounded-full bg-[#006B3F] px-4 py-2 text-xs font-black text-white"
              >
                Save URL
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ThemeColorControl({
  label,
  role,
  color,
  fallbackColor,
  onRoleChange,
  onColorChange,
  onClear,
}: {
  label: string;
  role: CvBuilderThemeColorRole;
  color?: string;
  fallbackColor: string;
  onRoleChange: (role: CvBuilderThemeColorRole) => void;
  onColorChange: (color: string) => void;
  onClear: () => void;
}) {
  const colorValue = color === 'transparent' ? fallbackColor : (color ?? fallbackColor);

  return (
    <div className={labelClass}>
      {label}
      <select
        className={inputClass}
        value={role}
        onChange={(event) =>
          onRoleChange(event.target.value as CvBuilderThemeColorRole)
        }
      >
        <option value="primary">Primary</option>
        <option value="accent">Accent</option>
        <option value="custom">Custom</option>
      </select>
      {role === 'custom' ? (
        <div className="flex gap-2">
          <input
            className={`${inputClass} flex-1`}
            type="color"
            value={colorValue}
            onChange={(event) => onColorChange(event.target.value)}
          />
          <ClearColorButton label={`Clear ${label}`} onClick={onClear} />
        </div>
      ) : null}
    </div>
  );
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
      className="h-10 rounded-xl border border-black/10 bg-white px-2 text-[10px] font-black text-black/55 hover:border-[#006B3F] hover:text-[#006B3F]"
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
