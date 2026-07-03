export interface CvTemplateItem {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCvTemplatePayload {
  name: string;
  imageUrl: string;
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

export interface DeleteCvTemplateResponse {
  message: string;
  templateId: string;
}
