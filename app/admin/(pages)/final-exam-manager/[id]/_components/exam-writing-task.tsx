import Accordion from "@/components/UI/accordion/accordion";

import type { ExamPartView } from "./exam-part-card";

interface ExamWritingTaskProps {
  part: ExamPartView;
  title: string;
  titleBn: string;
  instruction: string;
  minWords: number;
  maxWords: number;
  accentBarEnabled: boolean;
  onTitleChange: (value: string) => void;
  onTitleBnChange: (value: string) => void;
  onInstructionChange: (value: string) => void;
  onMinWordsChange: (value: number) => void;
  onMaxWordsChange: (value: number) => void;
  onAccentBarChange: (value: boolean) => void;
}

const ExamWritingTask = ({
  part,
  title,
  titleBn,
  instruction,
  minWords,
  maxWords,
  accentBarEnabled,
  onTitleChange,
  onTitleBnChange,
  onInstructionChange,
  onMinWordsChange,
  onMaxWordsChange,
  onAccentBarChange,
}: ExamWritingTaskProps) => {
  const Icon = part.icon;

  return (
    <Accordion
      defaultOpen
      className={`border-none border-l-8 shadow-sm ${part.accentClass}`}
      headerClassName="px-7 py-7"
      contentClassName="px-7 pb-8 pt-0 border-t-0"
      rightContent={
        <AccentToggle
          enabled={accentBarEnabled}
          onToggle={() => onAccentBarChange(!accentBarEnabled)}
        />
      }
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
          <FieldInput
            value={title}
            placeholder="Task Title (English)"
            onChange={onTitleChange}
          />

          <FieldInput
            value={titleBn}
            placeholder="Task Title (Bengali)"
            onChange={onTitleBnChange}
          />
        </div>

        <textarea
          value={instruction}
          onChange={(event) => onInstructionChange(event.target.value)}
          placeholder="Type instructions here... (Rich-text editor interface)"
          className="min-h-[150px] w-full resize-none rounded-3xl border border-[#E2E8E1] bg-[#F8FCF6] px-6 py-5 text-sm text-[#202420] outline-none placeholder:text-[#7A8580]"
        />

        <div className="flex flex-col gap-4 sm:flex-row">
          <InfoInput
            label="MIN WORDS"
            value={minWords}
            onChange={onMinWordsChange}
          />

          <InfoInput
            label="MAX WORDS"
            value={maxWords}
            onChange={onMaxWordsChange}
          />
        </div>
      </div>
    </Accordion>
  );
};

export default ExamWritingTask;

interface FieldInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const FieldInput = ({ value, placeholder, onChange }: FieldInputProps) => {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-full bg-[#F6FBF4] px-6 py-4 text-sm text-[#202420] outline-none placeholder:text-[#7A8580]"
    />
  );
};

interface InfoInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const InfoInput = ({ label, value, onChange }: InfoInputProps) => {
  return (
    <div className="flex min-w-[180px] items-center justify-between rounded-full bg-[#E8EEE6] px-6 py-4 text-sm">
      <span className="text-[#4F5B55]">{label}</span>

      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-20 bg-transparent text-right font-bold text-[#202420] outline-none"
      />
    </div>
  );
};

interface AccentToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const AccentToggle = ({ enabled, onToggle }: AccentToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="hidden items-center gap-3 rounded-full bg-[#9FF3B8] px-5 py-3 text-sm text-[#006B3F] sm:flex"
    >
      Italian Accent Bar
      <span
        className={`flex h-5 w-9 items-center rounded-full px-1 ${
          enabled ? "justify-end bg-[#12794C]" : "justify-start bg-[#BFD9C8]"
        }`}
      >
        <span className="size-3 rounded-full bg-white" />
      </span>
    </button>
  );
};
