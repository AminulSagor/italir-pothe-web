import { Flame } from "lucide-react";

export default function ActivityAnalyticsCard() {
  const bars = [
    70, 95, 88, 110, 122, 115, 130, 126, 138, 118, 70, 52, 80, 86,
  ];

  return (
    <section className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-black/5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-green-100 text-secondary">
            <Flame className="size-5" />
          </span>

          <h2 className="text-lg font-semibold text-black/90">
            Activity Analytics
          </h2>
        </div>

        <div className="flex gap-10">
          <div>
            <p className="text-sm font-semibold uppercase text-black/35">
              Current Streak
            </p>
            <h3 className="text-2xl font-bold text-secondary">45 Days</h3>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase text-black/35">
              Total Hours
            </p>
            <h3 className="text-2xl font-bold text-black/90">128.5 hrs</h3>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex h-[220px] items-end gap-2 overflow-hidden rounded-[2rem] bg-[#F8FBF7] px-7 pb-6 pt-10">
          {bars.map((bar, index) => {
            const isActive = index >= 4 && index <= 9;

            return (
              <div
                key={index}
                className={`relative flex-1 rounded-t-full ${isActive
                  ? "border-t-2 border-secondary bg-[#AEEF9C]"
                  : "bg-[#DCEBE8]"
                  }`}
                style={{ height: `${bar}px` }}
              >
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-semibold text-black/40">
          <span>30 Days Ago</span>
          <span>Active Trend</span>
          <span>Today</span>
        </div>
      </div>
    </section>
  );
}