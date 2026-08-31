"use client";

import { ArrowRight, Smartphone } from "lucide-react";

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.shafacode.italir_pothe&pcampaignid=web_share";

interface DownloadAppButtonProps {
  label?: string;
  variant?: "primary" | "light" | "outline";
  size?: "md" | "lg";
  className?: string;
  showArrow?: boolean;
  onPress?: () => void;
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
  label = "Get it on Google Play",
  variant = "primary",
  size = "md",
  className = "",
  showArrow = false,
  onPress,
}: DownloadAppButtonProps) {
  return (
    <a
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      href={GOOGLE_PLAY_URL}
      onClick={onPress}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Smartphone aria-hidden="true" size={18} />
      {label}
      {showArrow && <ArrowRight aria-hidden="true" size={18} />}
    </a>
  );
}
