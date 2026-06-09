'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import Button from '@/components/UI/buttons/button';
import {
  createCvTemplate,
  getCvTemplateById,
  updateCvTemplate,
} from '@/service/cv-template/cv_template';
import type {
  CvBuilderLayoutElement,
  CvTemplateFieldType,
  CvTemplatePageSize,
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
  const width = Math.min(element.width, page.width);
  const height = Math.min(element.height, page.height);
  return {
    ...element,
    width,
    height,
    x: Math.min(Math.max(0, element.x), page.width - width),
    y: Math.min(Math.max(0, element.y), page.height - height),
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
  const [selectedElementId, setSelectedElementId] = useState<string | null>('name');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedElementId) ?? null,
    [elements, selectedElementId],
  );

  const handleStyleReset = () => {
    setElements(buildDefaultElements(styleType, primaryColor, accentColor, fontFamily));
    setSelectedElementId('name');
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
      width: isHorizontalLine ? 280 : isVerticalLine ? 2 : item.type === 'circle' ? 90 : 250,
      height: isHorizontalLine ? 2 : isVerticalLine ? 220 : item.type === 'circle' ? 90 : 80,
      zIndex: Math.max(1, ...elements.map((current) => current.zIndex)) + 1,
      contentBinding: { mode: 'static', autoHeight: false, allowPageBreak: false },
      style: {
        fontFamily,
        fontSize: item.type === 'text' ? 18 : 12,
        fontWeight: item.type === 'text' ? 800 : 500,
        color: '#111827',
        backgroundColor:
          isHorizontalLine || isVerticalLine || item.type === 'rectangle'
            ? primaryColor
            : 'transparent',
        borderColor:
          isHorizontalLine || isVerticalLine
            ? primaryColor
            : item.type === 'circle' || item.type === 'rectangle'
              ? primaryColor
              : 'transparent',
        borderWidth: isHorizontalLine || isVerticalLine ? 2 : item.type === 'circle' ? 2 : 0,
        borderRadius: 0,
      },
    };
    setElements((current) => [...current, clampElementToPage(element, pageSize)]);
    setSelectedElementId(id);
  };

  const handleUpdateElement = (updatedElement: CvBuilderLayoutElement) => {
    setElements((current) =>
      current.map((element) =>
        element.id === updatedElement.id
          ? clampElementToPage(
              updatedElement.type === 'circle'
                ? { ...updatedElement, height: updatedElement.width }
                : updatedElement,
              pageSize,
            )
          : element,
      ),
    );
  };

  const handleDeleteElement = (elementId: string) => {
    setElements((current) => current.filter((element) => element.id !== elementId));
    setSelectedElementId(null);
  };

  const makeSafeSection = (section: CvTemplateSectionSchema): CvTemplateSectionSchema => ({
    ...section,
    key: section.key,
    required: false,
    fields: section.fields.map((field) => ({
      ...field,
      key: makeSafeKey(field.key),
      type: field.type as CvTemplateFieldType,
    })),
  });

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
        autoHeight: true,
        allowPageBreak: true,
      },
      style: {
        fontFamily,
        fontSize: 12,
        fontWeight: 600,
        color: '#111827',
        backgroundColor: sectionElements.length ? 'transparent' : '#FFFFFF',
        borderColor: sectionElements.length ? 'transparent' : primaryColor,
        borderWidth: sectionElements.length ? 0 : 1,
        borderRadius: 0,
      },
    };
    setElements((current) => [...current, clampElementToPage(element, pageSize)]);
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
              contentBinding: {
                ...element.contentBinding,
                sectionKey: safeSection.key,
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
      margin: 40,
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

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" rounded="full" size="lg" onClick={handleStyleReset}>
            <Eye className="size-5" />
            Reset Layout
          </Button>
          <select
            value={styleType}
            onChange={(event) => setStyleType(event.target.value as CvTemplateStyleType)}
            className="h-12 rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-[#202420] outline-none"
          >
            <option value="ats">ATS</option>
            <option value="modern_column">Modern Column</option>
            <option value="classic">Classic</option>
            <option value="creative">Creative</option>
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as CvTemplateStatus)}
            className="h-12 rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-[#202420] outline-none"
          >
            <option value="draft">Draft</option>
            <option value="active">Active / Publish</option>
            <option value="archived">Archived</option>
          </select>
          <Button rounded="full" size="lg" onClick={handleSave} disabled={isSubmitting} className="min-w-[170px]">
            <Save className="size-5" />
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
        />
      </div>

      <button
        type="button"
        onClick={() => setIsPremium((value) => !value)}
        className={`fixed bottom-6 right-6 rounded-full px-6 py-3 text-sm font-black shadow-2xl ${
          isPremium ? 'bg-[#006B3F] text-white' : 'bg-white text-[#202420]'
        }`}
      >
        {isPremium ? 'Premium Template' : 'Free Template'}
      </button>
    </div>
  );
}
