import { serviceClient } from "@/service/base/service_client";

import type {
  AccountDeletionOtpRequestPayload,
  AccountDeletionOtpRequestResponse,
  ConfirmAccountDeletionPayload,
  ConfirmAccountDeletionResponse,
} from "@/types/public-site/account-deletion.type";

const ACCOUNT_DELETION_ENDPOINT = "/public/account-deletion";

export const requestAccountDeletionOtp = async (
  payload: AccountDeletionOtpRequestPayload,
): Promise<AccountDeletionOtpRequestResponse> => {
  return serviceClient.post<AccountDeletionOtpRequestResponse>(
    `${ACCOUNT_DELETION_ENDPOINT}/request-otp`,
    payload,
  );
};

export const confirmAccountDeletion = async (
  payload: ConfirmAccountDeletionPayload,
): Promise<ConfirmAccountDeletionResponse> => {
  return serviceClient.post<ConfirmAccountDeletionResponse>(
    `${ACCOUNT_DELETION_ENDPOINT}/confirm`,
    payload,
  );
};
