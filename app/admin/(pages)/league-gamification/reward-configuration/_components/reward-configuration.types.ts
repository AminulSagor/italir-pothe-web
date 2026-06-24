import type {
  LeaderboardRewardType,
  RewardConfigurationResponse,
} from "@/types/leaderboard/leaderboard.type";

export interface RewardConfigurationFormState {
  rewardType: LeaderboardRewardType;

  title: string;
  subtitle: string;
  congratulatoryNote: string;
  earnedReason: string;

  imageUrl: string;
  fileUrl: string;
  relatedResourceId: string;

  primaryAmount: string;
  secondaryAmount: string;

  sendPushNotification: boolean;
  playConfettiAnimation: boolean;
  requestShippingAddress: boolean;
}

export type RewardConfigurationField =
  | keyof RewardConfigurationFormState
  | "certificateResource";

export type RewardConfigurationErrors = Partial<
  Record<RewardConfigurationField, string>
>;

export const isPhysicalRewardType = (rewardType: LeaderboardRewardType) => {
  return rewardType === "physical_prize" || rewardType === "physical_gift";
};

export const createInitialRewardForm = (
  configuration: RewardConfigurationResponse,
): RewardConfigurationFormState => {
  const firstAsset = configuration.assetTypes[0];

  const rewardType = firstAsset?.rewardType || "physical_prize";

  return {
    rewardType,

    title: "",
    subtitle: "",
    congratulatoryNote: "",
    earnedReason: "",

    imageUrl: "",
    fileUrl: "",
    relatedResourceId: "",

    primaryAmount: "",
    secondaryAmount: "",

    sendPushNotification:
      firstAsset?.systemActions?.sendPushNotification ??
      configuration.systemActionDefaults.sendPushNotification,

    playConfettiAnimation:
      firstAsset?.systemActions?.playConfettiAnimation ??
      configuration.systemActionDefaults.playConfettiAnimation,

    requestShippingAddress:
      firstAsset?.systemActions?.requestShippingAddress ??
      (isPhysicalRewardType(rewardType)
        ? configuration.systemActionDefaults.requestShippingAddress
        : false),
  };
};
