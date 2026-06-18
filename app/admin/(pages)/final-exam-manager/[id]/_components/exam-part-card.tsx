import type { LucideIcon } from "lucide-react";
import { List, LockKeyhole } from "lucide-react";

import Accordion from "@/components/UI/accordion/accordion";
import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

export interface ExamPartView {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accentClass: string;
  iconWrapperClass: string;
  iconClass: string;
  passingPercent: number;
  currentQuestions: number;
  requiredQuestions: number;
  actionLabel: string;
  actionPath: string;
  variant: "core" | "listening" | "writing" | "speaking";
}

interface ExamPartCardProps {
  part: ExamPartView;
  variant?: "core" | "listening";
  onNavigate: (path: string) => void;
}

const ExamPartCard = ({
  part,
  variant = "core",
  onNavigate,
}: ExamPartCardProps) => {
  const Icon = part.icon;

  if (variant === "core") {
    return (
      <Card
        rounded="3xl"
        padding="lg"
        shadow="sm"
        className={`border-l-8 ${part.accentClass}`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div
              className={`flex size-14 items-center justify-center rounded-full shadow-md ${part.iconWrapperClass}`}
            >
              <Icon className={`size-6 ${part.iconClass}`} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#202420]">{part.title}</h3>
              <p className="text-sm text-[#4F5B55]">{part.description}</p>

              <p className="mt-1 text-xs font-semibold text-[#007A4A]">
                {part.currentQuestions}/{part.requiredQuestions} Questions Ready
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-sm font-medium uppercase text-[#4F5B55]">
                Passing %
              </p>
              <div className="mt-1 rounded-full bg-[#F3F7F1] px-8 py-3 text-center text-lg font-bold text-[#006B3F]">
                {part.passingPercent}
              </div>
            </div>

            <Button
              size="lg"
              type="button"
              onClick={() => onNavigate(part.actionPath)}
            >
              {part.actionLabel}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Accordion
      defaultOpen
      className={`border-none border-l-8 shadow-sm ${part.accentClass}`}
      headerClassName="px-7 py-7"
      contentClassName="px-7 pb-8 pt-0 border-t-0"
      title={
        <div className="flex items-center gap-5">
          <div
            className={`flex size-14 items-center justify-center rounded-full ${part.iconWrapperClass}`}
          >
            <Icon className={`size-6 ${part.iconClass}`} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#202420]">{part.title}</h3>
            <p className="text-sm text-[#4F5B55]">{part.description}</p>

            <p className="mt-1 text-xs font-semibold text-[#007A4A]">
              {part.currentQuestions}/{part.requiredQuestions} Questions Ready
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4 rounded-full border border-[#F3D0D0] bg-[#FFF8F8] px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[#D21F2B]">
            <LockKeyhole className="size-4" />
            Lock Playback
          </div>

          <span className="flex h-6 w-11 items-center justify-end rounded-full bg-[#C92127] px-1">
            <span className="size-4 rounded-full bg-white" />
          </span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(part.actionPath)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E8EEE6] py-4 text-sm font-bold text-[#202420]"
        >
          <List className="size-5" />
          {part.actionLabel}
        </button>
      </div>
    </Accordion>
  );
};

export default ExamPartCard;
