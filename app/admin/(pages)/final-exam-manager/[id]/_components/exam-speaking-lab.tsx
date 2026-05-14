// app/admin/(pages)/final-exam-manager/[id]/_components/exam-speaking-lab.tsx

import { ChevronDown } from "lucide-react";

import Accordion from "@/components/UI/accordion/accordion";

import { ExamPart } from "@/mock/final-exam-manager/final-exam-setup.types";

interface Props {
  part: ExamPart;
}

const ExamSpeakingLab = ({ part }: Props) => {
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
        <Field text="Task Title (e.g. Describe your last vacation)" />

        <div className="min-h-[105px] rounded-3xl bg-[#F6FBF4] px-6 py-5 text-sm text-[#7A8580]">
          Instruction prompt for student...
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InfoPill label="MAX DURATION (S)" value="60s" />

          <div className="flex items-center justify-between rounded-full bg-[#F6FBF4] px-6 py-4 text-sm font-bold text-[#202420]">
            Unlimited Re-records
            <ChevronDown className="size-5" />
          </div>
        </div>
      </div>
    </Accordion>
  );
};

export default ExamSpeakingLab;

const Field = ({ text }: { text: string }) => {
  return (
    <div className="rounded-full bg-[#F6FBF4] px-6 py-4 text-sm text-[#7A8580]">
      {text}
    </div>
  );
};

const InfoPill = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between rounded-full bg-[#F6FBF4] px-6 py-4 text-sm">
      <span className="text-[#4F5B55]">{label}</span>
      <span className="font-bold text-[#00823F]">{value}</span>
    </div>
  );
};
