export type ResumeTemplateStatus = "draft" | "published" | "archived";
export type ResumeTemplateVersionStatus = "draft" | "published" | "archived";

export type ResumeSectionKey =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "languages"
  | "certifications"
  | "references";

export type ResumeFieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "url"
  | "date"
  | "image"
  | "repeatable"
  | "select"
  | "tags"
  | "boolean";

export type ResumeSectionZone = "header" | "main" | "sidebar" | "footer";
export type ResumeTemplateLayout = "single-column" | "two-column" | "custom";
export type ResumeSidebarContinuation = "not-applicable" | "template-managed";

export interface ResumeFieldDefinition {
  key: string;
  label: string;
  type: ResumeFieldType;
  enabled: boolean;
  required?: boolean;
  hidden?: boolean;
  maxLength?: number;
  maxItems?: number;
  options?: string[];
  aiAssist?: "summary-suggestions";
}

export interface ResumeSectionDefinition {
  key: ResumeSectionKey;
  label: string;
  enabled: boolean;
  required?: boolean;
  hidden?: boolean;
  order: number;
  zone?: ResumeSectionZone;
  maxItems?: number;
  fields?: ResumeFieldDefinition[];
}

export interface ResumeTemplateFieldSchema {
  version: 1;
  sections: ResumeSectionDefinition[];
}

export interface ResumeRendererConfig {
  layout: ResumeTemplateLayout;
  sidebarContinuation: ResumeSidebarContinuation;
  recommendedMaxPages: number;
  hardMaxPages: number;
  locale?: string;
}

export interface ResumeTemplate {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  isPremium: boolean;
  sortOrder: number;
  status: ResumeTemplateStatus;
  publishedVersionId: string | null;
  publishedVersionNumber: number | null;
  previewPdfStorageKey: string | null;
  previewImageStorageKey: string | null;
  createdByAdminId: string | null;
  updatedByAdminId: string | null;
  createdAt: string;
  updatedAt: string;
  previewPdfUrl?: string | null;
  previewImageUrl?: string | null;
}

export interface ResumeTemplateVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  status: ResumeTemplateVersionStatus;
  html: string;
  css: string;
  fieldSchema: ResumeTemplateFieldSchema;
  rendererConfig: ResumeRendererConfig;
  sampleData: Record<string, unknown> | null;
  checksum: string;
  createdByAdminId: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface ResumeTemplateAdminListResponse {
  items: ResumeTemplate[];
  total: number;
  page: number;
  limit: number;
}

export interface ResumeTemplateAdminDetailResponse {
  template: ResumeTemplate;
  versions: ResumeTemplateVersion[];
  previewPdfUrl: string | null;
  previewImageUrl: string | null;
}

export interface ResumeTemplateContract {
  defaultFieldSchema: ResumeTemplateFieldSchema;
  placeholderSyntax: {
    value: string;
    condition: string;
    list: string;
    parent: string;
    index: string;
  };
  markupConventions: {
    hideEmptySection: string;
    avoidEntrySplit: string;
    avoidOrphanHeading: string;
    cropPhoto: string;
  };
  security: string;
  aiAssist: {
    summary: string;
  };
  fieldInference: {
    endpoint: string;
    behavior: string;
  };
  sampleData: {
    behavior: string;
    supportedTopLevelKeys: string[];
  };
  aiCodeGenerationInstructions: string;
  publishedPreview: string;
  rendering: string;
}

export interface ResumeTemplateFieldInferenceResponse {
  fieldSchema: ResumeTemplateFieldSchema;
  detectedSectionKeys: ResumeSectionKey[];
  detectedFieldKeys: string[];
  ignoredPlaceholders: string[];
}

export interface InferResumeTemplateFieldSchemaPayload {
  html: string;
  currentFieldSchema?: ResumeTemplateFieldSchema;
}

export interface ResumeTemplateSourcePayload {
  html: string;
  css: string;
  fieldSchema: ResumeTemplateFieldSchema;
  rendererConfig: ResumeRendererConfig;
  sampleData?: Record<string, unknown>;
}

export interface CreateResumeTemplatePayload extends ResumeTemplateSourcePayload {
  name: string;
  slug: string;
  description?: string;
  category: string;
  isPremium?: boolean;
  sortOrder?: number;
}

export interface CreateResumeTemplateResponse {
  template: ResumeTemplate;
  draftVersion: ResumeTemplateVersion;
}

export interface UpdateResumeTemplateMetadataPayload {
  name?: string;
  description?: string;
  category?: string;
  isPremium?: boolean;
  sortOrder?: number;
}

export interface ResumeTemplateAdminQuery {
  search?: string;
  category?: string;
  status?: ResumeTemplateStatus | "";
  page?: number;
  limit?: number;
}

export interface ResumeTemplateEditorMetadata {
  name: string;
  slug: string;
  description: string;
  category: string;
  isPremium: boolean;
  sortOrder: number;
}

export interface ResumeTemplateEditorState {
  metadata: ResumeTemplateEditorMetadata;
  html: string;
  css: string;
  sampleDataJson: string;
  fieldSchema: ResumeTemplateFieldSchema;
  rendererConfig: ResumeRendererConfig;
}

export type ResumeTemplateAutosaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "error";
