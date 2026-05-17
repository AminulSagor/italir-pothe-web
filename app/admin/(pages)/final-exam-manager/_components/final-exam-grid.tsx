import CreateFinalExamCard from "./create-final-exam-card";
import FinalExamCard from "./final-exam-card";

import { finalExams } from "@/mock/final-exam-manager/final-exam-manager.mock";

const FinalExamGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {finalExams.map((exam) => (
        <FinalExamCard key={exam.id} exam={exam} />
      ))}

      <CreateFinalExamCard />
    </div>
  );
};

export default FinalExamGrid;
