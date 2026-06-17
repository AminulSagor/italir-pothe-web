import { serviceClient } from "@/service/base/service_client";
import {
  confirmUpload,
  createSignedReadUrl,
  createSignedUploadUrl,
  uploadToSignedUrl,
} from "@/service/files/file_upload";
import type {
  CareerTrackListParams,
  CareerTrackListResponse,
  CareerTrackModuleListParams,
  CareerTrackModuleListResponse,
  CareerTrackSummaryMetrics,
  CreateCareerTrackModulePayload,
  CreateCareerTrackPayload,
  CreateSkillBuilderSentencePayload,
  SkillBuilderCareerTrack,
  SkillBuilderCareerTrackModule,
  SkillBuilderSentence,
  SkillBuilderSentenceListParams,
  SkillBuilderSentenceListResponse,
  UpdateCareerTrackModulePayload,
  UpdateCareerTrackPayload,
  UpdateCareerTrackResourcesPayload,
  UpdateSkillBuilderSentencePayload,
} from "@/types/skill-builder/skill-builder.type";

const SKILL_BUILDER_ENDPOINTS = {
  careerTracks: "/admin/skill-builder/career-tracks",
  careerTracksSummary: "/admin/skill-builder/career-tracks/summary",
  careerTrackDetails: (careerTrackId: string) =>
    `/admin/skill-builder/career-tracks/${careerTrackId}`,
  careerTrackResources: (careerTrackId: string) =>
    `/admin/skill-builder/career-tracks/${careerTrackId}/resources`,
  syncCareerTrack: (careerTrackId: string) =>
    `/admin/skill-builder/career-tracks/${careerTrackId}/sync`,
  careerTrackModules: (careerTrackId: string) =>
    `/admin/skill-builder/career-tracks/${careerTrackId}/modules`,
  moduleDetails: (moduleId: string) =>
    `/admin/skill-builder/modules/${moduleId}`,
  moduleSentences: (moduleId: string) =>
    `/admin/skill-builder/modules/${moduleId}/sentences`,
  sentenceDetails: (sentenceId: string) =>
    `/admin/skill-builder/sentences/${sentenceId}`,
} as const;

type ListApiResponse<T> =
  | T[]
  | {
      items?: T[];
      data?: T[];
      meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalItems?: number;
        totalPages?: number;
      };
    };

type CareerTrackMutationApiResponse =
  | SkillBuilderCareerTrack
  | {
      careerTrack?: SkillBuilderCareerTrack;
      data?: SkillBuilderCareerTrack;
    };

const buildQueryString = (
  params: Record<string, string | number | undefined>,
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

const normalizeListResponse = <T>(
  response: ListApiResponse<T>,
): {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
} => {
  const items = Array.isArray(response)
    ? response
    : response.items || response.data || [];

  if (Array.isArray(response)) {
    return {
      items,
      page: 1,
      limit: items.length,
      totalItems: items.length,
      totalPages: 1,
    };
  }

  return {
    items,
    page: response.meta?.page || 1,
    limit: response.meta?.limit || items.length,
    totalItems:
      response.meta?.total || response.meta?.totalItems || items.length,
    totalPages: response.meta?.totalPages || 1,
  };
};

const normalizeCareerTrackMutationResponse = (
  response: CareerTrackMutationApiResponse,
): SkillBuilderCareerTrack => {
  if ("id" in response) return response;

  const careerTrack = response.careerTrack || response.data;

  if (!careerTrack) {
    throw new Error("Career track response is missing track data.");
  }

  return careerTrack;
};

export const getCareerTrackSummaryMetrics = () =>
  serviceClient.get<CareerTrackSummaryMetrics>(
    SKILL_BUILDER_ENDPOINTS.careerTracksSummary,
  );

export const getCareerTracks = async (
  params: CareerTrackListParams = {},
): Promise<CareerTrackListResponse> => {
  const response = await serviceClient.get<
    ListApiResponse<SkillBuilderCareerTrack>
  >(
    `${SKILL_BUILDER_ENDPOINTS.careerTracks}${buildQueryString({
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
    })}`,
  );

  return normalizeListResponse(response);
};

export const getCareerTrackDetails = (careerTrackId: string) =>
  serviceClient.get<SkillBuilderCareerTrack>(
    SKILL_BUILDER_ENDPOINTS.careerTrackDetails(careerTrackId),
  );

export const createCareerTrack = async (
  payload: CreateCareerTrackPayload,
): Promise<SkillBuilderCareerTrack> => {
  const response = await serviceClient.post<CareerTrackMutationApiResponse>(
    SKILL_BUILDER_ENDPOINTS.careerTracks,
    payload,
  );

  return normalizeCareerTrackMutationResponse(response);
};

export const updateCareerTrack = async (
  careerTrackId: string,
  payload: UpdateCareerTrackPayload,
): Promise<SkillBuilderCareerTrack> => {
  const response = await serviceClient.patch<CareerTrackMutationApiResponse>(
    SKILL_BUILDER_ENDPOINTS.careerTrackDetails(careerTrackId),
    payload,
  );

  return normalizeCareerTrackMutationResponse(response);
};

export const updateCareerTrackResources = async (
  careerTrackId: string,
  payload: UpdateCareerTrackResourcesPayload,
): Promise<SkillBuilderCareerTrack> => {
  const response = await serviceClient.patch<CareerTrackMutationApiResponse>(
    SKILL_BUILDER_ENDPOINTS.careerTrackResources(careerTrackId),
    payload,
  );

  return normalizeCareerTrackMutationResponse(response);
};

export const syncCareerTrack = (careerTrackId: string) =>
  serviceClient.post<SkillBuilderCareerTrack>(
    SKILL_BUILDER_ENDPOINTS.syncCareerTrack(careerTrackId),
  );

export const deleteCareerTrack = (careerTrackId: string) =>
  serviceClient.delete<{ message?: string }>(
    SKILL_BUILDER_ENDPOINTS.careerTrackDetails(careerTrackId),
  );

export const getCareerTrackModules = async (
  careerTrackId: string,
  params: CareerTrackModuleListParams = {},
): Promise<CareerTrackModuleListResponse> => {
  const response = await serviceClient.get<
    ListApiResponse<SkillBuilderCareerTrackModule>
  >(
    `${SKILL_BUILDER_ENDPOINTS.careerTrackModules(
      careerTrackId,
    )}${buildQueryString({
      page: params.page,
      limit: params.limit,
      search: params.search,
    })}`,
  );

  return normalizeListResponse(response);
};

export const createCareerTrackModule = (
  careerTrackId: string,
  payload: CreateCareerTrackModulePayload,
) =>
  serviceClient.post<SkillBuilderCareerTrackModule>(
    SKILL_BUILDER_ENDPOINTS.careerTrackModules(careerTrackId),
    payload,
  );

export const updateCareerTrackModule = (
  moduleId: string,
  payload: UpdateCareerTrackModulePayload,
) =>
  serviceClient.patch<SkillBuilderCareerTrackModule>(
    SKILL_BUILDER_ENDPOINTS.moduleDetails(moduleId),
    payload,
  );

export const deleteCareerTrackModule = (moduleId: string) =>
  serviceClient.delete<{ message?: string }>(
    SKILL_BUILDER_ENDPOINTS.moduleDetails(moduleId),
  );

export const getSkillBuilderSentences = async (
  moduleId: string,
  params: SkillBuilderSentenceListParams = {},
): Promise<SkillBuilderSentenceListResponse> => {
  const response = await serviceClient.get<
    ListApiResponse<SkillBuilderSentence>
  >(
    `${SKILL_BUILDER_ENDPOINTS.moduleSentences(moduleId)}${buildQueryString({
      page: params.page,
      limit: params.limit,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    })}`,
  );

  return normalizeListResponse(response);
};

export const createSkillBuilderSentence = (
  moduleId: string,
  payload: CreateSkillBuilderSentencePayload,
) =>
  serviceClient.post<SkillBuilderSentence>(
    SKILL_BUILDER_ENDPOINTS.moduleSentences(moduleId),
    payload,
  );

export const updateSkillBuilderSentence = (
  sentenceId: string,
  payload: UpdateSkillBuilderSentencePayload,
) =>
  serviceClient.patch<SkillBuilderSentence>(
    SKILL_BUILDER_ENDPOINTS.sentenceDetails(sentenceId),
    payload,
  );

export const deleteSkillBuilderSentence = (sentenceId: string) =>
  serviceClient.delete<{ message?: string }>(
    SKILL_BUILDER_ENDPOINTS.sentenceDetails(sentenceId),
  );

export const getSkillBuilderFileReadUrl = async (fileId: string) => {
  const response = await createSignedReadUrl(fileId);

  return response.signedReadUrl || response.publicUrl;
};

export const uploadSkillBuilderVideo = async (file: File) => {
  const mimeType = file.type || "video/mp4";

  const signedUpload = await createSignedUploadUrl({
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "skill_builder_video",
    visibility: "private",
  });

  await uploadToSignedUrl(signedUpload.signedUploadUrl, file, mimeType);

  const confirmedUpload = await confirmUpload({
    storageKey: signedUpload.storageKey,
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "skill_builder_video",
    visibility: "private",
    mediaType: "video",
    title: file.name,
  });

  return confirmedUpload.file.id;
};

export const uploadSkillBuilderPdf = async (file: File) => {
  const mimeType = file.type || "application/pdf";

  const signedUpload = await createSignedUploadUrl({
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "skill_builder_pdf",
    visibility: "private",
  });

  await uploadToSignedUrl(signedUpload.signedUploadUrl, file, mimeType);

  const confirmedUpload = await confirmUpload({
    storageKey: signedUpload.storageKey,
    originalName: file.name,
    mimeType,
    sizeBytes: file.size,
    filePurpose: "skill_builder_pdf",
    visibility: "private",
    mediaType: "pdf",
    title: file.name,
  });

  return confirmedUpload.file.id;
};

export const getCareerTrackModuleDetails = (moduleId: string) =>
  serviceClient.get<SkillBuilderCareerTrackModule>(
    SKILL_BUILDER_ENDPOINTS.moduleDetails(moduleId),
  );
