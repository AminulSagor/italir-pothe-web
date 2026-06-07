export type CvTemplateStatus = 'draft' | 'active' | 'archived';
export type CvTemplateStyleType = 'ats' | 'modern_column' | 'classic' | 'creative';
export type CvTemplatePageSize = 'a4' | 'letter';

export type CvBuilderElementType =
  | 'text'
  | 'section'
  | 'rectangle'
  | 'circle'
  | 'line';

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
  | 'custom';

export interface CvTemplateFieldSchema {
  key: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'list' | 'date';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface CvTemplateSectionSchema {
  key: string;
  title: string;
  required: boolean;
  fields: CvTemplateFieldSchema[];
}

export interface CvBuilderPageLayout {
  size: CvTemplatePageSize;
  width: number;
  height: number;
  unit: 'px';
  margin: number;
  backgroundColor: string;
}

export interface CvBuilderElementStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
  opacity?: number;
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
  style: CvBuilderElementStyle;
}

export interface CvTemplateLayoutSchema {
  version: number;
  page: CvBuilderPageLayout;
  elements: CvBuilderLayoutElement[];
}

export interface CvTemplateSchema {
  sections: CvTemplateSectionSchema[];
  colorOptions?: string[];
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
