export interface AccountDeletionOtpRequestPayload {
  identifier: string;
  website?: string;
}

export interface AccountDeletionOtpRequestResponse {
  message: string;
  devOtp?: string;
}

export interface ConfirmAccountDeletionPayload {
  identifier: string;
  otp: string;
  confirmation: string;
}

export interface ConfirmAccountDeletionResponse {
  message: string;
  deleted: boolean;
}

export type AccountDeletionStep = "request" | "verify" | "success";

export interface AccountDeletionFieldErrors {
  identifier?: string;
  otp?: string;
  confirmation?: string;
}
