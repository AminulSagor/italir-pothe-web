import type {
  CvBuilderElementType,
  CvBuilderFieldKey,
  CvBuilderLayoutElement,
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

export const sectionOptions: CvTemplateSectionSchema[] = [
  {
    key: 'contact',
    title: 'Personal Details',
    required: true,
    fields: [
      { key: 'fullName', label: 'Full name', type: 'text', required: true },
      { key: 'professionalTitle', label: 'Professional title', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone', type: 'phone', required: true },
      { key: 'location', label: 'Location', type: 'text', required: true },
    ],
  },
  {
    key: 'summary',
    title: 'Summary',
    required: true,
    fields: [
      { key: 'summary', label: 'Summary', type: 'textarea', required: true },
    ],
  },
  {
    key: 'experience',
    title: 'Professional Experience',
    required: true,
    fields: [
      { key: 'experience', label: 'Experience', type: 'list', required: true },
    ],
  },
  {
    key: 'education',
    title: 'Education',
    required: true,
    fields: [
      { key: 'education', label: 'Education', type: 'list', required: true },
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
  {
    key: 'languages',
    title: 'Languages',
    required: false,
    fields: [
      { key: 'languages', label: 'Languages', type: 'list', required: false },
    ],
  },
  {
    key: 'certificates',
    title: 'Certificates',
    required: false,
    fields: [
      { key: 'certificates', label: 'Certificates', type: 'list', required: false },
    ],
  },
  {
    key: 'projects',
    title: 'Projects',
    required: false,
    fields: [
      { key: 'projects', label: 'Projects', type: 'list', required: false },
    ],
  },
];

export const paletteItems: Array<{
  label: string;
  type: CvBuilderElementType;
  fieldKey: CvBuilderFieldKey;
  placeholder: string;
}> = [
  { label: 'Full Name', type: 'text', fieldKey: 'fullName', placeholder: 'Emily Carter' },
  { label: 'Title', type: 'text', fieldKey: 'professionalTitle', placeholder: 'Project Manager' },
  { label: 'Contact Row', type: 'section', fieldKey: 'email', placeholder: 'email@example.com  •  +880 1700 000000' },
  { label: 'Summary', type: 'section', fieldKey: 'summary', placeholder: 'Short professional summary...' },
  { label: 'Experience', type: 'section', fieldKey: 'experience', placeholder: 'Professional Experience' },
  { label: 'Education', type: 'section', fieldKey: 'education', placeholder: 'Education' },
  { label: 'Skills', type: 'section', fieldKey: 'skills', placeholder: 'Skills' },
  { label: 'Languages', type: 'section', fieldKey: 'languages', placeholder: 'Languages' },
  { label: 'Rectangle', type: 'rectangle', fieldKey: 'custom', placeholder: '' },
  { label: 'Circle', type: 'circle', fieldKey: 'custom', placeholder: '' },
  { label: 'Line', type: 'line', fieldKey: 'custom', placeholder: '' },
];

const createElement = (data: Partial<CvBuilderLayoutElement> & Pick<CvBuilderLayoutElement, 'id' | 'type' | 'fieldKey' | 'label' | 'placeholder'>): CvBuilderLayoutElement => ({
  x: 80,
  y: 80,
  width: 420,
  height: 54,
  zIndex: 1,
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
      createElement({ id: 'sidebar', type: 'rectangle', fieldKey: 'custom', label: 'Left Column Background', placeholder: '', x: 0, y: 0, width: 250, height: 1123, zIndex: 1, style: { backgroundColor: primaryColor, borderRadius: 0 } }),
      createElement({ id: 'photo', type: 'circle', fieldKey: 'custom', label: 'Photo Placeholder', placeholder: '', x: 72, y: 90, width: 110, height: 110, zIndex: 2, style: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF', borderWidth: 2 } }),
      createElement({ id: 'name', type: 'text', fieldKey: 'fullName', label: 'Full Name', placeholder: 'Brian T. Wayne', x: 290, y: 70, width: 360, height: 44, zIndex: 3, style: { fontFamily, fontSize: 28, fontWeight: 800, color: primaryColor } }),
      createElement({ id: 'title', type: 'text', fieldKey: 'professionalTitle', label: 'Professional Title', placeholder: 'Business Development Consultant', x: 290, y: 116, width: 360, height: 30, zIndex: 3, style: { fontFamily, fontSize: 16, color: '#4B5563' } }),
      createElement({ id: 'contact', type: 'section', fieldKey: 'email', label: 'Contact', placeholder: 'Email • Phone • Location', x: 36, y: 240, width: 180, height: 150, zIndex: 3, style: { fontFamily, fontSize: 12, color: '#FFFFFF' } }),
      createElement({ id: 'summary', type: 'section', fieldKey: 'summary', label: 'Profile', placeholder: 'Professional profile summary...', x: 36, y: 420, width: 180, height: 180, zIndex: 3, style: { fontFamily, fontSize: 12, color: '#FFFFFF' } }),
      createElement({ id: 'experience', type: 'section', fieldKey: 'experience', label: 'Work Experience', placeholder: 'Professional Experience', x: 290, y: 190, width: 420, height: 290, zIndex: 3, style: { fontFamily, fontSize: 13, color: '#111827', backgroundColor: '#F3F4F6' } }),
      createElement({ id: 'education', type: 'section', fieldKey: 'education', label: 'Education', placeholder: 'Education', x: 290, y: 510, width: 420, height: 190, zIndex: 3, style: { fontFamily, fontSize: 13, color: '#111827', backgroundColor: '#F3F4F6' } }),
      createElement({ id: 'skills', type: 'section', fieldKey: 'skills', label: 'Skills', placeholder: 'Skills', x: 290, y: 730, width: 420, height: 160, zIndex: 3, style: { fontFamily, fontSize: 13, color: '#111827', backgroundColor: '#F3F4F6' } }),
    ];
  }

  return [
    createElement({ id: 'name', type: 'text', fieldKey: 'fullName', label: 'Full Name', placeholder: 'Emily Carter', x: 80, y: 70, width: 630, height: 42, zIndex: 2, style: { fontFamily, fontSize: 25, fontWeight: 800, color: '#111827', textAlign: 'center' } }),
    createElement({ id: 'title', type: 'text', fieldKey: 'professionalTitle', label: 'Professional Title', placeholder: 'Project Manager', x: 80, y: 115, width: 630, height: 24, zIndex: 2, style: { fontFamily, fontSize: 14, color: '#4B5563', textAlign: 'center' } }),
    createElement({ id: 'contact', type: 'section', fieldKey: 'email', label: 'Contact', placeholder: 'Location • Email • Phone • LinkedIn', x: 80, y: 150, width: 630, height: 34, zIndex: 2, style: { fontFamily, fontSize: 11, color: '#111827', textAlign: 'center' } }),
    createElement({ id: 'line-1', type: 'line', fieldKey: 'custom', label: 'Divider', placeholder: '', x: 80, y: 205, width: 630, height: 2, zIndex: 2, style: { backgroundColor: primaryColor } }),
    createElement({ id: 'summary', type: 'section', fieldKey: 'summary', label: 'Summary', placeholder: 'Professional summary...', x: 80, y: 230, width: 630, height: 105, zIndex: 2, style: { fontFamily, fontSize: 12, color: '#111827', backgroundColor: accentColor } }),
    createElement({ id: 'experience', type: 'section', fieldKey: 'experience', label: 'Professional Experience', placeholder: 'Professional Experience', x: 80, y: 365, width: 630, height: 280, zIndex: 2, style: { fontFamily, fontSize: 12, color: '#111827' } }),
    createElement({ id: 'education', type: 'section', fieldKey: 'education', label: 'Education', placeholder: 'Education', x: 80, y: 675, width: 630, height: 150, zIndex: 2, style: { fontFamily, fontSize: 12, color: '#111827' } }),
    createElement({ id: 'skills', type: 'section', fieldKey: 'skills', label: 'Skills', placeholder: 'Skills', x: 80, y: 855, width: 630, height: 120, zIndex: 2, style: { fontFamily, fontSize: 12, color: '#111827' } }),
  ];
};
