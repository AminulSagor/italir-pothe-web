import { serviceClient } from "@/service/base/service_client";
import {
  confirmUpload,
  createSignedReadUrl,
  createSignedUploadUrl,
  uploadToSignedUrl,
} from "@/service/files/file_upload";
import type {
  CreateSurvivalSituationPayload,
  SurvivalSituation,
  SurvivalSituationListParams,
  SurvivalSituationListResponse,
  SurvivalSummaryMetrics,
  UpdateSurvivalSituationPayload,
} from "@/types/survival-italian/survival-italian.type";

const SURVIVAL_ITALIAN_ENDPOINTS = {
  situations: "/admin/survival-italian/situations",
  summary: "/admin/survival-italian/situations/summary",
  details: (situationId: string) =>
    `/admin/survival-italian/situations/${situationId}`,
} as const;

interface SurvivalSituationListApiResponse {
  items: SurvivalSituation[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    sortBy?: string;
    sortOrder?: string;
  };
}

const buildQueryString = (params: SurvivalSituationListParams) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

const normalizeSituationListResponse = (
  response: SurvivalSituationListApiResponse,
): SurvivalSituationListResponse => {
  return {
    items: response.items,
    page: response.meta?.page || 1,
    limit: response.meta?.limit || response.items.length,
    totalItems: response.meta?.total || response.items.length,
    totalPages: response.meta?.totalPages || 1,
  };
};

export const getSurvivalSummaryMetrics = () =>
  serviceClient.get<SurvivalSummaryMetrics>(SURVIVAL_ITALIAN_ENDPOINTS.summary);

export const getSurvivalSituations = async (
  params: SurvivalSituationListParams = {},
) => {
  const response = await serviceClient.get<SurvivalSituationListApiResponse>(
    `${SURVIVAL_ITALIAN_ENDPOINTS.situations}${buildQueryString(params)}`,
  );

  return normalizeSituationListResponse(response);
};

export const getSurvivalSituationDetails = (situationId: string) =>
  serviceClient.get<SurvivalSituation>(
    SURVIVAL_ITALIAN_ENDPOINTS.details(situationId),
  );

export const createSurvivalSituation = (
  payload: CreateSurvivalSituationPayload,
) =>
  serviceClient.post<SurvivalSituation>(
    SURVIVAL_ITALIAN_ENDPOINTS.situations,
    payload,
  );

export const updateSurvivalSituation = (
  situationId: string,
  payload: UpdateSurvivalSituationPayload,
) =>
  serviceClient.patch<SurvivalSituation>(
    SURVIVAL_ITALIAN_ENDPOINTS.details(situationId),
    payload,
  );

export const deleteSurvivalSituation = (situationId: string) =>
  serviceClient.delete<{ message: string }>(
    SURVIVAL_ITALIAN_ENDPOINTS.details(situationId),
  );

export const getSurvivalResourceReadUrl = async (resourceFileId: string) => {
  const response = await createSignedReadUrl(resourceFileId);

  return response.signedReadUrl || response.publicUrl;
};

export const uploadSurvivalPdf = async (file: File) => {
  const mimeType = file.type || "application/pdf";

  const signedUpload = await createSignedUploadUrl({
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "survival_pdf",
    visibility: "private",
  });

  await uploadToSignedUrl(signedUpload.signedUploadUrl, file, mimeType);

  const confirmedUpload = await confirmUpload({
    storageKey: signedUpload.storageKey,
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "survival_pdf",
    visibility: "private",
    title: file.name,
    mediaType: "pdf",
  });

  return confirmedUpload.file.id;
};
