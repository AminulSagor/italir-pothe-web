import { serviceClient } from "@/service/base/service_client";
import type {
  InfluencerArchiveResponse,
  InfluencerDashboard,
  InfluencerManualPayoutPayload,
  InfluencerPartnerDetailResponse,
  InfluencerPartnerListResponse,
  InfluencerPartnerPayload,
  InfluencerPartnerQuery,
  InfluencerReport,
} from "@/types/influencer-hub/influencer-hub.type";
import { assertValidUuid } from "@/utils/uuid";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const INFLUENCER_BASE_PATH = "/api/admin/influencers";

const unwrap = <T>(response: ApiEnvelope<T>): T => response.data;

const buildQueryString = (
  values: Record<string, string | number | undefined>,
) => {
  const query = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === null) {
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

export const getInfluencerDashboard =
  async (): Promise<InfluencerDashboard> => {
    const response = await serviceClient.get<ApiEnvelope<InfluencerDashboard>>(
      `${INFLUENCER_BASE_PATH}/dashboard`,
    );

    return unwrap(response);
  };

export const getInfluencerPartners = async (
  query: InfluencerPartnerQuery = {},
): Promise<InfluencerPartnerListResponse> => {
  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,
    search: query.search?.trim(),
    status: query.status,
    couponCode: query.couponCode?.trim(),
    productDomain: query.productDomain,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  const response = await serviceClient.get<
    ApiEnvelope<InfluencerPartnerListResponse>
  >(`${INFLUENCER_BASE_PATH}${queryString}`);

  return unwrap(response);
};

export const exportInfluencerPartnersCsv = async (
  query: InfluencerPartnerQuery = {},
): Promise<string> => {
  const queryString = buildQueryString({
    search: query.search?.trim(),
    status: query.status,
    couponCode: query.couponCode?.trim(),
    productDomain: query.productDomain,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<string>(
    `${INFLUENCER_BASE_PATH}/export.csv${queryString}`,
  );
};

export const createInfluencerPartner = async (
  payload: InfluencerPartnerPayload,
): Promise<InfluencerPartnerDetailResponse> => {
  const response = await serviceClient.post<
    ApiEnvelope<InfluencerPartnerDetailResponse>
  >(INFLUENCER_BASE_PATH, payload);

  return unwrap(response);
};

export const getInfluencerPartnerById = async (
  partnerId: string,
): Promise<InfluencerPartnerDetailResponse> => {
  const safePartnerId = assertValidUuid(partnerId, "Influencer partner ID");

  const response = await serviceClient.get<
    ApiEnvelope<InfluencerPartnerDetailResponse>
  >(`${INFLUENCER_BASE_PATH}/${safePartnerId}`);

  return unwrap(response);
};

export const updateInfluencerPartner = async (
  partnerId: string,
  payload: Partial<InfluencerPartnerPayload>,
): Promise<InfluencerPartnerDetailResponse> => {
  const safePartnerId = assertValidUuid(partnerId, "Influencer partner ID");

  const response = await serviceClient.patch<
    ApiEnvelope<InfluencerPartnerDetailResponse>
  >(`${INFLUENCER_BASE_PATH}/${safePartnerId}`, payload);

  return unwrap(response);
};

export const archiveInfluencerPartner = async (
  partnerId: string,
): Promise<InfluencerArchiveResponse> => {
  const safePartnerId = assertValidUuid(partnerId, "Influencer partner ID");

  const response = await serviceClient.delete<
    ApiEnvelope<InfluencerArchiveResponse>
  >(`${INFLUENCER_BASE_PATH}/${safePartnerId}`);

  return unwrap(response);
};

export const getInfluencerReport = async (
  partnerId: string,
  query: {
    dateFrom?: string;
    dateTo?: string;
  } = {},
): Promise<InfluencerReport> => {
  const safePartnerId = assertValidUuid(partnerId, "Influencer partner ID");

  const queryString = buildQueryString({
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  });

  const response = await serviceClient.get<ApiEnvelope<InfluencerReport>>(
    `${INFLUENCER_BASE_PATH}/${safePartnerId}/report${queryString}`,
  );

  return unwrap(response);
};

export const createInfluencerPayout = async (
  partnerId: string,
  payload: InfluencerManualPayoutPayload,
) => {
  const safePartnerId = assertValidUuid(partnerId, "Influencer partner ID");

  const response = await serviceClient.post<ApiEnvelope<unknown>>(
    `${INFLUENCER_BASE_PATH}/${safePartnerId}/payouts`,
    payload,
  );

  return unwrap(response);
};
