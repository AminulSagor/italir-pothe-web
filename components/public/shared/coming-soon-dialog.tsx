"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { BellRing, X } from "lucide-react";

interface ComingSoonDialogProps {
  open: boolean;
  onClose: () => void;
}

interface PlatformCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M16.7 12.3c0-2.1 1.7-3.1 1.8-3.2a4 4 0 0 0-3.2-1.7c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8a4.4 4.4 0 0 0-3.7 2.3c-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3.1-.7 1.4 0 1.9.7 3.1.7 1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.8-1.1-2.8-3.7ZM14.4 6c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.3-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.2Z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="m17.6 9.2 1.7-2.9a.6.6 0 0 0-1-.6l-1.8 3A10 10 0 0 0 12 7.6a10 10 0 0 0-4.5 1.1l-1.8-3a.6.6 0 1 0-1 .6l1.7 2.9A7.3 7.3 0 0 0 3 15h18a7.3 7.3 0 0 0-3.4-5.8ZM8 12.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM3 16h18v1.5a2.5 2.5 0 0 1-2.5 2.5H18v1.5a1.5 1.5 0 0 1-3 0V20H9v1.5a1.5 1.5 0 0 1-3 0V20h-.5A2.5 2.5 0 0 1 3 17.5V16Z" />
    </svg>
  );
}

function PlatformCard({
  title,
  description,
  icon,
}: PlatformCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-[#DCE7E0] bg-[#FBFDFC] p-5">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
          {icon}
        </span>

        <div className="min-w-0">
          <h3 className="font-black text-[#17211D]">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-[#657269]">
            {description}
          </p>

          <span className="mt-3 inline-flex rounded-full bg-[#EAF8EE] px-3 py-1 text-xs font-bold text-[#087448]">
            Coming soon
          </span>
        </div>
      </div>
    </article>
  );
}

export function ComingSoonDialog({
  open,
  onClose,
}: ComingSoonDialogProps) {
  const [isMounted, setIsMounted] = useState(false);

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!isMounted || !open) {
    return null;
  }

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-y-auto bg-[#07120D]/65 px-4 py-8 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative my-auto w-full max-w-xl rounded-[2rem] border border-white/80 bg-white p-6 shadow-2xl sm:p-9"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-[#F1F5F2] text-[#334139] transition hover:bg-[#E3ECE6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58]"
        >
          <X aria-hidden="true" size={20} />
        </button>

        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0A7C58]">
          Mobile application
        </p>

        <h2
          id={titleId}
          className="mt-3 max-w-md pr-10 text-3xl font-black tracking-[-0.04em] text-[#17211D] sm:text-4xl"
        >
          Italir Pothe is coming to iOS and Android
        </h2>

        <p
          id={descriptionId}
          className="mt-4 max-w-lg leading-7 text-[#5F6C65]"
        >
          We are preparing both versions of the app. Courses, webinars,
          examinations, certificates and learning progress will be available
          across supported mobile devices.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <PlatformCard
            title="iOS App"
            description="The Italir Pothe app will be available for compatible iPhone and iPad devices."
            icon={<AppleIcon />}
          />

          <PlatformCard
            title="Android App"
            description="The Italir Pothe app will be available for compatible Android phones and tablets."
            icon={<AndroidIcon />}
          />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#F2F8F3] p-4 text-sm leading-6 text-[#445149]">
          <BellRing
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#0A7C58]"
            size={18}
          />

          <span>
            Release announcements and store links will be shared through our
            official Facebook page and community.
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#006B3F] px-6 font-bold text-white transition hover:bg-[#005832] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2"
        >
          Got it
        </button>
      </section>
    </div>,
    document.body,
  );
}