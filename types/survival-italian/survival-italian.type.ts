export type SurvivalSituationStatus = "draft" | "published" | "archived";
export type SurvivalCardVariant = "normal" | "featured" | string;
export type SurvivalSituationSortOrder = "ASC" | "DESC";
export type SurvivalSituationSortBy = "sortOrder" | "title" | "createdAt";

export interface SurvivalSituationResourceFile {
  id: string;
  originalName?: string;
  fileName?: string;
  name?: string;
  title?: string;
  mimeType?: string;
  publicUrl?: string;
  signedReadUrl?: string;
}

export interface SurvivalSituation {
  id: string;
  title: string;
  subtitleBn: string | null;
  iconKey: string;
  cardColor: string;
  cardVariant: SurvivalCardVariant;
  resourceFileId: string | null;
  resourceFile?: SurvivalSituationResourceFile | null;
  sortOrder: number;
  status: SurvivalSituationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSurvivalSituationPayload {
  title: string;
  subtitleBn?: string;
  iconKey: string;
  cardColor: string;
  cardVariant: SurvivalCardVariant;
  resourceFileId?: string | null;
  sortOrder: number;
}

export interface UpdateSurvivalSituationPayload {
  title: string;
  subtitleBn?: string;
  iconKey: string;
  cardColor: string;
  cardVariant: SurvivalCardVariant;
  resourceFileId?: string | null;
  sortOrder: number;
}

export interface SurvivalSituationListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SurvivalSituationStatus;
  sortBy?: SurvivalSituationSortBy;
  sortOrder?: SurvivalSituationSortOrder;
}

export interface SurvivalSituationListResponse {
  items: SurvivalSituation[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface SurvivalSummaryMetrics {
  totalSituations: number;
  pdfsAttached: number;
  missingBengali: number;
  completionPercent: number;
}

export type SurvivalStatIconKey =
  | "total-situations"
  | "pdfs-attached"
  | "missing-bengali"
  | "completion";

export interface SurvivalStat {
  id: number;
  title: string;
  value: string;
  iconKey: SurvivalStatIconKey;
  iconBg: string;
}
