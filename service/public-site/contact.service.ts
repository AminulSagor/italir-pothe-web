import { serviceClient } from "@/service/base/service_client";
import type {
  ContactEnquiryPayload,
  ContactEnquiryResponse,
} from "@/types/public-site/contact.type";

const PUBLIC_CONTACT_ENDPOINT = "/public/contact";

export const sendContactEnquiry = async (
  payload: ContactEnquiryPayload,
): Promise<ContactEnquiryResponse> => {
  return serviceClient.post<ContactEnquiryResponse>(
    PUBLIC_CONTACT_ENDPOINT,
    payload,
  );
};
