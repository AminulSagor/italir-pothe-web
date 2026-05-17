// app/admin/(pages)/final-exam-manager/[id]/_components/exam-setup-header.tsx

import BackButton from "@/components/UI/buttons/back-button";

import { examSetupInfo } from "@/mock/final-exam-manager/final-exam-setup.mock";

const ExamSetupHeader = () => {
  return (
    <div className="flex items-start gap-4">
      <BackButton />

      <div>
        <h1 className="text-2xl font-bold text-[#004D2B] md:text-3xl">
          {examSetupInfo.title}
        </h1>

        <p className="mt-2 text-sm text-[#4F5B55]">{examSetupInfo.subtitle}</p>
      </div>
    </div>
  );
};

export default ExamSetupHeader;
