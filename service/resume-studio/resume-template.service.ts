import { serviceClient } from "@/service/base/service_client";
import type {
  CreateResumeTemplatePayload,
  CreateResumeTemplateResponse,
  InferResumeTemplateFieldSchemaPayload,
  ResumeTemplate,
  ResumeTemplateAdminDetailResponse,
  ResumeTemplateAdminListResponse,
  ResumeTemplateAdminQuery,
  ResumeTemplateContract,
  ResumeTemplateFieldInferenceResponse,
  ResumeTemplateSourcePayload,
  UpdateResumeTemplateMetadataPayload,
} from "@/types/resume-studio/resume-template.types";

const buildQuery = (query: ResumeTemplateAdminQuery = {}) => {
  const params = new URLSearchParams();

  if (query.search?.trim()) {
    params.set("search", query.search.trim());
  }

  if (query.category?.trim()) {
    params.set("category", query.category.trim().toLowerCase());
  }

  if (query.status) {
    params.set("status", query.status);
  }

  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 20));

  return params.toString();
};

export const getResumeTemplateContract = () =>
  serviceClient.get<ResumeTemplateContract>(
    "/admin/resume-studio/template-contract",
  );

export const getResumeTemplates = (query: ResumeTemplateAdminQuery = {}) =>
  serviceClient.get<ResumeTemplateAdminListResponse>(
    `/admin/resume-studio/templates?${buildQuery(query)}`,
  );

export const getResumeTemplate = (templateId: string) =>
  serviceClient.get<ResumeTemplateAdminDetailResponse>(
    `/admin/resume-studio/templates/${templateId}`,
  );

export const createResumeTemplate = (payload: CreateResumeTemplatePayload) =>
  serviceClient.post<CreateResumeTemplateResponse>(
    "/admin/resume-studio/templates",
    payload,
  );

export const updateResumeTemplateMetadata = (
  templateId: string,
  payload: UpdateResumeTemplateMetadataPayload,
) =>
  serviceClient.patch<ResumeTemplate>(
    `/admin/resume-studio/templates/${templateId}`,
    payload,
  );

export const saveResumeTemplateDraft = (
  templateId: string,
  payload: ResumeTemplateSourcePayload,
) =>
  serviceClient.put(
    `/admin/resume-studio/templates/${templateId}/draft`,
    payload,
  );

export const inferResumeTemplateFieldSchema = (
  payload: InferResumeTemplateFieldSchemaPayload,
) =>
  serviceClient.post<ResumeTemplateFieldInferenceResponse>(
    "/admin/resume-studio/templates/infer-field-schema",
    payload,
  );

export const previewResumeTemplate = (payload: ResumeTemplateSourcePayload) =>
  serviceClient.postFile(
    "/admin/resume-studio/templates/preview",
    payload,
    "resume-template-preview.pdf",
  );

export const publishResumeTemplate = (templateId: string) =>
  serviceClient.post<ResumeTemplateAdminDetailResponse>(
    `/admin/resume-studio/templates/${templateId}/publish`,
  );

export const archiveResumeTemplate = (templateId: string) =>
  serviceClient.post<ResumeTemplate>(
    `/admin/resume-studio/templates/${templateId}/archive`,
  );
