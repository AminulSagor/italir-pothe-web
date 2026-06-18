import { Settings2 } from "lucide-react";

import Accordion from "@/components/UI/accordion/accordion";

interface GlobalExamRulesProps {
  unlockCompletionPercent: number;
  plagiarismMonitorEnabled: boolean;
  copyPasteMonitorEnabled: boolean;
  resultNotice: string;
  resultNoticeBn: string;
  totalDurationMinutes: number;
  overallPassingPercent: number;
  onUnlockCompletionPercentChange: (value: number) => void;
  onPlagiarismMonitorChange: (value: boolean) => void;
  onCopyPasteMonitorChange: (value: boolean) => void;
  onResultNoticeChange: (value: string) => void;
  onResultNoticeBnChange: (value: string) => void;
  onTotalDurationMinutesChange: (value: number) => void;
  onOverallPassingPercentChange: (value: number) => void;
}

const GlobalExamRules = ({
  unlockCompletionPercent,
  plagiarismMonitorEnabled,
  copyPasteMonitorEnabled,
  resultNotice,
  resultNoticeBn,
  totalDurationMinutes,
  overallPassingPercent,
  onUnlockCompletionPercentChange,
  onPlagiarismMonitorChange,
  onCopyPasteMonitorChange,
  onResultNoticeChange,
  onResultNoticeBnChange,
  onTotalDurationMinutesChange,
  onOverallPassingPercentChange,
}: GlobalExamRulesProps) => {
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
          <NumberPill
            label="Unlock condition: Video Course Completion"
            value={unlockCompletionPercent}
            suffix="%"
            onChange={onUnlockCompletionPercentChange}
          />

          <NumberPill
            label="Total Duration"
            value={totalDurationMinutes}
            suffix="min"
            onChange={onTotalDurationMinutesChange}
          />

          <NumberPill
            label="Overall Passing"
            value={overallPassingPercent}
            suffix="%"
            onChange={onOverallPassingPercentChange}
          />

          <TogglePill
            label="AI Plagiarism Monitor"
            enabled={plagiarismMonitorEnabled}
            onToggle={() =>
              onPlagiarismMonitorChange(!plagiarismMonitorEnabled)
            }
          />

          <TogglePill
            label="Copy-Paste Monitor"
            enabled={copyPasteMonitorEnabled}
            onToggle={() => onCopyPasteMonitorChange(!copyPasteMonitorEnabled)}
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium uppercase text-[#4F5B55]">
            Results Turnaround Notice
          </p>

          <input
            value={resultNotice}
            onChange={(event) => onResultNoticeChange(event.target.value)}
            placeholder="E.g. Your results will be processed within 48 hours..."
            className="w-full rounded-full bg-[#F3F7F1] px-6 py-4 text-sm text-[#202420] outline-none placeholder:text-[#7A8580]"
          />

          <p className="my-3 text-xs italic text-[#4F5B55]">In Bengali</p>

          <input
            value={resultNoticeBn}
            onChange={(event) => onResultNoticeBnChange(event.target.value)}
            placeholder="আপনার ফলাফল ২৪–৪৮ ঘণ্টার মধ্যে প্রসেস করা হবে।"
            className="w-full rounded-full bg-[#F3F7F1] px-6 py-4 text-sm text-[#202420] outline-none placeholder:text-[#7A8580]"
          />

          <p className="mt-3 text-xs text-[#6F7673]">
            Visible to students before starting.
          </p>
        </div>
      </div>
    </Accordion>
  );
};

export default GlobalExamRules;

interface TogglePillProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}

const TogglePill = ({ label, enabled, onToggle }: TogglePillProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#F3F7F1] px-5 py-4 text-left"
    >
      <span className="text-sm text-[#4F5B55]">{label}</span>

      <span
        className={`flex h-6 w-11 items-center rounded-full px-1 ${
          enabled ? "justify-end bg-[#52EF63]" : "justify-start bg-[#D9E2DA]"
        }`}
      >
        <span
          className={`size-4 rounded-full ${
            enabled ? "bg-[#007A43]" : "bg-white"
          }`}
        />
      </span>
    </button>
  );
};

interface NumberPillProps {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}

const NumberPill = ({ label, value, suffix, onChange }: NumberPillProps) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F3F7F1] px-5 py-4">
      <span className="text-sm text-[#4F5B55]">{label}</span>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-8 w-20 rounded-full bg-white px-3 text-center text-sm font-bold text-[#006B3F] outline-none"
        />

        <span className="text-sm font-bold text-[#006B3F]">{suffix}</span>
      </div>
    </div>
  );
};
