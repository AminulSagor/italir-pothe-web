import type { LucideIcon } from "lucide-react";
import {
  Bus,
  BusFront,
  ChartNoAxesCombined,
  CheckSquare,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileText,
  Home,
  Hospital,
  Languages,
  MapPin,
  Pill,
  Shield,
  ShoppingBasket,
} from "lucide-react";

import type {
  SurvivalSituation,
  SurvivalStatIconKey,
} from "@/types/survival-italian/survival-italian.type";

export interface SurvivalIconOption {
  key: string;
  label: string;
  Icon: LucideIcon;
}

export const survivalIconOptions: SurvivalIconOption[] = [
  {
    key: "clock",
    label: "First 24 Hours",
    Icon: Clock3,
  },
  {
    key: "bus",
    label: "Bus",
    Icon: BusFront,
  },
  {
    key: "grocery",
    label: "Grocery",
    Icon: ShoppingBasket,
  },
  {
    key: "pharmacy",
    label: "Pharmacy",
    Icon: Pill,
  },
  {
    key: "hospital",
    label: "Hospital",
    Icon: Hospital,
  },
  {
    key: "police",
    label: "Police",
    Icon: Shield,
  },
  {
    key: "home",
    label: "Home",
    Icon: Home,
  },
  {
    key: "document",
    label: "Document",
    Icon: FileText,
  },
  {
    key: "location",
    label: "Location",
    Icon: MapPin,
  },
];

export const getSurvivalSubtitleBn = (situation: SurvivalSituation) => {
  return situation.subtitleBn?.trim() || "Needs translation";
};

export const getSurvivalIconOption = (iconKey?: string) => {
  return (
    survivalIconOptions.find((option) => option.key === iconKey) ||
    survivalIconOptions[1]
  );
};

export const getSurvivalStatIcon = (
  iconKey: SurvivalStatIconKey,
): LucideIcon => {
  const statIconMap: Record<SurvivalStatIconKey, LucideIcon> = {
    "total-situations": ClipboardList,
    "pdfs-attached": FileCheck2,
    "missing-bengali": Languages,
    completion: ChartNoAxesCombined,
  };

  return statIconMap[iconKey];
};

export const getSurvivalPdfFileName = (situation: SurvivalSituation) => {
  return (
    situation.resourceFile?.originalName ||
    situation.resourceFile?.fileName ||
    situation.resourceFile?.name ||
    situation.resourceFile?.title ||
    "PDF attached"
  );
};

export const getSurvivalResourceUrl = (situation: SurvivalSituation) => {
  return (
    situation.resourceFile?.signedReadUrl || situation.resourceFile?.publicUrl
  );
};

export const hasSurvivalPdf = (situation: SurvivalSituation) => {
  return Boolean(situation.resourceFileId);
};
