import { Pencil } from "lucide-react";

import Card from "@/components/UI/cards/card";

import { CareerTrack } from "@/mock/skill-builder-manager/skill-builder-manager.types";

interface Props {
  track: CareerTrack;
}

export default function CareerTrackCard({ track }: Props) {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="flex h-full flex-col"
    >
      <div
        className={`flex size-[62px] items-center justify-center rounded-2xl text-3xl ${track.iconBg}`}
      >
        {track.icon}
      </div>

      <div className="mt-7">
        <h2 className="text-2xl font-semibold leading-tight text-[#202420]">
          {track.title}
        </h2>

        <p className="mt-4 line-clamp-4 text-base leading-8 text-[#5F675F]">
          {track.description}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="rounded-full bg-[#006B3F] px-8 py-3 text-white">
          <p className="text-xl font-semibold leading-none">{track.modules}</p>

          <p className="mt- text-sm">Modules</p>
        </div>

        <div className="rounded-full bg-[#98F17B] px-8 py-3 text-[#006B3F]">
          <p className="text-xl font-semibold leading-none">
            {track.sentences}
          </p>

          <p className="mt text-sm">Sentences</p>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="mb-5 border-t border-[#E5ECE6]" />

        <div className="flex items-center justify-between">
          <p className="text-base text-[#5F675F]">Updated {track.updatedAgo}</p>

          <button
            type="button"
            className="text-[#006B3F] transition hover:opacity-70"
          >
            <Pencil className="size-5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
