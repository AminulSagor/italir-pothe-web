// app/admin/(pages)/final-exam-manager/[id]/page.tsx

import ExamBasicFields from "./_components/exam-basic-fields";
import ExamPartCard from "./_components/exam-part-card";
import ExamProgressCard from "./_components/exam-progress-card";
import ExamSetupHeader from "./_components/exam-setup-header";
import ExamSpeakingLab from "./_components/exam-speaking-lab";
import ExamWritingTask from "./_components/exam-writing-task";
import GlobalExamRules from "./_components/global-exam-rules";
import PublishFinalExam from "./_components/publish-final-exam";

import { examParts } from "@/mock/final-exam-manager/final-exam-setup.mock";

const FinalExamSetupPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-16">
      <ExamSetupHeader />

      <ExamProgressCard />

      <ExamBasicFields />

      <GlobalExamRules />

      <ExamPartCard part={examParts[0]} />

      <ExamPartCard part={examParts[1]} variant="listening" />

      <ExamWritingTask part={examParts[2]} />

      <ExamSpeakingLab part={examParts[3]} />

      <PublishFinalExam />
    </div>
  );
};

export default FinalExamSetupPage;
