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
  sm: "w-[360px]",
  md: "w-[430px]",
  lg: "w-[560px]",
  xl: "w-[720px]",
  "2xl": "w-[1020px]",
};

const positionClasses = {
  center: "items-start sm:items-center",
  top: "items-start",
  bottom: "items-end",
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
      className={`fixed inset-0 z-[100] overflow-x-auto overflow-y-auto bg-black/35 px-4 py-6 backdrop-blur-sm ${positionClasses[position]}`}
    >
      <div className="flex min-h-full min-w-fit justify-center">
        <Card
          padding="lg"
          rounded="3xl"
          shadow="lg"
          onClick={(event) => event.stopPropagation()}
          className={`relative z-10 my-auto max-h-[calc(100vh-48px)] min-w-fit overflow-y-auto ${sizeClasses[size]} ${className}`}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export default Dialog;
