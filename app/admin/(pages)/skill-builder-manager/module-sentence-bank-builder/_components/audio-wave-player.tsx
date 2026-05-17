import { Play } from "lucide-react";

export default function AudioWavePlayer() {
  return (
    <div className="flex items-center gap-3 rounded-full bg-[#EEF2ED] p-3">
      <button
        type="button"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#006B3F] text-white"
      >
        <Play className="ml-0.5 size-5 fill-current" />
      </button>

      <div className="flex flex-1 items-center gap-2">
        <div className="h-3 w-4 rounded-full bg-[#BFD1C5]" />
        <div className="h-4 w-5 rounded-full bg-[#89AA95]" />
        <div className="h-6 w-5 rounded-full bg-[#006B3F]" />
        <div className="h-4 w-4 rounded-full bg-[#BFD1C5]" />
        <div className="h-3 w-5 rounded-full bg-[#89AA95]" />
        <div className="h-5 w-5 rounded-full bg-[#006B3F]" />
        <div className="h-3 w-4 rounded-full bg-[#BFD1C5]" />
      </div>

      <span className="text-sm text-[#66736B]">0:04</span>
    </div>
  );
}
