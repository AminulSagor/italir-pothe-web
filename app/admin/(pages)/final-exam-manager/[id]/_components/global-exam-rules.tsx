// app/admin/(pages)/final-exam-manager/[id]/_components/global-exam-rules.tsx

import { Settings2 } from "lucide-react";

import Accordion from "@/components/UI/accordion/accordion";

const GlobalExamRules = () => {
  return (
    <Accordion
      defaultOpen
      className="border-none shadow-sm"
      headerClassName="px-7 py-7"
      contentClassName="px-7 pb-8 pt-0 border-t-0"
      title={
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#9FF3B8]">
            <Settings2 className="size-5 text-[#006B3F]" />
          </div>

          <h2 className="text-xl font-bold text-[#202420]">
            Global Exam Rules
          </h2>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <TogglePill label="Unlock condition: 80% Video Course Completion" />
          <TogglePill label="AI Plagiarism & Copy-Paste Monitor" />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium uppercase text-[#4F5B55]">
            Results Turnaround Notice
          </p>

          <div className="rounded-full bg-[#F3F7F1] px-6 py-4 text-sm text-[#7A8580]">
            E.G. Your results will be processed within 48 hours....
          </div>

          <p className="my-3 text-xs italic text-[#4F5B55]">In Bengali</p>

          <div className="rounded-full bg-[#F3F7F1] px-6 py-4 text-sm text-[#7A8580]">
            আপনার রাইটিং এবং স্পিকিং পার্ট আমাদের শিক্ষকরা রিভিউ করবেন ২৪-৪৮
            ঘন্টার মধ্যে...
          </div>

          <p className="mt-3 text-xs text-[#6F7673]">
            Visible to students before starting.
          </p>
        </div>
      </div>
    </Accordion>
  );
};

export default GlobalExamRules;

const TogglePill = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F3F7F1] px-5 py-4">
      <span className="text-sm text-[#4F5B55]">{label}</span>

      <span className="flex h-6 w-11 items-center justify-end rounded-full bg-[#52EF63] px-1">
        <span className="size-4 rounded-full bg-[#007A43]" />
      </span>
    </div>
  );
};
