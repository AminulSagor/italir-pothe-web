import { serviceClient } from '@/service/base/service_client';
import type {
  CvTemplateDetailsResponse,
  CvTemplateListResponse,
  CvTemplateMutationResponse,
  CvTemplatePayload,
  DeleteCvTemplateResponse,
} from '@/types/cv-template/cv_template_type';

const buildPaginationQuery = (page: number, limit: number) =>
  `page=${page}&limit=${limit}`;

export const getCvTemplates = (page = 1, limit = 20) =>
  serviceClient.get<CvTemplateListResponse>(
    `/admin/cv-templates?${buildPaginationQuery(page, limit)}`,
  );

export const getCvTemplateById = (templateId: string) =>
  serviceClient.get<CvTemplateDetailsResponse>(
    `/admin/cv-templates/${templateId}`,
  );

export const createCvTemplate = (payload: CvTemplatePayload) =>
  serviceClient.post<CvTemplateMutationResponse>('/admin/cv-templates', payload);

export const updateCvTemplate = (
  templateId: string,
  payload: CvTemplatePayload,
) =>
  serviceClient.patch<CvTemplateMutationResponse>(
    `/admin/cv-templates/${templateId}`,
    payload,
  );

export const deleteCvTemplate = (templateId: string) =>
  serviceClient.delete<DeleteCvTemplateResponse>(
    `/admin/cv-templates/${templateId}`,
  );
