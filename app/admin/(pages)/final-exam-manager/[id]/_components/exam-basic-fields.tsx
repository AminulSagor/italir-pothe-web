import { ChevronDown } from "lucide-react";

interface ExamBasicFieldsProps {
  examName: string;
  linkedCourse: string;
  onExamNameChange: (value: string) => void;
}

const ExamBasicFields = ({
  examName,
  linkedCourse,
  onExamNameChange,
}: ExamBasicFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium uppercase text-[#4F5B55]">
          Exam Name
        </label>

        <input
          value={examName}
          onChange={(event) => onExamNameChange(event.target.value)}
          className="w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#202420] shadow-sm outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium uppercase text-[#4F5B55]">
          Link To Course
        </label>

        <div className="flex items-center justify-between gap-4 rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#202420] shadow-sm">
          <span>{linkedCourse || "No course linked"}</span>
          <ChevronDown className="size-4 text-[#4F5B55]" />
        </div>
      </div>
    </div>
  );
};

export default ExamBasicFields;
