export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginUser {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  profilePhotoFileId?: string | null;
  hapticsEnabled?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: LoginUser;
}
