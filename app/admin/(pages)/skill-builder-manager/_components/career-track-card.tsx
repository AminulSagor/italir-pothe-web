import { Pencil } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { SkillBuilderCareerTrack } from "@/types/skill-builder/skill-builder.type";

import {
  getCareerTrackDescription,
  getCareerTrackIcon,
  getCareerTrackModuleCount,
  getCareerTrackSentenceCount,
  getCareerTrackUpdatedLabel,
} from "../_utils/skill-builder-manager-ui.util";

interface Props {
  track: SkillBuilderCareerTrack;
  onEdit: () => void;
}

export default function CareerTrackCard({ track, onEdit }: Props) {
  const Icon = getCareerTrackIcon(track.iconKey);

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="flex h-full flex-col"
    >
      <div
        className="flex size-[62px] items-center justify-center rounded-2xl"
        style={{ backgroundColor: track.cardColor || "#E7EFE7" }}
      >
        <Icon className="size-8 text-[#006B3F]" />
      </div>

      <div className="mt-7">
        <h2 className="text-2xl font-semibold leading-tight text-[#202420]">
          {track.title}
        </h2>

        <p className="mt-4 line-clamp-4 text-base leading-8 text-[#5F675F]">
          {getCareerTrackDescription(track)}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="rounded-full bg-[#006B3F] px-8 py-3 text-white">
          <p className="text-xl font-semibold leading-none">
            {getCareerTrackModuleCount(track)}
          </p>

          <p className="mt-1 text-sm">Modules</p>
        </div>

        <div className="rounded-full bg-[#98F17B] px-8 py-3 text-[#006B3F]">
          <p className="text-xl font-semibold leading-none">
            {getCareerTrackSentenceCount(track)}
          </p>

          <p className="mt-1 text-sm">Sentences</p>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="mb-5 border-t border-[#E5ECE6]" />

        <div className="flex items-center justify-between">
          <p className="text-base text-[#5F675F]">
            Updated {getCareerTrackUpdatedLabel(track)}
          </p>

          <button
            type="button"
            onClick={onEdit}
            className="text-[#006B3F] transition hover:opacity-70"
          >
            <Pencil className="size-5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
