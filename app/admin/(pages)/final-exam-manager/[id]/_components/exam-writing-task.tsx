// app/admin/(pages)/final-exam-manager/[id]/_components/exam-writing-task.tsx

import Accordion from "@/components/UI/accordion/accordion";

import { ExamPart } from "@/mock/final-exam-manager/final-exam-setup.types";

interface Props {
  part: ExamPart;
}

const ExamWritingTask = ({ part }: Props) => {
  const Icon = part.icon;

  return (
    <Accordion
      defaultOpen
      className={`border-none border-l-8 shadow-sm ${part.accentClass}`}
      headerClassName="px-7 py-7"
      contentClassName="px-7 pb-8 pt-0 border-t-0"
      rightContent={<AccentToggle />}
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldPlaceholder text="Task Title (English)" />
          <FieldPlaceholder text="Task Title (Bengali)" />
        </div>

        <div className="min-h-[150px] rounded-3xl border border-[#E2E8E1] bg-[#F8FCF6] px-6 py-5 text-sm text-[#7A8580]">
          Type instructions here... (Rich-text editor interface)
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <InfoPill label="MIN WORDS" value="150" />
          <InfoPill label="MAX WORDS" value="200" />
        </div>
      </div>
    </Accordion>
  );
};

export default ExamWritingTask;

const FieldPlaceholder = ({ text }: { text: string }) => {
  return (
    <div className="rounded-full bg-[#F6FBF4] px-6 py-4 text-sm text-[#7A8580]">
      {text}
    </div>
  );
};

const InfoPill = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex min-w-[180px] items-center justify-between rounded-full bg-[#E8EEE6] px-6 py-4 text-sm">
      <span className="text-[#4F5B55]">{label}</span>
      <span className="font-bold text-[#202420]">{value}</span>
    </div>
  );
};

const AccentToggle = () => {
  return (
    <div className="hidden items-center gap-3 rounded-full bg-[#9FF3B8] px-5 py-3 text-sm text-[#006B3F] sm:flex">
      Italian Accent Bar
      <span className="flex h-5 w-9 items-center justify-end rounded-full bg-[#12794C] px-1">
        <span className="size-3 rounded-full bg-white" />
      </span>
    </div>
  );
};
