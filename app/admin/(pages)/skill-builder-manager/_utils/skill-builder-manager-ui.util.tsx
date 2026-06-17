import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CookingPot,
  Factory,
  Hospital,
  Hotel,
  Store,
  Truck,
  Utensils,
} from "lucide-react";

import type { SkillBuilderCareerTrack } from "@/types/skill-builder/skill-builder.type";

interface CareerTrackIconOption {
  key: string;
  Icon: LucideIcon;
}

const careerTrackIconOptions: CareerTrackIconOption[] = [
  {
    key: "fork_knife",
    Icon: Utensils,
  },
  {
    key: "restaurant",
    Icon: Utensils,
  },
  {
    key: "kitchen",
    Icon: CookingPot,
  },
  {
    key: "supermarket",
    Icon: Store,
  },
  {
    key: "store",
    Icon: Store,
  },
  {
    key: "logistics",
    Icon: Truck,
  },
  {
    key: "warehouse",
    Icon: Factory,
  },
  {
    key: "hotel",
    Icon: Hotel,
  },
  {
    key: "healthcare",
    Icon: Hospital,
  },
  {
    key: "briefcase",
    Icon: BriefcaseBusiness,
  },
];

export const getCareerTrackIcon = (iconKey?: string) => {
  return (
    careerTrackIconOptions.find((option) => option.key === iconKey)?.Icon ||
    BriefcaseBusiness
  );
};

export const getCareerTrackModuleCount = (track: SkillBuilderCareerTrack) => {
  return (
    track.moduleCount ||
    track.modulesCount ||
    track.totalModules ||
    track.modules?.length ||
    0
  );
};

export const getCareerTrackSentenceCount = (track: SkillBuilderCareerTrack) => {
  return (
    track.sentenceCount || track.sentencesCount || track.totalSentences || 0
  );
};

export const getCareerTrackDescription = (track: SkillBuilderCareerTrack) => {
  return track.description?.trim() || "No description added yet.";
};

export const getCareerTrackUpdatedLabel = (track: SkillBuilderCareerTrack) => {
  const dateValue = track.updatedAt || track.createdAt;

  if (!dateValue) return "Just now";

  const updatedAt = new Date(dateValue);
  const diffMs = Date.now() - updatedAt.getTime();

  if (Number.isNaN(diffMs)) return "Just now";

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;

  return `${days}d ago`;
};
