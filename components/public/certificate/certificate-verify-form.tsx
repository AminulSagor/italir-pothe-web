"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck } from "lucide-react";

export function CertificateVerifyForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedIdentifier = identifier.trim();

    if (!normalizedIdentifier) {
      setError("Enter a certificate ID or verification code.");
      return;
    }

    setError("");
    router.push(
      `/certificates/public/verify/${encodeURIComponent(normalizedIdentifier)}`,
    );
  };

  return (
    <form
      className="rounded-[2rem] border border-[#D9E6DE] bg-white p-6 shadow-[0_20px_60px_rgba(20,70,42,0.10)] sm:p-8"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
          <ShieldCheck aria-hidden="true" size={24} />
        </span>
        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#17211D]">
            Check certificate authenticity
          </h2>
          <p className="mt-2 leading-7 text-[#627067]">
            Enter the identifier printed on the Italir Pothe certificate.
          </p>
        </div>
      </div>

      <div className="mt-7">
        <label
          className="mb-2 block text-sm font-bold text-[#334139]"
          htmlFor="certificate-identifier"
        >
          Certificate ID
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7A877F]"
            size={20}
          />
          <input
            aria-describedby={error ? "certificate-error" : "certificate-help"}
            aria-invalid={Boolean(error)}
            autoComplete="off"
            className="h-14 w-full rounded-2xl border border-[#C9D8CF] bg-[#FAFCFA] pl-12 pr-4 text-base font-semibold text-[#17211D] outline-none transition placeholder:text-[#9AA69F] focus:border-[#0A7C58] focus:ring-4 focus:ring-[#0A7C58]/10"
            id="certificate-identifier"
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Example: IP-2026-XXXX"
            type="text"
            value={identifier}
          />
        </div>
        {error ? (
          <p
            className="mt-2 text-sm font-semibold text-red-600"
            id="certificate-error"
          >
            {error}
          </p>
        ) : (
          <p className="mt-2 text-sm text-[#77847C]" id="certificate-help">
            The identifier may contain letters, numbers or hyphens.
          </p>
        )}
      </div>

      <button
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#006B3F] px-6 font-bold text-white transition hover:bg-[#005832] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2"
        type="submit"
      >
        <Search aria-hidden="true" size={18} />
        Verify Certificate
      </button>
    </form>
  );
}
