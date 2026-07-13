export interface ContactEnquiryPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface ContactEnquiryFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

export type ContactEnquiryField = keyof ContactEnquiryFormState;

export type ContactEnquiryFieldErrors = Partial<
  Record<ContactEnquiryField, string>
>;

export interface ContactEnquiryResponse {
  message: string;
}
