"use client";

import { CheckCircle2, ListChecks, RefreshCw, TriangleAlert, XCircle } from "lucide-react";

export type TechnicalChecklistState = "success" | "warning" | "error";

export type TechnicalChecklistItem = {
  title: string;
  status: string;
  state: TechnicalChecklistState;
};

interface TechnicalChecklistProps {
  items: TechnicalChecklistItem[];
  onRefresh: () => void;
}

const stateClasses: Record<TechnicalChecklistState, string> = {
  success: "bg-[#DCEFD7] text-[#0E8A3F]",
  warning: "bg-[#FFF4D8] text-[#B56A00]",
  error: "bg-[#FDE2E2] text-[#C92A2A]",
};

const iconClasses: Record<TechnicalChecklistState, string> = {
  success: "text-[#0E8A3F]",
  warning: "text-[#B56A00]",
  error: "text-[#C92A2A]",
};

export default function TechnicalChecklist({
  items,
  onRefresh,
}: TechnicalChecklistProps) {
  return (
    <div className="rounded-[34px] bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF3FF] text-blue-600">
            <ListChecks className="size-5" />
          </div>
          <h2 className="text-sm font-bold text-[#1F2421]">
            Technical Checklist
          </h2>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-[#007A4D] transition hover:bg-[#E4EEE1]"
          title="Run checklist again"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 rounded-2xl bg-[#F1F6EE] px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <ChecklistIcon state={item.state} />
              <p className="max-w-[120px] text-xs font-medium text-[#202420]">
                {item.title}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                stateClasses[item.state]
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistIcon({ state }: { state: TechnicalChecklistState }) {
  const className = `size-5 ${iconClasses[state]}`;

  if (state === "success") return <CheckCircle2 className={className} />;
  if (state === "warning") return <TriangleAlert className={className} />;
  return <XCircle className={className} />;
}
