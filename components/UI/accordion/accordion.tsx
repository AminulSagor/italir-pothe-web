"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  rightContent?: ReactNode;
}

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
  rightContent,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`overflow-hidden rounded-3xl border border-[#E2E8E1] bg-white ${className}`}
    >
      <div
        className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left ${headerClassName}`}
      >
        <div className="min-w-0 flex-1">{title}</div>

        <div className="flex shrink-0 items-center gap-4">
          {rightContent}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Collapse accordion" : "Expand accordion"}
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-[#F4F7F4]"
          >
            <ChevronDown
              className={`size-6 text-[#56635C] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-t border-[#E2E8E1] px-6 py-4 ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
