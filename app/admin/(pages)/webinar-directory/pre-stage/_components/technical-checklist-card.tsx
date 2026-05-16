import { CheckCircle2, ListChecks } from "lucide-react";

const items = [
  {
    title: "Internet Connection",
    status: "Stable",
  },
  {
    title: "Microphone Input",
    status: "Connected",
  },
  {
    title: "Camera Feed",
    status: "Ready",
  },
];

export default function TechnicalChecklist() {
  return (
    <div className="rounded-[34px] bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF3FF] text-blue-600">
          <ListChecks className="size-5" />
        </div>
        <h2 className="text-sm font-bold text-[#1F2421]">
          Technical Checklist
        </h2>
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between gap-4 rounded-2xl bg-[#F1F6EE] px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-[#0E8A3F]" />
              <p className="max-w-[120px] text-xs font-medium text-[#202420]">
                {item.title}
              </p>
            </div>

            <span className="rounded-full bg-[#DCEFD7] px-3 py-1 text-[10px] font-bold uppercase text-[#0E8A3F]">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
