import { serviceClient } from "@/service/base/service_client";
import type {
  DeviceRequestDecision,
  DeviceRequestsResponse,
  DeviceRequestStatus,
} from "@/types/device-requests/device-request.type";
import { assertValidUuid } from "@/utils/uuid";

const ENDPOINT = "/course-device-access/admin/requests";

export const getDeviceRequests = async (params: {
  status?: DeviceRequestStatus;
  search?: string;
}) => {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search?.trim()) query.set("search", params.search.trim());
  const suffix = query.size ? `?${query.toString()}` : "";
  return serviceClient.get<DeviceRequestsResponse>(`${ENDPOINT}${suffix}`);
};

export const decideDeviceRequest = async (
  requestId: string,
  decision: DeviceRequestDecision,
) => {
  const id = assertValidUuid(requestId, "Device request ID");
  return serviceClient.post<{
    ok: true;
    id: string;
    status: DeviceRequestStatus;
  }>(`${ENDPOINT}/${id}/decision`, { decision });
};
