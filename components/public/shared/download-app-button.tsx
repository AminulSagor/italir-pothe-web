"use client";

import { ArrowRight, Smartphone } from "lucide-react";

import { PUBLIC_SITE_CONFIG } from "@/constant/public-site.constant";

type AppStore = "google-play" | "app-store";

interface DownloadAppButtonProps {
  label?: string;
  variant?: "primary" | "light" | "outline";
  size?: "md" | "lg";
  className?: string;
  showArrow?: boolean;
  onPress?: () => void;
  store?: AppStore;
}

const variantClasses = {
  primary:
    "bg-[#006B3F] !text-white shadow-[0_12px_30px_rgba(0,107,63,0.22)] hover:bg-[#005832]",
  light: "bg-white !text-[#0A6C45] shadow-lg hover:bg-[#EFF7F1]",
  outline:
    "border border-[#BFD3C6] bg-white !text-[#25302B] hover:border-[#7CAC8D] hover:bg-[#F4F8F5]",
};

const sizeClasses = {
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-base",
};

export function DownloadAppButton({
  label,
  variant = "primary",
  size = "md",
  className = "",
  showArrow = false,
  onPress,
  store = "google-play",
}: DownloadAppButtonProps) {
  const isAppStore = store === "app-store";
  const storeLabel =
    label ??
    (isAppStore ? "Download on the App Store" : "Get it on Google Play");

  return (
    <a
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      href={
        isAppStore
          ? PUBLIC_SITE_CONFIG.appStoreUrl
          : PUBLIC_SITE_CONFIG.googlePlayUrl
      }
      onClick={onPress}
      rel="noopener noreferrer"
      target="_blank"
    >
      {isAppStore ? (
        <AppleIcon />
      ) : (
        <Smartphone aria-hidden="true" size={18} />
      )}
      {storeLabel}
      {showArrow && <ArrowRight aria-hidden="true" size={18} />}
    </a>
  );
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px]"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M16.7 12.3c0-2.1 1.7-3.1 1.8-3.2a4 4 0 0 0-3.2-1.7c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8a4.4 4.4 0 0 0-3.7 2.3c-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3.1-.7 1.4 0 1.9.7 3.1.7 1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.8-1.1-2.8-3.7ZM14.4 6c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.3-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.2Z" />
    </svg>
  );
}
