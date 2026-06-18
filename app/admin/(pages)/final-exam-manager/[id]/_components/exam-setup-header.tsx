import { ArrowLeft } from "lucide-react";

interface ExamSetupHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

const ExamSetupHeader = ({ title, subtitle, onBack }: ExamSetupHeaderProps) => {
  return (
    <div className="flex items-start gap-4">
      <button
        type="button"
        onClick={onBack}
        className="flex size-9 items-center justify-center rounded-full bg-white text-[#006B3F] shadow-sm"
        aria-label="Go back"
      >
        <ArrowLeft className="size-4" />
      </button>

      <div>
        <h1 className="text-2xl font-bold text-[#004D2B] md:text-3xl">
          {title || "Final Exam Setup"}
        </h1>

        <p className="mt-2 text-sm text-[#4F5B55]">
          {subtitle || "Configure final exam rules, sections, and tasks."}
        </p>
      </div>
    </div>
  );
};

export default ExamSetupHeader;
