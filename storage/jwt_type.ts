export interface JwtPayload {
  sub?: string;
  id?: string;
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  exp?: number;
  iat?: number;
}
