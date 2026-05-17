"use client";

import { Clapperboard, MonitorPlay } from "lucide-react";

import Card from "@/components/UI/cards/card";
import FileUploader from "@/components/UI/uploaders/file-uploader";

export default function MasterIntroductionVideoCard() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDF6EF]">
            <MonitorPlay className="size-6 text-[#006B3F]" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-[#202420]">
                Master Introduction Video
              </h2>

              <span className="rounded-full bg-[#E8F5EC] px-3 py-1 text-[10px] font-semibold text-[#2E8B57]">
                ACTIVE
              </span>
            </div>

            <p className="mt-1 max-w-md text-sm text-[#6D756E]">
              This video serves as the primary trailer for the career track.
            </p>
          </div>
        </div>
      </div>

      <FileUploader
        title="Upload Course Video"
        description="Drag & drop course video or click to browse. Supported formats: MP4, MOV. Max size 500MB."
        accept="video/mp4,video/quicktime"
        icon={<Clapperboard className="size-5" />}
        className="min-h-[220px] border-[#C6D4C8] bg-[#FCFDFC]"
      />
    </Card>
  );
}
