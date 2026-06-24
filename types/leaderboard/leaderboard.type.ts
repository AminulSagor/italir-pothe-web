export type LeagueKey = "bronze" | "silver" | "gold" | "diamond";

export type LeaderboardSortOrder = "ASC" | "DESC";

export type LeaderboardSortBy = "rank" | "totalXp" | "displayName";

export type LeaderboardRewardType =
  | "physical_gift"
  | "physical_prize"
  | "streak_freeze"
  | "cv_credits"
  | "ai_package"
  | "xp"
  | "course_access"
  | "downloadable_file"
  | "certificate"
  | "badge";

export type LeaderboardRewardStatus =
  | "pending"
  | "notified"
  | "opened"
  | "address_pending"
  | "address_received"
  | "approved"
  | "processing"
  | "dispatched"
  | "delivered"
  | "issued"
  | "claimed"
  | "revoked"
  | "cancelled"
  | "failed";

export type RewardHistorySortBy =
  | "createdAt"
  | "title"
  | "status"
  | "rewardType"
  | "recipient";

export interface LeaderboardBenefit {
  type: "xp_boost";
  multiplier: number;
  durationHours: number;
  durationDays: number;
}

export interface LeaderboardLeague {
  key: LeagueKey;
  name: string;
  minXp: number;
  maxXp: number | null;
  rangeLabel: string;
  iconKey: string;
  themeKey: string;
  sortOrder: number;
  benefit: LeaderboardBenefit | null;
}

export interface LeaderboardLeagueCard extends LeaderboardLeague {
  totalMembers: number;
}

export interface AdminLeaderboardUser {
  rank: number;
  userId: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  totalXp: number;
  streakDays: number;
  league: LeaderboardLeague;
  canGiftReward: boolean;
}

export interface LeaderboardPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminLeaderboardDashboard {
  leagueCards: LeaderboardLeagueCard[];
  globalTopTen: AdminLeaderboardUser[];
  items: AdminLeaderboardUser[];
  meta: LeaderboardPaginationMeta;
}

export interface AdminLeaderboardQuery {
  page?: number;
  limit?: number;
  search?: string;
  league?: LeagueKey;
  sortBy?: LeaderboardSortBy;
  sortOrder?: LeaderboardSortOrder;
}

export interface RewardConfigurationUser {
  id: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  level: string | null;

  displayName: string;
  username: string | null;
  avatarUrl: string | null;

  totalXp: number;
  streakDays: number;
  rank: number | null;
  topPercent: number | null;

  league: LeaderboardLeague;
}

export interface RewardAssetTypeConfiguration {
  rewardType: LeaderboardRewardType;
  label: string;
  requiredFields: string[];
  optionalFields?: string[];
  acceptedResourceFields?: string[];

  primaryUnit?: string;
  secondaryUnit?: string;

  systemActions?: {
    sendPushNotification: boolean;
    playConfettiAnimation: boolean;
    requestShippingAddress: boolean;
  };
}

export interface RewardConfigurationResponse {
  user: RewardConfigurationUser;
  assetTypes: RewardAssetTypeConfiguration[];

  systemActionDefaults: {
    sendPushNotification: boolean;
    playConfettiAnimation: boolean;
    requestShippingAddress: boolean;
  };
}

export interface CreateLeaderboardRewardPayload {
  rewardType: LeaderboardRewardType;
  title: string;

  subtitle?: string;
  congratulatoryNote?: string;
  earnedReason?: string;

  imageUrl?: string;
  fileUrl?: string;
  relatedResourceId?: string;

  primaryAmount?: number;
  secondaryAmount?: number;

  sendPushNotification?: boolean;
  playConfettiAnimation?: boolean;
  requestShippingAddress?: boolean;
}

export interface LeaderboardRewardContent {
  id: string;
  rewardId: string;

  congratulatoryNote: string | null;
  earnedReason: string | null;

  imageUrl: string | null;
  fileUrl: string | null;
  relatedResourceId: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardRewardValue {
  id: string;
  rewardId: string;

  primaryAmount: number | null;
  secondaryAmount: number | null;

  primaryUnit: string | null;
  secondaryUnit: string | null;

  appliedAt: string | null;
  applicationReference: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardRewardNotification {
  id: string;
  rewardId: string;
  userId: string;

  type: string;
  status: "queued" | "sent" | "failed";

  title: string;
  body: string;

  sentAt: string | null;
  errorMessage: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreatedLeaderboardReward {
  id: string;
  userId: string;

  leagueKey: LeagueKey;
  rewardType: LeaderboardRewardType;

  title: string;
  subtitle: string | null;

  status: LeaderboardRewardStatus;

  sendPushNotification: boolean;
  playConfettiAnimation: boolean;
  requestShippingAddress: boolean;

  createdAt: string;
}

export interface CreateLeaderboardRewardResponse {
  message: string;
  notificationMessage: string | null;

  reward: CreatedLeaderboardReward;
  content: LeaderboardRewardContent;
  value: LeaderboardRewardValue;

  notifications: {
    gift: LeaderboardRewardNotification | null;
    addressRequest: LeaderboardRewardNotification | null;
  };
}

export interface LeaderboardRewardSummary {
  totalRewardsGiven: number;
  notified: number;
  addressPending: number;
  addressReceived: number;
  processing: number;
  dispatched: number;
  delivered: number;
  digitalClaimed: number;
}

export interface RewardHistoryRecipient {
  userId: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
}

export interface RewardHistoryItem {
  id: string;

  recipient: RewardHistoryRecipient;

  leagueKey: LeagueKey;
  rewardType: LeaderboardRewardType;

  title: string;
  subtitle: string | null;
  imageUrl: string | null;

  primaryAmount: number | null;
  secondaryAmount: number | null;
  primaryUnit: string | null;
  secondaryUnit: string | null;

  status: LeaderboardRewardStatus;
  displayStatus: string;

  awardedAt: string;
  dispatchDate: string | null;
  shippingAddress: string | null;
  trackingNumber: string | null;
}

export interface RewardHistoryListResponse {
  items: RewardHistoryItem[];
  meta: LeaderboardPaginationMeta;
}

export interface RewardHistoryQuery {
  page?: number;
  limit?: number;
  search?: string;

  status?: LeaderboardRewardStatus;
  rewardType?: LeaderboardRewardType;
  league?: LeagueKey;

  dateFrom?: string;
  dateTo?: string;

  sortBy?: RewardHistorySortBy;
  sortOrder?: LeaderboardSortOrder;
}

export interface RewardDetailRecipient {
  id: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;

  email: string | null;
  phone: string | null;
  level: string | null;

  displayName: string;
  username: string | null;
  avatarUrl: string | null;

  totalXp: number;
  rank: number | null;

  league: LeaderboardLeague;
}

export interface RewardShippingAddress {
  fullName: string;
  whatsappNumber: string;
  addressLine: string;

  countryCode: string;
  latitude: string | null;
  longitude: string | null;

  isLocked: boolean;
  updatedAt: string;
}

export interface RewardFulfillment {
  addressRequestedAt: string | null;
  addressReceivedAt: string | null;
  processingAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  lastNotificationAt: string | null;

  carrierName: string | null;
  trackingNumber: string | null;
  invoiceUrl: string | null;
}

export interface RewardAvailableActions {
  canResendAddressRequest: boolean;
  canEditAddress: boolean;
  canSendUpdateNotification: boolean;
  canDispatch: boolean;
  canMarkDelivered: boolean;
  canRevoke: boolean;
  canDownloadInvoice: boolean;
}

export interface LeaderboardRewardDetail {
  reward: RewardHistoryItem;
  recipient: RewardDetailRecipient;
  shippingAddress: RewardShippingAddress | null;
  fulfillment: RewardFulfillment | null;
  notifications: LeaderboardRewardNotification[];
  availableActions: RewardAvailableActions;
}

export interface UpdateRewardStatusPayload {
  status: LeaderboardRewardStatus;
}

export interface SendRewardUpdatePayload {
  title?: string;
  body?: string;
}

export interface UpdateRewardShippingAddressPayload {
  fullName: string;
  whatsappNumber: string;
  addressLine: string;

  countryCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface DispatchRewardPayload {
  carrierName?: string;
  trackingNumber?: string;
  invoiceUrl?: string;
  sendNotification?: boolean;
}

export interface LeaderboardActionResponse {
  message: string;
  rewardId?: string;
  status?: LeaderboardRewardStatus;
}
