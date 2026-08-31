export type AppUpdatePlatform = "android" | "ios";

export type AppUpdateType = "OPTIONAL" | "REQUIRED" | "DISABLED";

export interface AppUpdateConfiguration {
  id?: string;
  platform: AppUpdatePlatform;
  latestVersion: string;
  minimumSupportedVersion: string;
  updateType: AppUpdateType;
  title: string;
  message: string;
  storeUrl: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export type UpdateAppUpdateConfigurationPayload = Omit<
  AppUpdateConfiguration,
  "id" | "platform" | "createdAt" | "updatedAt"
>;
