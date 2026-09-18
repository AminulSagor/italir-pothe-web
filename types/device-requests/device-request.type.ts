export type DeviceRequestStatus =
  | "pending"
  | "approved_replace"
  | "approved_add"
  | "rejected";

export type DeviceRequestDecision = "replace" | "add" | "reject";

export interface DeviceRequestListItem {
  id: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
  course: {
    id: string;
    title: string;
  };
  currentDeviceLabel: string;
  requestedDeviceLabel: string;
  requestedAt: string;
  status: DeviceRequestStatus;
  decidedAt: string | null;
}

export interface DeviceRequestsResponse {
  items: DeviceRequestListItem[];
}
