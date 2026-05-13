import { ChevronDown, Settings } from "lucide-react";

interface QuestionConfigurationHeaderProps {
  title: string;
  format: string;
}

export default function QuestionConfigurationHeader({
  title,
  format,
}: QuestionConfigurationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#E3F4EA]">
          <Settings className="size-5 text-[#007A4A]" />
        </div>

        <h2 className="text-xl font-bold text-[#202420]">{title}</h2>
      </div>

      <div className="sm:text-right">
        <p className="mb-1 text-[10px] font-bold uppercase text-[#8A968E]">
          Question Format
        </p>

        <button
          type="button"
          className="flex h-10 w-full items-center justify-between gap-3 rounded-full bg-[#EEF5EC] px-5 text-sm font-semibold text-[#007A4A] sm:w-[190px]"
        >
          {format}
          <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  );
}
