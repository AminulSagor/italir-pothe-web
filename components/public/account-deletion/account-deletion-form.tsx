"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MailCheck,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  accountDeletionOtpRequestSchema,
  confirmAccountDeletionSchema,
} from "@/schema/public-site/account-deletion.schema";

import {
  confirmAccountDeletion,
  requestAccountDeletionOtp,
} from "@/service/public-site/account-deletion.service";

import type {
  AccountDeletionFieldErrors,
  AccountDeletionStep,
} from "@/types/public-site/account-deletion.type";

const inputClassName =
  "mt-2 h-12 w-full rounded-2xl border border-[#C9D8CF] bg-[#FAFCFA] px-4 font-medium text-[#17211D] outline-none transition placeholder:text-[#9AA69F] focus:border-[#0A7C58] focus:ring-4 focus:ring-[#0A7C58]/10";

export function AccountDeletionForm() {
  const [step, setStep] = useState<AccountDeletionStep>("request");

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [website, setWebsite] = useState("");

  const [fieldErrors, setFieldErrors] = useState<AccountDeletionFieldErrors>(
    {},
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOtpRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validation = accountDeletionOtpRequestSchema.safeParse({
      identifier,
      website,
    });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;

      setFieldErrors({
        identifier: errors.identifier?.[0],
      });

      toast.error("Check the account information and try again.");

      return;
    }

    try {
      setIsSubmitting(true);
      setFieldErrors({});

      const response = await requestAccountDeletionOtp(validation.data);

      setIdentifier(validation.data.identifier);

      /*
       * devOtp is returned only when backend bypass mode
       * is enabled outside production.
       */
      if (response.devOtp) {
        setOtp(response.devOtp);
      }

      setStep("verify");
      toast.success(response.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not send the verification code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validation = confirmAccountDeletionSchema.safeParse({
      identifier,
      otp,
      confirmation,
    });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;

      setFieldErrors({
        identifier: errors.identifier?.[0],
        otp: errors.otp?.[0],
        confirmation: errors.confirmation?.[0],
      });

      toast.error("Check the verification information.");

      return;
    }

    try {
      setIsSubmitting(true);
      setFieldErrors({});

      const response = await confirmAccountDeletion(validation.data);

      setStep("success");
      setOtp("");
      setConfirmation("");

      toast.success(response.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Account deletion could not be completed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await requestAccountDeletionOtp({
        identifier,
        website: "",
      });

      if (response.devOtp) {
        setOtp(response.devOtp);
      }

      toast.success(response.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not resend the verification code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("request");
    setIdentifier("");
    setOtp("");
    setConfirmation("");
    setWebsite("");
    setFieldErrors({});
  };

  if (step === "success") {
    return (
      <section className="rounded-[2rem] border border-[#BDE4CB] bg-white p-7 shadow-[0_20px_60px_rgba(20,70,42,0.09)] sm:p-9">
        <span className="grid size-14 place-items-center rounded-full bg-[#E4F7EB] text-[#087448]">
          <CheckCircle2 aria-hidden="true" size={28} />
        </span>

        <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[#17211D]">
          Account deleted
        </h2>

        <p className="mt-3 leading-7 text-[#58665E]">
          Account access and direct profile identifiers have been removed.
          Limited records may remain where legally or operationally required.
        </p>
      </section>
    );
  }

  if (step === "verify") {
    return (
      <form
        className="rounded-[2rem] border border-red-200 bg-white p-6 shadow-[0_20px_60px_rgba(20,70,42,0.09)] sm:p-8"
        noValidate
        onSubmit={handleDeletion}
      >
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert aria-hidden="true" size={23} />
          </span>

          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#17211D]">
              Confirm permanent deletion
            </h2>

            <p className="mt-2 leading-7 text-[#627067]">
              Enter the code sent to <strong>{identifier}</strong>.
            </p>
          </div>
        </div>

        <label
          className="mt-7 block text-sm font-bold text-[#334139]"
          htmlFor="account-deletion-otp"
        >
          6-digit verification code
          <input
            aria-invalid={Boolean(fieldErrors.otp)}
            autoComplete="one-time-code"
            className={inputClassName}
            id="account-deletion-otp"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, ""));

              setFieldErrors((current) => ({
                ...current,
                otp: undefined,
              }));
            }}
            placeholder="000000"
            type="text"
            value={otp}
          />
          {fieldErrors.otp ? (
            <span className="mt-2 block text-sm font-semibold text-red-600">
              {fieldErrors.otp}
            </span>
          ) : null}
        </label>

        <label
          className="mt-5 block text-sm font-bold text-[#334139]"
          htmlFor="account-deletion-confirmation"
        >
          Type DELETE to confirm
          <input
            aria-invalid={Boolean(fieldErrors.confirmation)}
            autoComplete="off"
            className={inputClassName}
            id="account-deletion-confirmation"
            onChange={(event) => {
              setConfirmation(event.target.value);

              setFieldErrors((current) => ({
                ...current,
                confirmation: undefined,
              }));
            }}
            placeholder="DELETE"
            type="text"
            value={confirmation}
          />
          {fieldErrors.confirmation ? (
            <span className="mt-2 block text-sm font-semibold text-red-600">
              {fieldErrors.confirmation}
            </span>
          ) : null}
        </label>

        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-800">
          This action is immediate and cannot be undone. You will lose access to
          the account.
        </div>

        <button
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="animate-spin" size={18} />
              Deleting account...
            </>
          ) : (
            <>
              <Trash2 aria-hidden="true" size={18} />
              Delete account permanently
            </>
          )}
        </button>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-bold">
          <button
            className="text-[#087448] hover:underline disabled:opacity-50"
            disabled={isSubmitting}
            onClick={handleResend}
            type="button"
          >
            Send another code
          </button>

          <button
            className="text-[#657069] hover:underline disabled:opacity-50"
            disabled={isSubmitting}
            onClick={resetForm}
            type="button"
          >
            Use another account
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      className="relative rounded-[2rem] border border-[#DCE7E0] bg-white p-6 shadow-[0_20px_60px_rgba(20,70,42,0.09)] sm:p-8"
      noValidate
      onSubmit={handleOtpRequest}
    >
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] size-px overflow-hidden"
      >
        <label>
          Website
          <input
            autoComplete="off"
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            type="text"
            value={website}
          />
        </label>
      </div>

      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
          <MailCheck aria-hidden="true" size={23} />
        </span>

        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#17211D]">
            Verify account ownership
          </h2>

          <p className="mt-2 leading-7 text-[#627067]">
            We will send a verification code to your registered email address or
            phone number.
          </p>
        </div>
      </div>

      <label
        className="mt-7 block text-sm font-bold text-[#334139]"
        htmlFor="account-deletion-identifier"
      >
        Registered email or phone number
        <input
          aria-invalid={Boolean(fieldErrors.identifier)}
          autoComplete="username"
          className={inputClassName}
          id="account-deletion-identifier"
          maxLength={320}
          onChange={(event) => {
            setIdentifier(event.target.value);

            setFieldErrors((current) => ({
              ...current,
              identifier: undefined,
            }));
          }}
          placeholder="name@example.com or +8801..."
          type="text"
          value={identifier}
        />
        {fieldErrors.identifier ? (
          <span className="mt-2 block text-sm font-semibold text-red-600">
            {fieldErrors.identifier}
          </span>
        ) : null}
      </label>

      <button
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#006B3F] px-6 font-bold text-white transition hover:bg-[#005832] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin" size={18} />
            Sending code...
          </>
        ) : (
          <>
            <MailCheck aria-hidden="true" size={18} />
            Send deletion code
          </>
        )}
      </button>
    </form>
  );
}
