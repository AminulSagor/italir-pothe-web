import type {
  CvBuilderElementType,
  CvBuilderFieldKey,
  CvBuilderLayoutElement,
  CvTemplateContentFlowSchema,
  CvTemplatePageSize,
  CvTemplateSectionSchema,
  CvTemplateStyleType,
} from '@/types/cv-template/cv_template_type';

export const pageSizes: Record<CvTemplatePageSize, { width: number; height: number; label: string }> = {
  a4: { width: 794, height: 1123, label: 'A4' },
  letter: { width: 816, height: 1056, label: 'Letter' },
};

export const styleOptions: Array<{ label: string; value: CvTemplateStyleType }> = [
  { label: 'ATS Format', value: 'ats' },
  { label: 'Modern Column', value: 'modern_column' },
  { label: 'Classic European', value: 'classic' },
  { label: 'Creative Hospitality', value: 'creative' },
];

export const fontOptions = [
  'Inter',
  'Arial',
  'Times New Roman',
  'Georgia',
  'Roboto',
  'Verdana',
  'Courier New',
];

export const contentFlowDefaults: CvTemplateContentFlowSchema = {
  mode: 'auto_paginated_sections',
  autoCreatePages: true,
  pageBreakStrategy: 'section_boundary',
  overflowBehavior: 'move_to_next_page',
  sectionGap: 16,
};

export const defaultFormSections: CvTemplateSectionSchema[] = [
  {
    key: 'contact',
    title: 'Personal Details',
    required: false,
    fields: [
      { key: 'fullName', label: 'Full name', type: 'text', required: false },
      { key: 'professionalTitle', label: 'Professional title', type: 'text', required: false },
      { key: 'email', label: 'Email', type: 'email', required: false },
      { key: 'phone', label: 'Phone', type: 'phone', required: false },
      { key: 'location', label: 'Location', type: 'text', required: false },
    ],
  },
  {
    key: 'summary',
    title: 'Summary',
    required: false,
    fields: [
      { key: 'summary', label: 'Summary', type: 'textarea', required: false },
    ],
  },
  {
    key: 'experience',
    title: 'Professional Experience',
    required: false,
    fields: [
      { key: 'experience', label: 'Experience items', type: 'list', required: false },
    ],
  },
  {
    key: 'education',
    title: 'Education',
    required: false,
    fields: [
      { key: 'education', label: 'Education items', type: 'list', required: false },
    ],
  },
  {
    key: 'skills',
    title: 'Skills',
    required: false,
    fields: [
      { key: 'skills', label: 'Skills', type: 'list', required: false },
    ],
  },
];

export const paletteItems: Array<{
  label: string;
  type: CvBuilderElementType;
  fieldKey: CvBuilderFieldKey;
  placeholder: string;
}> = [
  { label: 'Text', type: 'text', fieldKey: 'custom', placeholder: 'Double click to edit text' },
  { label: 'Rectangle', type: 'rectangle', fieldKey: 'custom', placeholder: '' },
  { label: 'Circle', type: 'circle', fieldKey: 'custom', placeholder: '' },
  { label: 'Horizontal Line', type: 'horizontalLine', fieldKey: 'custom', placeholder: '' },
  { label: 'Vertical Line', type: 'verticalLine', fieldKey: 'custom', placeholder: '' },
];

const createElement = (
  data: Partial<CvBuilderLayoutElement> &
    Pick<CvBuilderLayoutElement, 'id' | 'type' | 'fieldKey' | 'label' | 'placeholder'>,
): CvBuilderLayoutElement => ({
  x: 80,
  y: 80,
  width: 420,
  height: 54,
  zIndex: 1,
  contentBinding: { mode: 'static', autoHeight: false, allowPageBreak: false },
  style: {},
  ...data,
});

export const buildDefaultElements = (
  styleType: CvTemplateStyleType,
  primaryColor: string,
  accentColor: string,
  fontFamily: string,
): CvBuilderLayoutElement[] => {
  if (styleType === 'modern_column') {
    return [
      createElement({
        id: 'sidebar',
        type: 'rectangle',
        fieldKey: 'custom',
        label: 'Left Column Background',
        placeholder: '',
        x: 0,
        y: 0,
        width: 250,
        height: 1123,
        zIndex: 1,
        style: { backgroundColor: primaryColor, borderRadius: 0 },
      }),
      createElement({
        id: 'photo',
        type: 'circle',
        fieldKey: 'custom',
        label: 'Photo Placeholder',
        placeholder: '',
        x: 72,
        y: 90,
        width: 110,
        height: 110,
        zIndex: 2,
        style: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF', borderWidth: 2 },
      }),
      createElement({
        id: 'name',
        type: 'text',
        fieldKey: 'fullName',
        label: 'Full Name Text',
        placeholder: 'Brian T. Wayne',
        x: 290,
        y: 70,
        width: 360,
        height: 44,
        zIndex: 3,
        contentBinding: {
          sectionKey: 'contact',
          fieldKey: 'fullName',
          mode: 'dynamic',
          autoHeight: true,
          allowPageBreak: false,
        },
        style: { fontFamily, fontSize: 28, fontWeight: 800, color: primaryColor },
      }),
      createElement({
        id: 'title',
        type: 'text',
        fieldKey: 'professionalTitle',
        label: 'Professional Title Text',
        placeholder: 'Business Development Consultant',
        x: 290,
        y: 116,
        width: 360,
        height: 30,
        zIndex: 3,
        contentBinding: {
          sectionKey: 'contact',
          fieldKey: 'professionalTitle',
          mode: 'dynamic',
          autoHeight: true,
          allowPageBreak: false,
        },
        style: { fontFamily, fontSize: 16, color: '#4B5563' },
      }),
      createElement({
        id: 'divider',
        type: 'horizontalLine',
        fieldKey: 'custom',
        label: 'Divider',
        placeholder: '',
        x: 290,
        y: 160,
        width: 420,
        height: 2,
        zIndex: 2,
        style: { backgroundColor: primaryColor, borderWidth: 2 },
      }),
      createElement({
        id: 'experience-title',
        type: 'text',
        fieldKey: 'experience',
        label: 'Work Experience Section Title',
        placeholder: 'WORK EXPERIENCE',
        x: 290,
        y: 190,
        width: 420,
        height: 28,
        zIndex: 3,
        contentBinding: { sectionKey: 'experience', mode: 'static', autoHeight: true, allowPageBreak: true },
        style: { fontFamily, fontSize: 14, fontWeight: 800, color: '#111827' },
      }),
    ];
  }

  return [
    createElement({
      id: 'name',
      type: 'text',
      fieldKey: 'fullName',
      label: 'Full Name Text',
      placeholder: 'Emily Carter',
      x: 80,
      y: 70,
      width: 630,
      height: 42,
      zIndex: 2,
      contentBinding: {
        sectionKey: 'contact',
        fieldKey: 'fullName',
        mode: 'dynamic',
        autoHeight: true,
        allowPageBreak: false,
      },
      style: { fontFamily, fontSize: 25, fontWeight: 800, color: '#111827', textAlign: 'center' },
    }),
    createElement({
      id: 'title',
      type: 'text',
      fieldKey: 'professionalTitle',
      label: 'Professional Title Text',
      placeholder: 'Project Manager',
      x: 80,
      y: 115,
      width: 630,
      height: 24,
      zIndex: 2,
      contentBinding: {
        sectionKey: 'contact',
        fieldKey: 'professionalTitle',
        mode: 'dynamic',
        autoHeight: true,
        allowPageBreak: false,
      },
      style: { fontFamily, fontSize: 14, color: '#4B5563', textAlign: 'center' },
    }),
    createElement({
      id: 'line-1',
      type: 'horizontalLine',
      fieldKey: 'custom',
      label: 'Divider',
      placeholder: '',
      x: 80,
      y: 205,
      width: 630,
      height: 2,
      zIndex: 2,
      style: { backgroundColor: primaryColor, borderWidth: 2 },
    }),
    createElement({
      id: 'summary-heading',
      type: 'text',
      fieldKey: 'summary',
      label: 'Summary Heading',
      placeholder: 'SUMMARY',
      x: 80,
      y: 230,
      width: 630,
      height: 28,
      zIndex: 2,
      contentBinding: { sectionKey: 'summary', mode: 'static', autoHeight: true, allowPageBreak: true },
      style: { fontFamily, fontSize: 13, fontWeight: 800, color: '#111827' },
    }),
    createElement({
      id: 'summary-text',
      type: 'text',
      fieldKey: 'summary',
      label: 'Summary Dynamic Text',
      placeholder: 'Professional summary goes here and grows with content.',
      x: 80,
      y: 260,
      width: 630,
      height: 90,
      zIndex: 2,
      contentBinding: {
        sectionKey: 'summary',
        fieldKey: 'summary',
        mode: 'dynamic',
        autoHeight: true,
        allowPageBreak: true,
      },
      style: { fontFamily, fontSize: 12, color: '#111827', backgroundColor: accentColor },
    }),
  ];
};
