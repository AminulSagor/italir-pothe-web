"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

import { contactEnquirySchema } from "@/schema/public-site/contact.schema";
import { sendContactEnquiry } from "@/service/public-site/contact.service";
import type {
  ContactEnquiryField,
  ContactEnquiryFieldErrors,
  ContactEnquiryFormState,
} from "@/types/public-site/contact.type";

const initialState: ContactEnquiryFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const inputClassName =
  "mt-2 h-12 w-full rounded-2xl border border-[#C9D8CF] bg-[#FAFCFA] px-4 font-medium text-[#17211D] outline-none transition placeholder:text-[#9AA69F] focus:border-[#0A7C58] focus:ring-4 focus:ring-[#0A7C58]/10";

export function ContactForm() {
  const [form, setForm] = useState<ContactEnquiryFormState>(initialState);

  const [fieldErrors, setFieldErrors] = useState<ContactEnquiryFieldErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: ContactEnquiryField, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationResult = contactEnquirySchema.safeParse(form);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;

      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        subject: errors.subject?.[0],
        message: errors.message?.[0],
        website: errors.website?.[0],
      });

      toast.error("Please check the highlighted fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFieldErrors({});

      const response = await sendContactEnquiry(validationResult.data);

      setForm(initialState);
      toast.success(response.message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not send your enquiry. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="relative rounded-[2rem] border border-[#DCE7E0] bg-white p-6 shadow-[0_20px_60px_rgba(20,70,42,0.09)] sm:p-8"
      noValidate
      onSubmit={handleSubmit}
    >
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto size-px overflow-hidden"
      >
        <label>
          Website
          <input
            autoComplete="off"
            onChange={(event) => updateField("website", event.target.value)}
            tabIndex={-1}
            type="text"
            value={form.website}
          />
        </label>
      </div>

      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
          <Mail aria-hidden="true" size={23} />
        </span>

        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#17211D]">
            Send an enquiry
          </h2>

          <p className="mt-2 leading-7 text-[#627067]">
            Complete the form and your message will be sent securely to our
            team.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label
          className="block text-sm font-bold text-[#334139]"
          htmlFor="contact-name"
        >
          Full name
          <input
            aria-describedby={
              fieldErrors.name ? "contact-name-error" : undefined
            }
            aria-invalid={Boolean(fieldErrors.name)}
            className={inputClassName}
            id="contact-name"
            maxLength={80}
            onChange={(event) => updateField("name", event.target.value)}
            type="text"
            value={form.name}
          />
          {fieldErrors.name ? (
            <span
              className="mt-2 block text-sm font-semibold text-red-600"
              id="contact-name-error"
            >
              {fieldErrors.name}
            </span>
          ) : null}
        </label>

        <label
          className="block text-sm font-bold text-[#334139]"
          htmlFor="contact-email"
        >
          Email address
          <input
            aria-describedby={
              fieldErrors.email ? "contact-email-error" : undefined
            }
            aria-invalid={Boolean(fieldErrors.email)}
            autoComplete="email"
            className={inputClassName}
            id="contact-email"
            maxLength={160}
            onChange={(event) => updateField("email", event.target.value)}
            type="email"
            value={form.email}
          />
          {fieldErrors.email ? (
            <span
              className="mt-2 block text-sm font-semibold text-red-600"
              id="contact-email-error"
            >
              {fieldErrors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label
        className="mt-5 block text-sm font-bold text-[#334139]"
        htmlFor="contact-subject"
      >
        Subject
        <input
          aria-describedby={
            fieldErrors.subject ? "contact-subject-error" : undefined
          }
          aria-invalid={Boolean(fieldErrors.subject)}
          className={inputClassName}
          id="contact-subject"
          maxLength={120}
          onChange={(event) => updateField("subject", event.target.value)}
          placeholder="How can we help?"
          type="text"
          value={form.subject}
        />
        {fieldErrors.subject ? (
          <span
            className="mt-2 block text-sm font-semibold text-red-600"
            id="contact-subject-error"
          >
            {fieldErrors.subject}
          </span>
        ) : null}
      </label>

      <label
        className="mt-5 block text-sm font-bold text-[#334139]"
        htmlFor="contact-message"
      >
        Message
        <textarea
          aria-describedby={
            fieldErrors.message
              ? "contact-message-error"
              : "contact-message-help"
          }
          aria-invalid={Boolean(fieldErrors.message)}
          className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-[#C9D8CF] bg-[#FAFCFA] px-4 py-3 font-medium text-[#17211D] outline-none transition focus:border-[#0A7C58] focus:ring-4 focus:ring-[#0A7C58]/10"
          id="contact-message"
          maxLength={3000}
          onChange={(event) => updateField("message", event.target.value)}
          value={form.message}
        />
        {fieldErrors.message ? (
          <span
            className="mt-2 block text-sm font-semibold text-red-600"
            id="contact-message-error"
          >
            {fieldErrors.message}
          </span>
        ) : (
          <span
            className="mt-2 block text-xs text-[#77847C]"
            id="contact-message-help"
          >
            {form.message.length}/3000 characters
          </span>
        )}
      </label>

      <button
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#006B3F] px-6 font-bold text-white transition hover:bg-[#005832] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin" size={18} />
            Sending enquiry...
          </>
        ) : (
          <>
            <Send aria-hidden="true" size={18} />
            Send Enquiry
          </>
        )}
      </button>
    </form>
  );
}
