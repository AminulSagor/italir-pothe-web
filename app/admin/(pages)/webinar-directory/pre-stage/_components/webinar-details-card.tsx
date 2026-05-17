import { Bell, Info, MapPin } from "lucide-react";

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

        <InfoBox
          label="Webinar Followers"
          value="342"
          actionLabel="Notify Followers"
        />

        <InfoBox label="Total App User" value="2400" actionLabel="Notify All" />
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl border border-[#D8E5DA] bg-[#F4FAF7] px-5 py-4 text-sm text-[#59635D]">
        <MapPin className="mt-0.5 size-4 shrink-0 text-[#007A4D]" />
        <p>
          {` Notification settings: 'Notify Followers' sends a targeted alert to
          students who has turned on notification for this specific webinar,
          while Notify All broadcasts a push notification to your entire app
          user base.`}
        </p>
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  actionLabel,
}: {
  label: string;
  value: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex min-h-[136px] items-end justify-between gap-4 rounded-3xl bg-[#F1F6EE] p-5">
      <div>
        <p className="mb-7 text-[11px] font-bold uppercase tracking-wide text-[#4E5A52]">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-[#202420]">{value}</h3>
      </div>

      {actionLabel && (
        <button className="mb-2 flex items-center gap-2 rounded-full bg-[#007A4D] px-5 py-3 text-[10px] font-bold uppercase text-white">
          <Bell className="size-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
