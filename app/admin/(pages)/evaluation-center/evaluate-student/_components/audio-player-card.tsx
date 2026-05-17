import { Download, Play, Volume2 } from "lucide-react";

import { AudioSubmission } from "@/mock/evaluation-center/evaluate-student/evaluate-student.types";

interface AudioPlayerCardProps {
  audio: AudioSubmission;
}

export default function AudioPlayerCard({ audio }: AudioPlayerCardProps) {
  return (
    <div className="rounded-[2rem] bg-[#006B3F] px-6 py-5 shadow-lg">
      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Play audio"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
        >
          <Play className="size-5 fill-white" />
        </button>

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between gap-4 text-xs font-bold text-white">
            <span>{audio.fileName}</span>
            <span>
              {audio.currentTime} / {audio.duration}
            </span>
          </div>

          <div className="h-2 rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-[#59F94D]"
              style={{ width: `${audio.progress}%` }}
            />
          </div>
        </div>

        <button type="button" aria-label="Volume" className="text-white">
          <Volume2 className="size-5" />
        </button>

        <button type="button" aria-label="Download" className="text-white">
          <Download className="size-5" />
        </button>
      </div>
    </div>
  );
}
