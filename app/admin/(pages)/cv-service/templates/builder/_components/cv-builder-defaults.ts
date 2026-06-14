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
  { label: 'Modern Column', value: 'modern_column' },
  { label: 'Classic', value: 'classic' },
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
  collapseEmptySections: true,
  reflowAfterCollapse: true,
  growDynamicSections: true,
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
      { key: 'profilePhoto', label: 'Profile photo', type: 'photoUrl', required: false },
    ],
  },
  {
    key: 'summary',
    title: 'Profile',
    required: false,
    fields: [{ key: 'summary', label: 'Profile summary', type: 'textarea', required: false }],
  },
  {
    key: 'experience',
    title: 'Work Experience',
    required: false,
    fields: [{ key: 'experience', label: 'Experience items', type: 'list', required: false }],
  },
  {
    key: 'education',
    title: 'Education',
    required: false,
    fields: [{ key: 'education', label: 'Education items', type: 'list', required: false }],
  },
  {
    key: 'skills',
    title: 'Skills',
    required: false,
    fields: [{ key: 'skills', label: 'Skills', type: 'list', required: false }],
  },
  {
    key: 'languages',
    title: 'Languages',
    required: false,
    fields: [{ key: 'languages', label: 'Languages', type: 'list', required: false }],
  },
  {
    key: 'hobbies',
    title: 'Hobbies',
    required: false,
    fields: [{ key: 'hobbies', label: 'Hobbies', type: 'list', required: false }],
  },
];

export const paletteItems: Array<{
  label: string;
  type: CvBuilderElementType;
  fieldKey: CvBuilderFieldKey;
  placeholder: string;
}> = [
  { label: 'Text', type: 'text', fieldKey: 'custom', placeholder: 'Double click to edit text' },
  { label: 'Textarea', type: 'textarea', fieldKey: 'custom', placeholder: '<p>Write long text here...</p>' },
  { label: 'Rectangle', type: 'rectangle', fieldKey: 'custom', placeholder: '' },
  { label: 'Circle', type: 'circle', fieldKey: 'custom', placeholder: '' },
  { label: 'Horizontal Line', type: 'horizontalLine', fieldKey: 'custom', placeholder: '' },
  { label: 'Vertical Line', type: 'verticalLine', fieldKey: 'custom', placeholder: '' },
  { label: 'Icon', type: 'icon', fieldKey: 'custom', placeholder: '' },
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

const text = (data: Partial<CvBuilderLayoutElement> & Pick<CvBuilderLayoutElement, 'id' | 'fieldKey' | 'label' | 'placeholder'>) =>
  createElement({
    type: 'text',
    width: 220,
    height: 28,
    ...data,
  });

const textarea = (data: Partial<CvBuilderLayoutElement> & Pick<CvBuilderLayoutElement, 'id' | 'fieldKey' | 'label' | 'placeholder'>) =>
  createElement({
    type: 'textarea',
    width: 330,
    height: 78,
    richTextFormat: 'html',
    ...data,
  });

export const buildDefaultElements = (
  styleType: CvTemplateStyleType,
  primaryColor: string,
  accentColor: string,
  fontFamily: string,
): CvBuilderLayoutElement[] => {
  if (styleType === 'modern_column') {
    const darkColor = primaryColor || '#202A36';
    const blueAccent = '#6BA5D8';
    return [
      createElement({
        id: 'modern-sidebar-bg',
        type: 'rectangle',
        fieldKey: 'custom',
        label: 'Dark left sidebar',
        placeholder: '',
        x: 0,
        y: 0,
        width: 292,
        height: 1123,
        zIndex: 1,
        style: { backgroundColor: darkColor, borderRadius: 0, borderWidth: 0 },
      }),
      createElement({
        id: 'modern-photo-frame',
        type: 'circle',
        fieldKey: 'profilePhoto',
        label: 'Profile photo circle',
        placeholder: '',
        x: 57,
        y: 52,
        width: 180,
        height: 180,
        zIndex: 2,
        contentBinding: { sectionKey: 'contact', fieldKey: 'profilePhoto', mode: 'dynamic', autoHeight: false, allowPageBreak: false, collapseWhenEmpty: true, reflowSiblings: true },
        style: { backgroundColor: '#E5E7EB', borderColor: '#FFFFFF', borderWidth: 4, borderRadius: 999 },
      }),
      text({
        id: 'modern-name', fieldKey: 'fullName', label: 'Name', placeholder: 'Your Name',
        x: 38, y: 278, width: 220, height: 52, zIndex: 3,
        contentBinding: { sectionKey: 'contact', fieldKey: 'fullName', mode: 'dynamic', autoHeight: true, allowPageBreak: false },
        style: { fontFamily, fontSize: 33, fontWeight: 900, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.08 },
      }),
      text({
        id: 'modern-title', fieldKey: 'professionalTitle', label: 'Professional title', placeholder: 'Software Engineer',
        x: 42, y: 336, width: 214, height: 30, zIndex: 3,
        contentBinding: { sectionKey: 'contact', fieldKey: 'professionalTitle', mode: 'dynamic', autoHeight: true, allowPageBreak: false },
        style: { fontFamily, fontSize: 20, fontWeight: 500, color: blueAccent, textAlign: 'center' },
      }),
      text({ id: 'contact-heading', fieldKey: 'custom', label: 'Contact Heading', placeholder: 'CONTACT', x: 40, y: 438, width: 210, height: 34, zIndex: 3, style: { fontFamily, fontSize: 24, fontWeight: 900, color: '#FFFFFF' } }),
      text({ id: 'contact-phone', fieldKey: 'phone', label: 'Phone', placeholder: '☎  +1 2345 6789', x: 40, y: 486, width: 220, height: 28, zIndex: 3, contentBinding: { sectionKey: 'contact', fieldKey: 'phone', mode: 'dynamic', autoHeight: true, allowPageBreak: false }, style: { fontFamily, fontSize: 15, fontWeight: 500, color: '#FFFFFF' } }),
      text({ id: 'contact-email', fieldKey: 'email', label: 'Email', placeholder: '✉  example@gmail.com', x: 40, y: 522, width: 220, height: 28, zIndex: 3, contentBinding: { sectionKey: 'contact', fieldKey: 'email', mode: 'dynamic', autoHeight: true, allowPageBreak: false }, style: { fontFamily, fontSize: 15, fontWeight: 500, color: '#FFFFFF' } }),
      text({ id: 'contact-location', fieldKey: 'location', label: 'Location', placeholder: '📍  #1 road, city/state-0011', x: 40, y: 558, width: 230, height: 42, zIndex: 3, contentBinding: { sectionKey: 'contact', fieldKey: 'location', mode: 'dynamic', autoHeight: true, allowPageBreak: false }, style: { fontFamily, fontSize: 15, fontWeight: 500, color: '#FFFFFF' } }),
      text({ id: 'skills-heading', fieldKey: 'custom', label: 'Skills Heading', placeholder: 'SKILLS', x: 40, y: 632, width: 210, height: 34, zIndex: 3, contentBinding: { sectionKey: 'skills', mode: 'static', collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 24, fontWeight: 900, color: '#FFFFFF' } }),
      textarea({ id: 'skills-list', fieldKey: 'skills', label: 'Skills list', placeholder: '<ul><li>SQL Database Management</li><li>Linux/Unix Command line</li><li>Python</li><li>C++</li><li>JAVA</li></ul>', x: 40, y: 680, width: 215, height: 120, zIndex: 3, contentBinding: { sectionKey: 'skills', fieldKey: 'skills', mode: 'dynamic', autoHeight: true, allowPageBreak: true, collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 15, fontWeight: 500, color: '#FFFFFF', lineHeight: 1.45 } }),
      text({ id: 'languages-heading', fieldKey: 'custom', label: 'Languages Heading', placeholder: 'LANGUAGES', x: 40, y: 850, width: 230, height: 34, zIndex: 3, contentBinding: { sectionKey: 'languages', mode: 'static', collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 24, fontWeight: 900, color: '#FFFFFF' } }),
      textarea({ id: 'languages-list', fieldKey: 'languages', label: 'Languages list', placeholder: '<ul><li><strong>English:</strong> Proficient</li><li><strong>Hindi:</strong> Proficient</li></ul>', x: 40, y: 898, width: 215, height: 80, zIndex: 3, contentBinding: { sectionKey: 'languages', fieldKey: 'languages', mode: 'dynamic', autoHeight: true, allowPageBreak: true, collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 15, fontWeight: 500, color: '#FFFFFF', lineHeight: 1.45 } }),
      text({ id: 'hobbies-heading', fieldKey: 'custom', label: 'Hobbies Heading', placeholder: 'HOBBIES', x: 40, y: 985, width: 210, height: 34, zIndex: 3, contentBinding: { sectionKey: 'hobbies', mode: 'static', collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 24, fontWeight: 900, color: '#FFFFFF' } }),
      textarea({ id: 'hobbies-list', fieldKey: 'hobbies', label: 'Hobbies list', placeholder: '<ul><li>Writing</li><li>Cricket</li><li>Music</li></ul>', x: 40, y: 1033, width: 215, height: 80, zIndex: 3, contentBinding: { sectionKey: 'hobbies', fieldKey: 'hobbies', mode: 'dynamic', autoHeight: true, allowPageBreak: true, collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 15, fontWeight: 500, color: '#FFFFFF', lineHeight: 1.45 } }),
      text({ id: 'profile-heading', fieldKey: 'custom', label: 'Profile Heading', placeholder: 'PROFILE', x: 330, y: 76, width: 390, height: 40, zIndex: 4, contentBinding: { sectionKey: 'summary', mode: 'static', collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 26, fontWeight: 900, color: '#111111' } }),
      textarea({ id: 'profile-text', fieldKey: 'summary', label: 'Profile body', placeholder: '<p>I am a software engineer with experience in a variety of programming languages and a track record of delivering high-quality code. I am skilled in problem-solving and have a strong background in computer science. I am a strong communicator and enjoy working collaboratively with others.</p>', x: 330, y: 126, width: 410, height: 120, zIndex: 4, contentBinding: { sectionKey: 'summary', fieldKey: 'summary', mode: 'dynamic', autoHeight: true, allowPageBreak: true, collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 16, fontWeight: 400, color: '#111111', lineHeight: 1.45, textAlign: 'justify' } }),
      text({ id: 'experience-heading', fieldKey: 'custom', label: 'Work Experience Heading', placeholder: 'WORK EXPERIENCE', x: 330, y: 286, width: 420, height: 42, zIndex: 4, contentBinding: { sectionKey: 'experience', mode: 'static', collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 27, fontWeight: 900, color: '#111111' } }),
      textarea({ id: 'experience-text', fieldKey: 'experience', label: 'Experience body', placeholder: '<p><strong>Senior Software Developer</strong><br/>Company – Country <span style="float:right">Jan 2022 – Dec 2023</span></p><ul><li>Developed and maintained software using Java, Python, and C++</li><li>Led cross-functional teams to deliver successful software projects</li><li>write a work experience of a senior software engineer in bullet points</li></ul><p><strong>Web Developer</strong><br/>Company – Country <span style="float:right">Jan 2021 – Dec 2021</span></p><ul><li>Developed and maintained various web applications using languages such as HTML, CSS, JavaScript, and PHP</li><li>Worked with cross-functional teams to gather requirements and design user interfaces</li></ul>', x: 330, y: 340, width: 410, height: 330, zIndex: 4, contentBinding: { sectionKey: 'experience', fieldKey: 'experience', mode: 'dynamic', autoHeight: true, allowPageBreak: true, collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 16, fontWeight: 400, color: '#111111', lineHeight: 1.45 } }),
      text({ id: 'education-heading', fieldKey: 'custom', label: 'Education Heading', placeholder: 'EDUCATION', x: 330, y: 780, width: 420, height: 42, zIndex: 4, contentBinding: { sectionKey: 'education', mode: 'static', collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 27, fontWeight: 900, color: '#111111' } }),
      textarea({ id: 'education-text', fieldKey: 'education', label: 'Education body', placeholder: '<p><strong>Masters in Software Engineering</strong></p><p>Jan 2019 – Dec 2020</p><p><em>XYX University, Bangalore</em></p><p><strong>Bachelor in Computer Science</strong></p><p>Jan 2015 – Dec 2018</p><p><em>XYX University, Bangalore</em></p>', x: 330, y: 834, width: 410, height: 230, zIndex: 4, contentBinding: { sectionKey: 'education', fieldKey: 'education', mode: 'dynamic', autoHeight: true, allowPageBreak: true, collapseWhenEmpty: true, reflowSiblings: true }, style: { fontFamily, fontSize: 16, fontWeight: 400, color: '#111111', lineHeight: 1.45 } }),
    ];
  }

  return [
    text({
      id: 'classic-name',
      fieldKey: 'fullName',
      label: 'Full Name Text',
      placeholder: 'Emily Carter',
      x: 80,
      y: 70,
      width: 630,
      height: 42,
      zIndex: 2,
      contentBinding: { sectionKey: 'contact', fieldKey: 'fullName', mode: 'dynamic', autoHeight: true, allowPageBreak: false },
      style: { fontFamily, fontSize: 25, fontWeight: 800, color: '#111827', textAlign: 'center' },
    }),
    text({
      id: 'classic-title',
      fieldKey: 'professionalTitle',
      label: 'Professional Title Text',
      placeholder: 'Project Manager',
      x: 80,
      y: 115,
      width: 630,
      height: 24,
      zIndex: 2,
      contentBinding: { sectionKey: 'contact', fieldKey: 'professionalTitle', mode: 'dynamic', autoHeight: true, allowPageBreak: false },
      style: { fontFamily, fontSize: 14, color: '#4B5563', textAlign: 'center' },
    }),
    createElement({
      id: 'classic-line-1',
      type: 'horizontalLine',
      fieldKey: 'custom',
      label: 'Divider',
      placeholder: '',
      x: 80,
      y: 205,
      width: 630,
      height: 2,
      zIndex: 2,
      style: { backgroundColor: primaryColor, borderColor: primaryColor, borderWidth: 2 },
    }),
    text({
      id: 'classic-summary-heading',
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
    textarea({
      id: 'classic-summary-text',
      fieldKey: 'summary',
      label: 'Summary Dynamic Text',
      placeholder: '<p>Professional summary goes here and grows with content.</p>',
      x: 80,
      y: 260,
      width: 630,
      height: 90,
      zIndex: 2,
      contentBinding: { sectionKey: 'summary', fieldKey: 'summary', mode: 'dynamic', autoHeight: true, allowPageBreak: true },
      style: { fontFamily, fontSize: 12, color: '#111827', backgroundColor: accentColor, textAlign: 'justify' },
    }),
  ];
};
