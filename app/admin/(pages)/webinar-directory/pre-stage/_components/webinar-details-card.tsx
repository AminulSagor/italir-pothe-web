import { Info } from "lucide-react";

export default function WebinarDetailsCard() {
  return (
    <div className="rounded-[34px] bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#FFF1E6] text-orange-500">
          <Info className="size-5" />
        </div>
        <h2 className="text-sm font-bold text-[#202420]">Webinar Details</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <InfoBox label="Start Time" value="10:00 AM" />
        <InfoBox label="Start Date" value="16th May 2026" />
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[136px] items-end justify-between gap-4 rounded-3xl bg-[#F1F6EE] p-5">
      <div>
        <p className="mb-7 text-[11px] font-bold uppercase tracking-wide text-[#4E5A52]">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-[#202420]">{value}</h3>
      </div>
    </div>
  );
}
