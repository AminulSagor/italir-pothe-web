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
  pageSizes,
  paletteItems,
  sectionOptions,
} from './_components/cv-builder-defaults';

const defaultColorOptions = ['#006B3F', '#646C7A', '#0B4A7D', '#7B4A2F', '#1F2937'];

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
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'contact',
    'summary',
    'experience',
    'education',
    'skills',
  ]);
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
        const layout = template.schema.layout;
        setTitle(template.title);
        setDescription(template.description ?? '');
        setStyleType(template.styleType);
        setPageSize(layout?.page.size ?? template.pageSize);
        setFontFamily(template.fontFamily);
        setPrimaryColor(template.primaryColor);
        setAccentColor(template.accentColor);
        setPreviewImageUrl(template.previewImageUrl ?? '');
        setStatus(template.status);
        setIsPremium(template.isPremium);
        setSelectedSections(
          template.schema.sections?.map((section) => section.key) ?? [
            'contact',
            'summary',
            'experience',
            'education',
            'skills',
          ],
        );
        setElements(
          layout?.elements?.length
            ? layout.elements
            : buildDefaultElements(
                template.styleType,
                template.primaryColor,
                template.accentColor,
                template.fontFamily,
              ),
        );
        setSelectedElementId(layout?.elements?.[0]?.id ?? null);
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

  const selectedSchemaSections = useMemo(
    () =>
      sectionOptions.filter(
        (section) => section.required || selectedSections.includes(section.key),
      ),
    [selectedSections],
  );

  const handleSectionToggle = (section: CvTemplateSectionSchema) => {
    if (section.required) return;
    setSelectedSections((current) =>
      current.includes(section.key)
        ? current.filter((item) => item !== section.key)
        : [...current, section.key],
    );
  };

  const handleStyleReset = () => {
    setElements(buildDefaultElements(styleType, primaryColor, accentColor, fontFamily));
    setSelectedElementId('name');
  };

  const handleAddElement = (itemIndex: number) => {
    const item = paletteItems[itemIndex];
    const id = `${item.fieldKey}-${Date.now()}`;
    const element: CvBuilderLayoutElement = {
      id,
      type: item.type,
      fieldKey: item.fieldKey,
      label: item.label,
      placeholder: item.placeholder,
      x: 90 + (elements.length % 4) * 18,
      y: 90 + (elements.length % 6) * 30,
      width: item.type === 'line' ? 280 : item.type === 'circle' ? 90 : 250,
      height: item.type === 'line' ? 3 : item.type === 'circle' ? 90 : 80,
      zIndex: Math.max(1, ...elements.map((current) => current.zIndex)) + 1,
      style: {
        fontFamily,
        fontSize: item.type === 'text' ? 18 : 12,
        fontWeight: item.type === 'text' ? 800 : 500,
        color: '#111827',
        backgroundColor:
          item.type === 'rectangle' || item.type === 'line' ? accentColor : 'transparent',
        borderColor: item.type === 'circle' || item.type === 'rectangle' ? primaryColor : 'transparent',
        borderWidth: item.type === 'circle' ? 2 : 0,
        borderRadius: item.type === 'rectangle' ? 10 : 0,
      },
    };
    setElements((current) => [...current, element]);
    setSelectedElementId(id);
  };

  const handleUpdateElement = (updatedElement: CvBuilderLayoutElement) => {
    setElements((current) =>
      current.map((element) =>
        element.id === updatedElement.id ? updatedElement : element,
      ),
    );
  };

  const handleDeleteElement = (elementId: string) => {
    setElements((current) => current.filter((element) => element.id !== elementId));
    setSelectedElementId(null);
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
      sections: selectedSchemaSections,
      colorOptions: Array.from(new Set([primaryColor, accentColor, ...defaultColorOptions])),
      layout: {
        version: 1,
        page: {
          size: pageSize,
          width: pageSizes[pageSize].width,
          height: pageSizes[pageSize].height,
          unit: 'px',
          margin: 40,
          backgroundColor: '#FFFFFF',
        },
        elements,
      },
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
              Build a FlowCV-style interactive page template. Drag, resize, layer, color, and bind components to form fields that users will fill in the Flutter app.
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

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <CvBuilderSidebar
          title={title}
          description={description}
          pageSize={pageSize}
          fontFamily={fontFamily}
          primaryColor={primaryColor}
          accentColor={accentColor}
          selectedSections={selectedSections}
          selectedElement={selectedElement}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onPageSizeChange={setPageSize}
          onFontFamilyChange={setFontFamily}
          onPrimaryColorChange={setPrimaryColor}
          onAccentColorChange={setAccentColor}
          onSectionToggle={handleSectionToggle}
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
