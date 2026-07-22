import { z } from "zod";

import type {
  AccountDeletionOtpRequestPayload,
  ConfirmAccountDeletionPayload,
} from "@/types/public-site/account-deletion.type";

const accountIdentifierSchema = z
  .string()
  .trim()
  .min(1, "Enter your registered email address or phone number.")
  .max(320, "The account identifier is too long.")
  .refine(
    (value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const bangladeshPhonePattern = /^\+8801\d{9}$/;

      const italianPhonePattern = /^\+39\d{8,11}$/;

      return (
        emailPattern.test(value) ||
        bangladeshPhonePattern.test(value) ||
        italianPhonePattern.test(value)
      );
    },
    {
      message:
        "Enter a valid email, Bangladesh phone number, or Italian phone number.",
    },
  );

export const accountDeletionOtpRequestSchema: z.ZodType<AccountDeletionOtpRequestPayload> =
  z.object({
    identifier: accountIdentifierSchema,

    website: z.string().max(200).optional(),
  });

export const confirmAccountDeletionSchema: z.ZodType<ConfirmAccountDeletionPayload> =
  z.object({
    identifier: accountIdentifierSchema,

    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Enter the 6-digit verification code."),

    confirmation: z
      .string()
      .trim()
      .refine((value) => value === "DELETE", "Type DELETE exactly as shown."),
  });
