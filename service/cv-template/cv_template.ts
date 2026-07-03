import { serviceClient } from "@/service/base/service_client";
import type {
  CreateCvTemplatePayload,
  CvTemplateListResponse,
  CvTemplateMutationResponse,
  DeleteCvTemplateResponse,
} from "@/types/cv-template/cv_template_type";

const buildTemplateQuery = (page: number, limit: number, search: string) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    query.set("search", normalizedSearch);
  }

  return query.toString();
};

export const getCvTemplates = (page = 1, limit = 9, search = "") =>
  serviceClient.get<CvTemplateListResponse>(
    `/admin/cv-templates?${buildTemplateQuery(page, limit, search)}`,
  );

export const createCvTemplate = (payload: CreateCvTemplatePayload) =>
  serviceClient.post<CvTemplateMutationResponse>(
    "/admin/cv-templates",
    payload,
  );

export const deleteCvTemplate = (templateId: string) =>
  serviceClient.delete<DeleteCvTemplateResponse>(
    `/admin/cv-templates/${templateId}`,
  );
