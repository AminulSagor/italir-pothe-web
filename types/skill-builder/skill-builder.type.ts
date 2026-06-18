export type SkillBuilderCareerTrackStatus = "draft" | "published" | "archived";

export type SkillBuilderSortOrder = "ASC" | "DESC";
export type SkillBuilderSentenceSortBy = "sortOrder";

export interface SkillBuilderFileReference {
  id: string;
  originalName?: string;
  fileName?: string;
  name?: string;
  title?: string;
  mimeType?: string;
  publicUrl?: string;
  signedReadUrl?: string;
}

export interface SkillBuilderCareerTrackModule {
  id: string;
  name: string;
  subtitleBn?: string | null;
  sortOrder: number;
  sentenceCount?: number;
  totalSentences?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillBuilderCareerTrack {
  id: string;
  title: string;
  subtitleBn?: string | null;
  description?: string | null;
  iconKey: string;
  cardColor: string;
  introVideoFileId: string;
  theoryResourceFileId: string;
  introVideoFile?: SkillBuilderFileReference | null;
  theoryResourceFile?: SkillBuilderFileReference | null;
  sortOrder: number;
  status: SkillBuilderCareerTrackStatus;
  moduleCount?: number;
  modulesCount?: number;
  totalModules?: number;
  sentenceCount?: number;
  sentencesCount?: number;
  totalSentences?: number;
  modules?: SkillBuilderCareerTrackModule[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  syncedAt?: string | null;
  lastSyncedAt?: string | null;
}

export interface CreateCareerTrackPayload {
  title: string;
  subtitleBn?: string;
  description?: string;
  iconKey: string;
  cardColor: string;
  introVideoFileId: string;
  theoryResourceFileId: string;
  sortOrder: number;
}

export interface UpdateCareerTrackPayload {
  title: string;
  subtitleBn?: string;
  description?: string;
  iconKey: string;
  cardColor: string;
  sortOrder: number;
}

export interface UpdateCareerTrackResourcesPayload {
  introVideoFileId?: string | null;
  theoryResourceFileId?: string | null;
}

export interface CareerTrackListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SkillBuilderCareerTrackStatus;
}

export interface CareerTrackListResponse {
  items: SkillBuilderCareerTrack[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CareerTrackSummaryMetrics {
  totalCareerTracks?: number;
  totalTracks?: number;
  draftTracks?: number;
  publishedTracks?: number;
  totalModules?: number;
  totalSentences?: number;
}

export interface CreateCareerTrackModulePayload {
  name: string;
  subtitleBn?: string;
  sortOrder: number;
}

export type UpdateCareerTrackModulePayload = CreateCareerTrackModulePayload;

export interface CareerTrackModuleListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CareerTrackModuleListResponse {
  items: SkillBuilderCareerTrackModule[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface SkillBuilderSentence {
  id: string;
  italianSentence: string;
  bengaliTranslation?: string | null;
  aiVoiceFileId?: string | null;
  voiceDurationSeconds?: number | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillBuilderSentencePayload {
  italianSentence: string;
  bengaliTranslation?: string;
  aiVoiceFileId?: string;
  voiceDurationSeconds?: number;
  sortOrder: number;
}

export type UpdateSkillBuilderSentencePayload =
  CreateSkillBuilderSentencePayload;

export interface SkillBuilderSentenceListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: SkillBuilderSentenceSortBy;
  sortOrder?: SkillBuilderSortOrder;
}

export interface SkillBuilderSentenceListResponse {
  items: SkillBuilderSentence[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
