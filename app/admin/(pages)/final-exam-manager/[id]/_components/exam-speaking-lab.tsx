import { ChevronDown } from "lucide-react";

import Accordion from "@/components/UI/accordion/accordion";

import type { ExamPartView } from "./exam-part-card";

interface ExamSpeakingLabProps {
  part: ExamPartView;
  title: string;
  titleBn: string;
  instruction: string;
  maxDurationSeconds: number;
  unlimitedRerecords: boolean;
  onTitleChange: (value: string) => void;
  onTitleBnChange: (value: string) => void;
  onInstructionChange: (value: string) => void;
  onMaxDurationSecondsChange: (value: number) => void;
  onUnlimitedRerecordsChange: (value: boolean) => void;
}

const ExamSpeakingLab = ({
  part,
  title,
  titleBn,
  instruction,
  maxDurationSeconds,
  unlimitedRerecords,
  onTitleChange,
  onTitleBnChange,
  onInstructionChange,
  onMaxDurationSecondsChange,
  onUnlimitedRerecordsChange,
}: ExamSpeakingLabProps) => {
  const Icon = part.icon;

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
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Task Title (e.g. Describe your last vacation)"
          className="w-full rounded-full bg-[#F6FBF4] px-6 py-4 text-sm text-[#202420] outline-none placeholder:text-[#7A8580]"
        />

        <input
          value={titleBn}
          onChange={(event) => onTitleBnChange(event.target.value)}
          placeholder="Task Title (Bengali)"
          className="w-full rounded-full bg-[#F6FBF4] px-6 py-4 text-sm text-[#202420] outline-none placeholder:text-[#7A8580]"
        />

        <textarea
          value={instruction}
          onChange={(event) => onInstructionChange(event.target.value)}
          placeholder="Instruction prompt for student..."
          className="min-h-[105px] w-full resize-none rounded-3xl bg-[#F6FBF4] px-6 py-5 text-sm text-[#202420] outline-none placeholder:text-[#7A8580]"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InfoInput
            label="MAX DURATION (S)"
            value={maxDurationSeconds}
            onChange={onMaxDurationSecondsChange}
          />

          <button
            type="button"
            onClick={() => onUnlimitedRerecordsChange(!unlimitedRerecords)}
            className="flex items-center justify-between rounded-full bg-[#F6FBF4] px-6 py-4 text-sm font-bold text-[#202420]"
          >
            {unlimitedRerecords ? "Unlimited Re-records" : "Limited Re-records"}
            <ChevronDown className="size-5" />
          </button>
        </div>
      </div>
    </Accordion>
  );
};

export default ExamSpeakingLab;

interface InfoInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const InfoInput = ({ label, value, onChange }: InfoInputProps) => {
  return (
    <div className="flex items-center justify-between rounded-full bg-[#F6FBF4] px-6 py-4 text-sm">
      <span className="text-[#4F5B55]">{label}</span>

      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-20 bg-transparent text-right font-bold text-[#00823F] outline-none"
      />
    </div>
  );
};
