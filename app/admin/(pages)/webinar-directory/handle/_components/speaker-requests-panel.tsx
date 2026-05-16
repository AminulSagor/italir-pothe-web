import { Hand, TrendingUp, UserRoundPlus, X } from "lucide-react";

const requests = [
  {
    name: "Fahid Hasan",
    tier: "STUDENT TIER - PREMIUM",
  },
  {
    name: "Sarah Conti",
    tier: "STUDENT TIER - BASIC",
  },
];

export default function SpeakerRequestsPanel() {
  return (
    <aside className="flex min-h-[690px] flex-col justify-between rounded-[32px] bg-white p-7 shadow-sm">
      <div>
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#007A4D]">
              Speaker Requests
            </h2>
            <p className="text-xs text-[#4E5A52]">⊕ 2 Pending Requests</p>
          </div>

          <div className="flex gap-3">
            <UserRoundPlus className="size-5 text-[#007A4D]" />
            <Hand className="size-5 text-[#202420]" />
          </div>
        </div>

        <div className="space-y-5">
          {requests.map((request) => (
            <div
              key={request.name}
              className="rounded-3xl border border-[#EDF2EA] bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="size-11 rounded-full bg-[#D9E6D8]" />
                <div>
                  <p className="text-sm font-semibold text-[#202420]">
                    {request.name}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8B958E]">
                    {request.tier}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 rounded-full bg-[#E6F8E7] py-3 text-sm font-semibold uppercase text-[#007A4D]">
                  Approve
                </button>
                <button className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <X className="size-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[#F1F6EE] p-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#DCEFE3] text-[#007A4D]">
            <TrendingUp className="size-5" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-[#202420]">Engagement</p>
            <p className="text-[10px] uppercase text-[#7B857E]">82% Positive</p>
          </div>

          <p className="text-sm font-bold text-[#007A4D]">+12%</p>
        </div>
      </div>
    </aside>
  );
}
