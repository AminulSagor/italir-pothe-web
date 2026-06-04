import { serviceClient } from "@/service/base/service_client";
import type {
  DeleteWebinarResponse,
  WebinarHostTokenResponse,
  WebinarItem,
  WebinarListResponse,
  WebinarMutationResponse,
  WebinarParticipantsResponse,
  WebinarPayload,
  WebinarSpeakerRequestActionResponse,
  WebinarSpeakerRequestsResponse,
} from "@/types/webinar/webinar_type";

const buildPaginationQuery = (page: number, limit: number) =>
  `page=${page}&limit=${limit}`;

export const getMyUpcomingWebinars = (page = 1, limit = 10) =>
  serviceClient.get<WebinarListResponse>(
    `/admin/webinars/my-upcoming?${buildPaginationQuery(page, limit)}`,
  );

export const getMyDraftWebinars = (page = 1, limit = 10) =>
  serviceClient.get<WebinarListResponse>(
    `/admin/webinars/my-drafts?${buildPaginationQuery(page, limit)}`,
  );

export const getMyLiveWebinars = (page = 1, limit = 10) =>
  serviceClient.get<WebinarListResponse>(
    `/admin/webinars/my-live?${buildPaginationQuery(page, limit)}`,
  );

export const getAdminWebinarById = async (webinarId: string) => {
  const [upcomingResponse, liveResponse, draftsResponse] = await Promise.all([
    getMyUpcomingWebinars(1, 100),
    getMyLiveWebinars(1, 100),
    getMyDraftWebinars(1, 100),
  ]);

  const webinar = [
    ...upcomingResponse.webinars,
    ...liveResponse.webinars,
    ...draftsResponse.webinars,
  ].find((item) => item.id === webinarId);

  if (!webinar) {
    throw new Error("Webinar details could not be loaded.");
  }

  return webinar;
};

export const createWebinar = (payload: WebinarPayload) =>
  serviceClient.post<WebinarMutationResponse>("/admin/webinars", payload);

export const updateWebinar = (webinarId: string, payload: WebinarPayload) =>
  serviceClient.patch<WebinarMutationResponse>(
    `/admin/webinars/${webinarId}`,
    payload,
  );

export const deleteWebinar = (webinarId: string) =>
  serviceClient.delete<DeleteWebinarResponse>(`/admin/webinars/${webinarId}`);

export const startWebinar = (webinarId: string) =>
  serviceClient.patch<WebinarMutationResponse>(
    `/admin/webinars/${webinarId}/start`,
  );

export const endWebinar = (webinarId: string) =>
  serviceClient.patch<WebinarMutationResponse>(`/admin/webinars/${webinarId}/end`);

export const getHostToken = (webinarId: string) =>
  serviceClient.post<WebinarHostTokenResponse>(
    `/admin/webinars/${webinarId}/host-token`,
  );

export const getWebinarParticipants = (webinarId: string, page = 1, limit = 10) =>
  serviceClient.get<WebinarParticipantsResponse>(
    `/webinars/${webinarId}/participants?${buildPaginationQuery(page, limit)}`,
  );

export const getSpeakerRequests = (webinarId: string, page = 1, limit = 10) =>
  serviceClient.get<WebinarSpeakerRequestsResponse>(
    `/admin/webinars/${webinarId}/speaker-requests?${buildPaginationQuery(page, limit)}`,
  );

export const approveSpeakerRequest = (webinarId: string, userId: string) =>
  serviceClient.patch<WebinarSpeakerRequestActionResponse>(
    `/admin/webinars/${webinarId}/speaker-requests/${userId}/approve`,
  );

export const rejectSpeakerRequest = (webinarId: string, userId: string) =>
  serviceClient.patch<WebinarSpeakerRequestActionResponse>(
    `/admin/webinars/${webinarId}/speaker-requests/${userId}/reject`,
  );

export const isWebinarLive = (webinar?: WebinarItem | null) =>
  webinar?.status === "live";
