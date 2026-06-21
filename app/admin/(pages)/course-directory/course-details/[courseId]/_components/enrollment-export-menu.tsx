"use client";

import { Download, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/UI/buttons/button";

interface EnrollmentExportMenuProps {
  disabled?: boolean;
  isExportingAll?: boolean;
  onExportCurrentPage: () => void;
  onExportAll: () => void;
}

const EnrollmentExportMenu = ({
  disabled = false,
  isExportingAll = false,
  onExportCurrentPage,
  onExportAll,
}: EnrollmentExportMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleCurrentPage = () => {
    setOpen(false);
    onExportCurrentPage();
  };

  const handleAll = () => {
    setOpen(false);
    onExportAll();
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled || isExportingAll}
        className="gap-2 bg-[#E9EEE9]"
        onClick={() => setOpen((value) => !value)}
      >
        {isExportingAll ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        Export
      </Button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={handleCurrentPage}
            className="w-full rounded-xl px-4 py-3 text-left text-sm text-[#202420] transition hover:bg-[#F4F7F4]"
          >
            Export current page
          </button>

          <button
            type="button"
            onClick={handleAll}
            className="w-full rounded-xl px-4 py-3 text-left text-sm text-[#202420] transition hover:bg-[#F4F7F4]"
          >
            Export all filtered results
          </button>
        </div>
      )}
    </div>
  );
};

export default EnrollmentExportMenu;
