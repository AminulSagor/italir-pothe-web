import { z } from "zod";

import type { ContactEnquiryPayload } from "@/types/public-site/contact.type";

export const contactEnquirySchema: z.ZodType<ContactEnquiryPayload> = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Name cannot exceed 80 characters."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(160, "Email cannot exceed 160 characters."),

  subject: z.string().trim().max(120, "Subject cannot exceed 120 characters."),

  message: z
    .string()
    .trim()
    .min(10, "Message must contain at least 10 characters.")
    .max(3000, "Message cannot exceed 3000 characters."),

  website: z.string().max(200).optional(),
});
