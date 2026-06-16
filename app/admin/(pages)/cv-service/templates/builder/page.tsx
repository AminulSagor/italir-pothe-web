'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import Button from '@/components/UI/buttons/button';
import {
  createCvTemplate,
  getCvTemplateById,
  getCvTemplateDefaultLayout,
  saveCvTemplateDefaultLayout,
  updateCvTemplate,
} from '@/service/cv-template/cv_template';
import type {
  CvBuilderLayoutElement,
  CvTemplateFieldType,
  CvTemplatePageSize,
  CvTemplateDefaultLayoutItem,
  CvTemplatePayload,
  CvTemplateSectionSchema,
  CvTemplateStatus,
  CvTemplateStyleType,
} from '@/types/cv-template/cv_template_type';
import CvBuilderCanvas from './_components/cv-builder-canvas';
import CvBuilderSidebar from './_components/cv-builder-sidebar';
import {
  buildDefaultElements,
  contentFlowDefaults,
  defaultFormSections,
  pageSizes,
  paletteItems,
} from './_components/cv-builder-defaults';

const defaultColorOptions = ['#006B3F', '#646C7A', '#0B4A7D', '#7B4A2F', '#1F2937'];


const sectionGap = 16;

const isSectionElement = (element: CvBuilderLayoutElement) => element.type === 'section';

const elementsOverlap = (first: CvBuilderLayoutElement, second: CvBuilderLayoutElement, gap = sectionGap) => {
  return !(
    first.x + first.width + gap <= second.x ||
    second.x + second.width + gap <= first.x ||
    first.y + first.height + gap <= second.y ||
    second.y + second.height + gap <= first.y
  );
};

const resolveSectionCollision = (
  targetElement: CvBuilderLayoutElement,
  allElements: CvBuilderLayoutElement[],
  pageSize: CvTemplatePageSize,
): CvBuilderLayoutElement => {
  if (!isSectionElement(targetElement)) return targetElement;

  const page = pageSizes[pageSize];
  let nextElement = clampElementToPage(targetElement, pageSize);
  const otherSections = allElements
    .filter((element) => element.id !== targetElement.id && isSectionElement(element))
    .sort((first, second) => first.y - second.y || first.x - second.x);

  for (let pass = 0; pass < otherSections.length + 2; pass += 1) {
    const blocker = otherSections.find((element) => elementsOverlap(nextElement, element));
    if (!blocker) break;
    nextElement = {
      ...nextElement,
      y: Math.min(
        Math.max(0, page.height - nextElement.height),
        blocker.y + blocker.height + sectionGap,
      ),
    };
  }

  return clampElementToPage(nextElement, pageSize);
};

const firstAvailableSectionPosition = (
  draftElement: CvBuilderLayoutElement,
  allElements: CvBuilderLayoutElement[],
  pageSize: CvTemplatePageSize,
): CvBuilderLayoutElement => {
  const page = pageSizes[pageSize];
  let nextElement = clampElementToPage(draftElement, pageSize);
  const sortedSections = allElements
    .filter(isSectionElement)
    .sort((first, second) => first.y - second.y || first.x - second.x);

  for (const section of sortedSections) {
    if (!elementsOverlap(nextElement, section)) continue;
    nextElement = {
      ...nextElement,
      y: Math.min(
        Math.max(0, page.height - nextElement.height),
        section.y + section.height + sectionGap,
      ),
    };
  }

  return clampElementToPage(nextElement, pageSize);
};


const resolveSectionStack = (
  allElements: CvBuilderLayoutElement[],
  pageSize: CvTemplatePageSize,
): CvBuilderLayoutElement[] => {
  const page = pageSizes[pageSize];
  const sectionIds = new Set(
    allElements.filter(isSectionElement).map((element) => element.id),
  );
  const sortedSections = allElements
    .filter(isSectionElement)
    .sort((first, second) => first.y - second.y || first.x - second.x);

  const adjustedSections = new Map<string, CvBuilderLayoutElement>();
  const placedSections: CvBuilderLayoutElement[] = [];

  for (const section of sortedSections) {
    let nextSection = clampElementToPage(section, pageSize);

    for (let pass = 0; pass < sortedSections.length + 4; pass += 1) {
      const blocker = placedSections.find((placedSection) =>
        elementsOverlap(nextSection, placedSection),
      );

      if (!blocker) break;

      const nextY = Math.min(
        Math.max(0, page.height - nextSection.height),
        blocker.y + blocker.height + sectionGap,
      );

      if (nextY === nextSection.y) break;

      nextSection = clampElementToPage(
        {
          ...nextSection,
          y: nextY,
        },
        pageSize,
      );
    }

    adjustedSections.set(nextSection.id, nextSection);
    placedSections.push(nextSection);
  }

  return allElements.map((element) =>
    sectionIds.has(element.id) ? adjustedSections.get(element.id) ?? element : element,
  );
};

const makeSafeKey = (value: string) =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^([0-9])/, 'field_$1') || `field_${Date.now()}`;

const clampElementToPage = (
  element: CvBuilderLayoutElement,
  pageSize: CvTemplatePageSize,
): CvBuilderLayoutElement => {
  const page = pageSizes[pageSize];
  const width = Math.min(element.width, Math.max(24, page.width));
  const height = Math.min(element.height, Math.max(24, page.height));

  return {
    ...element,
    width,
    height,
    x: Math.min(Math.max(0, element.x), Math.max(0, page.width - width)),
    y: Math.min(Math.max(0, element.y), Math.max(0, page.height - height)),
  };
};

export default function CvTemplateBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const isEdit = Boolean(templateId);

  const [title, setTitle] = useState('Professional CV Layout');
  const [description, setDescription] = useState('Editable CV template created with the visual layout builder.');
  const [styleType, setStyleType] = useState<CvTemplateStyleType>('modern_column');
  const [pageSize, setPageSize] = useState<CvTemplatePageSize>('a4');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [primaryColor, setPrimaryColor] = useState('#183847');
  const [accentColor, setAccentColor] = useState('#F3F4F6');
  const [status, setStatus] = useState<CvTemplateStatus>('draft');
  const [isPremium, setIsPremium] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [formSections, setFormSections] = useState<CvTemplateSectionSchema[]>(defaultFormSections);
  const [elements, setElements] = useState<CvBuilderLayoutElement[]>(() =>
    buildDefaultElements('modern_column', '#183847', '#F3F4F6', 'Inter'),
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>('modern-name');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDefaultLayout, setIsSavingDefaultLayout] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(templateId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) return;

    let active = true;
    setIsLoading(true);
    getCvTemplateById(templateId)
      .then((response) => {
        if (!active) return;
        const template = response.template;
        const designJson = template.schema.designJson ?? template.schema.layout;
        setTitle(template.title);
        setDescription(template.description ?? '');
        setStyleType(template.styleType);
        setPageSize(designJson?.page.size ?? template.pageSize);
        setFontFamily(template.fontFamily);
        setPrimaryColor(template.primaryColor);
        setAccentColor(template.accentColor);
        setPreviewImageUrl(template.previewImageUrl ?? '');
        setStatus(template.status);
        setIsPremium(template.isPremium);
        setFormSections(
          template.schema.sections?.length
            ? template.schema.sections
            : defaultFormSections,
        );
        setElements(
          designJson?.elements?.length
            ? designJson.elements
            : buildDefaultElements(
                template.styleType,
                template.primaryColor,
                template.accentColor,
                template.fontFamily,
              ),
        );
        setSelectedElementId(designJson?.elements?.[0]?.id ?? null);
      })
      .catch((apiError: Error) => setError(apiError.message))
      .finally(() => setIsLoading(false));

    return () => {
      active = false;
    };
  }, [templateId]);

  useEffect(() => {
    if (templateId) return;
    void loadDefaultLayout(styleType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedElementId) ?? null,
    [elements, selectedElementId],
  );

  const applyDefaultLayout = (defaultLayout: CvTemplateDefaultLayoutItem | null, fallbackStyleType: CvTemplateStyleType) => {
    if (!defaultLayout) {
      const nextElements = buildDefaultElements(
        fallbackStyleType,
        primaryColor,
        accentColor,
        fontFamily,
      );
      setElements(nextElements);
      setSelectedElementId(nextElements[0]?.id ?? null);
      return;
    }

    const defaultSchema = defaultLayout.schema;
    const designJson = defaultSchema.designJson ?? defaultSchema.layout;
    const nextPageSize = designJson?.page.size ?? defaultLayout.pageSize;
    setPageSize(nextPageSize);
    setFontFamily(defaultLayout.fontFamily);
    setPrimaryColor(defaultLayout.primaryColor);
    setAccentColor(defaultLayout.accentColor);
    setFormSections(
      defaultSchema.sections?.length ? defaultSchema.sections : defaultFormSections,
    );
    const nextElements = designJson?.elements?.length
      ? designJson.elements
      : buildDefaultElements(
          fallbackStyleType,
          defaultLayout.primaryColor,
          defaultLayout.accentColor,
          defaultLayout.fontFamily,
        );
    setElements(nextElements);
    setSelectedElementId(nextElements[0]?.id ?? null);
  };

  const loadDefaultLayout = async (nextStyleType: CvTemplateStyleType) => {
    try {
      const response = await getCvTemplateDefaultLayout(nextStyleType);
      applyDefaultLayout(response.layout, nextStyleType);
    } catch {
      const nextElements = buildDefaultElements(
        nextStyleType,
        primaryColor,
        accentColor,
        fontFamily,
      );
      setElements(nextElements);
      setSelectedElementId(nextElements[0]?.id ?? null);
    }
  };

  const handleStyleReset = () => {
    void loadDefaultLayout(styleType);
  };

  const handleStyleTypeChange = (value: CvTemplateStyleType) => {
    if (value === styleType) return;
    const confirmed = window.confirm(
      'All unsaved layout changes will be lost. Continue?',
    );
    if (!confirmed) return;
    setStyleType(value);
    void loadDefaultLayout(value);
  };

  const handlePageSizeChange = (value: CvTemplatePageSize) => {
    setPageSize(value);
    setElements((current) => current.map((element) => clampElementToPage(element, value)));
  };


  const handleAddElement = (itemIndex: number) => {
    const item = paletteItems[itemIndex];
    const id = `${item.type}-${Date.now()}`;
    const isHorizontalLine = item.type === 'horizontalLine';
    const isVerticalLine = item.type === 'verticalLine';
    const element: CvBuilderLayoutElement = {
      id,
      type: item.type,
      fieldKey: item.fieldKey,
      label: item.label,
      placeholder: item.placeholder,
      x: 90 + (elements.length % 4) * 18,
      y: 90 + (elements.length % 6) * 30,
      width: isHorizontalLine ? 280 : isVerticalLine ? 2 : item.type === 'circle' ? 90 : item.type === 'icon' ? 34 : 250,
      height: isHorizontalLine ? 2 : isVerticalLine ? 220 : item.type === 'circle' ? 90 : item.type === 'icon' ? 34 : item.type === 'textarea' ? 120 : 80,
      zIndex: Math.max(1, ...elements.map((current) => current.zIndex)) + 1,
      contentBinding: { mode: 'static', autoHeight: false, allowPageBreak: false },
      richTextFormat: item.type === 'textarea' ? 'html' : 'plain',
      iconName: item.type === 'icon' ? 'linkedin' : undefined,
      style: {
        fontFamily,
        fontSize: item.type === 'text' ? 18 : item.type === 'textarea' ? 13 : 12,
        fontWeight: item.type === 'text' ? 800 : 500,
        color: '#111827',
        backgroundColor:
          isHorizontalLine || isVerticalLine || item.type === 'rectangle' || item.type === 'circle'
            ? primaryColor
            : 'transparent',
        backgroundColorRole:
          isHorizontalLine || isVerticalLine || item.type === 'rectangle' || item.type === 'circle'
            ? 'primary'
            : 'custom',
        borderColor:
          isHorizontalLine || isVerticalLine
            ? accentColor
            : item.type === 'circle' || item.type === 'rectangle'
              ? accentColor
              : 'transparent',
        borderColorRole:
          isHorizontalLine || isVerticalLine || item.type === 'circle' || item.type === 'rectangle'
            ? 'accent'
            : 'custom',
        borderWidth: isHorizontalLine || isVerticalLine ? 2 : item.type === 'circle' ? 2 : 0,
        borderRadius: 0,
      },
    };
    setElements((current) => {
      const nextElement = firstAvailableSectionPosition(element, current, pageSize);
      return isSectionElement(nextElement)
        ? resolveSectionStack([...current, nextElement], pageSize)
        : [...current, nextElement];
    });
    setSelectedElementId(id);
  };

  const handleUpdateElement = (updatedElement: CvBuilderLayoutElement) => {
    setElements((current) => {
      const normalizedElement = updatedElement.type === 'circle'
        ? { ...updatedElement, height: updatedElement.width }
        : updatedElement;
      const nextElement = clampElementToPage(normalizedElement, pageSize);
      const collisionSafeElement = isSectionElement(nextElement)
        ? resolveSectionCollision(nextElement, current, pageSize)
        : nextElement;

      return current.map((element) =>
        element.id === updatedElement.id ? collisionSafeElement : element,
      );
    });
  };

  const handleDeleteElement = (elementId: string) => {
    setElements((current) => current.filter((element) => element.id !== elementId));
    setSelectedElementId(null);
  };

  const makeSafeSection = (section: CvTemplateSectionSchema): CvTemplateSectionSchema => {
    const fieldKeyMap = new Map<string, string>();
    const usedFieldKeys = new Set<string>();
    const makeUniqueSafeFieldKey = (value: string) => {
      const baseKey = makeSafeKey(value);
      let nextKey = baseKey;
      let serial = 2;
      while (usedFieldKeys.has(nextKey)) {
        nextKey = `${baseKey}_${serial}`;
        serial += 1;
      }
      usedFieldKeys.add(nextKey);
      return nextKey;
    };

    const fields = section.fields.map((field) => {
      const safeKey = makeUniqueSafeFieldKey(field.key);
      fieldKeyMap.set(field.key, safeKey);
      const itemKeys = new Set<string>();
      const itemFields = field.itemFields?.map((itemField) => {
        const baseKey = makeSafeKey(itemField.key);
        let nextKey = baseKey;
        let serial = 2;
        while (itemKeys.has(nextKey)) {
          nextKey = `${baseKey}_${serial}`;
          serial += 1;
        }
        itemKeys.add(nextKey);
        fieldKeyMap.set(itemField.key, nextKey);
        return {
          ...itemField,
          key: nextKey,
        };
      });
      return {
        ...field,
        key: safeKey,
        type: field.type as CvTemplateFieldType,
        itemFields,
        options: itemFields?.map((item) => `${item.key}|${item.label}|${item.type}`) ?? field.options,
      };
    });

    const dynamicItem = section.dynamicItem
      ? {
          ...section.dynamicItem,
          fieldKey: fieldKeyMap.get(section.dynamicItem.fieldKey) ?? section.dynamicItem.fieldKey,
          itemFields: section.dynamicItem.itemFields.map((itemField) => ({
            ...itemField,
            key: fieldKeyMap.get(itemField.key) ?? itemField.key,
          })),
        }
      : undefined;

    const designerJson = section.designerJson
      ? {
          ...section.designerJson,
          dynamicItem,
          elements: section.designerJson.elements.map((element) => ({
            ...element,
            fieldKey: fieldKeyMap.get(element.fieldKey) ?? element.fieldKey,
          })),
        }
      : section.designerJson;

    return {
      ...section,
      key: section.key,
      required: false,
      fields,
      dynamicItem,
      designerJson,
    };
  };

  const handleCreateFormSection = (section: CvTemplateSectionSchema) => {
    const safeSection = makeSafeSection(section);
    setFormSections((current) => {
      const existingIndex = current.findIndex((item) => item.key === safeSection.key);
      if (existingIndex === -1) return [...current, safeSection];
      return [
        ...current,
        {
          ...safeSection,
          key: `${safeSection.key}_${Date.now()}`,
        },
      ];
    });
  };

  const handlePlaceFormSection = (section: CvTemplateSectionSchema) => {
    const id = `section-${section.key}-${Date.now()}`;
    const sectionCanvas = section.designerJson?.canvas;
    const sectionElements = section.designerJson?.elements ?? [];
    const element: CvBuilderLayoutElement = {
      id,
      type: 'section',
      fieldKey: 'custom',
      label: section.title,
      placeholder: `Section: ${section.title}`,
      x: 90 + (elements.length % 4) * 18,
      y: 120 + (elements.length % 5) * 34,
      width: sectionCanvas?.width ?? 420,
      height: sectionCanvas?.height ?? Math.max(120, Math.min(280, 70 + section.fields.length * 34)),
      zIndex: Math.max(1, ...elements.map((current) => current.zIndex)) + 1,
      sectionDesignerJson: section.designerJson,
      contentBinding: {
        sectionKey: section.key,
        mode: 'dynamic',
        autoHeight: false,
        allowPageBreak: true,
        collapseWhenEmpty: true,
        reflowSiblings: true,
      },
      style: {
        fontFamily,
        fontSize: 12,
        fontWeight: 600,
        color: '#111827',
        backgroundColor: sectionElements.length ? 'transparent' : primaryColor,
        backgroundColorRole: sectionElements.length ? 'custom' : 'primary',
        borderColor: sectionElements.length ? 'transparent' : accentColor,
        borderColorRole: sectionElements.length ? 'custom' : 'accent',
        borderWidth: sectionElements.length ? 0 : 1,
        borderRadius: 0,
      },
    };
    setElements((current) => {
      const nextElement = firstAvailableSectionPosition(element, current, pageSize);
      return isSectionElement(nextElement)
        ? resolveSectionStack([...current, nextElement], pageSize)
        : [...current, nextElement];
    });
    setSelectedElementId(id);
  };

  const handleUpdateFormSection = (sectionKey: string, updatedSection: CvTemplateSectionSchema) => {
    const safeSection = makeSafeSection(updatedSection);
    setFormSections((current) =>
      current.map((section) => (section.key === sectionKey ? safeSection : section)),
    );
    setElements((current) =>
      current.map((element) =>
        element.contentBinding?.sectionKey === sectionKey
          ? {
              ...element,
              label: safeSection.title,
              placeholder: `Section: ${safeSection.title}`,
              width: element.width,
              height: element.height,
              sectionDesignerJson: safeSection.designerJson,
              contentBinding: {
                ...element.contentBinding,
                sectionKey: safeSection.key,
                autoHeight: false,
                allowPageBreak: true,
                collapseWhenEmpty: true,
                reflowSiblings: true,
              },
            }
          : element,
      ),
    );
  };

  const handleDeleteFormSection = (sectionKey: string) => {
    setFormSections((current) => current.filter((section) => section.key !== sectionKey));
    setElements((current) =>
      current.filter((element) => element.contentBinding?.sectionKey !== sectionKey),
    );
  };

  const designJson = {
    version: 2,
    format: 'cv_visual_template_json' as const,
    page: {
      size: pageSize,
      width: pageSizes[pageSize].width,
      height: pageSizes[pageSize].height,
      unit: 'px' as const,
      backgroundColor: '#FFFFFF',
    },
    contentFlow: contentFlowDefaults,
    elements,
  };

  const payload: CvTemplatePayload = {
    title,
    description: description || null,
    styleType,
    pageSize,
    fontFamily,
    primaryColor,
    accentColor,
    isPremium,
    status,
    previewImageUrl: previewImageUrl || null,
    schema: {
      sections: formSections,
      colorOptions: Array.from(new Set([primaryColor, accentColor, ...defaultColorOptions])),
      designJson,
      layout: designJson,
    },
  };

  const handleSaveDefaultLayout = async () => {
    if (isSavingDefaultLayout) return;
    if (styleType !== 'modern_column' && styleType !== 'classic') {
      setError('Only Modern and Classic CV default layouts are supported for now.');
      return;
    }

    setError(null);
    setIsSavingDefaultLayout(true);
    try {
      await saveCvTemplateDefaultLayout(styleType, {
        pageSize,
        fontFamily,
        primaryColor,
        accentColor,
        schema: payload.schema,
      });
      window.alert('Default layout saved successfully.');
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Default layout save failed.');
    } finally {
      setIsSavingDefaultLayout(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Template title is required.');
      return;
    }
    if (elements.length === 0) {
      setError('Add at least one CV layout element before saving.');
      return;
    }
    if (formSections.length === 0) {
      setError('Add at least one user form section before saving.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      if (templateId) {
        await updateCvTemplate(templateId, payload);
      } else {
        await createCvTemplate(payload);
      }
      router.push('/admin/cv-service/templates');
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Save failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="rounded-3xl bg-white p-8 text-sm text-black/60">Loading visual CV builder...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <Link href="/admin/cv-service/templates" className="flex size-9 items-center justify-center rounded-full bg-white text-[#006B3F] shadow-sm">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-[#211032]">
              {isEdit ? 'Edit Visual CV Template' : 'Professional CV Layout Builder'}
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-black/60">
              Create a real CV template JSON: draw components, bind text to fields, and let user data auto-flow to new pages when content becomes longer than the designed space.
            </p>
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto rounded-full bg-white/70 p-1.5 shadow-sm">
          <Button variant="outline" rounded="full" size="sm" onClick={handleStyleReset}>
            <Eye className="size-4" />
            Reset
          </Button>
          <select
            value={styleType}
            onChange={(event) =>
              handleStyleTypeChange(event.target.value as CvTemplateStyleType)
            }
            className="h-8 rounded-full border border-black/10 bg-white px-3 text-xs font-bold text-[#202420] outline-none"
          >
            <option value="modern_column">Modern Column</option>
            <option value="classic">Classic</option>
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as CvTemplateStatus)}
            className="h-8 rounded-full border border-black/10 bg-white px-3 text-xs font-bold text-[#202420] outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active / Publish</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={isPremium ? 'premium' : 'free'}
            onChange={(event) => setIsPremium(event.target.value === 'premium')}
            className="h-8 rounded-full border border-black/10 bg-white px-3 text-xs font-bold text-[#202420] outline-none"
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
          <Button rounded="full" size="sm" onClick={handleSave} disabled={isSubmitting} className="min-w-[130px]">
            <Save className="size-4" />
            {isSubmitting ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>

      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</div> : null}

      <div className="grid gap-5 xl:grid-cols-[400px_1fr]">
        <CvBuilderSidebar
          title={title}
          description={description}
          pageSize={pageSize}
          fontFamily={fontFamily}
          primaryColor={primaryColor}
          accentColor={accentColor}
          formSections={formSections}
          selectedElement={selectedElement}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onPageSizeChange={handlePageSizeChange}
          onFontFamilyChange={setFontFamily}
          onPrimaryColorChange={setPrimaryColor}
          onAccentColorChange={setAccentColor}
          onCreateFormSection={handleCreateFormSection}
          onUpdateFormSection={handleUpdateFormSection}
          onDeleteFormSection={handleDeleteFormSection}
          onPlaceFormSection={handlePlaceFormSection}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
        />

        <CvBuilderCanvas
          pageSize={pageSize}
          elements={elements}
          selectedElementId={selectedElementId}
          onSelect={setSelectedElementId}
          onChange={handleUpdateElement}
          onDelete={handleDeleteElement}
          primaryColor={primaryColor}
          accentColor={accentColor}
          onSaveDefaultLayout={handleSaveDefaultLayout}
          isSavingDefaultLayout={isSavingDefaultLayout}
        />
      </div>


    </div>
  );
}
