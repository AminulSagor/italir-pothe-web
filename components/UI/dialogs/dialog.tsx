"use client";

import { ReactNode } from "react";
import Card from "@/components/UI/cards/card";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  position?: "center" | "top" | "bottom";
}

const sizeClasses = {
  sm: "max-w-[360px]",
  md: "max-w-[430px]",
  lg: "max-w-[560px]",
  xl: "max-w-[720px]",
  "2xl": "max-w-[1020px]",
};

const positionClasses = {
  center: "items-center",
  top: "items-start pt-20",
  bottom: "items-end pb-20",
};

const Dialog = ({
  open,
  onClose,
  children,
  className = "",
  size = "md",
  position = "center",
}: DialogProps) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[100] flex justify-center bg-black/35 px-4 backdrop-blur-sm ${positionClasses[position]}`}
    >
      <Card
        padding="lg"
        rounded="3xl"
        shadow="lg"
        onClick={(event) => event.stopPropagation()}
        className={`relative z-10 w-full ${sizeClasses[size]} ${className}`}
      >
        {children}
      </Card>
    </div>
  );
};

export default Dialog;
