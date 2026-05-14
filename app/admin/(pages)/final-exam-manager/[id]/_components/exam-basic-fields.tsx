// app/admin/(pages)/final-exam-manager/[id]/_components/exam-basic-fields.tsx

import { ChevronDown } from "lucide-react";

import { examSetupInfo } from "@/mock/final-exam-manager/final-exam-setup.mock";

const ExamBasicFields = () => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium uppercase text-[#4F5B55]">
          Exam Name
        </label>

        <div className="rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#202420] shadow-sm">
          {examSetupInfo.examName}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium uppercase text-[#4F5B55]">
          Link To Course
        </label>

        <div className="flex items-center justify-between gap-4 rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#202420] shadow-sm">
          <span>{examSetupInfo.linkedCourse}</span>
          <ChevronDown className="size-4 text-[#4F5B55]" />
        </div>
      </div>
    </div>
  );
};

export default ExamBasicFields;
