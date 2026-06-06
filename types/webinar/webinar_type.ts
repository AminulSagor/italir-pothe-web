export type WebinarApiStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "completed"
  | "cancelled";

export type WebinarDirectoryTab = "upcoming-scheduled" | "live-now" | "draft";

export type WebinarPublishType = "draft" | "schedule";

export type WebinarParticipantSpeakingPermission = "requested" | "granted" | "rejected";

export type WebinarSpeakerRequestPermission = "requested" | "granted" | "rejected";

export type AgoraLiveRole = "publisher" | "subscriber";

export interface WebinarAudienceSettings {
  isForAllUsers: boolean;
  courseIds: string[];
}

export interface WebinarItem {
  id: string;
  title: string;
  dateTime: string;
  hostTeacherName: string;
  thumbnailImageUrl: string | null;
  sendNotification: boolean;
  status: WebinarApiStatus;
  agoraChannelName?: string | null;
  liveStartedAt?: string | null;
  liveEndedAt?: string | null;
  audienceSettings: WebinarAudienceSettings;
  createdByAdminId: string;
  updatedByAdminId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebinarPayload {
  title: string;
  dateTime: string;
  hostTeacherName: string;
  thumbnailImageUrl?: string | null;
  courseIds?: string[];
  sendNotification?: boolean;
  status?: "draft" | "scheduled";
}

export interface WebinarMutationResponse {
  message: string;
  webinar: WebinarItem;
}

export interface DeleteWebinarResponse {
  message: string;
  webinarId: string;
}

export interface WebinarPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface WebinarListResponse {
  webinars: WebinarItem[];
  pagination: WebinarPagination;
}

export interface AgoraTokenResponse {
  appId: string;
  channelName: string;
  uid: number;
  role: AgoraLiveRole;
  rtcToken: string;
  expiresIn: number;
  expiresAt: number;
}

export type WebinarHostTokenResponse = AgoraTokenResponse;

export interface WebinarUserItem {
  userId: string;
  fullName: string;
  profilePhoto: string | null;
  role: string;
  agoraUid?: number | null;
  joinedAt?: string | null;
  leftAt?: string | null;
  speakingPermission:
    | WebinarParticipantSpeakingPermission
    | WebinarSpeakerRequestPermission
    | null;
}

export interface WebinarParticipantsResponse {
  webinarId: string;
  participants: WebinarUserItem[];
  pagination: WebinarPagination;
}

export interface WebinarSpeakerRequestsResponse {
  webinarId: string;
  speakerRequests: WebinarUserItem[];
  pagination: WebinarPagination;
}

export interface WebinarSpeakerRequestActionResponse {
  message: string;
  participant: WebinarUserItem;
}


export interface WebinarChatMessageItem {
  id: string;
  webinarId: string;
  senderUserId: string;
  senderFullName: string;
  senderRole: string;
  senderProfilePhoto: string | null;
  message: string;
  isHost: boolean;
  createdAt: string;
}

export interface WebinarChatMessagesResponse {
  webinarId: string;
  chatMessages: WebinarChatMessageItem[];
  pagination: WebinarPagination;
}

export interface WebinarSendChatMessageResponse {
  message: string;
  chatMessage: WebinarChatMessageItem;
}

export interface WebinarSocketPayload {
  webinarId: string;
  webinar?: WebinarItem;
  participant?: WebinarUserItem;
  speakerRequest?: WebinarUserItem;
  action?: string;
  chatMessage?: WebinarChatMessageItem;
}
