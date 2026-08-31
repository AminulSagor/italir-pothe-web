import { serviceClient } from "@/service/base/service_client";
import type {
  AppUpdateConfiguration,
  AppUpdatePlatform,
  UpdateAppUpdateConfigurationPayload,
} from "@/types/app-update/app-update.type";

const ADMIN_APP_UPDATE_ENDPOINT = "/admin/app-update/config";

export const getAppUpdateConfigurations = async () => {
  return serviceClient.get<AppUpdateConfiguration[]>(ADMIN_APP_UPDATE_ENDPOINT);
};

export const updateAppUpdateConfiguration = async (
  platform: AppUpdatePlatform,
  payload: UpdateAppUpdateConfigurationPayload,
) => {
  return serviceClient.put<AppUpdateConfiguration>(
    `${ADMIN_APP_UPDATE_ENDPOINT}/${platform}`,
    payload,
  );
};
