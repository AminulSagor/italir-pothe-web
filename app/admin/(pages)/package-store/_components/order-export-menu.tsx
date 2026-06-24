"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface OrderExportMenuProps {
  disabled: boolean;
  isExporting: boolean;
  onExportCurrentPage: () => void;
  onExportAll: () => void;
}

export default function OrderExportMenu({
  disabled,
  isExporting,
  onExportCurrentPage,
  onExportAll,
}: OrderExportMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || isExporting}
        onClick={() => setOpen((current) => !current)}
        className="gap-2"
      >
        {isExporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        Export CSV
      </Button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-56 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExportCurrentPage();
            }}
            className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-[#F4F7F4]"
          >
            Export current page
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExportAll();
            }}
            className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-[#F4F7F4]"
          >
            Export all filtered orders
          </button>
        </div>
      )}
    </div>
  );
}
