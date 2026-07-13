"use client";

import { Toaster } from "react-hot-toast";

export function PublicToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "14px",
          background: "#ffffff",
          color: "#17211D",
          border: "1px solid #DCE7E0",
        },
        success: {
          duration: 5000,
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
}
