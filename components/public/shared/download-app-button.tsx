"use client";

import { PUBLIC_SITE_CONFIG } from "@/constant/public-site.constant";

type AppStore = "google-play" | "app-store";

interface DownloadAppButtonProps {
  size?: "md" | "lg";
  className?: string;
  onPress?: () => void;
  store?: AppStore;
}

const sizeClasses = {
  md: "h-12 min-w-[9.5rem] px-4",
  lg: "h-14 min-w-[11rem] px-5",
};

export function DownloadAppButton({
  size = "md",
  className = "",
  onPress,
  store = "google-play",
}: DownloadAppButtonProps) {
  const isAppStore = store === "app-store";

  return (
    <a
      aria-label={
        isAppStore ? "Download on the App Store" : "Get it on Google Play"
      }
      className={`inline-flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-[#090909] !text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1A1A1A] hover:shadow-[0_14px_30px_rgba(0,0,0,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2 ${sizeClasses[size]} ${className}`}
      href={
        isAppStore
          ? PUBLIC_SITE_CONFIG.appStoreUrl
          : PUBLIC_SITE_CONFIG.googlePlayUrl
      }
      onClick={onPress}
      rel="noopener noreferrer"
      target="_blank"
    >
      {isAppStore ? <AppleIcon /> : <GooglePlayIcon />}
      <span className="flex flex-col items-start leading-none">
        <span className="text-[8px] font-medium uppercase tracking-[0.08em] text-white/90">
          {isAppStore ? "Download on the" : "Get it on"}
        </span>
        <span className="mt-1 whitespace-nowrap text-[17px] font-semibold tracking-[-0.025em]">
          {isAppStore ? "App Store" : "Google Play"}
        </span>
      </span>
    </a>
  );
}

function GooglePlayIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-7 shrink-0"
      viewBox="0 0 32 36"
    >
      <path d="M2.2 1.7 19.6 18 2.2 34.3A2.8 2.8 0 0 1 1 32V4a2.8 2.8 0 0 1 1.2-2.3Z" fill="#00D7FE" />
      <path d="m2.2 1.7 20.5 11.6-3.1 4.7L2.2 1.7Z" fill="#00F076" />
      <path d="m2.2 34.3 20.5-11.6-3.1-4.7L2.2 34.3Z" fill="#FFCE00" />
      <path d="m22.7 13.3 6.8 3.8c1 .6 1 1.2 0 1.8l-6.8 3.8-3.1-4.7 3.1-4.7Z" fill="#F63448" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-7 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M16.7 12.3c0-2.1 1.7-3.1 1.8-3.2a4 4 0 0 0-3.2-1.7c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8a4.4 4.4 0 0 0-3.7 2.3c-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3.1-.7 1.4 0 1.9.7 3.1.7 1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.8-1.1-2.8-3.7ZM14.4 6c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.3-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.2Z" />
    </svg>
  );
}
