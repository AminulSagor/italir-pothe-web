export type CvTemplateStatus = 'draft' | 'active';
export type CvTemplateStyleType = 'ats' | 'modern_column' | 'classic' | 'creative';
export type CvTemplatePageSize = 'a4' | 'letter';

export type CvBuilderElementType =
  | 'text'
  | 'textarea'
  | 'rectangle'
  | 'circle'
  | 'horizontalLine'
  | 'verticalLine'
  | 'line'
  | 'icon'
  | 'list'
  | 'dynamicItems'
  | 'section';

export type CvBuilderThemeColorRole = 'primary' | 'accent' | 'custom';

export type CvBuilderFieldKey =
  | 'fullName'
  | 'professionalTitle'
  | 'email'
  | 'phone'
  | 'location'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certificates'
  | 'projects'
  | 'custom'
  | string;

export type CvTemplateFieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'list'
  | 'date'
  | 'imageUrl'
  | 'photoUrl'
  | 'website'
  | 'dynamicItems';

export interface CvTemplateDynamicItemFieldSchema {
  key: string;
  label: string;
  type: Exclude<CvTemplateFieldType, 'dynamicItems' | 'photoUrl' | 'imageUrl'>;
  required?: boolean;
  placeholder?: string;
}

export interface CvTemplateFieldSchema {
  key: string;
  label: string;
  type: CvTemplateFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  listStyle?: 'bullet' | 'number';
  repeatGap?: number;
  itemFields?: CvTemplateDynamicItemFieldSchema[];
}

export interface CvTemplateSectionDesignerElement {
  id: string;
  type: CvBuilderElementType;
  fieldKey: string;
  label: string;
  previewValue: string;
  isField?: boolean;
  richTextFormat?: 'plain' | 'html';
  hyperlink?: string;
  iconName?: 'github' | 'linkedin' | 'weblink' | 'phone' | 'location' | 'email';
  listStyle?: 'bullet' | 'number';
  contentFlow?: CvBuilderElementFlowSchema;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  style: CvBuilderElementStyle;
}

export interface CvTemplateSectionDynamicItemSchema {
  enabled: boolean;
  fieldKey: string;
  fieldLabel: string;
  repeatGap?: number;
  itemFields: CvTemplateDynamicItemFieldSchema[];
}

export interface CvTemplateSectionDesignerSchema {
  version: number;
  canvas: {
    width: number;
    height: number;
    unit: 'px';
  };
  contentFlow?: {
    fitToContent: boolean;
    autoCropOnSave: boolean;
    collapseEmptyFields: boolean;
    autoGrowFields: boolean;
    autoCreatePages: boolean;
    overflowBehavior: 'grow_section' | 'create_new_page';
    stackingStrategy: 'flow_relative' | 'absolute_with_reflow';
    baseWidth: number;
    baseHeight: number;
  };
  elements: CvTemplateSectionDesignerElement[];
  dynamicItem?: CvTemplateSectionDynamicItemSchema;
}

export interface CvTemplateSectionSchema {
  key: string;
  title: string;
  required: boolean;
  fields: CvTemplateFieldSchema[];
  designerJson?: CvTemplateSectionDesignerSchema;
  dynamicItem?: CvTemplateSectionDynamicItemSchema;
}


export interface CvBuilderPageLayout {
  size: CvTemplatePageSize;
  width: number;
  height: number;
  unit: 'px';
  backgroundColor: string;
}

export interface CvBuilderElementStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  opacity?: number;
  colorRole?: CvBuilderThemeColorRole;
  backgroundColorRole?: CvBuilderThemeColorRole;
  borderColorRole?: CvBuilderThemeColorRole;
}

export interface CvBuilderElementFlowSchema {
  flowOrder?: number;
  collapseWhenEmpty?: boolean;
  reserveSpaceWhenEmpty?: boolean;
  autoHeight?: boolean;
  allowPageBreak?: boolean;
  moveFollowingElements?: boolean;
  growDirection?: 'down' | 'right';
}

export interface CvBuilderContentBinding {
  sectionKey?: string;
  fieldKey?: string;
  mode: 'static' | 'dynamic';
  autoHeight?: boolean;
  allowPageBreak?: boolean;
  repeatItemGap?: number;
  collapseWhenEmpty?: boolean;
  reflowSiblings?: boolean;
}

export interface CvBuilderLayoutElement {
  id: string;
  type: CvBuilderElementType;
  fieldKey: CvBuilderFieldKey;
  label: string;
  placeholder: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  locked?: boolean;
  hyperlink?: string;
  iconName?: 'github' | 'linkedin' | 'weblink' | 'phone' | 'location' | 'email';
  richTextFormat?: 'plain' | 'html';
  listStyle?: 'bullet' | 'number';
  sectionDesignerJson?: CvTemplateSectionDesignerSchema;
  contentBinding?: CvBuilderContentBinding;
  style: CvBuilderElementStyle;
}

export interface CvTemplateContentFlowSchema {
  mode: 'fixed' | 'auto_paginated_sections';
  autoCreatePages: boolean;
  pageBreakStrategy: 'section_boundary' | 'element_boundary';
  overflowBehavior: 'move_to_next_page' | 'shrink_to_fit';
  sectionGap: number;
  collapseEmptySections?: boolean;
  reflowAfterCollapse?: boolean;
  growDynamicSections?: boolean;
}

export interface CvTemplateLayoutSchema {
  version: number;
  format?: 'cv_visual_template_json';
  page: CvBuilderPageLayout;
  contentFlow?: CvTemplateContentFlowSchema;
  elements: CvBuilderLayoutElement[];
}

export interface CvTemplateSchema {
  sections: CvTemplateSectionSchema[];
  colorOptions?: string[];
  designJson?: CvTemplateLayoutSchema;
  layout?: CvTemplateLayoutSchema;
}

export interface CvTemplateItem {
  id: string;
  title: string;
  description: string | null;
  styleType: CvTemplateStyleType;
  pageSize: CvTemplatePageSize;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  isPremium: boolean;
  status: CvTemplateStatus;
  previewImageUrl: string | null;
  schema: CvTemplateSchema;
  createdByAdminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CvTemplatePayload {
  title: string;
  description?: string | null;
  styleType: CvTemplateStyleType;
  pageSize: CvTemplatePageSize;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  isPremium: boolean;
  status: CvTemplateStatus;
  previewImageUrl?: string | null;
  schema: CvTemplateSchema;
}

export interface CvPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface CvTemplateListResponse {
  templates: CvTemplateItem[];
  pagination: CvPagination;
}

export interface CvTemplateMutationResponse {
  message: string;
  template: CvTemplateItem;
}

export interface CvTemplateDetailsResponse {
  template: CvTemplateItem;
}

export interface DeleteCvTemplateResponse {
  message: string;
  templateId: string;
}

export interface CvTemplateDefaultLayoutItem {
  id: string;
  styleType: CvTemplateStyleType;
  pageSize: CvTemplatePageSize;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  schema: CvTemplateSchema;
  updatedByAdminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CvTemplateDefaultLayoutResponse {
  layout: CvTemplateDefaultLayoutItem | null;
}

export interface CvTemplateDefaultLayoutMutationResponse {
  message: string;
  layout: CvTemplateDefaultLayoutItem;
}

export interface CvTemplateDefaultLayoutPayload {
  pageSize: CvTemplatePageSize;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  schema: CvTemplateSchema;
}
