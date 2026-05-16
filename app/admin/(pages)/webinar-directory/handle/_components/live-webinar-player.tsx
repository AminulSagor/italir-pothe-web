import { Expand, Mic, MoreVertical, MonitorUp, Video } from "lucide-react";

const controls = [
  { icon: Mic, active: true },
  { icon: Video, active: true },
  { icon: MonitorUp, active: false },
  { icon: MoreVertical, active: false },
];

export default function LiveWebinarPlayer() {
  return (
    <div className="rounded-[32px] bg-white p-5 shadow-sm">
      <div className="relative h-[380px] overflow-hidden rounded-[28px] bg-[#1C2928]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#33443F] to-[#0F1716]" />

        <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2 text-sm text-white">
          <span className="mr-2 text-green-400">●</span>
          342 Viewers
        </div>

        <button className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/55 text-white">
          <Expand className="size-5" />
        </button>
      </div>

      <div className="mt-5 flex justify-center gap-4">
        {controls.map(({ icon: Icon, active }, index) => (
          <button
            key={index}
            className={`flex size-14 items-center justify-center rounded-full ${
              active ? "bg-[#007A4D] text-white" : "bg-[#EDF2EA] text-[#202420]"
            }`}
          >
            <Icon className="size-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
