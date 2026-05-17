import AddNextQuestionCard from "./add-next-question-card";
import MiniQuizQuestionItem from "./mini-quiz-question-item";

import { ListeningMiniQuizData } from "@/mock/final-exam-manager/listening-mini-quiz.types";

interface Props {
  data: ListeningMiniQuizData;
}

const ModuleQuestionsSidebar = ({ data }: Props) => {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#006B3F]">
            Module Questions
          </h2>

          <div className="mt-2 inline-flex rounded-full bg-[#E6F8E7] px-3 py-1 text-xs font-semibold text-[#0A7C3E]">
            {data.totalQuestions} Total
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.questions.map((question) => (
          <MiniQuizQuestionItem
            key={question.id}
            question={question}
            active={question.id === 1}
          />
        ))}

        <AddNextQuestionCard />
      </div>
    </div>
  );
};

export default ModuleQuestionsSidebar;
