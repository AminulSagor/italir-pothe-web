// app/admin/(pages)/final-exam-manager/[id]/_components/exam-progress-card.tsx

import Card from "@/components/UI/cards/card";

import { examSetupInfo } from "@/mock/final-exam-manager/final-exam-setup.mock";

const ExamProgressCard = () => {
  return (
    <Card rounded="3xl" padding="lg" shadow="sm" className="bg-[#F8FBF7]">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm font-medium uppercase text-[#4F5B55]">
          Exam Creation Progress
        </p>

        <p className="text-sm font-bold text-[#006B3F]">
          {examSetupInfo.progress}% Complete
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[#E6ECE4]">
        <div
          className="h-full rounded-full bg-[#007A43]"
          style={{ width: `${examSetupInfo.progress}%` }}
        />
      </div>
    </Card>
  );
};

export default ExamProgressCard;
